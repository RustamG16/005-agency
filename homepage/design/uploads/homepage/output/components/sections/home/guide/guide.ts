"use client";

// Stage B — the live guide.
// WebGL conventions cloned from components/sections/about/monolith/monolith.ts
// (see reference/MonolithScene.tsx): dynamic three import, one scrubbed master
// timeline, render on the shared gsap ticker, full dispose on unmount.
//
// Every name below was read off the shipped GLB, not guessed:
//   meshes      BODY_Body_0 (material "Body")  ·  PARTS_parts_0 (material "parts")
//   eye bones   eyeR_06, eyeL_08   ·   head bone Head_05
//   clips       Armature|action_Greet, Armature|Run, Armature|Talk, Armature|Walking
// The shipped emissive map lights the BACK PANEL strips, not the eye, so it is
// dropped; the eye mark is built on the two eye bones instead (spec §1).

import type {
  AnimationAction,
  AnimationMixer,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  Texture,
  WebGLRenderer,
} from "three";
import { gsap } from "@/components/motion/gsap";

/* ---- Palette (tokens.css, R7) ---------------------------------------- */
const INK = 0x241f1f; // body / shell
const NOIR = 0x1b1717; // joints, undersides, page ground
const EYE_EMISSIVE = 0xd73b3e; // chili — ACCENT USE 1 of 4 (spec §6)

/** Resting eye. 1.0 renders exactly chili; the CTA step lifts it one notch. */
const EYE_BASE_INTENSITY = 1;
/** Eye mark, as a fraction of the robot's on-screen height. Measured, not guessed. */
const EYE_RADIUS = 0.034;
/** Distance from the eye bone to the pupil face, same units. */
const EYE_FORWARD = 0.244;

/* ---- Layout ----------------------------------------------------------- */
const CAM_Z = 6;
const CAM_FOV = 32;
const ROBOT_VH = 0.2;
const ROBOT_VH_MOBILE = 0.28;

export type GuideState = {
  /** Park position in viewport fractions — 0,0 is the top-left of the stage. */
  x: number;
  y: number;
  depth: number;
  /** Body yaw / pitch, radians. */
  turn: number;
  tilt: number;
  /** Head yaw offset, radians, applied on top of whatever clip is playing. */
  headTurn: number;
  /** Clip weights, 0–1. Highest priority wins the pose. */
  talk: number;
  greet: number;
  /** Idle sway amplitude, 0–1. */
  sway: number;
  /** Eye emissive multiplier — 1 is the resting mark. */
  eye: number;
  opacity: number;
};

export type GuideHandles = {
  group: Group;
  state: GuideState;
  apply: () => void;
  render: () => void;
  resize: () => void;
  dispose: () => void;
  /** Eye position in stage pixels, or null when it is behind the camera. */
  getEyeScreen: () => { x: number; y: number } | null;
  /** §2 first-frame capture rig: 1920×1080, noir floor, contact shadow, hero pose. */
  setPoseMode: (on: boolean) => void;
  inventory: { meshes: string[]; materials: string[]; clips: string[]; eyeBones: string[] };
};

const defaultState = (): GuideState => ({
  x: 0.5,
  y: -0.25,
  depth: 0,
  turn: 0,
  tilt: 0,
  headTurn: 0,
  talk: 0,
  greet: 0,
  sway: 0,
  eye: 1,
  opacity: 0,
});

const lower = (o: { name?: string } | null | undefined) => (o?.name ?? "").toLowerCase();

export async function buildGuide(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  modelUrl = "/models/repo_robot.glb"
): Promise<GuideHandles> {
  const THREE = await import("three");
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");

  const renderer: WebGLRenderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearAlpha(0);
  renderer.shadowMap.enabled = false; // spec §7 — no shadow maps
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const scene: Scene = new THREE.Scene();
  const camera: PerspectiveCamera = new THREE.PerspectiveCamera(CAM_FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAM_Z);
  camera.lookAt(0, 0, 0);

  // One warm directional key from the upper left + low ambient (spec §7).
  const key = new THREE.DirectionalLight(0xfff1e0, 4);
  key.position.set(-3.2, 4.4, 3.4);
  const ambient = new THREE.AmbientLight(0x8d867d, 0.45);
  scene.add(key, ambient);

  const group: Group = new THREE.Group();
  scene.add(group);

  const gltf = await new GLTFLoader().loadAsync(modelUrl);
  const model = gltf.scene;

  const inventory: GuideHandles["inventory"] = {
    meshes: [],
    materials: [],
    clips: gltf.animations.map((c) => c.name),
    eyeBones: [],
  };

  const ownedGeometries = new Set<{ dispose: () => void }>();
  const ownedMaterials = new Set<Material>();
  const ownedTextures = new Set<Texture>();

  /* ---- Recolor (spec §1) ------------------------------------------------ */
  const shell = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.85, metalness: 0.15 });
  const joint = new THREE.MeshStandardMaterial({ color: NOIR, roughness: 0.9, metalness: 0.1 });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: NOIR,
    roughness: 0.35,
    metalness: 0,
    emissive: new THREE.Color(EYE_EMISSIVE),
    emissiveIntensity: EYE_BASE_INTENSITY,
    toneMapped: false,
  });
  [shell, joint, eyeMat].forEach((m) => ownedMaterials.add(m));

  const keptNormals = new Set<Texture>();
  const retired: Material[] = [];

  model.traverse((child: Object3D) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    inventory.meshes.push(mesh.name);

    const original = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as
      | MeshStandardMaterial
      | undefined;
    if (original) inventory.materials.push(original.name);

    // "parts" = eye domes, arms, legs, panels → joints/undersides value.
    // "Body"  = shell → ink. Keyed on the GLB's own material names.
    const isParts = /parts/i.test(original?.name ?? "") || /parts/i.test(lower(mesh.geometry));
    const target = isParts ? joint : shell;

    // Normal maps carry surface, not colour — keeping them holds the matte
    // moulding detail while the red-rust base/emissive maps are dropped.
    if (original?.normalMap && !target.normalMap) {
      target.normalMap = original.normalMap;
      target.normalScale = new THREE.Vector2(0.6, 0.6);
      target.needsUpdate = true;
      keptNormals.add(original.normalMap);
    }
    if (original) retired.push(original);

    mesh.material = target;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    if (mesh.geometry) ownedGeometries.add(mesh.geometry as unknown as { dispose: () => void });
  });

  // Free the original PBR set (≈7MB of 1k textures) now that nothing points at it.
  retired.forEach((m) => {
    const std = m as MeshStandardMaterial;
    (["map", "emissiveMap", "roughnessMap", "metalnessMap", "aoMap", "normalMap"] as const).forEach((slot) => {
      const tex = std[slot] as Texture | null;
      if (tex && !keptNormals.has(tex)) tex.dispose();
    });
    m.dispose();
  });
  keptNormals.forEach((t) => ownedTextures.add(t));

  /* ---- Rig hooks -------------------------------------------------------- */
  let head: Object3D | null = null;
  const eyeBones: Object3D[] = [];
  model.traverse((child: Object3D) => {
    if (!head && /^head/i.test(child.name)) head = child;
    if (/^eye/i.test(child.name)) eyeBones.push(child);
  });
  inventory.eyeBones = eyeBones.map((b) => b.name);

  let mixer: AnimationMixer | null = null;
  let walkAction: AnimationAction | null = null;
  let talkAction: AnimationAction | null = null;
  let greetAction: AnimationAction | null = null;
  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(model);
    const find = (re: RegExp) => gltf.animations.find((c) => re.test(c.name));
    const wire = (clip: ReturnType<typeof find>) => {
      if (!clip || !mixer) return null;
      const action = mixer.clipAction(clip);
      action.play();
      action.setEffectiveWeight(0);
      return action;
    };
    walkAction = wire(find(/walk/i));
    talkAction = wire(find(/talk/i));
    greetAction = wire(find(/greet/i));
  }

  /* ---- Fit -------------------------------------------------------------- */
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const centre = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(centre);

  const pivot = new THREE.Group();
  model.position.sub(new THREE.Vector3(centre.x, box.min.y + size.y * 0.5, centre.z));
  pivot.add(model);
  group.add(pivot);

  const worldHeight = () => 2 * Math.tan((CAM_FOV * Math.PI) / 360) * CAM_Z;
  const robotHeight = () => worldHeight() * (window.innerWidth <= 768 ? ROBOT_VH_MOBILE : ROBOT_VH);
  const fit = () => pivot.scale.setScalar(robotHeight() / Math.max(size.y, 1e-6));
  fit();

  /* ---- The eye ---------------------------------------------------------- */
  // Placed in world space (group is unrotated here), then baked into each eye
  // bone's local frame — the two bones are mirrored, so a shared local offset
  // would send one pupil into the back of the head.
  const eyeGeometry = new THREE.SphereGeometry(1, 20, 16);
  ownedGeometries.add(eyeGeometry as unknown as { dispose: () => void });
  const eyes: Mesh[] = [];
  group.updateMatrixWorld(true);
  const boneScale = new THREE.Vector3();
  eyeBones.forEach((bone) => {
    const pupil = new THREE.Mesh(eyeGeometry, eyeMat);
    pupil.frustumCulled = false;
    bone.add(pupil);
    bone.updateWorldMatrix(true, false);
    bone.getWorldScale(boneScale);
    const target = new THREE.Vector3();
    bone.getWorldPosition(target);
    target.z += EYE_FORWARD * robotHeight();
    bone.worldToLocal(target);
    pupil.position.copy(target);
    pupil.scale.setScalar((EYE_RADIUS * robotHeight()) / Math.max(boneScale.x, 1e-6));
    eyes.push(pupil);
  });

  /* ---- Pose-mode extras (dev capture only) ------------------------------ */
  let floor: Mesh | null = null;
  let contact: Mesh | null = null;
  const buildFloor = () => {
    if (floor) return;
    const fg = new THREE.PlaneGeometry(60, 60);
    const fm = new THREE.MeshBasicMaterial({ color: NOIR });
    ownedGeometries.add(fg as unknown as { dispose: () => void });
    ownedMaterials.add(fm);
    floor = new THREE.Mesh(fg, fm);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -worldHeight() * 0.3;

    const cv = document.createElement("canvas");
    cv.width = cv.height = 128;
    const ctx = cv.getContext("2d");
    if (ctx) {
      const img = ctx.createImageData(128, 128);
      for (let i = 0; i < 128 * 128; i++) {
        const px = (i % 128) - 64;
        const py = Math.floor(i / 128) - 64;
        const d = Math.min(1, Math.hypot(px, py) / 62);
        img.data[i * 4 + 3] = Math.round(215 * (1 - d) ** 2.2);
      }
      ctx.putImageData(img, 0, 0);
    }
    const tex = new THREE.CanvasTexture(cv);
    const cg = new THREE.PlaneGeometry(1, 1);
    const cm = new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: tex, transparent: true, opacity: 0.5 });
    ownedTextures.add(tex);
    ownedGeometries.add(cg as unknown as { dispose: () => void });
    ownedMaterials.add(cm);
    contact = new THREE.Mesh(cg, cm);
    contact.rotation.x = -Math.PI / 2;
    scene.add(floor, contact);
  };

  /* ---- Frame loop ------------------------------------------------------- */
  const state = defaultState();
  const idle = { t: 0 };
  const idleSpin = gsap.to(idle, { t: Math.PI * 2, duration: 7, ease: "none", repeat: -1 });

  let poseMode = false;
  let stride = 0;
  let prevX = state.x;
  let prevY = state.y;
  const headRestY = head ? (head as Object3D).rotation.y : 0;
  const clamp01 = gsap.utils.clamp(0, 1);

  const setAction = (action: AnimationAction | null, weight: number, time: number) => {
    if (!action) return;
    const w = clamp01(weight);
    action.enabled = w > 0.001;
    action.setEffectiveWeight(w);
    if (w > 0.001) {
      const duration = action.getClip().duration || 1;
      action.time = ((time % duration) + duration) % duration;
    }
  };

  const apply = () => {
    const wh = worldHeight();
    const ww = wh * camera.aspect;

    const bob = Math.sin(idle.t) * 0.012 * wh * (0.3 + state.sway);
    group.position.set((state.x - 0.5) * ww, (0.5 - state.y) * wh + bob, state.depth);
    group.rotation.y = state.turn + Math.sin(idle.t * 0.75) * 0.07 * state.sway;
    group.rotation.x = state.tilt + Math.sin(idle.t * 1.3) * 0.018 * state.sway;

    const travel = Math.hypot(state.x - prevX, state.y - prevY);
    stride += travel * 11;
    prevX = state.x;
    prevY = state.y;

    if (mixer) {
      // One deterministic pose per frame: gesture beats travel beats rest.
      const greet = state.greet;
      const talk = state.talk * (1 - greet);
      const walking = clamp01(travel * 220) * (1 - greet - talk);
      setAction(greetAction, greet, greet * (greetAction?.getClip().duration ?? 1));
      setAction(talkAction, talk, talk * (talkAction?.getClip().duration ?? 1));
      setAction(walkAction, walking, stride);
      mixer.update(0);
    }

    // Head offset lands after the mixer so it survives whatever clip is active.
    if (head) (head as Object3D).rotation.y = headRestY + state.headTurn;

    const opacity = clamp01(state.opacity);
    group.visible = opacity > 0.002;
    [shell, joint, eyeMat].forEach((m) => {
      m.transparent = opacity < 0.999;
      m.opacity = opacity;
    });
    eyeMat.emissiveIntensity = EYE_BASE_INTENSITY * state.eye;
  };

  const render = () => {
    apply();
    renderer.render(scene, camera);
  };

  const resize = () => {
    const w = poseMode ? 1920 : stage.clientWidth;
    const h = poseMode ? 1080 : stage.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fit();
    apply();
  };
  resize();

  const eyePoint = new THREE.Vector3();
  const getEyeScreen = () => {
    const pupil = eyes[0];
    if (!pupil) return null;
    pupil.getWorldPosition(eyePoint);
    eyePoint.project(camera);
    if (eyePoint.z > 1) return null;
    const rect = stage.getBoundingClientRect();
    return {
      x: rect.left + ((eyePoint.x + 1) / 2) * rect.width,
      y: rect.top + ((1 - eyePoint.y) / 2) * rect.height,
    };
  };

  const setPoseMode = (on: boolean) => {
    poseMode = on;
    if (on) {
      buildFloor();
      if (floor) floor.visible = true;
      if (contact) contact.visible = true;
      // §2 hero start: centred-right, ~20° off camera, eye lit, warm key upper-left.
      Object.assign(state, defaultState(), { x: 0.6, y: 0.56, turn: -0.35, headTurn: 0.06, eye: 1, opacity: 1 });
      idleSpin.pause();
      idle.t = 0;
      resize();
      if (contact) {
        const wh = worldHeight();
        contact.position.set(group.position.x, -wh * 0.3 + 0.002, 0);
        contact.scale.setScalar(robotHeight() * 1.5);
      }
    } else {
      if (floor) floor.visible = false;
      if (contact) contact.visible = false;
      idleSpin.resume();
      resize();
    }
  };

  const dispose = () => {
    idleSpin.kill();
    mixer?.stopAllAction();
    ownedGeometries.forEach((g) => g.dispose());
    ownedMaterials.forEach((m) => m.dispose());
    ownedTextures.forEach((t) => t.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    scene.clear();
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[guide] model inventory", inventory);
  }

  return { group, state, apply, render, resize, dispose, getEyeScreen, setPoseMode, inventory };
}

/* ---- The one master timeline (spec §3) --------------------------------- */
/**
 * Total duration is exactly 1, so timeline progress and scrub progress are the
 * same number and the chapter windows read straight off §3. Every step is a
 * plain tween on `state` — reversible by construction, which is what keeps the
 * scrub clean in both directions.
 */
export function buildGuideTimeline(g: GuideHandles) {
  const st = g.state;
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

  // .00–.08 Arrival — drops in from the top edge, lands beside the H1, brief idle.
  tl.set(st, { x: 0.2, y: -0.22, turn: 0.1, opacity: 1 }, 0)
    .to(st, { y: 0.46, duration: 0.055, ease: "power3.out" }, 0)
    .to(st, { turn: -0.18, headTurn: 0.2, duration: 0.02 }, 0.05)
    .to(st, { sway: 1, duration: 0.01 }, 0.07);

  // .08–.30 Services — walks down the left gutter, parking at each of the five rows.
  const rows = 5;
  const step = (0.3 - 0.08) / rows;
  for (let i = 0; i < rows; i++) {
    const at = 0.08 + i * step;
    tl.to(st, { x: 0.13, y: 0.3 + i * 0.06, sway: 0.15, headTurn: 0, duration: step * 0.62 }, at).to(
      st,
      { headTurn: 0.4, turn: 0.12, sway: 1, duration: step * 0.38 },
      at + step * 0.62
    );
  }

  // .30–.50 Process — follows the film band, then gestures at it.
  tl.to(st, { x: 0.74, y: 0.52, turn: -0.5, headTurn: -0.18, sway: 0.3, duration: 0.07 }, 0.3)
    .to(st, { talk: 1, duration: 0.06, ease: "power2.out" }, 0.37)
    .to(st, { y: 0.44, duration: 0.05 }, 0.4)
    .to(st, { talk: 0, sway: 0.8, duration: 0.04 }, 0.46);

  // .50–.70 Principles — perches on the block edge, idle sway.
  tl.to(st, { x: 0.16, y: 0.6, turn: 0.26, headTurn: 0, tilt: 0.06, duration: 0.07 }, 0.5).to(
    st,
    { sway: 1, duration: 0.03 },
    0.57
  );

  // .70–.85 FAQ — tilts and shrugs at the list.
  tl.to(st, { x: 0.8, y: 0.5, turn: -0.28, tilt: -0.04, duration: 0.06 }, 0.7)
    .to(st, { headTurn: 0.28, talk: 0.5, duration: 0.03 }, 0.76)
    .to(st, { headTurn: -0.14, talk: 0, duration: 0.03 }, 0.8);

  // .85–1.0 CTA — centre, faces the viewer, one wave, eye up one step.
  tl.to(st, { x: 0.5, y: 0.54, turn: 0, tilt: 0, headTurn: 0, sway: 0.4, duration: 0.06 }, 0.85)
    .fromTo(st, { greet: 0 }, { greet: 1, duration: 0.09, ease: "none" }, 0.89)
    .to(st, { greet: 0, duration: 0.02 }, 0.98)
    .to(st, { eye: 1.55, duration: 0.05 }, 0.93);

  return tl;
}
