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
import {
  ARTIFACT_COUNT,
  TOKEN_HEX,
  dcArtifactCanvas,
  dcFloorCanvas,
  dcGlowCanvas,
  dcMoteCanvas,
  dcScreenCanvas,
  dcSurfaceCanvas,
  dcWallCanvas,
} from "./textures";

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

/**
 * Chapter-1 arrival window on master progress. Full opacity through chapter 1 (0→.12),
 * then out across chapter 2 so nothing survives into the .28 fracture.
 *
 * Driven from the ScrollTrigger's `onUpdate` in `MonolithScene.tsx`, exactly like
 * `SCREEN_WINDOW` gates the loop video — deliberately NOT a tween on the master
 * timeline, so `buildObjectTimeline` stays untouched.
 */
export const ARRIVAL_WINDOW: [number, number] = [0.12, 0.28];

/** The three chapter-1 concepts, selectable at runtime. See `buildArrival`. */
export type ArrivalConcept = 1 | 2 | 3;

/** Live-tunable knobs, per concept. Driven by `window.__ch1Tune` in development. */
export type ArrivalTune = Partial<{
  /** C1 backlight peak alpha · C3 wash peak alpha */
  glow: number;
  /** C1 floor reflection strength */
  floor: number;
  /** C1 mote field opacity */
  motes: number;
  /** C1 glow breath period, seconds */
  breath: number;
  /** C2 ring opacity */
  rings: number;
  /** C2 satellite cube scale */
  satellites: number;
  /** C2 seconds per revolution (primary ring) */
  spin: number;
  /** C2 cherry edge alpha */
  edge: number;
  /** C3 cherry wash peak alpha (`glow` is accepted as an alias) */
  wash: number;
  /** C3 strata hairline opacity */
  strata: number;
  /** C3 seconds per ascent cycle */
  rise: number;
  /** C3 shaft rule opacity */
  rules: number;
}>;

export type ArrivalHandles = {
  concept: ArrivalConcept;
  root: THREE.Group;
  /** Master opacity multiplier, 0–1, applied over each element's own base alpha. */
  setOpacity: (t: number) => void;
  tune: (next: ArrivalTune) => void;
  /** Ambient loops belonging to this concept — killed when the concept is swapped out. */
  tweens: gsap.core.Tween[];
  dispose: () => void;
};

/** Optional media. Absent files fall back to the canvas-drawn surfaces, silently. */
const MANIFEST_SRC = "/images/about/manifest.json";
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
  /** The body's micro-tooth map — shared so arrival satellites light like the object. */
  surfaceTex: THREE.Texture;
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

  // Decoration pass — rim light, cotton, for edge separation against the noir wall.
  const rim = new THREE.DirectionalLight(0xedebdd, 0.9); // cotton
  rim.position.set(-2.4, 1.6, -2.8);
  scene.add(rim);

  const rig = new THREE.Object3D();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 4.2);
  rig.add(camera);
  scene.add(rig);

  const group = new THREE.Group();
  scene.add(group);

  const disposables: Array<{ dispose: () => void }> = [];

  // Decoration pass — static backdrop wall. Added to `scene`, never `group`: it must
  // stay perfectly still, inheriting neither the group's rotation nor the idle float.
  const wallTex = dcWallCanvas();
  const wallGeo = new THREE.PlaneGeometry(7.17, 9.28); // 448:580 ratio × 16
  const wallMat = new THREE.MeshBasicMaterial({ map: wallTex, toneMapped: false });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(0, 0, -3.4);
  wall.renderOrder = -1;
  scene.add(wall);
  disposables.push(wallGeo, wallMat, wallTex);

  const sw = FACE_W / COLS;
  const sh = FACE_H / ROWS;
  const sd = DEPTH / LAYERS;

  // Body — carved by light, with a decoration-pass micro-tooth roughness/bump map.
  const bodyMat = new THREE.MeshStandardMaterial({
    color: TOKEN_HEX.ink,
    roughness: 0.86,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
  });
  disposables.push(bodyMat);

  const surfaceTex = dcSurfaceCanvas();
  surfaceTex.wrapS = surfaceTex.wrapT = THREE.RepeatWrapping;
  surfaceTex.repeat.set(3, 4); // seams land on the 3×4 lattice boundaries
  surfaceTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  bodyMat.roughnessMap = surfaceTex;
  bodyMat.roughness = 1.0; // map multiplies; canvas value 0.82±0.1 → effective 0.72–0.92, astride today's 0.86
  bodyMat.bumpMap = surfaceTex;
  bodyMat.bumpScale = 0.012;
  disposables.push(surfaceTex);

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
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
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
   * These eight files have never existed, and the previous approach — HEAD-probe each URL
   * and skip on a non-ok response — was written believing `fetch` fails quietly. It does
   * not: Chrome logs "Failed to load resource: 404" for a failed `fetch` exactly as it
   * does for an `<img>`. So every visit to /about fired eight requests, took eight 404s,
   * and printed eight console errors, which is a standing failure of the CLAUDE.md
   * verification gate ("console error check").
   *
   * A manifest inverts it. One request that returns 200, listing what is actually present.
   * Absent or empty, nothing else is requested and the canvas-drawn surfaces stand — which
   * is the intended default, not a fallback. Dropping assets in still needs no code change,
   * only a line in the manifest.
   */
  const manifest = (async (): Promise<Set<string>> => {
    try {
      const res = await fetch(MANIFEST_SRC, { cache: "force-cache" });
      if (!res.ok) return new Set();
      const json: unknown = await res.json();
      const list = (json as { available?: unknown })?.available;
      return Array.isArray(list) ? new Set(list.filter((s): s is string => typeof s === "string")) : new Set();
    } catch {
      return new Set();
    }
  })();

  const exists = async (url: string) => (await manifest).has(url);

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
    surfaceTex,
    resize,
    render,
    setVideosActive,
    loadOptionalMedia,
    dispose,
  };
}

/**
 * Chapter-1 arrival decoration — three interchangeable concepts.
 *
 * Everything built here is additive and lives on its own `THREE.Group` added straight to
 * the scene (never to `group`, which rotates and floats). Only the requested concept is
 * instantiated; the other two cost nothing. Ambient motion is a set of independent
 * looping tweens — the same pattern as the existing idle float — so the scrubbed master
 * timeline is never involved.
 *
 * `setOpacity` is the single fade channel: every material's own base alpha is stored and
 * multiplied by `t`, so the concepts fade out together across chapter 2 and are gone
 * before the fracture.
 */
export function buildArrival(
  concept: ArrivalConcept,
  renderer: THREE.WebGLRenderer,
  surfaceTex: THREE.Texture
): ArrivalHandles {
  const root = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const tweens: gsap.core.Tween[] = [];
  /** material → base alpha, so `setOpacity` scales rather than overwrites. */
  const bases = new Map<THREE.Material & { opacity: number }, number>();

  const track = <T extends THREE.Material & { opacity: number }>(mat: T, base: number) => {
    mat.opacity = base;
    bases.set(mat, base);
    return mat;
  };
  const rebase = (mat: THREE.Material & { opacity: number }, base: number) => {
    bases.set(mat, base);
  };

  let master = 1;
  const setOpacity = (t: number) => {
    master = Math.max(0, Math.min(1, t));
    for (const [mat, base] of bases) {
      mat.opacity = base * master;
      // Skip the draw entirely once invisible — cheaper than blending a transparent quad.
      mat.visible = mat.opacity > 0.001;
    }
  };

  const anisotropy = renderer.capabilities.getMaxAnisotropy();
  let tune: (next: ArrivalTune) => void = () => {};

  if (concept === 1) {
    // ── Threshold: a doorway of light, a reflective floor, dust in the beam. ──────
    const glowTex = dcGlowCanvas();
    glowTex.anisotropy = anisotropy;
    const glowMat = track(
      new THREE.MeshBasicMaterial({
        map: glowTex,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
      }),
      0.55
    );
    const glowGeo = new THREE.PlaneGeometry(3.2, 4.6);
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(0, 0.1, -1.6);
    glow.renderOrder = -1;
    root.add(glow);
    disposables.push(glowGeo, glowMat, glowTex);

    const floorTex = dcFloorCanvas();
    floorTex.anisotropy = anisotropy;
    const floorMat = track(
      new THREE.MeshBasicMaterial({
        map: floorTex,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      0.85
    );
    const floorGeo = new THREE.PlaneGeometry(8, 6);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.0, -1.4);
    floor.renderOrder = -1;
    root.add(floor);
    disposables.push(floorGeo, floorMat, floorTex);

    const MOTES = 240;
    const positions = new Float32Array(MOTES * 3);
    const rand = (n: number) => (Math.random() - 0.5) * n;
    for (let i = 0; i < MOTES; i++) {
      positions[i * 3] = rand(4);
      positions[i * 3 + 1] = rand(3);
      positions[i * 3 + 2] = rand(2);
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const moteTex = dcMoteCanvas();
    const moteMat = track(
      new THREE.PointsMaterial({
        map: moteTex,
        size: 0.012,
        transparent: true,
        depthWrite: false,
        sizeAttenuation: true,
        toneMapped: false,
      }),
      0.35
    );
    const motes = new THREE.Points(moteGeo, moteMat);
    root.add(motes);
    disposables.push(moteGeo, moteMat, moteTex);

    // Ambient: the bloom breathes; the mote field turns slowly enough to read as drift.
    tweens.push(
      gsap.to(glow.scale, {
        x: 1.03,
        y: 1.03,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      }),
      gsap.to(motes.rotation, { y: Math.PI * 2, duration: 240, ease: "none", repeat: -1 })
    );

    tune = (n) => {
      if (n.glow !== undefined) rebase(glowMat, n.glow);
      if (n.floor !== undefined) rebase(floorMat, n.floor);
      if (n.motes !== undefined) rebase(moteMat, n.motes);
      if (n.breath !== undefined) tweens[0].duration(n.breath);
      setOpacity(master);
    };
  } else if (concept === 2) {
    // ── Orbit: hairline rings and shards-in-waiting, foreshadowing the fracture. ──
    const ringOf = (radius: number, tilt: number, alpha: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = track(
        new THREE.LineBasicMaterial({
          color: TOKEN_HEX.bone,
          transparent: true,
          toneMapped: false,
        }),
        alpha
      );
      const loop = new THREE.LineLoop(geo, mat);
      loop.rotation.x = tilt;
      disposables.push(geo, mat);
      return { loop, mat };
    };

    // ~72° off flat reads as a shallow ellipse from the chapter-1 camera.
    const primary = ringOf(1.55, THREE.MathUtils.degToRad(72), 0.28);
    const counter = ringOf(1.12, THREE.MathUtils.degToRad(-64), 0.18);
    root.add(primary.loop, counter.loop);

    // Satellites share the body's tooth map, so they catch the key light like the object.
    const satGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const satMat = new THREE.MeshStandardMaterial({
      color: TOKEN_HEX.ink,
      roughness: 1.0,
      roughnessMap: surfaceTex,
      metalness: 0.02,
      transparent: true,
    });
    track(satMat, 1);
    disposables.push(satGeo, satMat);
    const SATS = 12;
    for (let i = 0; i < SATS; i++) {
      const a = (i / SATS) * Math.PI * 2;
      const cube = new THREE.Mesh(satGeo, satMat);
      cube.position.set(Math.cos(a) * 1.55, 0, Math.sin(a) * 1.55);
      cube.rotation.set(a, a * 0.5, 0);
      primary.loop.add(cube);
    }

    // A dim, soft pre-echo of chapter 6's seam — wide and low where that one is thin
    // and bright, so it never competes with the payoff.
    const edgeTex = dcGlowCanvas();
    const edgeMat = track(
      new THREE.MeshBasicMaterial({
        map: edgeTex,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
      }),
      0.3
    );
    const edgeGeo = new THREE.PlaneGeometry(0.9, 2.9);
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.set(FACE_W / 2 + 0.16, 0, -0.4);
    edge.renderOrder = -1;
    root.add(edge);
    disposables.push(edgeGeo, edgeMat, edgeTex);

    tweens.push(
      gsap.to(primary.loop.rotation, { y: Math.PI * 2, duration: 60, ease: "none", repeat: -1 }),
      gsap.to(counter.loop.rotation, { y: -Math.PI * 2, duration: 90, ease: "none", repeat: -1 })
    );

    tune = (n) => {
      if (n.rings !== undefined) {
        rebase(primary.mat, n.rings);
        rebase(counter.mat, n.rings * 0.64);
      }
      if (n.satellites !== undefined) {
        primary.loop.children.forEach((c) => c.scale.setScalar(n.satellites!));
      }
      if (n.spin !== undefined) {
        tweens[0].duration(n.spin);
        tweens[1].duration(n.spin * 1.5);
      }
      if (n.edge !== undefined) rebase(edgeMat, n.edge);
      setOpacity(master);
    };
  } else {
    // ── Strata: lit floor-plates in a shaft, drifting down to imply rising. ───────
    const washTex = dcGlowCanvas();
    washTex.anisotropy = anisotropy;
    const washMat = track(
      new THREE.MeshBasicMaterial({
        map: washTex,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
      }),
      0.35
    );
    const washGeo = new THREE.PlaneGeometry(6.4, 5.2);
    const wash = new THREE.Mesh(washGeo, washMat);
    wash.position.set(0, 0, -1.9);
    wash.renderOrder = -1;
    root.add(wash);
    disposables.push(washGeo, washMat, washTex);

    // The strata ride their own group so the ascent drift never touches the rules.
    const strata = new THREE.Group();
    root.add(strata);
    const STRATA = 7;
    const SPAN = 4.8;
    const step = SPAN / (STRATA - 1);
    const strataMats: THREE.MeshBasicMaterial[] = [];
    const strataGeo = new THREE.PlaneGeometry(5.5, 0.012);
    disposables.push(strataGeo);
    for (let i = 0; i < STRATA; i++) {
      const y = -SPAN / 2 + i * step;
      // Dimmer with distance from the centre line — the shaft recedes rather than stripes.
      const falloff = 1 - Math.abs(y) / (SPAN / 2 + 0.6);
      const mat = track(
        new THREE.MeshBasicMaterial({
          color: TOKEN_HEX.bone,
          transparent: true,
          toneMapped: false,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
        0.22 * falloff
      );
      const plate = new THREE.Mesh(strataGeo, mat);
      plate.position.set(0, y, -1.2);
      plate.renderOrder = -1;
      strata.add(plate);
      strataMats.push(mat);
      disposables.push(mat);
    }

    const ruleGeo = new THREE.PlaneGeometry(0.01, 7);
    disposables.push(ruleGeo);
    const ruleMats: THREE.MeshBasicMaterial[] = [];
    for (const x of [-2.1, 2.1]) {
      const mat = track(
        new THREE.MeshBasicMaterial({
          color: TOKEN_HEX.bone,
          transparent: true,
          toneMapped: false,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
        0.12
      );
      const rule = new THREE.Mesh(ruleGeo, mat);
      rule.position.set(x, 0, -1.2);
      rule.renderOrder = -1;
      root.add(rule);
      ruleMats.push(mat);
      disposables.push(mat);
    }

    // Drift down by exactly one gap, then snap back — the wrap is invisible because
    // every stratum is identical, so the ascent reads as continuous.
    const drift = gsap.fromTo(
      strata.position,
      { y: 0 },
      { y: -step, duration: 30, ease: "none", repeat: -1 }
    );
    tweens.push(
      drift,
      gsap.to(wash.scale, {
        x: 1.02,
        y: 1.02,
        duration: 11,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    );

    tune = (n) => {
      if (n.wash !== undefined) rebase(washMat, n.wash);
      if (n.glow !== undefined) rebase(washMat, n.glow);
      if (n.strata !== undefined) {
        strataMats.forEach((m, i) => {
          const y = -SPAN / 2 + i * step;
          rebase(m, n.strata! * (1 - Math.abs(y) / (SPAN / 2 + 0.6)));
        });
      }
      if (n.rise !== undefined) drift.duration(n.rise);
      if (n.rules !== undefined) ruleMats.forEach((m) => rebase(m, n.rules!));
      setOpacity(master);
    };
  }

  const dispose = () => {
    for (const t of tweens) t.kill();
    tweens.length = 0;
    root.removeFromParent();
    root.clear();
    for (const d of disposables) d.dispose();
  };

  return { concept, root, setOpacity, tune, tweens, dispose };
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
