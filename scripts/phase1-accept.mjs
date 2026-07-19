/**
 * Phase 1 Accept check — doors → question → split → zoom → showcase.
 * Usage: SCREEN_BASE_URL=http://localhost:3010 node scripts/phase1-accept.mjs
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:3010";
const OUT_DIR = path.resolve("screenshots/phase1");
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
    if (i > 100) break;
  }
}

async function probeOpening(page) {
  return page.evaluate(() => {
    const stage = document.querySelector(
      '[aria-label="Convenium Studio introduction and selected work"]'
    );
    if (!stage) return { ok: false, reason: "no stage" };

    const question = stage.querySelector("[class*='question']");
    const layerB = stage.querySelector("[class*='layerSplit']");
    const layerA = stage.querySelector("[class*='bgLayer']");
    const manifesto = stage.querySelector("[class*='manifestoCol']");
    const plate = stage.querySelector('img[src*="works_plate"]');
    const cta = stage.querySelector('a[href="/works"]');
    const gallery = stage.querySelector('video source[src*="gallery_scrub"]');

    const qOp = question ? Number(getComputedStyle(question).opacity) : 0;
    const bOp = layerB ? Number(getComputedStyle(layerB).opacity) : 0;
    const aOp = layerA ? Number(getComputedStyle(layerA).opacity) : 1;
    const mOp = manifesto ? Number(getComputedStyle(manifesto).opacity) : 0;
    const pOp = plate ? Number(getComputedStyle(plate).opacity) : 0;

    const text = stage.textContent || "";
    return {
      ok: true,
      scrollY: window.scrollY,
      qOp,
      bOp,
      aOp,
      mOp,
      pOp,
      hasQuestionCopy: text.includes("Are you ready to level up your design"),
      hasWelcome: text.includes("Welcome to Convenium"),
      hasGallery: Boolean(gallery),
      hasCta: Boolean(cta),
      hasPlate: Boolean(plate),
    };
  });
}

/** Reload + immediate scroll ×5 — must reach question or split, never skip. */
async function earlyScrollRun(page, run) {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(300);

  for (let notch = 0; notch < 12; notch++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(500);

  const shot = path.join(OUT_DIR, `early-scroll-run${run}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  log(`saved ${shot}`);

  const state = await probeOpening(page);
  // Pass if we are past hero into question and/or split (doors closed or open)
  const progressed =
    state.ok &&
    (state.qOp > 0.3 || state.bOp > 0.3) &&
    state.scrollY > 50;
  log(`early-scroll run ${run}: progressed=${progressed} ${JSON.stringify(state)}`);
  return { ...state, progressed };
}

/** Walk scroll through split → zoom → showcase. */
async function walkChoreography(page) {
  await page.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
    await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  });
  await page.waitForTimeout(800);

  const milestones = {
    question: false,
    split: false,
    plate: false,
    showcase: false,
  };

  for (let i = 0; i < 80; i++) {
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(200);
    const p = await probeOpening(page);
    if (!p.ok) continue;
    if (p.qOp > 0.5) milestones.question = true;
    if (p.bOp > 0.8 && p.mOp > 0.3 && p.hasWelcome) milestones.split = true;
    if (p.pOp > 0.5 && p.hasPlate) milestones.plate = true;
    if (p.pOp > 0.5 && p.hasCta) milestones.showcase = true;
  }

  const file = path.join(OUT_DIR, "choreography-end.png");
  await page.screenshot({ path: file, fullPage: false });
  log(`saved ${file}`);

  const final = await probeOpening(page);
  const ok =
    milestones.question &&
    milestones.split &&
    milestones.plate &&
    milestones.showcase &&
    final.hasGallery &&
    final.hasCta;
  log(`choreography milestones: ${JSON.stringify(milestones)} ok=${ok}`);
  return { ok, milestones, final };
}

async function snapDirectionTest(page) {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(800);

  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(180);
  }
  await page.waitForTimeout(800);
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
const report = { earlyScroll: [], choreography: null, snap: null, intervals: [] };

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
      report.earlyScroll.push(await earlyScrollRun(page, run));
    }
    report.choreography = await walkChoreography(page);
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
    const manifesto = document.querySelector('[aria-label="Studio manifesto"]');
    const works = document.querySelector('[aria-label="Selected work"]');
    const pin = document.querySelector(
      '[aria-label="Convenium Studio introduction and selected work"]'
    );
    const text = manifesto?.textContent || "";
    return {
      hasManifesto: Boolean(manifesto),
      hasQuestion: text.includes("Are you ready to level up your design"),
      hasWelcome: text.includes("Welcome to Convenium"),
      hasWorks: Boolean(works),
      hasPin: Boolean(pin),
    };
  });
  report.reducedMotion =
    hasStatic.hasManifesto &&
    hasStatic.hasQuestion &&
    hasStatic.hasWelcome &&
    hasStatic.hasWorks &&
    !hasStatic.hasPin;
  log(`reduced-motion probe: ${JSON.stringify(hasStatic)} pass=${report.reducedMotion}`);
  await context.close();
}

await browser.close();

const earlyOk = report.earlyScroll.length === 5 && report.earlyScroll.every((r) => r.progressed);

log("\n=== PHASE 1 ACCEPT SUMMARY ===");
log(`early-scroll ×5 progressed: ${earlyOk}`);
log(`choreography ok: ${report.choreography?.ok}`);
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
  !earlyOk || !report.choreography?.ok || !report.snap?.neverBackward || !report.reducedMotion;

process.exit(fail ? 1 : 0);
