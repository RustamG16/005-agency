/**
 * The Monolith — one WebGL object that carries the whole About page.
 *
 * Ported from the design authority (`about_us/Monolith Preview.dc.html`, `_scene` /
 * object timeline) rather than the earlier v2 build: smooth ink body lit by a single
 * warm key, no deboss relief, no edge lines, no floor/contact-shadow, no ghost
 * numerals — form comes from light, not from extra geometry.
 *
 * Geometry mirrors the site's project card (448:580 face ratio, `--card-w/--card-h`),
 * pre-split into a 3×4×2 lattice of 24 shards so chapter 3 can fracture without a
 * physics library. All motion lives on one paused GSAP timeline of duration 1,
 * scrubbed by one ScrollTrigger in `MonolithScene.tsx` — master progress *is* the
 * .dc chapter table's progress.
 */

import * as THREE from "three";
import { gsap } from "@/components/motion/gsap";
import { ARTIFACT_COUNT, TOKEN_HEX, dcArtifactCanvas, dcScreenCanvas } from "./textures";

/** Face geometry locked to the card ratio the rest of the site uses. */
const FACE_W = 1.4;
const FACE_H = FACE_W * (580 / 448);
const DEPTH = FACE_W * 0.25;

const COLS = 3;
const ROWS = 4;
const LAYERS = 2;

/** Exploded-grid multipliers — a strict lattice, never a tumble. */
const EX = 2.05;
const EY = 1.5;
const EZ = 5.2;

/** Chapter-5 screen window on master progress — used to gate the optional loop video. */
export const SCREEN_WINDOW: [number, number] = [0.72, 0.9];

/** Optional media. Absent files fall back to the canvas-drawn surfaces, silently. */
const COVER_SRC = "/images/about/monolith-cover.jpg";
const PLATE_SRC = (i: number) => `/images/about/plates/plate-0${i + 1}.jpg`;
const SCREEN_VIDEO_SRC = "/videos/loops/loop-a.mp4";

type Vec3 = { x: number; y: number; z: number };

export type MonolithHandles = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  rig: THREE.Object3D;
  group: THREE.Group;
  shards: THREE.Mesh[];
  rest: Vec3[];
  exploded: Vec3[];
  bodyMat: THREE.MeshStandardMaterial;
  plateMats: THREE.MeshBasicMaterial[];
  wireMat: THREE.LineBasicMaterial;
  screenMat: THREE.MeshBasicMaterial;
  seam: THREE.Mesh;
  seamMat: THREE.MeshBasicMaterial;
  resize: () => void;
  render: () => void;
  setVideosActive: (active: boolean) => void;
  /** Wires optional real media into the scene; `tl` lets the front-cover fade join the live timeline. */
  loadOptionalMedia: (tl: gsap.core.Timeline) => void;
  dispose: () => void;
};

export function buildMonolith(canvas: HTMLCanvasElement, stage: HTMLElement): MonolithHandles {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = false;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(TOKEN_HEX.noir);

  // One warm key, one cool fill, low ambient — nothing else. Form comes from light.
  const key = new THREE.DirectionalLight(0xfff1e2, 2.5);
  key.position.set(2.6, 3.2, 3.4);
  const fill = new THREE.DirectionalLight(0xdfe4ea, 0.5);
  fill.position.set(-3.2, -1.2, 1.8);
  const ambient = new THREE.AmbientLight(0xffffff, 0.22);
  scene.add(key, fill, ambient);

  const rig = new THREE.Object3D();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 4.2);
  rig.add(camera);
  scene.add(rig);

  const group = new THREE.Group();
  scene.add(group);

  const disposables: Array<{ dispose: () => void }> = [];

  const sw = FACE_W / COLS;
  const sh = FACE_H / ROWS;
  const sd = DEPTH / LAYERS;

  // Smooth ink — no roughness/bump maps. The body reads as carved by light, not texture.
  const bodyMat = new THREE.MeshStandardMaterial({
    color: TOKEN_HEX.ink,
    roughness: 0.86,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
  });
  disposables.push(bodyMat);

  const shardGeo = new THREE.BoxGeometry(sw, sh, sd);
  const plateGeo = new THREE.PlaneGeometry(sw * 0.82, sh * 0.82);
  disposables.push(shardGeo, plateGeo);

  const shards: THREE.Mesh[] = [];
  const rest: Vec3[] = [];
  const exploded: Vec3[] = [];
  const plateMats: THREE.MeshBasicMaterial[] = [];
  const plateTextures: THREE.CanvasTexture[] = [];
  let plateCount = 0;

  for (let k = 0; k < LAYERS; k++) {
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const x = (i - (COLS - 1) / 2) * sw;
        const y = (j - (ROWS - 1) / 2) * sh;
        const z = (k - (LAYERS - 1) / 2) * sd;

        const mesh = new THREE.Mesh(shardGeo, bodyMat);
        mesh.position.set(x, y, z);
        group.add(mesh);
        shards.push(mesh);
        rest.push({ x, y, z });
        exploded.push({ x: x * EX, y: y * EY, z: z * EZ });

        // Fracture plates ride the front layer on a checkerboard so they never cluster.
        if (k === LAYERS - 1 && plateCount < ARTIFACT_COUNT && (i + j) % 2 === 0) {
          const tex = new THREE.CanvasTexture(dcArtifactCanvas(plateCount));
          tex.colorSpace = THREE.SRGBColorSpace;
          const mat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0,
            toneMapped: false,
          });
          const plate = new THREE.Mesh(plateGeo, mat);
          plate.position.z = sd / 2 + 0.003;
          plate.renderOrder = 1;
          mesh.add(plate);
          plateMats.push(mat);
          plateTextures.push(tex);
          plateCount++;
        }
      }
    }
  }
  disposables.push(...plateMats, ...plateTextures);

  const wireSrc = new THREE.BoxGeometry(FACE_W, FACE_H, DEPTH, COLS, ROWS, LAYERS);
  const wireGeo = new THREE.WireframeGeometry(wireSrc);
  wireSrc.dispose();
  const wireMat = new THREE.LineBasicMaterial({
    color: TOKEN_HEX.hairline,
    transparent: true,
    opacity: 0,
  });
  group.add(new THREE.LineSegments(wireGeo, wireMat));
  disposables.push(wireGeo, wireMat);

  // Chapter-5 screen face — static scanline canvas until a real loop lands.
  const screenTex = new THREE.CanvasTexture(dcScreenCanvas());
  screenTex.colorSpace = THREE.SRGBColorSpace;
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTex,
    transparent: true,
    opacity: 0,
    toneMapped: false,
  });
  const screenGeo = new THREE.PlaneGeometry(FACE_W * 0.86, FACE_H * 0.86);
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = DEPTH / 2 + 0.004;
  screen.renderOrder = 2;
  group.add(screen);
  disposables.push(screenTex, screenMat, screenGeo);

  // Accent render #1 — the only oxblood in the scene. Scales down the front-right edge.
  const seamGeo = new THREE.PlaneGeometry(0.006, FACE_H);
  seamGeo.translate(0, -FACE_H / 2, 0);
  const seamMat = new THREE.MeshBasicMaterial({
    color: TOKEN_HEX.accentOnNoir,
    transparent: true,
    opacity: 0,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const seam = new THREE.Mesh(seamGeo, seamMat);
  seam.position.set(FACE_W / 2 - 0.005, FACE_H / 2, DEPTH / 2 + 0.003);
  seam.renderOrder = 3;
  group.add(seam);
  disposables.push(seamGeo, seamMat);

  const videos: HTMLVideoElement[] = [];
  let activeVideo: HTMLVideoElement | null = null;

  const setVideosActive = (active: boolean) => {
    if (!activeVideo) return;
    if (active) void activeVideo.play().catch(() => {});
    else activeVideo.pause();
  };

  /**
   * Optional media, loaded after first paint.
   *
   * Every URL is probed with `fetch` before anything is attached to the DOM or to a
   * TextureLoader: a missing `<img>`/`<video>` source logs a 404 to the console, a
   * missing `fetch` does not. Absent files therefore leave the canvas-drawn surfaces
   * in place with a genuinely clean console.
   */
  const exists = async (url: string) => {
    try {
      const res = await fetch(url, { method: "HEAD", cache: "force-cache" });
      return res.ok;
    } catch {
      return false;
    }
  };

  const loadOptionalMedia = (tl: gsap.core.Timeline) => {
    const loader = new THREE.TextureLoader();

    const applyTexture = (url: string, onLoad: (tex: THREE.Texture) => void) =>
      loader.loadAsync(url).then((tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        disposables.push(tex);
        onLoad(tex);
      });

    void (async () => {
      // Front cover — off by default. Absent file → pure ink face, exactly the .dc
      // reference. Present file → a face plane that fades out with the ch3 fracture.
      if (await exists(COVER_SRC)) {
        await applyTexture(COVER_SRC, (tex) => {
          const coverGeo = new THREE.PlaneGeometry(FACE_W, FACE_H);
          const coverMat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 1,
            toneMapped: false,
          });
          const cover = new THREE.Mesh(coverGeo, coverMat);
          cover.position.z = DEPTH / 2 + 0.002;
          cover.renderOrder = 1;
          group.add(cover);
          disposables.push(coverGeo, coverMat);
          tl.to(coverMat, { opacity: 0, duration: 0.03, ease: "none" }, 0.28);
        });
      }

      // Fracture plates — kinds 0–5 only; kind 6 (the X-box) always stays code-drawn.
      await Promise.all(
        plateMats.slice(0, 6).map(async (mat, i) => {
          const url = PLATE_SRC(i);
          if (!(await exists(url))) return;
          await applyTexture(url, (tex) => {
            mat.map = tex;
            mat.needsUpdate = true;
          });
        })
      );

      // Chapter-5 screen loop — a genuine VideoTexture inside the same screen frame.
      if (await exists(SCREEN_VIDEO_SRC)) {
        const v = document.createElement("video");
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.preload = "auto";
        await new Promise<void>((resolve) => {
          v.addEventListener("loadeddata", () => resolve(), { once: true });
          v.src = SCREEN_VIDEO_SRC;
          v.load();
        });
        const videoTex = new THREE.VideoTexture(v);
        videoTex.colorSpace = THREE.SRGBColorSpace;
        screenMat.map = videoTex;
        screenMat.needsUpdate = true;
        activeVideo = v;
        videos.push(v);
        disposables.push(videoTex);
      }
    })();
  };

  const resize = () => {
    const w = stage.clientWidth;
    const h = Math.max(1, stage.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  const render = () => {
    renderer.render(scene, camera);
  };

  const dispose = () => {
    for (const v of videos) {
      v.pause();
      v.removeAttribute("src");
      v.load();
    }
    videos.length = 0;
    for (const d of disposables) d.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };

  return {
    renderer,
    scene,
    camera,
    rig,
    group,
    shards,
    rest,
    exploded,
    bodyMat,
    plateMats,
    wireMat,
    screenMat,
    seam,
    seamMat,
    resize,
    render,
    setVideosActive,
    loadOptionalMedia,
    dispose,
  };
}

/**
 * The object half of the master timeline — ported verbatim from the .dc reference's
 * `_scene()` master timeline. Positions are literal spec progress values: .00 arrival
 * · .12 position · .28 fracture · .50 reassemble · .72 screen · .90 seam.
 */
export function buildObjectTimeline(m: MonolithHandles) {
  const tl = gsap.timeline({ paused: true });
  const { rig, group, camera, shards, rest, exploded, plateMats, wireMat, bodyMat, screenMat, seam, seamMat } = m;

  // 01 — Arrival (.00–.12): whole, near-imperceptible drift.
  tl.to(rig.rotation, { y: 0.06, duration: 0.12, ease: "none" }, 0);
  tl.to(group.rotation, { y: 0.035, duration: 0.12, ease: "none" }, 0);

  // 02 — Position (.12–.28): slow ~35° orbit, object pushed left for the manifesto column.
  tl.to(rig.rotation, { y: 0.61, duration: 0.16, ease: "power1.inOut" }, 0.12);
  tl.to(camera.position, { x: -0.72, z: 4.6, duration: 0.16, ease: "power1.inOut" }, 0.12);
  tl.to(group.rotation, { y: 0.055, duration: 0.16, ease: "none" }, 0.12);

  // 03 — Fracture (.28–.50): the object breaks into a strict exploded lattice.
  tl.to(camera.position, { x: -0.5, z: 6.4, duration: 0.12, ease: "power2.inOut" }, 0.28);
  tl.to(rig.rotation, { y: 0.42, duration: 0.22, ease: "power1.inOut" }, 0.28);
  shards.forEach((mesh, i) => {
    tl.to(
      mesh.position,
      { x: exploded[i].x, y: exploded[i].y, z: exploded[i].z, duration: 0.1, ease: "power3.out" },
      0.28 + i * 0.0022
    );
  });
  tl.to(plateMats, { opacity: 1, duration: 0.05, stagger: 0.004, ease: "none" }, 0.35);
  tl.to(group.rotation, { y: 0.1, duration: 0.1, ease: "sine.inOut" }, 0.4);

  // 04 — Web & 3D (.50–.72): reassemble, cross-fade to wireframe, re-materialise.
  shards.forEach((mesh, i) => {
    tl.to(
      mesh.position,
      { x: rest[i].x, y: rest[i].y, z: rest[i].z, duration: 0.08, ease: "power2.inOut" },
      0.5 + i * 0.0015
    );
  });
  tl.to(plateMats, { opacity: 0, duration: 0.04, ease: "none" }, 0.5);
  tl.to(camera.position, { x: -0.7, z: 4.8, duration: 0.1, ease: "power2.inOut" }, 0.5);
  tl.to(rig.rotation, { y: 0.3, duration: 0.22, ease: "power1.inOut" }, 0.5);
  tl.to(group.rotation, { y: 0.02, duration: 0.22, ease: "power1.inOut" }, 0.5);
  tl.to(wireMat, { opacity: 0.85, duration: 0.04, ease: "none" }, 0.6);
  tl.to(bodyMat, { opacity: 0.05, duration: 0.04, ease: "none" }, 0.6);
  tl.to(bodyMat, { opacity: 1, duration: 0.05, ease: "power2.out" }, 0.66);
  tl.to(wireMat, { opacity: 0, duration: 0.05, ease: "none" }, 0.665);

  // 05 — Content (.72–.90): square up, move right, front face becomes a screen.
  tl.to(rig.rotation, { y: 0, duration: 0.08, ease: "power2.inOut" }, 0.72);
  tl.to(group.rotation, { y: 0, duration: 0.08, ease: "power2.inOut" }, 0.72);
  tl.to(camera.position, { x: 0.82, z: 3.4, duration: 0.08, ease: "power2.inOut" }, 0.72);
  tl.to(screenMat, { opacity: 1, duration: 0.045, ease: "none" }, 0.755);
  tl.to(screenMat, { opacity: 0, duration: 0.035, ease: "none" }, 0.9);

  // 06 — Going up (.90–1): arrival framing returns, oxblood seam ignites.
  tl.to(camera.position, { x: 0, z: 4.2, duration: 0.1, ease: "power2.inOut" }, 0.9);
  tl.to(rig.rotation, { y: 0.06, duration: 0.1, ease: "power2.inOut" }, 0.9);
  tl.fromTo(seam.scale, { y: 0.02 }, { y: 1, duration: 0.08, ease: "power3.out" }, 0.92);
  tl.to(seamMat, { opacity: 1, duration: 0.015, ease: "power2.out" }, 0.92);

  tl.to({}, { duration: 0 }, 1);

  return tl;
}
