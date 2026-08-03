// Live guide canvas for the home-page design preview.
// Same architecture and the same locked numbers as
// output/components/sections/home/guide/guide.ts — this is that code running in
// the browser so the choreography can be judged before it is merged.
import * as THREE from "https://esm.sh/three@0.169.0";
import { GLTFLoader } from "https://esm.sh/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";

const INK = 0x241f1f;
const NOIR = 0x1b1717;
const CHILI = 0xd73b3e;

const EYE_BASE_INTENSITY = 1;
const EYE_RADIUS = 0.034;
const EYE_FORWARD = 0.244;

const CAM_Z = 6;
const CAM_FOV = 32;
const ROBOT_VH = 0.2;

export const CHAPTERS = [
  { id: "arrival", range: [0, 0.08] },
  { id: "services", range: [0.08, 0.3] },
  { id: "process", range: [0.3, 0.5] },
  { id: "principles", range: [0.5, 0.7] },
  { id: "faq", range: [0.7, 0.85] },
  { id: "cta", range: [0.85, 1] },
];

function buildTimeline(gsap, st) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });

  tl.set(st, { x: 0.2, y: -0.22, turn: 0.1, opacity: 1 }, 0)
    .to(st, { y: 0.46, duration: 0.055, ease: "power3.out" }, 0)
    .to(st, { turn: -0.18, headTurn: 0.2, duration: 0.02 }, 0.05)
    .to(st, { sway: 1, duration: 0.01 }, 0.07);

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

  tl.to(st, { x: 0.74, y: 0.52, turn: -0.5, headTurn: -0.18, sway: 0.3, duration: 0.07 }, 0.3)
    .to(st, { talk: 1, duration: 0.06, ease: "power2.out" }, 0.37)
    .to(st, { y: 0.44, duration: 0.05 }, 0.4)
    .to(st, { talk: 0, sway: 0.8, duration: 0.04 }, 0.46);

  tl.to(st, { x: 0.16, y: 0.6, turn: 0.26, headTurn: 0, tilt: 0.06, duration: 0.07 }, 0.5).to(
    st,
    { sway: 1, duration: 0.03 },
    0.57
  );

  tl.to(st, { x: 0.8, y: 0.5, turn: -0.28, tilt: -0.04, duration: 0.06 }, 0.7)
    .to(st, { headTurn: 0.28, talk: 0.5, duration: 0.03 }, 0.76)
    .to(st, { headTurn: -0.14, talk: 0, duration: 0.03 }, 0.8);

  tl.to(st, { x: 0.5, y: 0.54, turn: 0, tilt: 0, headTurn: 0, sway: 0.4, duration: 0.06 }, 0.85)
    .fromTo(st, { greet: 0 }, { greet: 1, duration: 0.09, ease: "none" }, 0.89)
    .to(st, { greet: 0, duration: 0.02 }, 0.98)
    .to(st, { eye: 1.55, duration: 0.05 }, 0.93);

  return tl;
}

class GuideScene extends HTMLElement {
  async connectedCallback() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block";
    this.appendChild(canvas);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setClearAlpha(0);
    renderer.shadowMap.enabled = false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAM_FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAM_Z);
    camera.lookAt(0, 0, 0);

    const key = new THREE.DirectionalLight(0xfff1e0, 4);
    key.position.set(-3.2, 4.4, 3.4);
    scene.add(key, new THREE.AmbientLight(0x8d867d, 0.45));

    const group = new THREE.Group();
    scene.add(group);

    const gltf = await new GLTFLoader().loadAsync(this.getAttribute("src") || "uploads/repo_robot.glb");
    const model = gltf.scene;

    const shell = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.85, metalness: 0.15 });
    const joint = new THREE.MeshStandardMaterial({ color: NOIR, roughness: 0.9, metalness: 0.1 });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: NOIR,
      roughness: 0.35,
      metalness: 0,
      emissive: new THREE.Color(CHILI),
      emissiveIntensity: EYE_BASE_INTENSITY,
      toneMapped: false,
    });

    model.traverse((o) => {
      if (!o.isMesh) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      const isParts = /parts/i.test(m?.name || "");
      const target = isParts ? joint : shell;
      if (m?.normalMap && !target.normalMap) {
        target.normalMap = m.normalMap;
        target.normalScale = new THREE.Vector2(0.6, 0.6);
        target.needsUpdate = true;
      }
      o.material = target;
      o.frustumCulled = false;
    });

    let head = null;
    const eyeBones = [];
    model.traverse((o) => {
      if (!head && /^head/i.test(o.name)) head = o;
      if (/^eye/i.test(o.name)) eyeBones.push(o);
    });

    let walkAction = null;
    let talkAction = null;
    let greetAction = null;
    const mixer = gltf.animations.length ? new THREE.AnimationMixer(model) : null;
    if (mixer) {
      const wire = (re) => {
        const clip = gltf.animations.find((c) => re.test(c.name));
        if (!clip) return null;
        const a = mixer.clipAction(clip);
        a.play();
        a.setEffectiveWeight(0);
        return a;
      };
      walkAction = wire(/walk/i);
      talkAction = wire(/talk/i);
      greetAction = wire(/greet/i);
    }

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
    const robotHeight = () => worldHeight() * ROBOT_VH;
    const fit = () => pivot.scale.setScalar(robotHeight() / Math.max(size.y, 1e-6));
    fit();

    // The eye bones are mirrored, so measure forward in world space and bake the
    // result into each bone's own frame.
    const eyeGeo = new THREE.SphereGeometry(1, 20, 16);
    const eyes = [];
    group.updateMatrixWorld(true);
    const boneScale = new THREE.Vector3();
    eyeBones.forEach((bone) => {
      const pupil = new THREE.Mesh(eyeGeo, eyeMat);
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

    const state = {
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
    };
    const idle = { t: 0 };
    gsap.to(idle, { t: Math.PI * 2, duration: 7, ease: "none", repeat: -1 });

    const clamp01 = gsap.utils.clamp(0, 1);
    const headRestY = head ? head.rotation.y : 0;
    let stride = 0;
    let prevX = state.x;
    let prevY = state.y;

    const setAction = (action, weight, time) => {
      if (!action) return;
      const w = clamp01(weight);
      action.enabled = w > 0.001;
      action.setEffectiveWeight(w);
      if (w > 0.001) {
        const d = action.getClip().duration || 1;
        action.time = ((time % d) + d) % d;
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
        const greet = state.greet;
        const talk = state.talk * (1 - greet);
        const walking = clamp01(travel * 220) * (1 - greet - talk);
        setAction(greetAction, greet, greet * (greetAction?.getClip().duration ?? 1));
        setAction(talkAction, talk, talk * (talkAction?.getClip().duration ?? 1));
        setAction(walkAction, walking, stride);
        mixer.update(0);
      }
      if (head) head.rotation.y = headRestY + state.headTurn;

      const opacity = clamp01(state.opacity);
      group.visible = opacity > 0.002;
      [shell, joint, eyeMat].forEach((m) => {
        m.transparent = opacity < 0.999;
        m.opacity = opacity;
      });
      eyeMat.emissiveIntensity = EYE_BASE_INTENSITY * state.eye;
    };

    const resize = () => {
      const w = this.clientWidth || window.innerWidth;
      const h = this.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fit();
      apply();
    };
    resize();
    window.addEventListener("resize", () => {
      resize();
      ScrollTrigger.refresh();
    });

    const eyePoint = new THREE.Vector3();
    const getEyeScreen = () => {
      const pupil = eyes[0];
      if (!pupil) return null;
      pupil.getWorldPosition(eyePoint);
      eyePoint.project(camera);
      if (eyePoint.z > 1) return null;
      const rect = this.getBoundingClientRect();
      return {
        x: rect.left + ((eyePoint.x + 1) / 2) * rect.width,
        y: rect.top + ((1 - eyePoint.y) / 2) * rect.height,
      };
    };

    /* ---- The one master scrubbed trigger ------------------------------- */
    // The page streams, so the trigger element can arrive after this component
    // upgrades — wait for it instead of silently skipping the scrub.
    const selector = this.getAttribute("trigger") || "#guide";
    const waitFor = (sel, tries = 0) =>
      new Promise((resolve) => {
        const found = document.querySelector(sel);
        if (found || tries > 100) return resolve(found);
        setTimeout(() => waitFor(sel, tries + 1).then(resolve), 50);
      });
    const root = await waitFor(selector);
    const tl = buildTimeline(gsap, state);
    if (!root) console.warn("[guide] trigger", selector, "never appeared — scrub not wired");

    // Progress is computed from the LIVE layout every frame rather than from a
    // ScrollTrigger start/end measured once. This page streams (React can swap
    // the trigger node) and the hero pin injects a 200vh spacer after this async
    // load resolves, so any cached measurement is stale by construction. Reading
    // offsetTop/offsetHeight per frame cannot drift, and `eased` reproduces the
    // scrub: 0.3 catch-up feel.
    const live = () => (selector && document.querySelector(selector)) || root;
    let eased = 0;
    let lastService = -1;
    let override = false;
    const scrubProgress = () => {
      const el = live();
      if (!el) return 0;
      const span = el.offsetHeight - window.innerHeight;
      if (span <= 0) return 0;
      return clamp01((window.scrollY - el.offsetTop) / span);
    };
    const advance = () => {
      if (override) return;
      const target = scrubProgress();
      eased += (target - eased) * 0.18;
      if (Math.abs(target - eased) < 0.0005) eased = target;
      tl.progress(eased);

      const [s, e] = CHAPTERS[1].range;
      if (eased >= s && eased < e) {
        const i = Math.min(4, Math.floor((eased - s) / ((e - s) / 5)));
        if (i !== lastService) {
          lastService = i;
          document.dispatchEvent(new CustomEvent("guide:service", { detail: { index: i } }));
        }
      } else {
        lastService = -1;
      }
    };

    window.__guideProgress = (p) => {
      override = p !== null && p !== undefined;
      if (!override) return;
      tl.progress(clamp01(p));
      eased = clamp01(p);
      apply();
      renderer.render(scene, camera);
    };

    /* ---- Callout connector: card corner → the eye, live ---------------- */
    const render = () => {
      if (document.hidden) return;
      advance();
      apply();
      renderer.render(scene, camera);

      const card = document.querySelector('[data-guide-card][data-active="true"]');
      const conn = card?.querySelector("[data-guide-conn]");
      if (!conn) return;
      const eye = getEyeScreen();
      const anchor = conn.getBoundingClientRect();
      if (!eye) {
        conn.style.setProperty("--conn-len", "0px");
        return;
      }
      const dx = eye.x - anchor.left;
      const dy = eye.y - anchor.top;
      conn.style.setProperty("--conn-len", `${Math.round(Math.hypot(dx, dy))}px`);
      conn.style.setProperty("--conn-angle", `${(Math.atan2(dy, dx) * 180) / Math.PI}deg`);
    };
    gsap.ticker.add(render);

    this.dataset.ready = "true";
    // The hero pin's spacer is inserted into the layout before this async load
    // resolves, so the master trigger above measured a stale document. A hard
    // refresh in creation order re-measures every trigger against the real one.
    ScrollTrigger.sort();
    ScrollTrigger.refresh(true);
    document.dispatchEvent(new CustomEvent("guide:ready"));
  }
}

customElements.define("guide-scene", GuideScene);
