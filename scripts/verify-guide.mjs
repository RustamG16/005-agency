/**
 * Track A verification for The Guide.
 *
 * Assumes a dev server is already listening. Run:
 *   SCREEN_BASE_URL=http://localhost:4329 node scripts/verify-guide.mjs
 *
 * The browser preview pane cannot verify this component — canvas,
 * requestAnimationFrame and IntersectionObserver do not run there, so a working
 * robot reads as a blank square. Real Chromium is the only honest check.
 *
 * Covers the 2026-08-03 revision: corner-locked stage, 3D platform, no clipping
 * disc, nudge-and-walk-back drag, and the appear-after-hero gate. Edge docking,
 * position persistence and drop-to-jump are retired and no longer asserted.
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:4328";
const OUT = "qa/guide";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, expectedStage: 180 },
  { name: "mobile", width: 390, height: 844, expectedStage: 130 },
];

const results = [];
const fail = (msg) => {
  results.push({ ok: false, msg });
  console.error(`  FAIL  ${msg}`);
};
const pass = (msg) => {
  results.push({ ok: true, msg });
  console.log(`  ok    ${msg}`);
};
const check = (cond, msg) => (cond ? pass(msg) : fail(msg));

/** The stage is display-hidden until you scroll past the hero, so wait on
 *  attachment rather than visibility. */
const waitForGuide = (page) =>
  page
    .waitForSelector('[data-guide-dock][data-ready="true"]', { state: "attached", timeout: 40000 })
    .then(() => true)
    .catch(() => false);

/** Lenis never settles Playwright's stability check — park it first. */
async function parkScroll(page, y) {
  await page.evaluate((target) => {
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else window.scrollTo(0, target);
  }, y);
  await page.waitForTimeout(400);
}

/** Non-transparent pixels in the canvas — catches a silently failed GLB load.
 *  Requires the renderer's preserveDrawingBuffer. */
const canvasInk = (page) =>
  page.evaluate(() => {
    const canvas = document.querySelector("[data-guide-dock] canvas");
    if (!canvas) return -1;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return -2;
    const buf = new Uint8Array(canvas.width * canvas.height * 4);
    gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    let lit = 0;
    for (let i = 3; i < buf.length; i += 4) if (buf[i] > 12) lit++;
    return lit;
  });

const stageInfo = (page) =>
  page.evaluate(() => {
    const d = document.querySelector("[data-guide-dock]");
    const b = d?.querySelector("button");
    if (!d) return null;
    const r = d.getBoundingClientRect();
    return {
      w: Math.round(r.width),
      h: Math.round(r.height),
      right: Math.round(window.innerWidth - r.right),
      bottom: Math.round(window.innerHeight - r.bottom),
      visible: d.dataset.visible,
      state: b?.dataset.state,
      ground: b?.dataset.ground,
    };
  });

async function run() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({
    args: [
      "--use-gl=swiftshader",
      "--enable-unsafe-swiftshader",
      "--enable-webgl",
      "--ignore-gpu-blocklist",
    ],
  });

  const consoleErrors = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(`[${vp.name}] ${m.text()}`);
    });
    page.on("pageerror", (e) => consoleErrors.push(`[${vp.name}] pageerror: ${e.message}`));

    console.log(`\n--- ${vp.name} ${vp.width}x${vp.height} ---`);

    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    const ready = await waitForGuide(page);
    check(ready, "guide scene reports data-ready");
    if (!ready) {
      await context.close();
      continue;
    }

    /* ---- appear-after-hero gate ---- */
    const atTop = await stageInfo(page);
    check(atTop.visible === "false", `hidden over the hero (data-visible=${atTop.visible})`);
    await page.screenshot({ path: `${OUT}/${vp.name}-hero-absent.png` });

    await parkScroll(page, vp.height * 2.2);
    await page.waitForTimeout(1200);
    const afterScroll = await stageInfo(page);
    check(afterScroll.visible === "true", `appears past the hero (data-visible=${afterScroll.visible})`);

    /* ---- geometry ---- */
    check(
      afterScroll.w === vp.expectedStage && afterScroll.h === vp.expectedStage,
      `stage is ${vp.expectedStage}px (measured ${afterScroll.w}x${afterScroll.h})`
    );
    check(
      afterScroll.right >= 0 && afterScroll.right <= 40 && afterScroll.bottom >= 0 && afterScroll.bottom <= 40,
      `locked to the bottom-right corner (right ${afterScroll.right}px, bottom ${afterScroll.bottom}px)`
    );

    const ink = await canvasInk(page);
    check(ink > 500, `robot + platform painted (${ink} lit pixels)`);
    await page.screenshot({ path: `${OUT}/${vp.name}-platform-page.png` });
    await page.locator("[data-guide-dock]").screenshot({ path: `${OUT}/${vp.name}-platform.png` });

    /* ---- hover ---- */
    // The puck specifically — the dock also holds the radial menu's buttons now.
    const puck = page.locator("[data-guide-dock] button[data-ground]");
    await puck.hover();
    await page.waitForTimeout(300);
    check((await puck.getAttribute("data-state")) === "hover", "hover registers");

    /* ---- zero-movement click ----
     * The case pointer-capture-on-pointerdown silently breaks. Must be a real
     * dispatched click, never el.click(). */
    await puck.click();
    await page.waitForTimeout(250);
    check((await puck.getAttribute("data-state")) === "menu", "zero-movement real click opens the menu");
    await puck.click();
    await page.waitForTimeout(250);
    check((await puck.getAttribute("data-state")) !== "menu", "second real click closes it");

    /* ---- nudge, then walk back to the pad ---- */
    const box = await puck.boundingBox();
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx - 45, cy - 30, { steps: 8 });
    await page.waitForTimeout(150);
    check((await puck.getAttribute("data-state")) === "dragging", "drag past threshold enters drag state");

    const nudged = await page.evaluate(() => window.__guideOffset?.() ?? null);
    await page.screenshot({ path: `${OUT}/${vp.name}-nudged.png` });
    await page.mouse.up();
    await page.waitForTimeout(1800);
    check(
      (await puck.getAttribute("data-state")) === "idle",
      "returns to idle after the walk back"
    );
    if (nudged !== null) pass(`offset while dragging: ${JSON.stringify(nudged)}`);

    /* ---- he never leaves the corner ---- */
    const afterDrag = await stageInfo(page);
    check(
      afterDrag.right === afterScroll.right && afterDrag.bottom === afterScroll.bottom,
      "stage stayed corner-locked through the drag"
    );

    /* ---- noir ground ---- */
    await page.goto(`${BASE}/about`, { waitUntil: "domcontentloaded" });
    if (await waitForGuide(page)) {
      await parkScroll(page, vp.height * 2.2);
      await page.waitForTimeout(1000);
      const about = await stageInfo(page);
      pass(`/about ground reported as "${about.ground}"`);
      await page.screenshot({ path: `${OUT}/${vp.name}-about.png` });
    } else {
      fail("guide did not become ready on /about");
    }

    await context.close();
  }

  /* ---- reduced motion ---- */
  console.log("\n--- reduced motion ---");
  const rmContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const rmPage = await rmContext.newPage();
  rmPage.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(`[reduced] ${m.text()}`);
  });
  rmPage.on("pageerror", (e) => consoleErrors.push(`[reduced] pageerror: ${e.message}`));
  await rmPage.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const rmReady = await waitForGuide(rmPage);
  check(rmReady, "guide builds under prefers-reduced-motion");
  if (rmReady) {
    await parkScroll(rmPage, 1800);
    await rmPage.waitForTimeout(800);
    const rmInk = await canvasInk(rmPage);
    check(rmInk > 500, `reduced motion still paints one static frame (${rmInk} lit pixels)`);
    await rmPage.screenshot({ path: `${OUT}/reduced-home.png` });
  }
  await rmContext.close();

  await browser.close();

  console.log("\n=== console/page errors ===");
  if (consoleErrors.length === 0) console.log("  none");
  else consoleErrors.forEach((e) => console.log(`  ${e}`));

  const failures = results.filter((r) => !r.ok);
  await writeFile(
    `${OUT}/report.txt`,
    [
      `checks: ${results.length}, failed: ${failures.length}`,
      `console errors: ${consoleErrors.length}`,
      ...failures.map((f) => `FAIL: ${f.msg}`),
      ...consoleErrors.map((e) => `ERR: ${e}`),
    ].join("\n"),
    "utf8"
  );

  console.log(`\n=== ${results.length} checks, ${failures.length} failed ===`);
  process.exit(failures.length ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
