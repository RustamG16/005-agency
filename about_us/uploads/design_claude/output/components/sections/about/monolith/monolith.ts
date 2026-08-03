/**
 * The Monolith — geometry, materials and the single chapter timeline.
 * Spec: ABOUT-MONOLITH-SPEC.md §1–§3.
 *
 * Nothing here touches the DOM layout: the scene is built once, and every chapter
 * state is a keyframe on ONE gsap timeline that MonolithScene scrubs with a single
 * ScrollTrigger. Object/camera motion lives here; DOM motion never does.
 */

import * as THREE from "three";
import { gsap } from "@/components/motion/gsap";

/* Face ratio 448:580 — the object and the site's project cards share geometry. */
export const FACE_W = 1.4;
export const FACE_H = FACE_W * (580 / 448);
export const DEPTH = FACE_W * 0.25;

const COLS = 3;
const ROWS = 4;
const LAYERS = 2;

/* Token colours only (styles/tokens.css). */
const INK = 0x171717;
const NOIR = 0x050505;
const HAIRLINE = 0xcac8c0;
const ACCENT_ON_NOIR = 0xc1554d; /* accent render #1 — ch.6 edge seam, nothing else */
const BONE_CSS = "#eeede8";
const INK_CSS = "#171717";
const GRAY_CSS = "#777771";

/* ------------------------------------------------------------------ *
 * Chapter-3 brand artifacts — CanvasTexture, drawn in code (media guide §5).
 * Bone stock, ink marks, no fabricated names, numbers or clients: the only
 * figures used are our own token geometry (448 × 580, 8pt base, 12 col).
 * ------------------------------------------------------------------ */

const ARTIFACT_PX = 512;

function artifactCanvas(kind: number): HTMLCanvasElement {
  const s = ARTIFACT_PX;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const g = c.getContext("2d")!;
  g.fillStyle = BONE_CSS;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = INK_CSS;
  g.fillStyle = INK_CSS;
  g.lineWidth = 2;

  switch (kind % 7) {
    /* 0 — baseline sheet */
    case 0: {
      g.globalAlpha = 0.32;
      for (let y = 48; y < s; y += 32) {
        g.beginPath();
        g.moveTo(40, y);
        g.lineTo(s - 40, y);
        g.stroke();
      }
      g.globalAlpha = 1;
      g.fillRect(40, 48, 168, 96);
      g.fillRect(40, 176, 300, 8);
      g.fillRect(40, 208, 232, 8);
      break;
    }
    /* 1 — spec fragment: the card/face ratio itself */
    case 1: {
      g.strokeRect(96, 72, 232, 300);
      g.globalAlpha = 0.5;
      g.beginPath();
      g.moveTo(96, 404);
      g.lineTo(328, 404);
      g.moveTo(96, 396);
      g.lineTo(96, 412);
      g.moveTo(328, 396);
      g.lineTo(328, 412);
      g.stroke();
      g.globalAlpha = 1;
      g.font = "600 26px ui-sans-serif, system-ui, sans-serif";
      g.fillText("448 × 580", 96, 452);
      break;
    }
    /* 2 — cropped letterform */
    case 2: {
      g.font = "900 520px ui-sans-serif, system-ui, sans-serif";
      g.fillText("C", -30, 452);
      break;
    }
    /* 3 — type stack */
    case 3: {
      const widths = [392, 296, 344, 208, 264];
      widths.forEach((w, i) => g.fillRect(56, 88 + i * 76, w, 30));
      break;
    }
    /* 4 — dot grid */
    case 4: {
      g.globalAlpha = 0.6;
      for (let y = 64; y <= s - 64; y += 48) {
        for (let x = 64; x <= s - 64; x += 48) {
          g.beginPath();
          g.arc(x, y, 4, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.globalAlpha = 1;
      break;
    }
    /* 5 — column rule + label */
    case 5: {
      g.globalAlpha = 0.35;
      for (let i = 0; i <= 12; i++) {
        const x = 56 + (i * (s - 112)) / 12;
        g.beginPath();
        g.moveTo(x, 56);
        g.lineTo(x, s - 96);
        g.stroke();
      }
      g.globalAlpha = 1;
      g.font = "600 24px ui-sans-serif, system-ui, sans-serif";
      g.fillText("GRID / 12", 56, s - 48);
      break;
    }
    /* 6 — mark construction */
    default: {
      g.lineWidth = 3;
      g.strokeRect(112, 112, 288, 288);
      g.beginPath();
      g.moveTo(112, 112);
      g.lineTo(400, 400);
      g.moveTo(400, 112);
      g.lineTo(112, 400);
      g.stroke();
      g.globalAlpha = 0.4;
      g.beginPath();
      g.arc(256, 256, 144, 0, Math.PI * 2);
      g.stroke();
      g.globalAlpha = 1;
      break;
    }
  }
  return c;
}

/* ------------------------------------------------------------------ *
 * Chapter-5 screen face — VideoTexture loops with a graceful ink fallback.
 * ------------------------------------------------------------------ */

export type ScreenFace = {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  /** 0-based loop index; falls back to the ink panel when that loop is absent. */
  setLoop: (index: number) => void;
  setPlaying: (playing: boolean) => void;
  dispose: () => void;
};

function placeholderScreenTexture(): THREE.CanvasTexture {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const g = c.getContext("2d")!;
  g.fillStyle = INK_CSS;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = GRAY_CSS;
  g.globalAlpha = 0.18;
  g.lineWidth = 1;
  for (let y = 0; y < s; y += 6) {
    g.beginPath();
    g.moveTo(0, y + 0.5);
    g.lineTo(s, y + 0.5);
    g.stroke();
  }
  g.globalAlpha = 0.45;
  g.strokeRect(96.5, 96.5, 319, 319);
  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createScreenFace(sources: string[]): ScreenFace {
  const fallback = placeholderScreenTexture();
  const material = new THREE.MeshBasicMaterial({
    map: fallback,
    transparent: true,
    opacity: 0,
    toneMapped: false,
  });
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(FACE_W * 0.86, FACE_H * 0.86),
    material
  );
  mesh.position.z = DEPTH / 2 + 0.004;
  mesh.renderOrder = 2;

  const videos: HTMLVideoElement[] = [];
  const textures: (THREE.VideoTexture | null)[] = sources.map(() => null);
  let current = -1;
  let playing = false;

  sources.forEach((src, i) => {
    const v = document.createElement("video");
    v.src = src;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";
    v.setAttribute("aria-hidden", "true");
    v.addEventListener(
      "loadeddata",
      () => {
        const tex = new THREE.VideoTexture(v);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        textures[i] = tex;
        if (i === current) apply(i);
      },
      { once: true }
    );
    /* Missing file: stay on the ink panel, never throw. */
    v.addEventListener("error", () => undefined);
    videos.push(v);
  });

  function apply(i: number) {
    const tex = textures[i];
    material.map = tex ?? fallback;
    material.needsUpdate = true;
    videos.forEach((v, k) => {
      if (k === i && playing && tex) {
        void v.play().catch(() => undefined);
      } else if (!v.paused) {
        v.pause();
      }
    });
  }

  return {
    mesh,
    material,
    setLoop(index: number) {
      const i = Math.max(0, Math.min(sources.length - 1, index));
      if (i === current) return;
      current = i;
      apply(i);
    },
    setPlaying(next: boolean) {
      if (next === playing) return;
      playing = next;
      if (current >= 0) apply(current);
      else if (next) {
        current = 0;
        apply(0);
      }
    },
    dispose() {
      videos.forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
      textures.forEach((t) => t?.dispose());
      fallback.dispose();
      material.dispose();
      mesh.geometry.dispose();
    },
  };
}

/* ------------------------------------------------------------------ *
 * Build
 * ------------------------------------------------------------------ */

export type Monolith = {
  group: THREE.Group;
  shards: THREE.Mesh[];
  rest: THREE.Vector3[];
  exploded: THREE.Vector3[];
  body: THREE.MeshStandardMaterial;
  artifacts: THREE.MeshBasicMaterial[];
  wire: THREE.LineSegments;
  wireMaterial: THREE.LineBasicMaterial;
  screen: ScreenFace;
  seam: THREE.Mesh;
  seamMaterial: THREE.MeshBasicMaterial;
  dispose: () => void;
};

export type MonolithOptions = {
  /** Chapter-5 loop sources, in play order. Absent files degrade to the ink panel. */
  loopSources?: string[];
};

export function buildMonolith(options: MonolithOptions = {}): Monolith {
  const loopSources = options.loopSources ?? [
    "/videos/loops/loop-a.mp4",
    "/videos/loops/loop-b.mp4",
    "/videos/loops/loop-c.mp4",
  ];

  const group = new THREE.Group();

  const sw = FACE_W / COLS;
  const sh = FACE_H / ROWS;
  const sd = DEPTH / LAYERS;

  /* One matte ink material shared by all 24 shards — 24 single-material draw calls. */
  const body = new THREE.MeshStandardMaterial({
    color: INK,
    roughness: 0.86,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
  });

  /* Exact cell size: any inset notches the silhouette and telegraphs the fracture. */
  const shardGeometry = new THREE.BoxGeometry(sw, sh, sd);
  const shards: THREE.Mesh[] = [];
  const rest: THREE.Vector3[] = [];
  const exploded: THREE.Vector3[] = [];
  const artifacts: THREE.MeshBasicMaterial[] = [];
  const artifactTextures: THREE.CanvasTexture[] = [];
  const artifactGeometry = new THREE.PlaneGeometry(sw * 0.82, sh * 0.82);

  /* Strict exploded grid: pure translation on the rest lattice, no tumbling. */
  const EX = 2.05;
  const EY = 1.5;
  const EZ = 5.2;

  let artifactCount = 0;
  for (let k = 0; k < LAYERS; k++) {
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const x = (i - (COLS - 1) / 2) * sw;
        const y = (j - (ROWS - 1) / 2) * sh;
        const z = (k - (LAYERS - 1) / 2) * sd;

        const mesh = new THREE.Mesh(shardGeometry, body);
        mesh.position.set(x, y, z);
        group.add(mesh);
        shards.push(mesh);
        rest.push(new THREE.Vector3(x, y, z));
        exploded.push(new THREE.Vector3(x * EX, y * EY, z * EZ));

        /* 7 front-layer faces carry the brand artifacts (spec §2, ch.3). */
        const frontLayer = k === LAYERS - 1;
        if (frontLayer && artifactCount < 7 && (i + j) % 2 !== 1) {
          const tex = new THREE.CanvasTexture(artifactCanvas(artifactCount));
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          const mat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: 0,
            toneMapped: false,
          });
          const plane = new THREE.Mesh(artifactGeometry, mat);
          plane.position.z = sd / 2 + 0.003;
          plane.renderOrder = 1;
          mesh.add(plane);
          artifacts.push(mat);
          artifactTextures.push(tex);
          artifactCount++;
        }
      }
    }
  }

  /* Wireframe of the same 3×4×2 subdivision — the ch.4 construction pass. */
  const wireSource = new THREE.BoxGeometry(FACE_W, FACE_H, DEPTH, COLS, ROWS, LAYERS);
  const wireGeometry = new THREE.WireframeGeometry(wireSource);
  wireSource.dispose();
  const wireMaterial = new THREE.LineBasicMaterial({
    color: HAIRLINE,
    transparent: true,
    opacity: 0,
  });
  const wire = new THREE.LineSegments(wireGeometry, wireMaterial);
  group.add(wire);

  /* Ch.5 screen face. */
  const screen = createScreenFace(loopSources);
  group.add(screen.mesh);

  /* Ch.6 seam — accent render #1. Pivot at the top so it ignites downward. */
  const seamGeometry = new THREE.PlaneGeometry(0.006, FACE_H);
  seamGeometry.translate(0, -FACE_H / 2, 0);
  const seamMaterial = new THREE.MeshBasicMaterial({
    color: ACCENT_ON_NOIR,
    transparent: true,
    opacity: 0,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  const seam = new THREE.Mesh(seamGeometry, seamMaterial);
  /* Face-on sliver down the right edge of the front face: a 45° corner plane
     projects sub-pixel at this width and reads muddy. */
  seam.position.set(FACE_W / 2 - 0.005, FACE_H / 2, DEPTH / 2 + 0.003);
  seam.renderOrder = 3;
  group.add(seam);

  return {
    group,
    shards,
    rest,
    exploded,
    body,
    artifacts,
    wire,
    wireMaterial,
    screen,
    seam,
    seamMaterial,
    dispose() {
      shardGeometry.dispose();
      artifactGeometry.dispose();
      artifactTextures.forEach((t) => t.dispose());
      artifacts.forEach((m) => m.dispose());
      body.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      seamGeometry.dispose();
      seamMaterial.dispose();
      screen.dispose();
      group.clear();
    },
  };
}

export function buildScene(monolith: Monolith) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NOIR);

  /* One warm key + low ambient. No shadow maps. */
  const key = new THREE.DirectionalLight(0xfff1e2, 2.5);
  key.position.set(2.6, 3.2, 3.4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe4ea, 0.5);
  fill.position.set(-3.2, -1.2, 1.8);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  scene.add(monolith.group);
  return { scene, lights: [key, fill] as THREE.Light[] };
}

export const CAMERA_DIST_ARRIVAL = 4.2;

export function buildRig() {
  const rig = new THREE.Object3D();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  /* Camera looks down the rig's -Z. Lateral offset shifts the object across the
     frame in screen space without re-aiming, so it survives the orbit. */
  camera.position.set(0, 0, CAMERA_DIST_ARRIVAL);
  rig.add(camera);
  return { rig, camera };
}

/* ------------------------------------------------------------------ *
 * The single chapter timeline — master progress 0→1 maps 1:1 to spec §2.
 * ------------------------------------------------------------------ */

export type ChapterTimelineArgs = {
  monolith: Monolith;
  rig: THREE.Object3D;
  camera: THREE.PerspectiveCamera;
  /** Called with the active chapter-5 loop index as the playhead moves. */
  onLoop?: (index: number) => void;
};

export function buildChapterTimeline({
  monolith,
  rig,
  camera,
  onLoop,
}: ChapterTimelineArgs): gsap.core.Timeline {
  const { group, shards, rest, exploded, body, artifacts, wireMaterial, screen, seam } =
    monolith;

  const tl = gsap.timeline({ paused: true });
  const loop = { i: 0 };

  /* Ch.1 · .00–.12 — Arrival. Whole, floating, ~2° of rotation. */
  tl.to(rig.rotation, { y: 0.06, duration: 0.12, ease: "none" }, 0);
  tl.to(group.rotation, { y: 0.035, duration: 0.12, ease: "none" }, 0);

  /* Ch.2 · .12–.28 — Position. Slow ~35° orbit; the object is not touched. */
  tl.to(rig.rotation, { y: 0.61, duration: 0.16, ease: "power1.inOut" }, 0.12);
  tl.to(camera.position, { x: -0.72, z: 4.6, duration: 0.16, ease: "power1.inOut" }, 0.12);
  tl.to(group.rotation, { y: 0.055, duration: 0.16, ease: "none" }, 0.12);

  /* Ch.3 · .28–.50 — Fracture. Held whole until .28, then broken with weight. */
  tl.to(camera.position, { x: -0.5, z: 6.4, duration: 0.12, ease: "power2.inOut" }, 0.28);
  tl.to(rig.rotation, { y: 0.42, duration: 0.22, ease: "power1.inOut" }, 0.28);
  shards.forEach((mesh, i) => {
    tl.to(
      mesh.position,
      {
        x: exploded[i].x,
        y: exploded[i].y,
        z: exploded[i].z,
        duration: 0.1,
        ease: "power3.out",
      },
      0.28 + i * 0.0022
    );
  });
  tl.to(artifacts, { opacity: 1, duration: 0.05, stagger: 0.004, ease: "none" }, 0.35);
  tl.to(group.rotation, { y: 0.1, duration: 0.1, ease: "sine.inOut" }, 0.4);

  /* Ch.4 · .50–.72 — Re-assemble, cross-fade to wireframe, re-materialise. */
  shards.forEach((mesh, i) => {
    tl.to(
      mesh.position,
      {
        x: rest[i].x,
        y: rest[i].y,
        z: rest[i].z,
        duration: 0.08,
        ease: "power2.inOut",
      },
      0.5 + i * 0.0015
    );
  });
  tl.to(artifacts, { opacity: 0, duration: 0.04, ease: "none" }, 0.5);
  tl.to(camera.position, { x: -0.7, z: 4.8, duration: 0.1, ease: "power2.inOut" }, 0.5);
  tl.to(rig.rotation, { y: 0.3, duration: 0.22, ease: "power1.inOut" }, 0.5);
  tl.to(group.rotation, { y: 0.02, duration: 0.22, ease: "power1.inOut" }, 0.5);
  tl.to(wireMaterial, { opacity: 0.85, duration: 0.04, ease: "none" }, 0.6);
  tl.to(body, { opacity: 0.05, duration: 0.04, ease: "none" }, 0.6);
  tl.to(body, { opacity: 1, duration: 0.05, ease: "power2.out" }, 0.66);
  tl.to(wireMaterial, { opacity: 0, duration: 0.05, ease: "none" }, 0.665);

  /* Ch.5 · .72–.90 — The front face becomes a screen; object moves left of frame. */
  tl.to(rig.rotation, { y: 0, duration: 0.08, ease: "power2.inOut" }, 0.72);
  tl.to(group.rotation, { y: 0, duration: 0.08, ease: "power2.inOut" }, 0.72);
  tl.to(camera.position, { x: 0.82, z: 3.4, duration: 0.08, ease: "power2.inOut" }, 0.72);
  tl.to(screen.material, { opacity: 1, duration: 0.045, ease: "none" }, 0.755);
  tl.to(
    loop,
    {
      i: 2.999,
      duration: 0.13,
      ease: "none",
      onUpdate: () => {
        screen.setLoop(Math.floor(loop.i));
        onLoop?.(Math.floor(loop.i));
      },
    },
    0.76
  );

  /* Ch.6 · .90–1.00 — Pull back to arrival framing; the seam ignites. */
  tl.to(screen.material, { opacity: 0, duration: 0.035, ease: "none" }, 0.9);
  tl.to(camera.position, { x: 0, z: CAMERA_DIST_ARRIVAL, duration: 0.1, ease: "power2.inOut" }, 0.9);
  tl.to(rig.rotation, { y: 0.06, duration: 0.1, ease: "power2.inOut" }, 0.9);
  tl.fromTo(
    seam.scale,
    { y: 0.02 },
    { y: 1, duration: 0.08, ease: "power3.out" },
    0.92
  );
  /* Opacity lands first and fast; the scale tween is what reads as the ignition. */
  tl.to(monolith.seamMaterial, { opacity: 1, duration: 0.015, ease: "power2.out" }, 0.92);
  /* Pin total duration to exactly 1 so scroll progress == spec progress. */
  tl.to({}, { duration: 0 }, 1);

  return tl;
}

/** Near-imperceptible float — independent of scroll, paused with the RAF. */
export function buildIdleFloat(monolith: Monolith): gsap.core.Tween {
  return gsap.to(monolith.group.position, {
    y: 0.045,
    duration: 6.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}
