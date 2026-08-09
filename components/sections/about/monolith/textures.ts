/**
 * Canvas-drawn surfaces for the About monolith — ported verbatim from the design
 * authority (`about_us/Monolith Preview.dc.html`, `_artifact` / `_screenTexture`).
 *
 * Every surface the object wears is generated here so the page ships complete with
 * zero external media. Real files (fracture plates, the screen loop, portraits) are
 * optional overrides loaded in `monolith.ts` — see `MEDIA-BRIEF-ABOUT.md`.
 *
 * Token values are duplicated as literals because canvas 2D cannot read CSS vars.
 * Keep these in sync with `styles/tokens.css`.
 */

import * as THREE from "three";

export const TOKEN = {
  noir: "#1b1717",
  bone: "#edebdd",
  paper: "#f5f3e8",
  ink: "#241f1f",
  gray: "#6e6963",
  hairline: "#d6d2c2",
  grayOnNoir: "#a8a29a",
  accent: "#810100",
  accentOnNoir: "#e5595c",
  accentGraphic: "#d73b3e",
  accentDeep: "#630000",
} as const;

export const TOKEN_HEX = {
  noir: 0x1b1717,
  bone: 0xedebdd,
  paper: 0xf5f3e8,
  ink: 0x241f1f,
  gray: 0x6e6963,
  hairline: 0xd6d2c2,
  accent: 0x810100,
  accentOnNoir: 0xe5595c,
  accentGraphic: 0xd73b3e,
  accentDeep: 0x630000,
} as const;

const UI = "ui-sans-serif, system-ui, sans-serif";

function ctx2d(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d");
  if (!g) throw new Error("2D context unavailable");
  return { canvas, g };
}

/** Small seeded PRNG (mulberry32) — deterministic pixels for the Playwright visual-diff gate. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Resolves the site's display font for canvas text. `--font-family-display` is a CSS
 * custom property whose own value is `var(--font-archivo-black), Arial Black, sans-serif`
 * — `getComputedStyle` on a custom property returns the raw authored string, it does not
 * resolve nested `var()` references, so this reliably comes back containing a literal
 * `"var("` substring rather than a usable font name. Falls back to the UI stack already
 * used elsewhere in this file whenever that happens (or the property is empty/missing).
 */
function resolveDisplayFont(): string {
  if (typeof document === "undefined") return UI;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--font-family-display").trim();
  if (!raw || raw.includes("var(")) return UI;
  return raw;
}

/** Draws `text` left-to-right with manual per-character tracking (canvas 2D has no letter-spacing). */
function drawTracked(
  g: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSizePx: number,
  trackingEm: number
) {
  const trackingPx = fontSizePx * trackingEm;
  let cx = x;
  for (const ch of text) {
    g.fillText(ch, cx, y);
    cx += g.measureText(ch).width + trackingPx;
  }
}

/** Total advance width of `drawTracked`'s output — for centering. */
function trackedWidth(g: CanvasRenderingContext2D, text: string, fontSizePx: number, trackingEm: number) {
  const trackingPx = fontSizePx * trackingEm;
  let w = 0;
  for (const ch of text) w += g.measureText(ch).width + trackingPx;
  return w - trackingPx;
}

const PLATE_CAPTIONS = ["IDENTITY", "SPEC", "WORDMARK", "SYSTEM", "TEXTURE", "GRID", "MARK"];

/**
 * The seven fracture-plate drawings — bone/paper ground, ink graphics, one per artifact
 * kind. `kind` cycles 0–6; kinds 0–5 are eligible for the real-plate override in
 * `monolith.ts`, kind 6 (the X-box) always stays code-drawn.
 */
export const ARTIFACT_COUNT = 7;

export function dcArtifactCanvas(kind: number, s = 1024) {
  const { canvas, g } = ctx2d(s, s);
  g.fillStyle = kind % 2 === 0 ? TOKEN.bone : TOKEN.paper;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = TOKEN.ink;
  g.fillStyle = TOKEN.ink;
  g.lineWidth = 4;

  const displayFont = resolveDisplayFont();

  if (kind === 0) {
    g.globalAlpha = 0.32;
    for (let y = 96; y < s; y += 64) {
      g.beginPath();
      g.moveTo(80, y);
      g.lineTo(s - 80, y);
      g.stroke();
    }
    g.globalAlpha = 1;
    g.fillRect(80, 96, 336, 192);
    g.fillRect(80, 352, 600, 16);
    g.fillRect(80, 416, 464, 16);
  } else if (kind === 1) {
    g.lineWidth = 2;
    g.strokeRect(192, 144, 464, 600);
    g.globalAlpha = 0.5;
    g.beginPath();
    g.moveTo(192, 808);
    g.lineTo(656, 808);
    g.moveTo(192, 792);
    g.lineTo(192, 824);
    g.moveTo(656, 792);
    g.lineTo(656, 824);
    g.stroke();
    g.globalAlpha = 1;
    g.font = `600 52px ${displayFont}`;
    g.fillText("448 × 580", 192, 904);
  } else if (kind === 2) {
    g.font = `900 1040px ${displayFont}`;
    g.fillText("C", -60, 904);
  } else if (kind === 3) {
    [784, 592, 688, 416, 528].forEach((w, i) => g.fillRect(112, 176 + i * 152, w, 60));
  } else if (kind === 4) {
    g.globalAlpha = 0.6;
    for (let y = 128; y <= s - 128; y += 96) {
      for (let x = 128; x <= s - 128; x += 96) {
        g.beginPath();
        g.arc(x, y, 8, 0, Math.PI * 2);
        g.fill();
      }
    }
    g.globalAlpha = 1;
  } else if (kind === 5) {
    g.globalAlpha = 0.35;
    for (let i = 0; i <= 12; i++) {
      const x = 112 + (i * (s - 224)) / 12;
      g.beginPath();
      g.moveTo(x, 112);
      g.lineTo(x, s - 192);
      g.stroke();
    }
    g.globalAlpha = 1;
    g.font = `600 48px ${UI}`;
    g.fillText("GRID / 12", 112, s - 96);
  } else {
    g.lineWidth = 6;
    g.strokeRect(224, 224, 576, 576);
    g.beginPath();
    g.moveTo(224, 224);
    g.lineTo(800, 800);
    g.moveTo(800, 224);
    g.lineTo(224, 800);
    g.stroke();
    g.globalAlpha = 0.4;
    g.beginPath();
    g.arc(512, 512, 288, 0, Math.PI * 2);
    g.stroke();
    g.globalAlpha = 1;
  }

  // Hairline frame, kinds 1 and 5 only — inset 64px from every edge at the 1024 scale.
  if (kind === 1 || kind === 5) {
    g.strokeStyle = TOKEN.ink;
    g.lineWidth = 1;
    g.strokeRect(64.5, 64.5, s - 129, s - 129);
  }

  // Caption, bottom-left corner, every plate.
  g.fillStyle = TOKEN.gray;
  g.font = `600 20px ${UI}`;
  drawTracked(g, PLATE_CAPTIONS[kind] ?? "", 48, s - 48, 20, 0.08);

  return canvas;
}

/** Backdrop wall — a perfectly static plate behind the object, never a child of `group`. */
export function dcWallCanvas(w = 1024, h = 1324) {
  const { canvas, g } = ctx2d(w, h);
  g.fillStyle = TOKEN.ink;
  g.fillRect(0, 0, w, h);
  g.strokeStyle = TOKEN.hairline;
  g.lineWidth = 1;
  g.globalAlpha = 0.07;
  [256, 512, 768].forEach((x) => {
    g.beginPath();
    g.moveTo(x + 0.5, 0);
    g.lineTo(x + 0.5, h);
    g.stroke();
  });
  g.beginPath();
  g.moveTo(0, 662.5);
  g.lineTo(w, 662.5);
  g.stroke();
  g.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Micro-tooth roughness/bump map for `bodyMat` — a seeded, reproducible speckle field. */
export function dcSurfaceCanvas(s = 512) {
  const { canvas, g } = ctx2d(s, s);
  g.fillStyle = "#d0d0d0";
  g.fillRect(0, 0, s, s);

  const rand = mulberry32(0x9e3779b9);
  for (let i = 0; i < 9000; i++) {
    const x = Math.floor(rand() * s);
    const y = Math.floor(rand() * s);
    const v = Math.round(208 + (rand() * 2 - 1) * 26);
    g.fillStyle = `rgb(${v}, ${v}, ${v})`;
    g.fillRect(x, y, 1, 1);
  }

  return new THREE.CanvasTexture(canvas);
}

/** Chapter-5 screen face — the no-video fallback. Drawn once; static, not per-frame. */
export function dcScreenCanvas(s = 1024) {
  const { canvas, g } = ctx2d(s, s);
  g.fillStyle = TOKEN.ink;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = TOKEN.gray;
  g.lineWidth = 1;
  g.globalAlpha = 0.18;
  for (let y = 0; y < s; y += 12) {
    g.beginPath();
    g.moveTo(0, y + 0.5);
    g.lineTo(s, y + 0.5);
    g.stroke();
  }
  g.globalAlpha = 1;

  // Four corner crop-marks in place of the old single border.
  g.strokeStyle = TOKEN.hairline;
  g.lineWidth = 1;
  g.globalAlpha = 0.45;
  const inset = 192;
  const leg = 48;
  const drawCorner = (x: number, y: number, hx: number, hy: number) => {
    g.beginPath();
    g.moveTo(x, y + hy * leg);
    g.lineTo(x, y);
    g.lineTo(x + hx * leg, y);
    g.stroke();
  };
  drawCorner(inset, inset, 1, 1);
  drawCorner(s - inset, inset, -1, 1);
  drawCorner(inset, s - inset, 1, -1);
  drawCorner(s - inset, s - inset, -1, -1);
  g.globalAlpha = 1;

  // Wordmark, bottom-centre, tracked out.
  const label = "CONVENIUM · STUDIO";
  const fontSize = 22;
  const tracking = 0.12;
  g.fillStyle = TOKEN.gray;
  g.font = `600 ${fontSize}px ${UI}`;
  const width = trackedWidth(g, label, fontSize, tracking);
  drawTracked(g, label, s / 2 - width / 2, s - 96, fontSize, tracking);

  return canvas;
}
