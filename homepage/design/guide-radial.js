/* Corner guide rig — design-lock harness.
 * One shared WebGL renderer blits into N 2D canvases, so a board can carry
 * thirty robot renders without hitting the browser's context ceiling.
 * <guide-puck>   — one framed robot render (+ measured luminance readout)
 * <guide-corner> — the full corner rig: puck, radial fan, speech bubble, ask panel
 * Numbers here are the LOCKED numbers — see DESIGN-LOCK.md.
 */
import * as THREE from "https://esm.sh/three@0.169.0";
import { GLTFLoader } from "https://esm.sh/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";

const C = {
  noir: "#1B1717",
  ink: "#241F1F",
  cotton: "#EDEBDD",
  paper: "#F5F3E8",
  gray: "#6E6963",
  grayNoir: "#A8A29A",
  hairline: "#D6D2C2",
  cherry: "#810100",
  maroon: "#630000",
  chili: "#D73B3E",
  chili300: "#E5595C",
};
const SHARP = "cubic-bezier(0.16,1,0.3,1)";
const SOFT = "cubic-bezier(0.65,0,0.35,1)";
const UI = "Inter, system-ui, sans-serif";
const DISPLAY = "'Archivo Black', Arial Black, sans-serif";
const SERIF = "Newsreader, Georgia, serif";
const MONO = "ui-monospace, Menlo, monospace";

/* ---- locked rig numbers ------------------------------------------------ */
export const LOCK = {
  puck: 104,
  puckMobile: 76,
  radius: 148,
  petal: 44,
  arc: [176, 276],
  frame: "waist",
  remap: "cherry-lift",
  parts: "noir",
  eye: "paper",
  eyeIntensity: 1.35,
  eyeCtaStep: 1.9,
  bubbleMin: 176,
  bubbleMax: 264,
  askWidth: 360,
};
window.GUIDE_LOCK = LOCK;

const CAM_FOV = 32;
const CAM_Z = 6;
const VIEW_H = 2 * Math.tan((CAM_FOV * Math.PI) / 360) * CAM_Z;
const EYE_RADIUS = 0.034;
const EYE_FORWARD = 0.244;

/* model-height fractions kept in frame: [bottom, top] */
const FRAMES = {
  full: [-0.16, 1.16],
  waist: [0.02, 1.1],
  head: [0.3, 1.06],
};

/* hue / sat / lightness targets for the red-band remap. lightness is
 * re-centred on `l`; gamma < 1 lifts the whole curve so wear survives. */
const REMAPS = {
  cherry: { h: 0.5, s: 0.99, l: 0.25, contrast: 1, gamma: 1 },
  chili: { h: 359.4, s: 0.65, l: 0.54, contrast: 1, gamma: 1 },
  "cherry-lift": { h: 0.5, s: 0.94, l: 0.25, contrast: 1.18, gamma: 0.68 },
};
const EYES = {
  chili: { emissive: C.chili, intensity: 1 },
  hot: { emissive: C.chili, intensity: 2.6 },
  paper: { emissive: C.paper, intensity: 1.35 },
};

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h;
  if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (mx === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}
function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hsl2rgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}
const inRedBand = (h, s, l) => s >= 0.14 && l > 0.04 && l < 0.97 && (h <= 26 || h >= 332);

/* draw the GLB's own base-colour map to a canvas, walk the pixels, rewrite
 * only the red hue family. Everything else passes through untouched. */
function remapImage(image, key, size = 512) {
  const t = REMAPS[key];
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, size, size);
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  let sum = 0, n = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 8) continue;
    const [h, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]);
    if (inRedBand(h, s, l)) { sum += l; n++; }
  }
  const mean = n ? sum / n : 0.5;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 8) continue;
    const [h, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]);
    if (!inRedBand(h, s, l)) continue;
    let L = clamp(t.l + (l - mean) * t.contrast, 0.01, 0.99);
    if (t.gamma !== 1) L = clamp(Math.pow(L, t.gamma), 0.01, 0.99);
    const [r, g, b] = hsl2rgb(t.h, t.s, L);
    d[i] = r; d[i + 1] = g; d[i + 2] = b;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.flipY = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return { tex, mean, coverage: n / (size * size) };
}

/* ---- shared render farm ------------------------------------------------ */
const farm = { ready: false, stats: {} };
let loading = null;

function boot(src) {
  if (loading) return loading;
  loading = (async () => {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setClearAlpha(0);
    renderer.shadowMap.enabled = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAM_FOV, 1, 0.1, 100);
    camera.position.set(0, 0, CAM_Z);
    const key = new THREE.DirectionalLight(0xfff1e0, 4);
    key.position.set(-3.2, 4.4, 3.4);
    scene.add(key, new THREE.AmbientLight(0x8d867d, 0.45));

    const group = new THREE.Group();
    const pivot = new THREE.Group();
    group.add(pivot);
    scene.add(group);

    const gltf = await new GLTFLoader().loadAsync(src);
    const model = gltf.scene;

    let bodyMesh = null, partsMesh = null, bodySrc = null, partsSrc = null;
    model.traverse((o) => {
      if (!o.isMesh) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      o.frustumCulled = false;
      if (/parts/i.test(m?.name || "")) { partsMesh = o; partsSrc = m; }
      else { bodyMesh = o; bodySrc = m; }
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const centre = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(centre);
    model.position.set(-centre.x, -box.min.y, -centre.z);
    pivot.add(model);
    pivot.scale.setScalar(1);

    let head = null;
    const bones = [];
    model.traverse((o) => {
      if (!head && /^head/i.test(o.name)) head = o;
      if (/^eye/i.test(o.name)) bones.push(o);
    });

    /* the eye mark: one sphere per eye bone. Bones are mirrored, so the forward
     * offset is measured in world space (pivot scale 1 = model units) and baked
     * into each bone's own frame, then scales with the pivot. */
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x1b1717,
      roughness: 0.35,
      metalness: 0,
      emissive: new THREE.Color(C.chili),
      emissiveIntensity: 1,
      toneMapped: false,
    });
    const eyeGeo = new THREE.SphereGeometry(1, 20, 16);
    const eyes = [];
    scene.updateMatrixWorld(true);
    const bs = new THREE.Vector3();
    bones.forEach((bone) => {
      const pupil = new THREE.Mesh(eyeGeo, eyeMat);
      pupil.frustumCulled = false;
      bone.add(pupil);
      bone.updateWorldMatrix(true, false);
      bone.getWorldScale(bs);
      const target = new THREE.Vector3();
      bone.getWorldPosition(target);
      target.z += EYE_FORWARD * size.y;
      bone.worldToLocal(target);
      pupil.position.copy(target);
      pupil.scale.setScalar((EYE_RADIUS * size.y) / Math.max(bs.x, 1e-6));
      eyes.push(pupil);
    });

    const mats = { cache: new Map() };
    const bodyMat = (remap) => {
      const k = "b:" + remap;
      if (mats.cache.has(k)) return mats.cache.get(k);
      let m;
      if (remap === "none") {
        m = bodySrc.clone();
      } else {
        const r = remapImage(bodySrc.map.image, remap);
        farm.stats[remap] = { mean: r.mean, coverage: r.coverage };
        m = new THREE.MeshStandardMaterial({
          map: r.tex,
          normalMap: bodySrc.normalMap || null,
          roughness: 0.85,
          metalness: 0.15,
        });
        if (m.normalMap) m.normalScale = new THREE.Vector2(0.6, 0.6);
      }
      mats.cache.set(k, m);
      return m;
    };
    const partsMat = (mode, remap) => {
      const k = "p:" + mode + ":" + remap;
      if (mats.cache.has(k)) return mats.cache.get(k);
      let m;
      if (mode === "noir") {
        m = new THREE.MeshStandardMaterial({
          color: 0x1b1717,
          roughness: 0.9,
          metalness: 0.1,
          normalMap: partsSrc.normalMap || null,
        });
        if (m.normalMap) m.normalScale = new THREE.Vector2(0.6, 0.6);
      } else if (remap === "none") {
        m = partsSrc.clone();
      } else {
        const r = remapImage(partsSrc.map.image, remap);
        m = new THREE.MeshStandardMaterial({
          map: r.tex,
          normalMap: partsSrc.normalMap || null,
          roughness: 0.9,
          metalness: 0.1,
        });
        if (m.normalMap) m.normalScale = new THREE.Vector2(0.6, 0.6);
      }
      mats.cache.set(k, m);
      return m;
    };

    const mixer = gltf.animations.length ? new THREE.AnimationMixer(model) : null;
    const actions = {};
    if (mixer) {
      const wire = (name, re) => {
        const clip = gltf.animations.find((c) => re.test(c.name));
        if (!clip) return;
        const a = mixer.clipAction(clip);
        a.play();
        a.setEffectiveWeight(0);
        actions[name] = a;
      };
      wire("walk", /walk/i);
      wire("talk", /talk/i);
      wire("greet", /greet/i);
    }

    Object.assign(farm, {
      ready: true, renderer, scene, camera, group, pivot, model, size,
      bodyMesh, partsMesh, bodyMat, partsMat, eyeMat, eyes, head, mixer, actions,
      headRest: head ? head.rotation.y : 0,
      /* distance from the head bone to the top of the model, in model units —
       * the bubble anchors here so it tracks the bone but lands at the crown */
      crownLift: head ? size.y - head.getWorldPosition(new THREE.Vector3()).y : size.y * 0.5,
      clips: gltf.animations.map((c) => c.name),
    });
    return farm;
  })();
  return loading;
}

const _v = new THREE.Vector3();
function project(obj, lift, w, h) {
  obj.getWorldPosition(_v);
  _v.y += lift;
  _v.project(farm.camera);
  return { x: ((_v.x + 1) / 2) * w, y: ((1 - _v.y) / 2) * h };
}

function renderInto(canvas, cfg) {
  const { renderer, camera, group, pivot, size } = farm;
  const w = cfg.w, h = cfg.h;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  const span = FRAMES[cfg.frame] || FRAMES.waist;
  const scaleH = 1 / (span[1] - span[0]);
  const modelH = VIEW_H * scaleH;
  pivot.scale.setScalar(modelH / Math.max(size.y, 1e-6));
  group.position.set(0, -((span[0] + span[1]) / 2) * modelH + (cfg.bob || 0) * modelH, 0);
  group.rotation.set(cfg.tilt || 0, cfg.turn ?? -0.28, 0);

  farm.bodyMesh.material = farm.bodyMat(cfg.remap);
  farm.partsMesh.material = farm.partsMat(cfg.parts, cfg.remap);
  const eye = EYES[cfg.eye] || EYES.paper;
  farm.eyeMat.emissive.set(eye.emissive);
  farm.eyeMat.emissiveIntensity = eye.intensity * (cfg.eyeStep || 1);

  if (farm.mixer) {
    Object.entries(farm.actions).forEach(([name, a]) => {
      const on = name === cfg.clip;
      a.enabled = on;
      a.setEffectiveWeight(on ? 1 : 0);
      if (on) {
        const d = a.getClip().duration || 1;
        a.time = ((cfg.clipTime ?? 0.35 * d) % d + d) % d;
      }
    });
    farm.mixer.update(0);
  }
  if (farm.head) farm.head.rotation.y = farm.headRest + (cfg.headTurn || 0);

  renderer.render(farm.scene, camera);

  const ctx = canvas.getContext("2d");
  canvas.width = w * (window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, 2) : 1);
  canvas.height = canvas.width * (h / w);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);

  return {
    head: project(farm.head || farm.model, farm.crownLift * pivot.scale.y + 0.012 * modelH, w, h),
    eye: farm.eyes[0] ? project(farm.eyes[0], 0, w, h) : null,
  };
}

const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const relY = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};
function measure(canvas, groundHex) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const d = ctx.getImageData(0, 0, w, h).data;
  let n = 0, sum = 0, hot = 0, hotSum = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 24) continue;
    const Y = 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
    n++; sum += Y;
    if (Y > 0.45) { hot++; hotSum += Y; }
  }
  if (!n) return "no pixels";
  const mean = sum / n;
  const gY = relY(groundHex);
  const ratio = (Math.max(mean, gY) + 0.05) / (Math.min(mean, gY) + 0.05);
  const px = window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, 2) : 1;
  const markArea = Math.round(hot / (px * px));
  return `body Y ${mean.toFixed(3)} · ${ratio.toFixed(2)}:1 vs ground · mark ${markArea}px² @ Y ${hot ? (hotSum / hot).toFixed(2) : "—"}`;
}

/* ---- <guide-puck> ------------------------------------------------------ */
const pucks = new Set();

class GuidePuck extends HTMLElement {
  static get observedAttributes() {
    return ["remap", "parts", "eye", "frame", "turn", "clip", "live", "size", "eye-step", "head-turn"];
  }
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.style.display = "block";
    this.style.position = this.style.position || "relative";
    this._cv = document.createElement("canvas");
    this._cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    this._img = document.createElement("img");
    this._img.alt = "";
    this._img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:none";
    this._cv.style.zIndex = "1";
    this.append(this._cv, this._img);
    pucks.add(this);
    this._dirty = true;
    queueFlush();
    boot(this.getAttribute("src") || "uploads/repo_robot.glb").then(() => { this._dirty = true; queueFlush(); });
  }
  disconnectedCallback() { pucks.delete(this); }
  attributeChangedCallback() { this._dirty = true; queueFlush(); }
  get live() { return this.hasAttribute("live"); }
  cfg(t) {
    const w = this.offsetWidth || parseFloat(this.getAttribute("size")) || 104;
    const h = this.offsetHeight || w;
    const live = this.live;
    const clip = this.getAttribute("clip") || "none";
    return {
      w: Math.max(24, Math.round(w)),
      h: Math.max(24, Math.round(h)),
      remap: this.getAttribute("remap") || LOCK.remap,
      parts: this.getAttribute("parts") || LOCK.parts,
      eye: this.getAttribute("eye") || LOCK.eye,
      frame: this.getAttribute("frame") || LOCK.frame,
      turn: parseFloat(this.getAttribute("turn") ?? "-0.28") + (live ? Math.sin(t * 0.55) * 0.07 : 0),
      tilt: live ? Math.sin(t * 0.9) * 0.014 : 0,
      bob: live ? Math.sin(t * 0.8) * 0.006 : 0,
      headTurn: parseFloat(this.getAttribute("head-turn") ?? "0"),
      eyeStep: parseFloat(this.getAttribute("eye-step") ?? "1"),
      clip,
      clipTime: live && clip !== "none" ? t * 0.9 : undefined,
    };
  }
  paint(t) {
    if (!farm.ready) return;
    const w = Math.round(this.offsetWidth || 0);
    if (!this.live && !this._dirty && w === this._lastW) return;
    this._lastW = w;
    this._dirty = false;
    const p = renderInto(this._cv, this.cfg(t));
    this._proj = p;
    /* static pucks publish as an <img> so DOM-cloning capture tools see them;
     * live pucks keep the canvas on top and refresh the <img> beneath at 1.4fps
     * so a screenshot of a live board still shows the robot. */
    if (this.live) {
      this._cv.style.display = "block";
      const stamp = performance.now();
      if (!this._stamp || stamp - this._stamp > 700) {
        this._stamp = stamp;
        this._img.src = this._cv.toDataURL("image/png");
        this._img.style.display = "block";
      }
    } else {
      this._img.src = this._cv.toDataURL("image/png");
      this._img.style.display = "block";
      this._cv.style.display = "none";
    }
    this.style.setProperty("--head-x", p.head.x.toFixed(1) + "px");
    this.style.setProperty("--head-y", p.head.y.toFixed(1) + "px");
    this.dispatchEvent(new CustomEvent("puck:project", { detail: p, bubbles: true }));
    const id = this.getAttribute("readout");
    if (id && !this._measured) {
      this._measured = true;
      const out = document.querySelector(`[data-readout-for="${id}"]`);
      if (out) out.textContent = measure(this._cv, this.getAttribute("ground") || C.cotton);
    }
  }
}
customElements.define("guide-puck", GuidePuck);

let t0 = performance.now();
const now = () => (performance.now() - t0) / 1000;
const safe = (p, t) => { try { p.paint(t); } catch (e) { console.warn("[guide-puck]", e); } };

/* rAF drives the live pucks; a timer drives static ones, because rAF does not
 * fire while the document is hidden and a still board must still develop. */
function frame() {
  if (!document.hidden) pucks.forEach((p) => safe(p, now()));
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

let flushQueued = false;
function flush() {
  flushQueued = false;
  pucks.forEach((p) => { if (!p.live || !p._stamp) safe(p, now()); });
}
function queueFlush() {
  if (flushQueued) return;
  flushQueued = true;
  setTimeout(flush, 0);
}
setInterval(queueFlush, 900);
window.addEventListener("resize", queueFlush);

/* ---- nav model --------------------------------------------------------- */
const NAV = [
  { n: "01", label: "SERVICES", line: "Five crafts. One system." },
  { n: "02", label: "PROCESS", line: "This is how a project actually runs." },
  { n: "03", label: "PRINCIPLES", line: "The rules we don’t break." },
  { n: "04", label: "FAQ", line: "Ask anything. These come up a lot." },
  { n: "05", label: "CONTACT", line: "Your turn." },
  { n: "?", label: "ASK", line: "Ask me anything about the studio." },
];
const LOG = [
  ["What do you actually do?", "Five crafts, one system — branding, graphic design, web + app, media, SMM."],
  ["Who works on my project?", "Both founders. Two people by design."],
  ["How does it start?", "One conversation, then a written plan."],
  ["Can you take over an existing site?", "Yes, when the foundation is sound. We say so when it isn’t."],
  ["What do you need from me?", "The ambition, the constraints, and one decision-maker."],
];

const el = (tag, style, text) => {
  const n = document.createElement(tag);
  if (style) n.style.cssText = style;
  if (text != null) n.textContent = text;
  return n;
};

/* ---- <guide-corner> ---------------------------------------------------- */
class GuideCorner extends HTMLElement {
  static get observedAttributes() {
    return ["ground", "state", "size", "radius", "petal", "arc", "labels", "ask-petal", "ring",
      "bubble", "chapter", "exchanges", "dock-right", "dock-bottom", "dock-top", "frame",
      "remap", "parts", "eye", "live", "flip", "brief", "focus", "eye-step"];
  }
  attributeChangedCallback() { if (this._built) this.sync(); }
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    this.build();
    this.sync();
  }

  get ground() { return this.getAttribute("ground") === "noir" ? "noir" : "cotton"; }
  get onNoir() { return this.ground === "noir"; }
  get state() { return this.getAttribute("state") || "idle"; }
  get size() { return parseFloat(this.getAttribute("size") || LOCK.puck); }
  get labelsMode() { return this.getAttribute("labels") || "list"; }
  get reduced() { return this.state === "reduced"; }

  build() {
    this.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;font-family:" + UI;

    this.dock = el("div", "position:absolute;pointer-events:auto");
    this.appendChild(this.dock);

    /* petals + label list live behind the puck so the disc always wins */
    this.fan = el("div", "position:absolute;inset:0;pointer-events:none");
    this.list = el("div", "position:absolute;display:grid;pointer-events:none");
    this.dock.append(this.fan, this.list);

    /* puck */
    this.puck = el("button", "position:absolute;left:0;top:0;padding:0;border:0;background:transparent;border-radius:50%;cursor:pointer;pointer-events:auto;touch-action:none");
    this.puck.setAttribute("aria-label", "The guide — open chapter menu");
    this.disc = el("span", "position:absolute;inset:0;border-radius:50%;overflow:hidden;display:block");
    this.robot = document.createElement("guide-puck");
    this.robot.style.cssText = "position:absolute;inset:0;display:block";
    this.disc.appendChild(this.robot);
    this.puck.appendChild(this.disc);
    this.dock.appendChild(this.puck);

    /* bubble */
    this.bubble = el("div", "position:absolute;pointer-events:none;left:0;top:0");
    this.bubbleTail = el("span", "position:absolute;display:block");
    this.bubbleBody = el("div", "position:relative;display:grid;gap:6px");
    this.bubbleEyebrow = el("span", "", "GUIDE — 01/06");
    this.bubbleLine = el("p", "margin:0", NAV[0].line);
    this.bubbleBrief = el("p", "margin:0", "");
    this.bubbleBody.append(this.bubbleEyebrow, this.bubbleLine, this.bubbleBrief);
    this.bubble.append(this.bubbleTail, this.bubbleBody);
    this.dock.appendChild(this.bubble);

    /* ask panel */
    this.ask = el("div", "position:absolute;pointer-events:auto;display:grid");
    this.askHead = el("div", "display:flex;align-items:center;justify-content:space-between;gap:12px");
    this.askEyebrow = el("span", "", "ASK THE GUIDE");
    this.askClose = el("button", "border:0;background:transparent;padding:0;cursor:pointer;font-family:" + UI, "CLOSE");
    this.askHead.append(this.askEyebrow, this.askClose);
    this.log = el("div", "display:grid;gap:14px;overflow-y:auto;overscroll-behavior:contain");
    this.chips = el("div", "display:flex;flex-wrap:wrap;gap:6px");
    this.inputRow = el("div", "display:flex;align-items:center;gap:10px");
    this.input = el("input");
    this.input.type = "text";
    this.input.placeholder = "Ask the guide…";
    this.send = el("button", "border:0;background:transparent;cursor:pointer;padding:0;font-family:" + UI, "ASK");
    this.inputRow.append(this.input, this.send);
    this.ask.append(this.askHead, this.log, this.chips, this.inputRow);
    this.dock.appendChild(this.ask);

    /* interaction */
    this.open = null; // null | "menu" | "ask"
    this.hovering = false;
    this.dragging = false;
    this.armed = null;

    this.puck.addEventListener("pointerenter", () => { this.hovering = true; this.sync(); });
    this.puck.addEventListener("pointerleave", () => { this.hovering = false; this.sync(); });
    this.puck.addEventListener("click", (e) => {
      if (this._moved) { this._moved = false; return; }
      e.preventDefault();
      this.open = this.open === "menu" ? null : "menu";
      this.sync();
    });
    this.puck.addEventListener("pointerdown", (e) => this.startDrag(e));
    this.askClose.addEventListener("click", () => { this.open = null; this.sync(); });
    this.robot.addEventListener("puck:project", (e) => {
      this._head = e.detail.head;
      this.place();
    });
    window.addEventListener("resize", () => this.place());
  }

  startDrag(e) {
    if (e.button) return;
    const scale = this.offsetWidth ? this.getBoundingClientRect().width / this.offsetWidth : 1;
    const startX = e.clientX, startY = e.clientY;
    const base = { left: this.dock.offsetLeft, top: this.dock.offsetTop };
    let moved = false;
    this.puck.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      if (!moved && Math.hypot(dx, dy) > 4) {
        moved = true;
        this.dragging = true;
        this.open = null;
        this.sync();
      }
      if (!moved) return;
      this._free = {
        left: clamp(base.left + dx, 8, this.clientWidth - this.size - 8),
        top: clamp(base.top + dy, 8, this.clientHeight - this.size - 8),
      };
      this.placeDock();
      const hit = this.hitTest(ev.clientX, ev.clientY);
      if (hit !== this.armed) { this.armed = hit; this.paintTargets(); this.sync(); }
      this.place();
    };
    const up = () => {
      this.puck.removeEventListener("pointermove", move);
      this.puck.removeEventListener("pointerup", up);
      this._moved = moved;
      this.dragging = false;
      if (this.armed) { this.open = "ask"; }
      this.armed = null;
      this.paintTargets();
      this.sync();
    };
    this.puck.addEventListener("pointermove", move);
    this.puck.addEventListener("pointerup", up);
  }
  hitTest(cx, cy) {
    const targets = [...this.querySelectorAll("[data-guide-drop]"),
      ...(this.parentElement ? this.parentElement.querySelectorAll("[data-guide-drop]") : [])];
    return targets.find((t) => {
      const r = t.getBoundingClientRect();
      return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
    }) || null;
  }
  paintTargets() {
    const all = this.parentElement ? this.parentElement.querySelectorAll("[data-guide-drop]") : [];
    all.forEach((t) => {
      const on = t === this.armed;
      t.style.outline = on ? `1px solid ${this.onNoir ? C.chili : C.cherry}` : "none";
      t.style.outlineOffset = "6px";
    });
  }

  /* ---- geometry ---- */
  placeDock() {
    const s = this.size;
    const d = this.dock.style;
    d.width = s + "px";
    d.height = s + "px";
    if (this._free) {
      d.left = this._free.left + "px";
      d.top = this._free.top + "px";
      d.right = "auto";
      d.bottom = "auto";
      return;
    }
    const right = this.getAttribute("dock-right") ?? "24";
    d.right = right + "px";
    d.left = "auto";
    if (this.hasAttribute("dock-top")) {
      d.top = this.getAttribute("dock-top") + "px";
      d.bottom = "auto";
    } else {
      d.bottom = (this.getAttribute("dock-bottom") ?? "24") + "px";
      d.top = "auto";
    }
  }

  place() {
    const s = this.size;
    const head = this._head || { x: s / 2, y: s * 0.14 };
    const crownX = this.dock.offsetLeft + head.x;
    const crownY = this.dock.offsetTop + head.y;
    const bw = this.bubble.offsetWidth || 200;
    const bh = this.bubble.offsetHeight || 80;
    const pad = 14;
    const forced = this.getAttribute("flip");
    const flip = forced === "below" || (forced !== "above" && crownY - bh - 12 < pad);
    let left = crownX - bw / 2;
    left = clamp(left, pad, Math.max(pad, this.clientWidth - pad - bw));
    const top = flip ? this.dock.offsetTop + s + 14 : crownY - 12 - bh;
    this.bubble.style.left = left - this.dock.offsetLeft + "px";
    this.bubble.style.top = top - this.dock.offsetTop + "px";

    const tailX = clamp(crownX - left, 18, Math.max(18, bw - 18));
    const t = this.bubbleTail.style;
    const paper = C.paper;
    t.width = t.height = "11px";
    t.background = paper;
    t.transform = "rotate(45deg)";
    t.left = tailX - 5.5 + "px";
    if (flip) {
      t.top = "-6px"; t.bottom = "auto";
      t.borderTop = `1px solid ${C.hairline}`;
      t.borderLeft = `1px solid ${C.hairline}`;
      t.borderBottom = "0"; t.borderRight = "0";
    } else {
      t.bottom = "-6px"; t.top = "auto";
      t.borderBottom = `1px solid ${C.hairline}`;
      t.borderRight = `1px solid ${C.hairline}`;
      t.borderTop = "0"; t.borderLeft = "0";
    }
    this.bubbleTail.style.borderRadius = "1px";
  }

  buildFan() {
    const s = this.size;
    const r = parseFloat(this.getAttribute("radius") || LOCK.radius);
    const p = parseFloat(this.getAttribute("petal") || LOCK.petal);
    const arc = (this.getAttribute("arc") || LOCK.arc.join(",")).split(",").map(Number);
    const mode = this.labelsMode;
    const distinct = (this.getAttribute("ask-petal") || "distinct") === "distinct";
    const key = [s, r, p, arc.join(), mode, distinct, this.ground].join("|");
    if (this._fanKey === key) return;
    this._fanKey = key;
    this.fan.textContent = "";
    this.list.textContent = "";
    this._petals = [];
    this._rows = [];
    const cx = s / 2, cy = s / 2;
    const step = (arc[1] - arc[0]) / (NAV.length - 1);
    const rows = mode === "rows";

    NAV.forEach((item, i) => {
      const isAsk = i === NAV.length - 1;
      if (!rows) {
        const th = ((arc[0] + i * step) * Math.PI) / 180;
        const x = cx + r * Math.cos(th) - p / 2;
        const y = cy + r * Math.sin(th) - p / 2;
        const b = el("button", `position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${p}px;height:${p}px;border-radius:50%;display:grid;place-items:center;cursor:pointer;pointer-events:auto;font-family:${DISPLAY};font-size:${Math.round(p * 0.34)}px;letter-spacing:0.02em;line-height:1;padding:0`);
        b.type = "button";
        b.textContent = item.n;
        b.dataset.ask = isAsk ? "1" : "";
        b.dataset.i = i;
        b.setAttribute("aria-label", isAsk ? "Ask the guide" : `${item.n} ${item.label}`);
        const hoverLabel = el("span", "position:absolute;right:" + (p + 12) + "px;top:50%;transform:translateY(-50%);white-space:nowrap;pointer-events:none;opacity:0");
        hoverLabel.textContent = item.label;
        b.appendChild(hoverLabel);
        b._hoverLabel = hoverLabel;
        b.addEventListener("pointerenter", () => this.hi(i, true));
        b.addEventListener("pointerleave", () => this.hi(i, false));
        b.addEventListener("focus", () => this.hi(i, true));
        b.addEventListener("blur", () => this.hi(i, false));
        if (isAsk) b.addEventListener("click", () => { this.open = "ask"; this.sync(); });
        this.fan.appendChild(b);
        this._petals.push(b);
      }
      if (mode === "list" || rows) {
        const row = el("button", "display:flex;align-items:center;justify-content:flex-end;gap:12px;cursor:pointer;pointer-events:auto;background:transparent;border:0;padding:0;white-space:nowrap;font-family:" + UI);
        row.type = "button";
        const num = el("span", "font-family:" + DISPLAY, item.n);
        const lab = el("span", "", item.label);
        if (rows) row.append(num, lab); else row.append(lab);
        row.dataset.i = i;
        row.dataset.ask = isAsk ? "1" : "";
        if (!rows) row.style.order = String(NAV.length - i); /* 01 sits at the foot, paired with the lowest petal */
        row.addEventListener("pointerenter", () => this.hi(i, true));
        row.addEventListener("pointerleave", () => this.hi(i, false));
        if (isAsk) row.addEventListener("click", () => { this.open = "ask"; this.sync(); });
        this.list.appendChild(row);
        this._rows.push(row);
      }
    });
  }

  hi(i, on) {
    this._hi = on ? i : null;
    this.paintFan();
  }

  paintFan() {
    const s = this.size;
    const r = parseFloat(this.getAttribute("radius") || LOCK.radius);
    const p = parseFloat(this.getAttribute("petal") || LOCK.petal);
    const mode = this.labelsMode;
    const rows = mode === "rows";
    const open = this.open === "menu" || this.state === "open";
    const noir = this.onNoir;
    const ms = this.reduced ? 0 : 260;

    const petalFill = noir ? C.ink : C.noir;
    const petalText = C.cotton;
    const petalRing = noir ? C.gray : "transparent";
    const askFill = C.paper;
    const askText = C.ink;

    this._petals.forEach((b, i) => {
      const isAsk = b.dataset.ask === "1";
      const hot = this._hi === i;
      const distinct = (this.getAttribute("ask-petal") || "distinct") === "distinct";
      b.style.background = isAsk && distinct ? askFill : petalFill;
      b.style.color = isAsk && distinct ? askText : petalText;
      b.style.border = `1px solid ${isAsk && distinct ? C.hairline : hot ? (noir ? C.cotton : C.hairline) : petalRing}`;
      b.style.transition = `transform ${ms}ms ${SHARP}, opacity ${ms}ms ${SHARP}, border-color 180ms ${SHARP}, background 180ms ${SHARP}`;
      b.style.transitionDelay = open ? `${i * 26}ms` : "0ms";
      b.style.transform = open ? "scale(1)" : "scale(0.86)";
      b.style.opacity = open ? "1" : "0";
      b.style.pointerEvents = open ? "auto" : "none";
      b.style.outlineOffset = "3px";
      if (b._hoverLabel) {
        const lbl = b._hoverLabel;
        lbl.style.cssText = `position:absolute;right:${p + 12}px;top:50%;transform:translateY(-50%);white-space:nowrap;pointer-events:none;font-family:${UI};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${noir ? C.cotton : C.ink};opacity:${mode === "hover" && hot && open ? "1" : "0"};transition:opacity 180ms ${SHARP}`;
      }
    });

    /* label list / mobile rows */
    const l = this.list.style;
    if (rows) {
      l.right = "0px";
      l.left = "auto";
      l.bottom = s + 16 + "px";
      l.top = "auto";
      l.gap = "0px";
      l.justifyItems = "end";
    } else if (mode === "list") {
      const ys = [];
      const arc = (this.getAttribute("arc") || LOCK.arc.join(",")).split(",").map(Number);
      const step = (arc[1] - arc[0]) / (NAV.length - 1);
      for (let i = 0; i < NAV.length; i++) ys.push(Math.sin(((arc[0] + i * step) * Math.PI) / 180) * r);
      const mid = (Math.min(...ys) + Math.max(...ys)) / 2;
      l.right = r + p / 2 + 34 + s / 2 + "px";
      l.left = "auto";
      l.top = s / 2 + mid - (NAV.length * 30 - 6) / 2 + "px";
      l.bottom = "auto";
      l.gap = "6px";
      l.justifyItems = "end";
    }
    this._rows.forEach((row, i) => {
      const hot = this._hi === i;
      const isAsk = row.dataset.ask === "1";
      row.style.transition = `opacity ${ms}ms ${SHARP}, transform ${ms}ms ${SHARP}, color 180ms ${SHARP}`;
      row.style.transitionDelay = open ? `${i * 26 + 40}ms` : "0ms";
      row.style.opacity = open ? "1" : "0";
      row.style.transform = open ? "translateX(0)" : "translateX(10px)";
      row.style.pointerEvents = open ? "auto" : "none";
      row.style.fontSize = rows ? "13px" : "12px";
      row.style.letterSpacing = "0.1em";
      row.style.height = rows ? "44px" : "24px";
      row.style.padding = rows ? "0 4px" : "0";
      row.style.color = hot ? (noir ? C.chili300 : C.cherry) : noir ? C.cotton : C.ink;
      row.style.outlineOffset = "3px";
      if (isAsk) {
        row.style.marginTop = rows ? "8px" : "0px";
        row.style.marginBottom = rows ? "0px" : "8px";
      }
      const num = row.firstChild;
      if (rows && num) {
        num.style.fontSize = "12px";
        num.style.color = hot ? (noir ? C.chili300 : C.cherry) : noir ? C.grayNoir : C.gray;
        num.style.minWidth = "22px";
        num.style.textAlign = "left";
      }
    });
  }

  paintBubble() {
    const noir = this.onNoir;
    const shape = this.getAttribute("bubble") || "paper";
    /* one overlay at a time: opening the fan or the ask panel retires the bubble */
    const busy = this.open !== null || this.state === "open" || this.state === "ask";
    const on = shape !== "none" && !busy;
    const ch = clamp(parseInt(this.getAttribute("chapter") || "1", 10), 1, 6) - 1;
    const radius = shape === "cloud" ? "999px" : shape === "rect" ? "10px" : "2px";
    const ms = this.reduced ? 0 : 320;

    Object.assign(this.bubble.style, {
      boxSizing: "border-box",
      width: "max-content",
      minWidth: LOCK.bubbleMin + "px",
      maxWidth: LOCK.bubbleMax + "px",
      background: C.paper,
      border: `1px solid ${C.hairline}`,
      borderRadius: radius,
      padding: shape === "cloud" ? "18px 22px" : "12px 14px",
      opacity: on ? "1" : "0",
      clipPath: on ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
      transform: on ? "translateY(0)" : "translateY(4px)",
      transition: this.dragging ? "none" : `opacity ${ms}ms ${SHARP}, clip-path ${ms}ms ${SHARP}, transform ${ms}ms ${SHARP}`,
      pointerEvents: "none",
    });
    if (shape === "cloud") {
      this.bubble.style.borderRadius = "999px";
      this.bubbleTail.style.borderRadius = "50%";
      this.bubbleTail.style.width = this.bubbleTail.style.height = "13px";
      this.bubbleTail.style.transform = "none";
      this.bubbleTail.style.border = `1px solid ${C.hairline}`;
    }
    this.bubbleEyebrow.style.cssText = `font-family:${UI};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.gray}`;
    this.bubbleEyebrow.textContent = `GUIDE — 0${ch + 1}/06`;
    this.bubbleLine.style.cssText = `margin:0;font-family:${SERIF};font-size:17px;line-height:1.32;color:${C.ink};text-wrap:pretty`;
    this.bubbleLine.textContent = NAV[ch].line;
    const brief = this.getAttribute("brief");
    this.bubbleBrief.style.cssText = `margin:0;font-family:${UI};font-size:13px;line-height:1.45;color:${C.gray};display:${brief ? "block" : "none"}`;
    if (brief) this.bubbleBrief.textContent = brief;
  }

  paintAsk() {
    const on = this.open === "ask" || this.state === "ask";
    const noir = this.onNoir;
    const s = this.size;
    const sheet = this.clientWidth > 0 && this.clientWidth <= 460;
    const n = clamp(parseInt(this.getAttribute("exchanges") || "1", 10), 0, 5);
    const ms = this.reduced ? 0 : 320;

    Object.assign(this.ask.style, {
      background: C.paper,
      border: `1px solid ${C.hairline}`,
      borderRadius: "10px",
      padding: "16px",
      gap: "14px",
      width: sheet ? "auto" : LOCK.askWidth + "px",
      left: sheet ? 12 - this.dock.offsetLeft + "px" : "auto",
      right: sheet ? this.clientWidth - (this.dock.offsetLeft + s) - 12 + "px" : "0px",
      bottom: sheet ? 12 - (this.clientHeight - this.dock.offsetTop - s) + "px" : s + 16 + "px",
      opacity: on ? "1" : "0",
      clipPath: on ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
      transform: on ? "translateY(0)" : "translateY(6px)",
      transition: `opacity ${ms}ms ${SHARP}, clip-path ${ms}ms ${SHARP}, transform ${ms}ms ${SHARP}`,
      pointerEvents: on ? "auto" : "none",
    });
    this.askEyebrow.style.cssText = `font-family:${UI};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.gray}`;
    this.askClose.style.cssText = `border:0;background:transparent;padding:0;cursor:pointer;font-family:${UI};font-size:11px;letter-spacing:0.14em;color:${C.gray}`;
    this.log.style.maxHeight = sheet ? "44vh" : "300px";
    /* in sheet mode the sheet covers the corner, so the puck stands down and a
     * 28px mark in the header keeps him present */
    if (sheet && !this.askMark) {
      this.askMark = el("span", "width:28px;height:28px;border-radius:50%;overflow:hidden;background:#1B1717;position:relative;display:block;flex:0 0 auto");
      const m = document.createElement("guide-puck");
      m.style.cssText = "position:absolute;inset:0;display:block";
      m.setAttribute("frame", "head");
      m.setAttribute("remap", LOCK.remap);
      m.setAttribute("parts", LOCK.parts);
      m.setAttribute("eye", LOCK.eye);
      m.setAttribute("turn", "-0.1");
      this.askMark.appendChild(m);
      this.askHead.insertBefore(this.askMark, this.askEyebrow);
      this.askHead.style.justifyContent = "flex-start";
      this.askHead.style.gap = "10px";
      this.askClose.style.marginLeft = "auto";
    }
    if (this.askMark) this.askMark.style.display = sheet ? "block" : "none";
    this._sheetOpen = sheet && on;

    if (this._logN !== n || this._logSheet !== sheet) {
      this._logN = n; this._logSheet = sheet;
      this.log.textContent = "";
      LOG.slice(0, n).forEach(([q, a]) => {
        const qs = el("p", `margin:0 0 0 auto;max-width:82%;background:${C.cotton};color:${C.ink};font-family:${UI};font-size:14px;line-height:1.4;padding:8px 10px;border-radius:8px`, q);
        const as = el("p", `margin:0;font-family:${SERIF};font-size:17px;line-height:1.34;color:${C.ink};text-wrap:pretty`, a);
        this.log.append(qs, as);
      });
      this.log.scrollTop = this.log.scrollHeight;
    }
    if (!this.chips.childElementCount) {
      ["What do you charge?", "How long?", "Who works on it?"].forEach((c) => {
        const b = el("button", "", c);
        b.type = "button";
        b.style.cssText = `font-family:${UI};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.gray};background:transparent;border:1px solid ${C.hairline};border-radius:8px;padding:6px 9px;cursor:pointer;transition:color 180ms ${SHARP}, border-color 180ms ${SHARP}`;
        b.addEventListener("pointerenter", () => { b.style.color = C.ink; b.style.borderColor = C.gray; });
        b.addEventListener("pointerleave", () => { b.style.color = C.gray; b.style.borderColor = C.hairline; });
        this.chips.appendChild(b);
      });
    }
    this.inputRow.style.cssText = `display:flex;align-items:center;gap:10px;border-top:1px solid ${C.hairline};padding-top:12px`;
    this.input.style.cssText = `flex:1;min-width:0;border:0;background:transparent;font-family:${UI};font-size:15px;color:${C.ink};outline-offset:4px`;
    this.send.style.cssText = `border:0;background:transparent;cursor:pointer;font-family:${UI};font-size:11px;letter-spacing:0.14em;color:${C.cherry};padding:0`;
    void noir;
  }

  paintPuck() {
    const s = this.size;
    const noir = this.onNoir;
    const st = this.state;
    const open = this.open === "menu" || st === "open";
    const hover = this.hovering || st === "hover";
    const drag = this.dragging || st === "drag";
    const armed = !!this.armed || st === "armed";
    const ms = this.reduced ? 0 : 180;

    this.puck.style.width = this.puck.style.height = s + "px";
    this.puck.style.transition = `transform ${ms}ms ${SHARP}, opacity ${ms}ms ${SHARP}`;
    this.puck.style.opacity = this._sheetOpen ? "0" : "1";
    this.puck.style.pointerEvents = this._sheetOpen ? "none" : "auto";
    this.puck.style.transform = drag ? "scale(0.97)" : "scale(1)";
    this.puck.style.cursor = drag ? "grabbing" : "grab";
    this.puck.style.outlineOffset = "4px";

    /* ring: adaptive — none on cotton at rest, hairline on noir at rest,
     * one step up on hover / open / drag. Never chili (retired). */
    let ring = "transparent";
    if (noir) ring = C.gray;
    if (hover || open) ring = noir ? C.cotton : C.hairline;
    if (drag) ring = noir ? C.cotton : C.gray;
    if (armed) ring = noir ? C.chili : C.cherry;
    const forced = this.getAttribute("ring");
    if (forced === "none" && !(hover || open || drag || armed)) ring = "transparent";
    if (forced === "hairline" && !(hover || open || drag || armed)) ring = noir ? C.gray : C.hairline;
    if (forced === "chili") ring = C.chili;

    Object.assign(this.disc.style, {
      background: noir ? C.ink : C.noir,
      border: `1px solid ${ring}`,
      transition: `border-color ${ms}ms ${SHARP}`,
    });

    this.robot.setAttribute("frame", this.getAttribute("frame") || LOCK.frame);
    this.robot.setAttribute("remap", this.getAttribute("remap") || LOCK.remap);
    this.robot.setAttribute("parts", this.getAttribute("parts") || LOCK.parts);
    this.robot.setAttribute("eye", this.getAttribute("eye") || LOCK.eye);
    this.robot.setAttribute("eye-step", this.getAttribute("eye-step") || "1");
    this.robot.setAttribute("clip", st === "talk" ? "talk" : drag ? "walk" : "none");
    this.robot.setAttribute("head-turn", open ? "0.34" : st === "armed" ? "-0.2" : "0");
    if (this.hasAttribute("live") && !this.reduced) this.robot.setAttribute("live", "");
    else this.robot.removeAttribute("live");
  }

  sync() {
    this.placeDock();
    this.buildFan();
    this.paintFan();
    this.paintBubble();
    this.paintAsk();
    this.paintPuck();
    this.place();
    const f = this.getAttribute("focus");
    const ringCol = this.onNoir ? C.cotton : C.ink;
    [this.puck, ...(this._petals || []), this.input].forEach((n) => n && (n.style.outline = "none"));
    if (f === "puck") this.puck.style.outline = `2px solid ${ringCol}`;
    if (f === "petal" && this._petals[1]) this._petals[1].style.outline = `2px solid ${ringCol}`;
    if (f === "input") this.input.style.outline = `2px solid ${C.ink}`;
  }
}
customElements.define("guide-corner", GuideCorner);
