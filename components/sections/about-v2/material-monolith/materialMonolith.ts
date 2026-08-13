import * as THREE from "three";
import { gsap } from "@/components/motion/gsap";

const COLORS = {
  noir: 0x1b1717,
  ink: 0x241f1f,
  bone: 0xedebdd,
  gray: 0xa8a29a,
  cherry: 0x810100,
  chili: 0xd73b3e,
};

type OptionalManifest = {
  cover: string | null;
  plates: string[];
  loop: string | null;
};

export type MaterialMonolithHandles = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  monolith: THREE.Group;
  core: THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;
  plates: Array<THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>>;
  glowMaterial: THREE.MeshBasicMaterial;
  resize: () => void;
  render: () => void;
  setMediaActive: (active: boolean) => void;
  loadOptionalMedia: () => Promise<void>;
  dispose: () => void;
};

function seeded(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeTexture(kind: "paper" | "stone" | "metal" | "lacquer" | "grid" | "resolved") {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  ctx.fillStyle = kind === "paper" ? "#c9c5b8" : kind === "lacquer" ? "#2b1414" : "#211d1d";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const random = seeded(kind.length * 947);
  if (kind === "paper") {
    ctx.strokeStyle = "rgba(27,23,23,.16)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 24; i++) {
      const p = 20 + i * 21;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, 512);
      ctx.stroke();
    }
    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = `rgba(27,23,23,${0.02 + random() * 0.04})`;
      ctx.fillRect(random() * 512, random() * 512, 1, 1);
    }
  } else if (kind === "stone" || kind === "resolved") {
    ctx.strokeStyle = kind === "resolved" ? "rgba(237,235,221,.13)" : "rgba(237,235,221,.08)";
    for (let i = 0; i < 18; i++) {
      ctx.lineWidth = 0.5 + random() * 1.4;
      ctx.beginPath();
      const y = random() * 512;
      ctx.moveTo(-20, y);
      ctx.bezierCurveTo(120, y + random() * 80 - 40, 350, y + random() * 90 - 45, 540, y + random() * 50 - 25);
      ctx.stroke();
    }
  } else if (kind === "metal") {
    for (let x = 0; x < 512; x += 3) {
      const alpha = 0.025 + random() * 0.08;
      ctx.fillStyle = `rgba(237,235,221,${alpha})`;
      ctx.fillRect(x, 0, 1, 512);
    }
  } else if (kind === "lacquer") {
    ctx.fillStyle = "rgba(215,59,62,.24)";
    ctx.fillRect(246, 0, 20, 512);
    ctx.fillStyle = "rgba(237,235,221,.08)";
    ctx.fillRect(266, 0, 2, 512);
  } else {
    ctx.strokeStyle = "rgba(237,235,221,.12)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const p = i * 64;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, 512);
      ctx.moveTo(0, p);
      ctx.lineTo(512, p);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function buildMaterialMonolith(
  canvas: HTMLCanvasElement,
  stage: HTMLElement
): MaterialMonolithHandles {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(COLORS.noir, 1);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.25 : 1.5));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.noir);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, window.innerWidth < 700 ? 9.4 : 8.2);

  const ambient = new THREE.AmbientLight(0xffffff, 0.36);
  const key = new THREE.DirectionalLight(0xfff4e6, 3.1);
  key.position.set(-4, 5, 6);
  const rim = new THREE.DirectionalLight(COLORS.chili, 1.35);
  rim.position.set(4, -1, -4);
  scene.add(ambient, key, rim);

  const monolith = new THREE.Group();
  monolith.rotation.set(-0.03, -0.2, -0.015);
  scene.add(monolith);

  const textures = [
    makeTexture("paper"),
    makeTexture("stone"),
    makeTexture("metal"),
    makeTexture("grid"),
    makeTexture("lacquer"),
    makeTexture("resolved"),
  ];
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  textures.forEach((texture) => {
    texture.anisotropy = Math.min(maxAnisotropy, 8);
  });

  const coreTexture = makeTexture("stone");
  coreTexture.anisotropy = Math.min(maxAnisotropy, 8);
  textures.push(coreTexture);

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.ink,
    map: coreTexture,
    roughness: 0.82,
    metalness: 0.08,
  });
  const coreGeometry = new THREE.BoxGeometry(3.06, 4.56, 0.72, 1, 1, 1);
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  monolith.add(core);

  const plateMaterials: THREE.MeshStandardMaterial[] = [
    new THREE.MeshStandardMaterial({ color: 0xc9c5b8, map: textures[0], roughness: 0.92 }),
    new THREE.MeshPhysicalMaterial({
      color: 0x423d3d,
      map: textures[1],
      roughness: 0.28,
      metalness: 0.04,
      transparent: true,
      opacity: 0.9,
      transmission: 0.08,
    }),
    new THREE.MeshStandardMaterial({ color: 0x5f5a55, map: textures[2], roughness: 0.34, metalness: 0.76 }),
    new THREE.MeshStandardMaterial({ color: 0x2b2626, map: textures[3], roughness: 0.74 }),
    new THREE.MeshStandardMaterial({
      color: 0x371919,
      map: textures[4],
      roughness: 0.22,
      metalness: 0.18,
      emissive: COLORS.cherry,
      emissiveIntensity: 0.11,
    }),
    new THREE.MeshStandardMaterial({ color: 0x332e2d, map: textures[5], roughness: 0.56, metalness: 0.22 }),
  ];

  const plateGeometry = new THREE.BoxGeometry(1.42, 1.43, 0.12);
  const plates: MaterialMonolithHandles["plates"] = [];
  for (let i = 0; i < 6; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const plate = new THREE.Mesh(plateGeometry, plateMaterials[i]);
    plate.position.set(col === 0 ? -0.735 : 0.735, 1.49 - row * 1.49, 0.43);
    plate.userData.closed = plate.position.clone();
    monolith.add(plate);
    plates.push(plate);
  }

  const edgeGeometry = new THREE.EdgesGeometry(coreGeometry, 24);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: COLORS.bone,
    transparent: true,
    opacity: 0.22,
  });
  const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
  core.add(edges);

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: COLORS.cherry,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
  });
  const glowGeometry = new THREE.PlaneGeometry(2.54, 3.98);
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.z = -0.44;
  monolith.add(glow);

  const seamMaterial = new THREE.MeshBasicMaterial({
    color: COLORS.chili,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });
  const seamGeometry = new THREE.PlaneGeometry(0.012, 4.12);
  const seam = new THREE.Mesh(seamGeometry, seamMaterial);
  seam.position.z = 0.505;
  monolith.add(seam);

  const ringGeometry = new THREE.RingGeometry(2.55, 2.56, 96);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: COLORS.bone,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.08,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.position.z = -0.9;
  ring.scale.y = 1.18;
  monolith.add(ring);

  let video: HTMLVideoElement | null = null;
  let videoTexture: THREE.VideoTexture | null = null;
  const optionalTextures: THREE.Texture[] = [];

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 700 ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 700 ? 9.4 : 8.2;
    camera.updateProjectionMatrix();
  };

  const render = () => renderer.render(scene, camera);

  const setMediaActive = (active: boolean) => {
    if (!video) return;
    if (active) void video.play().catch(() => undefined);
    else video.pause();
  };

  const loadTexture = async (url: string) => {
    const texture = await new THREE.TextureLoader().loadAsync(url);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(maxAnisotropy, 8);
    optionalTextures.push(texture);
    return texture;
  };

  const loadOptionalMedia = async () => {
    try {
      const response = await fetch("/images/about-v2/manifest.json", { cache: "no-store" });
      if (!response.ok) return;
      const manifest = (await response.json()) as OptionalManifest;

      if (manifest.cover) {
        const cover = await loadTexture(manifest.cover);
        coreMaterial.map = cover;
        coreMaterial.color.set(0xffffff);
        coreMaterial.needsUpdate = true;
      }

      await Promise.all(
        manifest.plates.slice(0, 6).map(async (url, index) => {
          const texture = await loadTexture(url);
          plateMaterials[index].map = texture;
          plateMaterials[index].color.set(0xffffff);
          plateMaterials[index].needsUpdate = true;
        })
      );

      if (manifest.loop) {
        video = document.createElement("video");
        video.src = manifest.loop;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        videoTexture = new THREE.VideoTexture(video);
        videoTexture.colorSpace = THREE.SRGBColorSpace;
        plateMaterials[4].map = videoTexture;
        plateMaterials[4].color.set(0xffffff);
        plateMaterials[4].needsUpdate = true;
      }
    } catch {
      // Procedural materials are the complete fallback; optional media fails silently.
    }
  };

  resize();
  render();

  const dispose = () => {
    video?.pause();
    if (video) {
      video.removeAttribute("src");
      video.load();
    }
    videoTexture?.dispose();
    optionalTextures.forEach((texture) => texture.dispose());
    textures.forEach((texture) => texture.dispose());
    coreGeometry.dispose();
    coreMaterial.dispose();
    plateGeometry.dispose();
    plateMaterials.forEach((material) => material.dispose());
    edgeGeometry.dispose();
    edgeMaterial.dispose();
    glowGeometry.dispose();
    glowMaterial.dispose();
    seamGeometry.dispose();
    seamMaterial.dispose();
    ringGeometry.dispose();
    ringMaterial.dispose();
    scene.clear();
    renderer.dispose();
  };

  return {
    renderer,
    scene,
    camera,
    monolith,
    core,
    plates,
    glowMaterial,
    resize,
    render,
    setMediaActive,
    loadOptionalMedia,
    dispose,
  };
}

export function buildMaterialTimeline(handles: MaterialMonolithHandles, mobile: boolean) {
  const { monolith, core, plates, glowMaterial } = handles;
  const closed = plates.map((plate) => (plate.userData.closed as THREE.Vector3).clone());
  const shift = mobile ? 0 : 0.68;
  const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });

  tl.to(monolith.rotation, { y: 0.08, x: 0.02, duration: 0.14 }, 0)
    .to(monolith.position, { x: shift, duration: 0.14 }, 0)
    .to(glowMaterial, { opacity: 0.48, duration: 0.14 }, 0)
    .to(
      plates.map((plate) => plate.position),
      {
        x: (index) => closed[index].x + (index % 2 === 0 ? -0.16 : 0.16),
        z: (index) => closed[index].z + (index % 3) * 0.06,
        duration: 0.14,
      },
      0
    )
    .to(monolith.rotation, { y: -0.38, z: 0.018, duration: 0.18 }, 0.14)
    .to(monolith.position, { x: -shift, duration: 0.18 }, 0.14)
    .to(
      plates.map((plate) => plate.position),
      {
        x: (index) => (index % 2 === 0 ? -1.18 : 1.18) + (mobile ? 0 : (index - 2.5) * 0.08),
        y: (index) => 1.58 - Math.floor(index / 2) * 1.58,
        z: (index) => 0.55 + (index % 3) * 0.2,
        duration: 0.18,
      },
      0.14
    )
    .to(core.material, { opacity: 0.44, transparent: true, duration: 0.18 }, 0.14)
    .to(monolith.rotation, { y: 0.34, x: -0.05, duration: 0.19 }, 0.32)
    .to(monolith.position, { x: shift, duration: 0.19 }, 0.32)
    .to(
      plates.map((plate) => plate.position),
      {
        x: (index) => ((index % 3) - 1) * (mobile ? 1.02 : 1.24),
        y: (index) => (index < 3 ? 0.88 : -0.88),
        z: (index) => 0.58 + (index % 2) * 0.16,
        duration: 0.19,
      },
      0.32
    )
    .to(monolith.rotation, { y: -0.14, x: 0.035, duration: 0.18 }, 0.51)
    .to(monolith.position, { x: -shift, duration: 0.18 }, 0.51)
    .to(
      plates.map((plate) => plate.position),
      {
        x: (index) => closed[index].x * 1.12,
        y: (index) => closed[index].y * 0.92,
        z: (index) => 0.48 + Math.abs(2.5 - index) * 0.09,
        duration: 0.18,
      },
      0.51
    )
    .to(core.material, { opacity: 0.72, duration: 0.18 }, 0.51)
    .to(monolith.rotation, { y: 0.26, z: -0.02, duration: 0.17 }, 0.69)
    .to(monolith.position, { x: shift, duration: 0.17 }, 0.69)
    .to(
      plates.map((plate) => plate.position),
      {
        x: (index) => (index % 2 === 0 ? -1.34 : 1.34),
        y: (index) => 1.46 - Math.floor(index / 2) * 1.46,
        z: 0.58,
        duration: 0.17,
      },
      0.69
    )
    .to(core.material, { opacity: 0.22, duration: 0.17 }, 0.69)
    .to(monolith.rotation, { y: 0, x: 0, z: 0, duration: 0.14 }, 0.86)
    .to(monolith.position, { x: 0, duration: 0.14 }, 0.86)
    .to(
      plates.map((plate) => plate.position),
      {
        x: (index) => closed[index].x + (index % 2 === 0 ? -0.52 : 0.52),
        y: (index) => closed[index].y,
        z: closed[0].z,
        duration: 0.14,
      },
      0.86
    )
    .to(core.material, { opacity: 0.82, duration: 0.14 }, 0.86)
    .to(glowMaterial, { opacity: 0.76, duration: 0.14 }, 0.86);

  return tl;
}
