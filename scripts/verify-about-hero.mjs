/**
 * verify-about-hero.mjs — scroll-state QA for the /about-v3 hero banner and
 * the re-paced journey sequence.
 *
 * Companion to `verify-about.mjs`, which covers behaviour (focus order, tap
 * targets, on-demand media). This one covers what only a driven scroll can
 * reach: it walks each section's ScrollTrigger to exact progress values and
 * captures every beat, then runs the sequence gates from the implementation
 * plan's §7 — forward and reverse scrub, resize mid-sequence, JS heap across
 * repeated full cycles, whether any <video> is instantiated at all, and 404s.
 *
 *   OUT=./shots TAG=desktop node scripts/verify-about-hero.mjs
 *   OUT=./shots TAG=mobile VW=390 VH=844 node scripts/verify-about-hero.mjs
 *   OUT=./shots TAG=reduced REDUCED=1 node scripts/verify-about-hero.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:4328";
const OUT = process.env.OUT ?? path.resolve("shots");
const REDUCED = process.env.REDUCED === "1";
const VW = Number(process.env.VW ?? 1440);
const VH = Number(process.env.VH ?? 900);
const TAG = process.env.TAG ?? "desktop";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: 1,
  reducedMotion: REDUCED ? "reduce" : "no-preference",
});
const page = await context.newPage();

const errors = [];
const requests = [];
page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("response", (r) => {
  if (r.status() >= 400) requests.push(`${r.status()} ${r.url()}`);
});
page.on("request", (r) => {
  const u = r.url();
  if (/\.(mp4|webm)$/.test(u)) requests.push(`MEDIA-REQ ${u.split("/").pop()}`);
});

await page.goto(`${BASE}/about`, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(1200);

/** Scroll so that the given ScrollTrigger id sits at `p` progress. */
async function toProgress(id, p) {
  await page.evaluate(
    ([id, p]) => {
      const ST = window.ScrollTrigger || (window.gsap && window.gsap.ScrollTrigger);
      const list = (ST && ST.getAll && ST.getAll()) || [];
      const t = list.find((x) => x.vars && x.vars.id === id);
      if (!t) return false;
      window.scrollTo(0, t.start + (t.end - t.start) * p);
      return true;
    },
    [id, p]
  );
  await page.waitForTimeout(650);
}

async function shot(name) {
  const f = path.join(OUT, `${TAG}-${name}.png`);
  await page.screenshot({ path: f });
  return f;
}

// Expose ScrollTrigger for the driver.
const hasST = await page.evaluate(() => {
  // gsap registers ScrollTrigger; find it via an existing trigger's constructor
  try {
    const mod = window.ScrollTrigger;
    return !!mod;
  } catch {
    return false;
  }
});

console.log(`[${TAG}] ScrollTrigger on window: ${hasST}`);

// Fallback driver: absolute scroll positions if ScrollTrigger isn't exposed.
const heroInfo = await page.evaluate(() => {
  const root = document.querySelector("[data-about-hero]");
  if (!root) return null;
  const r = root.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: root.offsetHeight, vh: window.innerHeight };
});
console.log(`[${TAG}] hero:`, JSON.stringify(heroInfo));

const videoCount = await page.evaluate(
  () => document.querySelectorAll("[data-about-hero] video").length
);
console.log(`[${TAG}] hero <video> elements in DOM: ${videoCount}`);

if (heroInfo) {
  // hero scroll range: start top top -> end bottom bottom
  const range = heroInfo.height - heroInfo.vh;
  const at = async (p) => {
    await page.evaluate(
      ([y]) => window.scrollTo(0, y),
      [heroInfo.top + range * p]
    );
    await page.waitForTimeout(700);
  };

  // 0.85 and 0.95 sample the panel-fill crossfade finale (true progress
  // ~0.817–1.0 once the finale beat is appended — see AboutHero.tsx), which
  // the older checkpoint list only bracketed at its very start/end.
  for (const p of [0, 0.15, 0.28, 0.32, 0.5, 0.7, 0.85, 0.95, 1.0]) {
    await at(p);
    console.log("saved", await shot(`hero-${String(p).replace(".", "_")}`));
  }

  // reverse scrub back down to 0
  for (const p of [0.7, 0.4, 0.15, 0]) {
    await at(p);
  }
  console.log(`[${TAG}] reverse scrub complete`);
}

// Journey sequence
const jInfo = await page.evaluate(() => {
  const root = document.querySelector("[data-journey]");
  if (!root) return null;
  const r = root.getBoundingClientRect();
  return {
    top: r.top + window.scrollY,
    height: root.offsetHeight,
    enhanced: root.dataset.enhanced === "true",
    vh: window.innerHeight,
  };
});
console.log(`[${TAG}] journey:`, JSON.stringify(jInfo));

if (jInfo && jInfo.enhanced) {
  const range = jInfo.height - jInfo.vh;
  for (const p of [0, 0.2, 0.4, 0.55, 0.7, 0.85, 1.0]) {
    await page.evaluate(([y]) => window.scrollTo(0, y), [jInfo.top + range * p]);
    await page.waitForTimeout(750);
    console.log("saved", await shot(`journey-${String(p).replace(".", "_")}`));
  }
  // reverse
  for (const p of [0.8, 0.6, 0.4, 0.2, 0]) {
    await page.evaluate(([y]) => window.scrollTo(0, y), [jInfo.top + range * p]);
    await page.waitForTimeout(400);
  }
  console.log(`[${TAG}] journey reverse scrub complete`);
}

/* --- gate 4: resize and orientation change mid-sequence ---------------- */
if (jInfo) {
  await page.evaluate(([y]) => window.scrollTo(0, y), [jInfo.top + (jInfo.height - jInfo.vh) * 0.45]);
  await page.waitForTimeout(400);
  await page.setViewportSize({ width: 1024, height: 1400 });
  await page.waitForTimeout(900);
  await page.setViewportSize({ width: VW, height: VH });
  await page.waitForTimeout(900);
  console.log(`[${TAG}] resize mid-sequence survived`);
  console.log("saved", await shot("after-resize"));
}

/* --- gate 6: memory across repeated full cycles -------------------------- */
const mem = [];
for (let cycle = 0; cycle < 3; cycle++) {
  for (const p of [0, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate(([f]) => window.scrollTo(0, document.body.scrollHeight * f), [p]);
    await page.waitForTimeout(220);
  }
  for (const p of [0.75, 0.5, 0.25, 0]) {
    await page.evaluate(([f]) => window.scrollTo(0, document.body.scrollHeight * f), [p]);
    await page.waitForTimeout(220);
  }
  const m = await page.evaluate(() => (performance.memory ? performance.memory.usedJSHeapSize : 0));
  mem.push(Math.round(m / 1048576));
}
console.log(`[${TAG}] JS heap MB after each full cycle: ${mem.join(" -> ")}`);

const liveVideos = await page.evaluate(() => document.querySelectorAll("video").length);
console.log(`[${TAG}] total <video> elements on page: ${liveVideos}`);

// full page bottom, then hover pass
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);
const links = await page.locator("a").all();
for (const l of links.slice(0, 12)) {
  await l.hover({ timeout: 1500 }).catch(() => {});
}
await page.waitForTimeout(400);

console.log(`\n[${TAG}] === MEDIA REQUESTS ===`);
console.log(requests.filter((r) => r.startsWith("MEDIA-REQ")).join("\n") || "(none)");
console.log(`\n[${TAG}] === HTTP >=400 ===`);
console.log(requests.filter((r) => !r.startsWith("MEDIA-REQ")).join("\n") || "(none)");
console.log(`\n[${TAG}] === CONSOLE ERRORS ===`);
console.log(errors.join("\n") || "(none)");

await browser.close();
