/**
 * Hero pin verification — steps the scrubbed pin and captures a frame per beat.
 *
 * A scrubbed pin cannot be screenshotted deterministically by scrolling by hand:
 * the range is 300% of the viewport, `scrub: 0.3` lags the playhead, and the
 * seek lands asynchronously. This drives `Hero.tsx`'s dev-only `__heroRange()`,
 * parks Lenis at an exact offset, waits for the scrub and the seek to settle,
 * then reports the film time, the header ground and the wipe's clip-path at each
 * step. Those readings are what the R6 constants (INVERT_FROM / INVERT_TO /
 * REVEAL_AT) were chosen from.
 *
 * Assumes a dev server is already listening. Run:
 *   SCREEN_BASE_URL=http://localhost:4328 node scripts/verify-hero.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:4328";
const OUT = process.env.OUT_DIR ?? path.resolve("screenshots/r6/hero-steps");
fs.mkdirSync(OUT, { recursive: true });

const STEPS = [0, 0.2, 0.41, 0.55, 0.66, 0.8, 0.86, 0.93, 1.0];

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
// The master is fetched to a Blob before the first seek can land.
await page.waitForTimeout(3000);

const range = await page.evaluate(() => window.__heroRange?.() ?? null);
console.log("hero range:", JSON.stringify(range));
if (!range) {
  console.log("!! __heroRange missing — is the pin building at this viewport?");
}

for (const p of STEPS) {
  const y = range ? range.start + (range.end - range.start) * p : 900 * 3 * p;
  await page.evaluate((top) => {
    if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true });
    else window.scrollTo(0, top);
  }, y);
  await page.waitForTimeout(900);

  const state = await page.evaluate(() => {
    const hero = document.querySelector("#top");
    const v = hero?.querySelector("video");
    const reveal = hero?.querySelector("[class*='reveal']");
    const statement = hero?.querySelector("[class*='statement']");
    const cs = (el) => {
      const c = el ? getComputedStyle(el).clipPath : null;
      return c && c !== "none" ? c.replace(/\s+/g, " ") : c;
    };
    return {
      ground: hero?.dataset.ground ?? "(unset)",
      t: v && Number.isFinite(v.duration) ? Number(v.currentTime.toFixed(2)) : null,
      dur: v && Number.isFinite(v.duration) ? Number(v.duration.toFixed(2)) : null,
      // Must stay identical to `panel` through the wipe — that is what keeps the
      // statement uncovered by the seam instead of fading across it.
      panel: cs(reveal),
      type: cs(statement),
    };
  });
  await page.screenshot({ path: path.join(OUT, `p${String(p).replace(".", "_")}.png`) });
  console.log(`p=${String(p).padEnd(5)} ${JSON.stringify(state)}`);
}

console.log("\n--- console errors ---");
console.log(errors.length ? errors.join("\n") : "none");

await browser.close();
process.exit(errors.length ? 1 : 0);
