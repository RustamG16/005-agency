// MEDIA-GUIDE-HOME §2 — hero first-frame capture.
//
//   npm run dev            (in another terminal)
//   node scripts/capture-hero-frame.mjs
//
// Writes homepage/assets/hero-first-frame.png at exactly 1920×1080. That file is
// both the video poster and the Omni Flash image-to-video input, so it must be
// the final-quality recolored robot — not a placeholder.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const URL = process.env.CAPTURE_URL ?? "http://localhost:3000/?pose=hero";
const OUT = process.env.CAPTURE_OUT ?? "homepage/assets/hero-first-frame.png";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});

const errors = [];
page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
page.on("pageerror", (error) => errors.push(String(error)));

await page.goto(URL, { waitUntil: "networkidle" });

// The stage flags itself ready once the GLB is loaded and recolored.
await page.waitForSelector('[data-pose="hero"][data-ready="true"]', { timeout: 30000 });
await page.waitForFunction(() => document.fonts.ready.then(() => true));
await page.waitForTimeout(600);

const stage = await page.locator('[data-pose="hero"]').first();
const box = await stage.boundingBox();
if (!box || Math.round(box.width) !== 1920 || Math.round(box.height) !== 1080) {
  throw new Error(`Stage must be exactly 1920×1080, got ${box?.width}×${box?.height}`);
}

await mkdir(dirname(OUT), { recursive: true });
await stage.screenshot({ path: OUT });
await browser.close();

console.log(`hero first frame → ${OUT}`);
if (errors.length) {
  console.error("console errors during capture:");
  errors.forEach((e) => console.error("  ", e));
  process.exitCode = 1;
}
