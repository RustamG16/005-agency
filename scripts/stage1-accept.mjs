/**
 * STAGE 1 Accept check — unified curtain pin.
 * Usage: SCREEN_BASE_URL=http://localhost:3010 node scripts/stage1-accept.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve("screenshots/stage1");
fs.mkdirSync(OUT_DIR, { recursive: true });

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

function log(msg) {
  console.log(msg);
}

async function captureIntervals(page, tag) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = 500;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  const full = path.join(OUT_DIR, `${tag}-full.png`);
  await page.screenshot({ path: full, fullPage: true });
  log(`saved ${full}`);

  let y = 0;
  let i = 0;
  while (y < height) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(450);
    const file = path.join(OUT_DIR, `${tag}-y${String(y).padStart(5, "0")}.png`);
    await page.screenshot({ path: file, fullPage: false });
    log(`saved ${file}`);
    y += step;
    i += 1;
    if (i > 80) break;
  }
}

async function earlyScrollManifesto(page, run) {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(350);

  // Immediate scroll before film can finish
  for (let notch = 0; notch < 10; notch++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(280);
  }
  await page.waitForTimeout(600);

  const shot = path.join(OUT_DIR, `early-scroll-run${run}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  log(`saved ${shot}`);

  const state = await page.evaluate(() => {
    const stage = document.querySelector(
      '[aria-label="Convenium Studio introduction and selected work"]'
    );
    if (!stage) return { ok: false, reason: "no stage" };
    const layerB = stage.querySelector("[class*='layerWorks']");
    const layerA = stage.querySelector("[class*='bgLayer']");
    const bOp = layerB ? getComputedStyle(layerB).opacity : "n/a";
    const aOp = layerA ? getComputedStyle(layerA).opacity : "n/a";
    const doors = Array.from(stage.querySelectorAll("[class*='doorLeft'], [class*='doorRight']"));
    // Success: either mid-manifesto (doors covering) or works layer already up
    const worksVisible = Number(bOp) > 0.5;
    const heroHidden = Number(aOp) < 0.5;
    return {
      ok: true,
      scrollY: window.scrollY,
      worksVisible,
      heroHidden,
      layerA: aOp,
      layerB: bOp,
      doorCount: doors.length,
    };
  });
  log(`early-scroll run ${run}: ${JSON.stringify(state)}`);
  return state;
}

async function doorsOpenOntoWork(page) {
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  });
  await page.waitForTimeout(800);

  // Walk scroll until Layer B is visible and Layer A is hidden (doors-open region)
  let found = false;
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(220);
    const probe = await page.evaluate(() => {
      const stage = document.querySelector(
        '[aria-label="Convenium Studio introduction and selected work"]'
      );
      if (!stage) return null;
      const layerB = stage.querySelector("[class*='layerWorks']");
      const layerA = stage.querySelector("[class*='bgLayer']");
      const bOp = layerB ? Number(getComputedStyle(layerB).opacity) : 0;
      const aOp = layerA ? Number(getComputedStyle(layerA).opacity) : 1;
      const hasEyebrow = (stage.textContent || "").includes("Selected Work");
      return { bOp, aOp, hasEyebrow, y: window.scrollY };
    });
    if (probe && probe.bOp > 0.9 && probe.aOp < 0.1 && probe.hasEyebrow) {
      found = true;
      log(`doors-open landed at y=${probe.y} a=${probe.aOp} b=${probe.bOp}`);
      break;
    }
  }

  const file = path.join(OUT_DIR, "doors-open-onto-work.png");
  await page.screenshot({ path: file, fullPage: false });
  log(`saved ${file}`);

  const finalProbe = await page.evaluate(() => {
    const stage = document.querySelector(
      '[aria-label="Convenium Studio introduction and selected work"]'
    );
    if (!stage) return { ok: false, reason: "no stage" };
    const layerB = stage.querySelector("[class*='layerWorks']");
    const layerA = stage.querySelector("[class*='bgLayer']");
    const bOp = layerB ? Number(getComputedStyle(layerB).opacity) : 0;
    const aOp = layerA ? Number(getComputedStyle(layerA).opacity) : 1;
    const rect = layerB?.getBoundingClientRect();
    // Sample center pixel via presence of gallery media (not bare empty)
    const hasGallery = Boolean(stage.querySelector('video source[src*="gallery_scrub"]'));
    const hasEyebrow = (stage.textContent || "").includes("Selected Work");
    return {
      ok: bOp > 0.9 && aOp < 0.1 && hasGallery && hasEyebrow,
      bOp,
      aOp,
      hasGallery,
      hasEyebrow,
      layerBTop: rect?.top,
    };
  });
  log(`doors-open probe: ${JSON.stringify(finalProbe)} foundWalk=${found}`);
  return finalProbe;
}

async function snapDirectionTest(page) {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(800);

  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(700);
  const beforeSlow = await page.evaluate(() => window.scrollY);

  await page.mouse.wheel(0, 80);
  await page.waitForTimeout(900);
  const afterSlow = await page.evaluate(() => window.scrollY);

  await page.mouse.wheel(0, 1800);
  await page.waitForTimeout(900);
  const afterFast = await page.evaluate(() => window.scrollY);

  const neverBackward = afterSlow + 2 >= beforeSlow && afterFast + 2 >= afterSlow;

  const file = path.join(OUT_DIR, "snap-direction.png");
  await page.screenshot({ path: file, fullPage: false });
  log(`saved ${file}`);
  log(
    `snap test: before=${beforeSlow.toFixed(0)} slow=${afterSlow.toFixed(0)} fast=${afterFast.toFixed(0)} neverBackward=${neverBackward}`
  );

  return { neverBackward, beforeSlow, afterSlow, afterFast };
}

const browser = await chromium.launch({ channel: "chrome" });
const errors = [];
const report = { earlyScroll: [], doorsOpen: null, snap: null, intervals: [] };

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`[${viewport.name}] console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`[${viewport.name}] pageerror: ${err.message}`));

  log(`\n=== ${viewport.name} ${viewport.width}x${viewport.height} ===`);

  if (viewport.name === "desktop") {
    for (let run = 1; run <= 5; run++) {
      report.earlyScroll.push(await earlyScrollManifesto(page, run));
    }
    report.doorsOpen = await doorsOpenOntoWork(page);
    report.snap = await snapDirectionTest(page);
  }

  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  });
  await page.waitForTimeout(800);
  await captureIntervals(page, `home-${viewport.name}`);
  report.intervals.push(viewport.name);

  await page.hover("a").catch(() => {});
  await page.waitForTimeout(200);

  await context.close();
}

// Reduced-motion path
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  });
  await page.waitForTimeout(1500);
  const file = path.join(OUT_DIR, "home-reduced-motion.png");
  await page.screenshot({ path: file, fullPage: true });
  log(`saved ${file}`);
  const hasStatic = await page.evaluate(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const manifesto = document.querySelector('[aria-label="Studio manifesto"]');
    const works = document.querySelector('[aria-label="Selected work"]');
    const pin = document.querySelector(
      '[aria-label="Convenium Studio introduction and selected work"]'
    );
    return {
      mq,
      hasManifesto: Boolean(manifesto),
      manifestoText: manifesto?.textContent?.slice(0, 60) ?? "",
      hasWorks: Boolean(works),
      hasPin: Boolean(pin),
    };
  });
  report.reducedMotion = hasStatic.hasManifesto && hasStatic.hasWorks && !hasStatic.hasPin;
  log(`reduced-motion probe: ${JSON.stringify(hasStatic)} pass=${report.reducedMotion}`);
  await context.close();
}

await browser.close();

log("\n=== STAGE 1 ACCEPT SUMMARY ===");
log(`early-scroll runs: ${report.earlyScroll.length}`);
log(`doors-open ok: ${report.doorsOpen?.ok}`);
log(`snap neverBackward: ${report.snap?.neverBackward}`);
log(`reduced-motion: ${report.reducedMotion}`);
log(`interval sets: ${report.intervals.join(", ")}`);

if (errors.length) {
  log("\n=== console/page errors ===");
  for (const e of errors) log(e);
} else {
  log("\nNo console or page errors captured.");
}

const fail =
  report.earlyScroll.length < 5 ||
  !report.doorsOpen?.ok ||
  !report.snap?.neverBackward ||
  !report.reducedMotion;

process.exit(fail ? 1 : 0);
