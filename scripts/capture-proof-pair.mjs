/**
 * capture-proof-pair.mjs — matched before/after captures for /about-v3 §09.
 *
 * Deterministic headless capture of two live sites at one identical viewport,
 * so the comparison slider shows real pixels on both halves. Same principle as
 * scripts/capture-preview.mjs: never a mockup, never a screen recording.
 *
 * Sources are the ones recorded in
 * `.olympus/about-v3/media/MEDIA-PLANNING-HANDOFF.md` §09. A project only ships
 * a slider when BOTH halves come out of this script.
 *
 *   node scripts/capture-proof-pair.mjs
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const VIEWPORT = { width: 1440, height: 900 };
const OUT = path.resolve("public/images/about-v3");
const RAW = path.resolve(".olympus/about-v3/evidence/proof-capture");

const PAIRS = [
  {
    slug: "sonnwerk",
    existing: "https://sonn-werk.at/",
    proposed: "https://rustamg16.github.io/002-sonnwerk/",
  },
];

await mkdir(OUT, { recursive: true });
await mkdir(RAW, { recursive: true });

const browser = await chromium.launch({
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});

for (const pair of PAIRS) {
  for (const state of ["existing", "proposed"]) {
    const url = pair[state];
    if (!url) continue;

    const page = await browser.newPage({
      viewport: VIEWPORT,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
      colorScheme: "light",
    });

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2500);

      const raw = path.join(RAW, `${pair.slug}-${state}.png`);
      await page.screenshot({ path: raw, animations: "disabled" });

      await sharp(raw)
        .resize(1440, 810, { fit: "cover", position: "top" })
        .webp({ quality: 82 })
        .toFile(path.join(OUT, `proof-${pair.slug}-${state}.webp`));

      const meta = await page.evaluate(() => ({
        title: document.title,
        text: document.body.innerText.slice(0, 220).replace(/\s+/g, " "),
      }));
      console.log(`✓ ${pair.slug}/${state}  ${url}`);
      console.log(`   ${meta.title} — ${meta.text}`);
    } catch (error) {
      console.log(`✗ ${pair.slug}/${state}  ${url}\n   ${String(error).split("\n")[0]}`);
    }

    await page.close();
  }
}

await browser.close();
console.log(`\nraw → ${RAW}\nweb → ${OUT}`);
