// Recolor lab — mounts a live three.js view of repo_robot.glb with the exact
// material overrides from HOME-GUIDE-SPEC §1, so the locked look can be judged
// (and screenshotted) before it ships into guide.ts.
import * as THREE from "https://esm.sh/three@0.169.0";
import { GLTFLoader } from "https://esm.sh/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";

const INK = 0x241f1f;
const NOIR = 0x1b1717;
const CHILI = 0xd73b3e;
/** Locked numbers, shared with output/.../guide.ts — the harness must agree with
 *  the ship code or it misrepresents the look the film is generated from. */
const EYE_BASE_INTENSITY = 1;
const EYE_RADIUS = 0.034;
const EYE_FORWARD = 0.244;
const KEY_INTENSITY = 4;
const AMBIENT_INTENSITY = 0.45;

/** Original emissive map is green; keep it as a luminance mask so chili is the only colour. */
function maskFromEmissive(tex) {
  const src = tex?.image;
  if (!src) return null;
  const size = 1024;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(src, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size);
  const d = data.data;
  let max = 1;
  for (let i = 0; i < d.length; i += 4) max = Math.max(max, d[i], d[i + 1], d[i + 2]);
  const gain = 255 / max;
  for (let i = 0; i < d.length; i += 4) {
    const l = Math.min(255, Math.max(d[i], d[i + 1], d[i + 2]) * gain);
    d[i] = d[i + 1] = d[i + 2] = l;
  }
  ctx.putImageData(data, 0, 0);
  const out = new THREE.CanvasTexture(cv);
  out.flipY = false;
  out.colorSpace = THREE.SRGBColorSpace;
  return out;
}

class RobotLab extends HTMLElement {
  connectedCallback() {
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
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setClearAlpha(0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const key = new THREE.DirectionalLight(0xfff1e0, KEY_INTENSITY);
    key.position.set(-3.2, 4.4, 3.4);
    const ambient = new THREE.AmbientLight(0x8d867d, AMBIENT_INTENSITY);
    scene.add(key, ambient);

    const group = new THREE.Group();
    scene.add(group);

    const state = { turn: -0.35, tilt: 0, eye: 1, headTurn: 0 };
    let mixer = null;
    let head = null;
    const lab = { state, scene, camera, renderer, group, key, ambient, mats: {}, actions: {} };
    window.__lab = lab;

    const resize = () => {
      const w = this.clientWidth || 640;
      const h = this.clientHeight || 640;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    new ResizeObserver(resize).observe(this);

    new GLTFLoader().load(
      this.getAttribute("src") || "uploads/repo_robot.glb",
      (gltf) => {
        const model = gltf.scene;
        const shell = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.85, metalness: 0.15 });
        const joint = new THREE.MeshStandardMaterial({ color: NOIR, roughness: 0.9, metalness: 0.1 });
        lab.mats = { shell, joint };

        model.traverse((o) => {
          if (!o.isMesh) return;
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          const isParts = /parts/i.test(m?.name || "") || /parts/i.test(o.geometry?.name || "");
          (lab.assign ||= []).push(`${o.name} · ${m?.name} · emis:${!!m?.emissiveMap} -> ${isParts ? "parts/noir" : "body/ink"}`);
          const target = isParts ? joint : shell;
          if (m?.normalMap) {
            target.normalMap = m.normalMap;
            target.normalScale = new THREE.Vector2(0.6, 0.6);
          }
          o.material = target;
          o.frustumCulled = false;
        });

        // THE EYE — the shipped emissive map lights back panels, not the eye, so
        // it is dropped and the mark is built on the rig's eye bones instead.
        const eyeMat = new THREE.MeshStandardMaterial({
          color: NOIR,
          roughness: 0.35,
          metalness: 0,
          emissive: new THREE.Color(CHILI),
          emissiveIntensity: EYE_BASE_INTENSITY,
          toneMapped: false,
        });
        lab.mats.eye = eyeMat;
        const eyeGeo = new THREE.SphereGeometry(1, 20, 16);
        const bones = [];
        model.traverse((o) => {
          if (/^eye/i.test(o.name)) bones.push(o);
        });
        lab.eyeBones = bones.map((b) => b.name);

        model.traverse((o) => {
          if (!head && /^head/i.test(o.name)) head = o;
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const centre = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(centre);
        model.position.sub(new THREE.Vector3(centre.x, centre.y, centre.z));
        const worldH = 2 * Math.tan((32 * Math.PI) / 360) * 6;
        model.scale.setScalar((worldH * 0.62) / size.y);
        group.add(model);

        // Same bake as guide.ts: the eye bones are mirrored, so the offset is
        // measured in world space and converted into each bone's own frame.
        const robotHeight = worldH * 0.62;
        group.updateMatrixWorld(true);
        const boneScale = new THREE.Vector3();
        bones.forEach((b) => {
          const s = new THREE.Mesh(eyeGeo, eyeMat);
          s.frustumCulled = false;
          b.add(s);
          b.updateWorldMatrix(true, false);
          b.getWorldScale(boneScale);
          const target = new THREE.Vector3();
          b.getWorldPosition(target);
          target.z += EYE_FORWARD * robotHeight;
          b.worldToLocal(target);
          s.position.copy(target);
          s.scale.setScalar((EYE_RADIUS * robotHeight) / Math.max(boneScale.x, 1e-6));
          lab.eyes = (lab.eyes || []).concat(s);
        });
        lab.debug = { size: size.toArray().map((n) => +n.toFixed(2)), robotHeight: +robotHeight.toFixed(3) };

        if (gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const a = mixer.clipAction(clip);
            lab.actions[clip.name] = a;
          });
          lab.play = (name, t = 0) => {
            Object.values(lab.actions).forEach((a) => {
              a.stop();
              a.setEffectiveWeight(0);
            });
            const a = lab.actions[name];
            if (!a) return;
            a.play();
            a.setEffectiveWeight(1);
            a.time = t * (a.getClip().duration || 1);
            mixer.update(0);
            renderer.render(scene, camera);
          };
        }
        lab.ready = true;
        lab.inventory = {
          meshes: [],
          clips: gltf.animations.map((c) => c.name),
        };
        model.traverse((o) => o.isMesh && lab.inventory.meshes.push(o.name));
        this.dataset.ready = "true";
      },
      undefined,
      (err) => {
        this.dataset.error = String(err);
      }
    );

    const tick = () => {
      group.rotation.y = state.turn;
      group.rotation.x = state.tilt;
      if (head) head.rotation.y += state.headTurn;
      if (lab.mats.eye) lab.mats.eye.emissiveIntensity = EYE_BASE_INTENSITY * state.eye;
      renderer.render(scene, camera);
      this._raf = requestAnimationFrame(tick);
    };
    tick();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
  }
}

customElements.define("robot-lab", RobotLab);
