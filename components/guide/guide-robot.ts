/**
 * The Guide — three.js scene for the corner puck.
 *
 * Every number here is locked. They were measured off a live render on the
 * design board (`homepage/design/guide-radial.js`, itself documented by
 * `homepage/design/DESIGN-LOCK.md` §1–2) — not estimated, and not to be
 * re-derived. The recolor pipeline, eye geometry, lights and framing span are
 * ports of that board's implementation.
 *
 * Architecture follows `components/sections/about/monolith/monolith.ts`:
 * a plain builder returning handles, with an explicit disposables list.
 *
 * Token values are duplicated as literals because WebGL cannot read CSS vars.
 * Keep in sync with `styles/tokens.css`.
 */

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const TOKEN_HEX = {
  noir: 0x1b1717,
  ink: 0x241f1f,
  hairline: 0xd6d2c2,
  paper: 0xf5f3e8,
  gray: 0x6e6963,
  cotton: 0xedebdd,
} as const;

/**
 * DESIGN-LOCK §3's ring states, relocated to the pad's milled rim.
 *
 * The lock put these on a circular disc behind the robot; Russ retired the disc
 * on 2026-08-03 because it flattened him into a badge. The states themselves
 * were never retired — they just had nowhere to live. The rim is the one
 * hairline element already in the render, so it carries them, and hover/drag
 * read as light catching machined metal instead of a UI ring stuck on a 3D
 * object.
 */
export type GuideRimState = "rest" | "hover" | "dragging";

export const RIM_COLOR: Record<"cotton" | "noir", Record<GuideRimState, number>> = {
  // On cotton the lock specifies no ring at rest — the rim drops to the pad's
  // own ink so it reads as an unlit edge rather than a drawn line.
  cotton: { rest: TOKEN_HEX.ink, hover: TOKEN_HEX.hairline, dragging: TOKEN_HEX.gray },
  noir: { rest: TOKEN_HEX.gray, hover: TOKEN_HEX.cotton, dragging: TOKEN_HEX.cotton },
};

/* ---- locked scene numbers (DESIGN-LOCK §1–2) --------------------------- */

const CAM_FOV = 32;
const CAM_Z = 6;
const VIEW_H = 2 * Math.tan((CAM_FOV * Math.PI) / 360) * CAM_Z;

/** Model-height fractions kept in frame. Framing is a SPAN, not a scalar (lock
 *  §2). REVISED 2026-08-03 (Russ): the waist-up 0.02→1.10 crop is retired —
 *  he stands on a platform now, so the frame has to hold the full figure plus
 *  the pad beneath his feet. The lock rejected full-figure because the eye
 *  vanished at 76px; the footprint grew to 180px to pay for it. */
const SPAN: [number, number] = [-0.34, 1.16];

/** The pad, in model-height units. Feet sit at y = 0, so it hangs below.
 *  Kept narrower than the frame so the disc never clips at the canvas edge. */
const PAD = {
  deckRadius: 0.34,
  baseRadius: 0.4,
  deckHeight: 0.04,
  baseHeight: 0.05,
  rimTube: 0.006,
};

/** A small camera lift so the pad reads as a surface he stands ON, seen
 *  slightly from above, rather than a line behind his feet. */
const CAM_LIFT = 0.5;

/** Extra headroom above the crown so the bubble tail clears the dome. */
const CROWN_HEADROOM = 0.012;

const EYE_RADIUS = 0.034; // of model height
const EYE_FORWARD = 0.244; // of model height

export const EYE_BASE = 1.35;
export const EYE_CTA = 1.9; // absolute, not a multiplier — see plan deviation 2
export const EYE_SLEEP = 0.6;

/** Resting yaw. Was -0.28 (a 16° three-quarter); Russ read that as him looking
 *  away. Kept as a slight turn so he still reads as a figure in space rather
 *  than a decal, but shallow enough to be facing you. */
export const REST_TURN = -0.1;

/** Squared up to the reader — where he goes while he is speaking. */
export const FACING_READER = 0;

/** The lifted curve. `s` is 0.94 here, matching the `cherry-lift` entry in
 *  guide-radial.js that produced the locked measurement (body Y 0.085 =
 *  6.47:1 on cotton). Lock §1's summary table says 0.99; flagged, not folded. */
const REMAP = { h: 0.5, s: 0.94, l: 0.25, contrast: 1.18, gamma: 0.68 };

const REMAP_SIZE = 512;

/* ---- colour helpers (ported verbatim from the board) ------------------- */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function rgb2hsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h: number;
  if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (mx === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
  h = (((h % 360) + 360) % 360) / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

/** The red family, as measured on the shipped map. Anything outside passes
 *  through untouched, which is what keeps the wear and panel work alive. */
const inRedBand = (h: number, s: number, l: number) =>
  s >= 0.14 && l > 0.04 && l < 0.97 && (h <= 26 || h >= 332);

/**
 * Draw the GLB's own base-colour map to a canvas, walk the pixels, rewrite only
 * the red hue family to cherry. Lightness is re-centred on the band's OWN mean
 * so the remap keeps the map's internal contrast, then gamma < 1 lifts the whole
 * curve — flat cherry measures 1.79:1 on noir and fails there.
 */
function remapRedBand(image: CanvasImageSource) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = REMAP_SIZE;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(image, 0, 0, REMAP_SIZE, REMAP_SIZE);
  const img = ctx.getImageData(0, 0, REMAP_SIZE, REMAP_SIZE);
  const d = img.data;

  let sum = 0;
  let n = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 8) continue;
    const [h, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]);
    if (inRedBand(h, s, l)) {
      sum += l;
      n++;
    }
  }
  const mean = n ? sum / n : 0.5;

  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 8) continue;
    const [h, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]);
    if (!inRedBand(h, s, l)) continue;
    let L = clamp(REMAP.l + (l - mean) * REMAP.contrast, 0.01, 0.99);
    L = clamp(Math.pow(L, REMAP.gamma), 0.01, 0.99);
    const [r, g, b] = hsl2rgb(REMAP.h, REMAP.s, L);
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(cv);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ---- pose -------------------------------------------------------------- */

/** Plain object so GSAP can tween it directly. The scheduler owns these. */
export type GuidePose = {
  turn: number; // group yaw (rad)
  tilt: number; // group pitch (rad)
  headTurn: number; // Head_05 yaw offset (rad)
  headPitch: number; // Head_05 pitch offset (rad)
  sway: number; // 0..1 ambient sway amount
  bob: number; // extra vertical offset, in model heights
  /** Where he is standing relative to the pad centre, in model heights.
   *  Drag writes these; releasing walks them back to 0. */
  offsetX: number;
  offsetY: number;
  eye: number; // absolute emissiveIntensity
  walk: number; // clip weights, 0..1
  talk: number;
  greet: number;
  run: number;
};

/** The clips this rig actually ships, by the name the pose uses for each. */
export const CLIP_KEYS = ["walk", "talk", "greet", "run"] as const;
export type GuideClip = (typeof CLIP_KEYS)[number];

export function createPose(): GuidePose {
  return {
    turn: REST_TURN,
    tilt: 0,
    headTurn: 0,
    headPitch: 0,
    sway: 1,
    bob: 0,
    offsetX: 0,
    offsetY: 0,
    eye: EYE_BASE,
    walk: 0,
    talk: 0,
    greet: 0,
    run: 0,
  };
}

export type GuideRobot = {
  pose: GuidePose;
  clips: string[];
  /** Advance the mixer and draw one frame. `dt` in seconds. */
  render(dt: number, elapsed: number): void;
  resize(size: number): void;
  /** Crown position in viewport pixels, or null when off-screen. */
  getCrown(): { x: number; y: number } | null;
  /** DESIGN-LOCK §3 ring states, carried by the pad's rim. */
  setRim(ground: "cotton" | "noir", state: GuideRimState): void;
  dispose(): void;
};

/* ---- builder ----------------------------------------------------------- */

export async function buildGuideRobot(
  canvas: HTMLCanvasElement,
  modelUrl: string
): Promise<GuideRobot> {
  const disposables: Array<{ dispose: () => void }> = [];

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    // Matches the design board. Costs a little memory, but it is what makes the
    // canvas readable from Playwright — without it a verification readback gets
    // a cleared buffer and a working robot reports as blank.
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  renderer.setClearAlpha(0);
  renderer.shadowMap.enabled = false;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAM_FOV, 1, 0.1, 100);
  camera.position.set(0, CAM_LIFT, CAM_Z);
  camera.lookAt(0, 0, 0);

  // Locked lighting — one warm key, low ambient, no shadow maps.
  const key = new THREE.DirectionalLight(0xfff1e0, 4);
  key.position.set(-3.2, 4.4, 3.4);
  scene.add(key, new THREE.AmbientLight(0x8d867d, 0.45));

  const group = new THREE.Group();
  const pivot = new THREE.Group();
  group.add(pivot);
  scene.add(group);

  const gltf = await new GLTFLoader().loadAsync(modelUrl);
  const model = gltf.scene;

  let bodyMesh: THREE.Mesh | null = null;
  let partsMesh: THREE.Mesh | null = null;
  let bodySrc: THREE.MeshStandardMaterial | null = null;
  let partsSrc: THREE.MeshStandardMaterial | null = null;

  model.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.frustumCulled = false;
    const m = (
      Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
    ) as THREE.MeshStandardMaterial;
    if (/parts/i.test(m?.name || "")) {
      partsMesh = mesh;
      partsSrc = m;
    } else {
      bodyMesh = mesh;
      bodySrc = m;
    }
  });

  // Centre on X/Z and sit the feet at y = 0, so crownLift below is a clean
  // "distance from the head bone to the top of the model".
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const centre = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(centre);
  model.position.set(-centre.x, -box.min.y, -centre.z);
  // The figure gets its own group so it can be nudged around inside the stage
  // while the pad stays put — he steps off it, then walks back on.
  const figure = new THREE.Group();
  figure.add(model);
  pivot.add(figure);
  pivot.scale.setScalar(1);

  /* ---- the platform ----
   * A machined pad, not a sci-fi hover disc: matte noir deck, ink base, one
   * fine hairline rim where the two meet. No emission, no gradient — the
   * bevel and the key light do all the work. */
  const padGroup = new THREE.Group();
  const padDeckGeo = new THREE.CylinderGeometry(
    PAD.deckRadius * size.y,
    PAD.baseRadius * size.y,
    PAD.deckHeight * size.y,
    56
  );
  const padBaseGeo = new THREE.CylinderGeometry(
    PAD.baseRadius * size.y,
    PAD.baseRadius * 0.96 * size.y,
    PAD.baseHeight * size.y,
    56
  );
  const padRimGeo = new THREE.TorusGeometry(PAD.deckRadius * size.y, PAD.rimTube * size.y, 8, 72);
  disposables.push(padDeckGeo, padBaseGeo, padRimGeo);

  const padDeckMat = new THREE.MeshStandardMaterial({
    color: TOKEN_HEX.noir,
    roughness: 0.85,
    metalness: 0.12,
  });
  const padBaseMat = new THREE.MeshStandardMaterial({
    color: TOKEN_HEX.ink,
    roughness: 0.95,
    metalness: 0.08,
  });
  const padRimMat = new THREE.MeshStandardMaterial({
    color: TOKEN_HEX.hairline,
    roughness: 0.55,
    metalness: 0.25,
  });
  disposables.push(padDeckMat, padBaseMat, padRimMat);

  const padDeck = new THREE.Mesh(padDeckGeo, padDeckMat);
  padDeck.position.y = -(PAD.deckHeight / 2) * size.y;
  const padBase = new THREE.Mesh(padBaseGeo, padBaseMat);
  padBase.position.y = -(PAD.deckHeight + PAD.baseHeight / 2) * size.y;
  const padRim = new THREE.Mesh(padRimGeo, padRimMat);
  padRim.rotation.x = Math.PI / 2;
  padRim.position.y = -0.001 * size.y;
  for (const m of [padDeck, padBase, padRim]) m.frustumCulled = false;
  padGroup.add(padBase, padDeck, padRim);
  pivot.add(padGroup);

  let head: THREE.Object3D | null = null;
  const eyeBones: THREE.Object3D[] = [];
  model.traverse((o) => {
    if (!head && /^head/i.test(o.name)) head = o;
    if (/^eye/i.test(o.name)) eyeBones.push(o);
  });

  /* ---- materials ---- */

  const bodyMap = (bodySrc as THREE.MeshStandardMaterial | null)?.map ?? null;
  const remapped = bodyMap?.image ? remapRedBand(bodyMap.image as CanvasImageSource) : null;
  if (remapped) disposables.push(remapped);

  const bodyMat = new THREE.MeshStandardMaterial({
    map: remapped,
    normalMap: (bodySrc as THREE.MeshStandardMaterial | null)?.normalMap ?? null,
    roughness: 0.85,
    metalness: 0.15,
  });
  if (bodyMat.normalMap) bodyMat.normalScale = new THREE.Vector2(0.6, 0.6);
  disposables.push(bodyMat);

  // Parts are held flat noir and their base-colour map is NOT used, so the red
  // reads as the accent instead of covering the whole robot.
  const partsMat = new THREE.MeshStandardMaterial({
    color: TOKEN_HEX.noir,
    roughness: 0.9,
    metalness: 0.1,
    normalMap: (partsSrc as THREE.MeshStandardMaterial | null)?.normalMap ?? null,
  });
  if (partsMat.normalMap) partsMat.normalScale = new THREE.Vector2(0.6, 0.6);
  disposables.push(partsMat);

  if (bodyMesh) (bodyMesh as THREE.Mesh).material = bodyMat;
  if (partsMesh) (partsMesh as THREE.Mesh).material = partsMat;

  /* ---- the eye mark ----
   * One emissive sphere per eye bone. The bones are mirrored, so the forward
   * offset is measured in world space (pivot scale 1 = model units) and baked
   * into each bone's own frame, where it then scales with the pivot. */
  const eyeMat = new THREE.MeshStandardMaterial({
    color: TOKEN_HEX.noir,
    roughness: 0.35,
    metalness: 0,
    emissive: new THREE.Color(TOKEN_HEX.paper),
    emissiveIntensity: EYE_BASE,
    toneMapped: false,
  });
  disposables.push(eyeMat);

  const eyeGeo = new THREE.SphereGeometry(1, 20, 16);
  disposables.push(eyeGeo);

  scene.updateMatrixWorld(true);
  const boneScale = new THREE.Vector3();
  for (const bone of eyeBones) {
    const pupil = new THREE.Mesh(eyeGeo, eyeMat);
    pupil.frustumCulled = false;
    bone.add(pupil);
    bone.updateWorldMatrix(true, false);
    bone.getWorldScale(boneScale);
    const target = new THREE.Vector3();
    bone.getWorldPosition(target);
    target.z += EYE_FORWARD * size.y;
    bone.worldToLocal(target);
    pupil.position.copy(target);
    pupil.scale.setScalar((EYE_RADIUS * size.y) / Math.max(boneScale.x, 1e-6));
  }

  /** Distance from the head bone to the top of the model, in model units. The
   *  bone sits low inside the dome, so anchoring the bubble to it alone puts
   *  the tail on his face (lock deviation 5). */
  const crownLift = head
    ? size.y - (head as THREE.Object3D).getWorldPosition(new THREE.Vector3()).y
    : size.y * 0.5;

  const headRestY = head ? (head as THREE.Object3D).rotation.y : 0;
  const headRestX = head ? (head as THREE.Object3D).rotation.x : 0;

  /* ---- clips ----
   * The rig ships exactly four: `Armature|action_Greet`, `Armature|Run`,
   * `Armature|Talk`, `Armature|Walking` — read off the GLB, not assumed. There
   * is NO idle or fidget clip, so ambient life stays procedural (guide-idle.ts),
   * and there is no spin/jump/flip either, which is why "Do a trick" is Run plus
   * a turn written in code. */
  const mixer = gltf.animations.length ? new THREE.AnimationMixer(model) : null;
  const actions: Partial<Record<GuideClip, THREE.AnimationAction>> = {};
  if (mixer) {
    const wire = (name: GuideClip, re: RegExp) => {
      const clip = gltf.animations.find((c) => re.test(c.name));
      if (!clip) return;
      const a = mixer.clipAction(clip);
      a.play();
      a.setEffectiveWeight(0);
      a.enabled = false;
      actions[name] = a;
    };
    wire("walk", /walk/i);
    wire("talk", /talk/i);
    wire("greet", /greet/i);
    wire("run", /run/i);
  }

  // With every action disabled the mixer stops writing to the bones, which
  // would freeze the rig mid-stride. Snapshot the bind pose so it can be
  // restored the moment clip weight drops to zero.
  type BoneRest = {
    node: THREE.Object3D;
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
    scale: THREE.Vector3;
  };
  const restPose: BoneRest[] = [];
  model.traverse((o) => {
    if ((o as THREE.Bone).isBone) {
      restPose.push({
        node: o,
        position: o.position.clone(),
        quaternion: o.quaternion.clone(),
        scale: o.scale.clone(),
      });
    }
  });
  const restoreRestPose = () => {
    for (const b of restPose) {
      b.node.position.copy(b.position);
      b.node.quaternion.copy(b.quaternion);
      b.node.scale.copy(b.scale);
    }
  };

  /* ---- framing (lock §2) ---- */

  let modelH = 1;
  const fit = () => {
    const scaleH = 1 / (SPAN[1] - SPAN[0]);
    modelH = VIEW_H * scaleH;
    pivot.scale.setScalar(modelH / Math.max(size.y, 1e-6));
  };
  fit();

  const pose = createPose();

  /* ---- per-frame ---- */

  const apply = (dt: number, elapsed: number) => {
    /* Ambient life, always running. Three periods that do not divide into each
     * other, so the loop never lands on an obvious beat — the whole point is
     * that he looks like he is doing something rather than cycling. */
    group.position.set(0, -((SPAN[0] + SPAN[1]) / 2) * modelH, 0);
    group.rotation.y =
      pose.turn +
      (Math.sin(elapsed * 0.55) * 0.06 + Math.sin(elapsed * 0.23) * 0.03) * pose.sway;
    group.rotation.x = pose.tilt + Math.sin(elapsed * 0.9) * 0.018 * pose.sway;
    group.rotation.z = Math.sin(elapsed * 0.41) * 0.012 * pose.sway;

    // The figure breathes; the pad never moves, so he reads as an object
    // standing ON something rather than a decal beside it.
    const bob =
      (Math.sin(elapsed * 0.8) * 0.008 + Math.sin(elapsed * 1.7) * 0.002) * pose.sway * modelH +
      pose.bob * modelH;
    figure.position.set(pose.offsetX * modelH, bob + pose.offsetY * modelH, 0);

    if (mixer) {
      let total = 0;
      for (const name of CLIP_KEYS) {
        const action = actions[name];
        if (!action) continue;
        const w = clamp(pose[name], 0, 1);
        total += w;
        action.enabled = w > 0.001;
        action.setEffectiveWeight(w);
      }
      if (total <= 0.001) restoreRestPose();
      else mixer.update(dt);
    }

    if (head) {
      const h = head as THREE.Object3D;
      h.rotation.y = headRestY + pose.headTurn;
      h.rotation.x = headRestX + pose.headPitch;
    }

    eyeMat.emissiveIntensity = pose.eye;
  };

  const crownVec = new THREE.Vector3();
  const getCrown = () => {
    const anchor = (head as THREE.Object3D | null) ?? model;
    anchor.getWorldPosition(crownVec);
    crownVec.y += crownLift * pivot.scale.y + CROWN_HEADROOM * modelH;
    crownVec.project(camera);
    if (crownVec.z > 1) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + ((crownVec.x + 1) / 2) * rect.width,
      y: rect.top + ((1 - crownVec.y) / 2) * rect.height,
    };
  };

  const resize = (px: number) => {
    const s = Math.max(24, Math.round(px));
    renderer.setSize(s, s, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    fit();
  };

  const render = (dt: number, elapsed: number) => {
    apply(dt, elapsed);
    scene.updateMatrixWorld(true);
    renderer.render(scene, camera);
  };

  const dispose = () => {
    mixer?.stopAllAction();
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) mesh.geometry.dispose();
    });
    // The GLB's own maps are not in `disposables` — they came from the loader.
    for (const src of [bodySrc, partsSrc] as (THREE.MeshStandardMaterial | null)[]) {
      src?.map?.dispose();
      src?.normalMap?.dispose();
      src?.dispose();
    }
    for (const d of disposables) d.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };

  /* The rim is set, not tweened: at this size a colour crossfade is invisible
   * and a tween would be one more thing to kill on unmount. */
  const setRim = (ground: "cotton" | "noir", state: GuideRimState) => {
    padRimMat.color.setHex(RIM_COLOR[ground][state]);
  };

  return {
    pose,
    clips: gltf.animations.map((c) => c.name),
    render,
    resize,
    getCrown,
    setRim,
    dispose,
  };
}
