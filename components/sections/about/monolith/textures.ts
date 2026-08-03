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

/**
 * The seven fracture-plate drawings — bone ground, ink graphics, one per artifact
 * kind. `kind` cycles 0–6; kinds 0–5 are eligible for the real-plate override in
 * `monolith.ts`, kind 6 (the X-box) always stays code-drawn.
 */
export const ARTIFACT_COUNT = 7;

export function dcArtifactCanvas(kind: number, s = 512) {
  const { canvas, g } = ctx2d(s, s);
  g.fillStyle = TOKEN.bone;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = TOKEN.ink;
  g.fillStyle = TOKEN.ink;
  g.lineWidth = 2;

  if (kind === 0) {
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
  } else if (kind === 1) {
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
    g.font = `600 26px ${UI}`;
    g.fillText("448 × 580", 96, 452);
  } else if (kind === 2) {
    g.font = `900 520px ${UI}`;
    g.fillText("C", -30, 452);
  } else if (kind === 3) {
    [392, 296, 344, 208, 264].forEach((w, i) => g.fillRect(56, 88 + i * 76, w, 30));
  } else if (kind === 4) {
    g.globalAlpha = 0.6;
    for (let y = 64; y <= s - 64; y += 48) {
      for (let x = 64; x <= s - 64; x += 48) {
        g.beginPath();
        g.arc(x, y, 4, 0, Math.PI * 2);
        g.fill();
      }
    }
    g.globalAlpha = 1;
  } else if (kind === 5) {
    g.globalAlpha = 0.35;
    for (let i = 0; i <= 12; i++) {
      const x = 56 + (i * (s - 112)) / 12;
      g.beginPath();
      g.moveTo(x, 56);
      g.lineTo(x, s - 96);
      g.stroke();
    }
    g.globalAlpha = 1;
    g.font = `600 24px ${UI}`;
    g.fillText("GRID / 12", 56, s - 48);
  } else {
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
  }

  return canvas;
}

/** Chapter-5 screen face — the no-video fallback. Drawn once; static, not per-frame. */
export function dcScreenCanvas(s = 512) {
  const { canvas, g } = ctx2d(s, s);
  g.fillStyle = TOKEN.ink;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = TOKEN.gray;
  g.lineWidth = 1;
  g.globalAlpha = 0.18;
  for (let y = 0; y < s; y += 6) {
    g.beginPath();
    g.moveTo(0, y + 0.5);
    g.lineTo(s, y + 0.5);
    g.stroke();
  }
  g.globalAlpha = 0.45;
  g.strokeRect(96.5, 96.5, 319, 319);
  g.globalAlpha = 1;
  return canvas;
}
