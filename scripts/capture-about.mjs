/**
 * capture-about.mjs — evidence capture for the /about-v3 lockup rebuild.
 *
 * Full-page and per-section shots at every target viewport, plus a console /
 * page-error / failed-request log and a small DOM audit (heading order, one
 * h1, horizontal overflow, missing alt text). Output lands under
 * `.olympus/about-v3/evidence/confirmed-lockup-fidelity/`.
 *
 *   node scripts/capture-about.mjs
 *   node scripts/capture-about.mjs --base http://localhost:4328
 *   node scripts/capture-about.mjs --only mobile
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? d : argv[i + 1];
};

const BASE = flag("base", "http://localhost:4328");
const ONLY = flag("only", null);
const OUT = path.resolve(".olympus/about-v3/evidence/confirmed-lockup-fidelity");

/** `sections: true` also emits a per-section shot for lockup comparison. */
const VIEWPORTS = [
  { name: "lockup-1680", width: 1680, height: 945, reduced: false, sections: true },
  { name: "desktop-1920", width: 1920, height: 1080, reduced: false },
  { name: "desktop-1440", width: 1440, height: 900, reduced: false },
  { name: "laptop-1024", width: 1024, height: 768, reduced: false },
  { name: "mobile-390", width: 390, height: 844, reduced: false, sections: true },
  { name: "mobile-390-reduced", width: 390, height: 844, reduced: true },
  { name: "desktop-1440-reduced", width: 1440, height: 900, reduced: true },
];

/** Section shots, keyed to the confirmed lockup each one answers to. */
const SECTIONS = [
  ["01-opening", "section:nth-of-type(1)"],
  ["03-arrival", "[aria-labelledby='about-arrival-title']"],
  ["04-analysis", "[aria-labelledby='about-analysis-title']"],
  ["05-programs", "[aria-labelledby='about-programs-title']"],
  ["06-intake", "[aria-labelledby='about-intake-title']"],
  ["07-atlas", "[aria-labelledby='about-atlas-title']"],
  ["08-proof", "[aria-labelledby='about-proof-title']"],
  ["09-cta", "[aria-labelledby='about-cta-title']"],
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const report = { base: BASE, capturedAt: new Date().toISOString(), runs: [] };

for (const vp of VIEWPORTS) {
  if (ONLY && !vp.name.includes(ONLY)) continue;

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: vp.reduced ? "reduce" : "no-preference",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const console_ = [];
  const errors = [];
  const failed = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") console_.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("requestfailed", (r) => failed.push(`${r.url()} — ${r.failure()?.errorText}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });

  await page.goto(`${BASE}/about`, { waitUntil: "networkidle", timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);

  // Walk the page so every lazy image enters the viewport and starts loading,
  // then come back to the top. Stepping matters: a single jump to the bottom
  // skips past most of them, and `img.decode()` on an image that never started
  // loading returns a promise that simply never settles.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page
    .waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20_000 })
    .catch(() => console.log("  (some images still loading — captured anyway)"));
  // Let the opening timeline finish.
  await page.waitForTimeout(2600);

  await page.screenshot({
    path: path.join(OUT, `${vp.name}-full.png`),
    fullPage: true,
    animations: "disabled",
  });

  // Section shots exist to be held against the lockups, so the fixed page
  // chrome is suppressed for them — otherwise the header and the corner guide
  // print themselves over whichever section is being captured. The full-page
  // shots above keep both.
  if (vp.sections) {
    await page.addStyleTag({
      content: "header, [class*='GuideDock'], [class*='guideDock'], [class*='Cursor_'] { visibility: hidden !important; }",
    });
  }

  for (const [label, selector] of vp.sections ? SECTIONS : []) {
    const el = page.locator(selector).first();
    if (!(await el.count())) {
      report.runs.push({ viewport: vp.name, missingSection: label });
      continue;
    }
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(320);
    await el
      .screenshot({ path: path.join(OUT, `${vp.name}--${label}.png`), animations: "disabled" })
      .catch((e) => report.runs.push({ viewport: vp.name, sectionShotFailed: label, error: String(e) }));
  }

  const audit = await page.evaluate(() => {
    const headings = [...document.querySelectorAll("main h1, main h2, main h3, main h4")].map(
      (h) => ({ tag: h.tagName, text: (h.textContent || "").trim().slice(0, 60) })
    );
    const imgs = [...document.querySelectorAll("main img")];
    return {
      h1Count: document.querySelectorAll("main h1").length,
      mainCount: document.querySelectorAll("main").length,
      headings,
      imagesTotal: imgs.length,
      imagesMissingAlt: imgs.filter((i) => i.getAttribute("alt") === null).map((i) => i.currentSrc || i.src),
      imagesBroken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      docHeight: document.documentElement.scrollHeight,
      videos: [...document.querySelectorAll("video")].map((v) => ({
        preload: v.preload,
        paused: v.paused,
        muted: v.muted,
        hasPoster: Boolean(v.poster),
      })),
    };
  });

  report.runs.push({ viewport: vp.name, reduced: vp.reduced, audit, console: console_, errors, failed });
  console.log(
    `✓ ${vp.name.padEnd(22)} h1=${audit.h1Count} overflow=${audit.horizontalOverflow} ` +
      `broken=${audit.imagesBroken.length} noAlt=${audit.imagesMissingAlt.length} ` +
      `errors=${errors.length} failed=${failed.length}`
  );

  await context.close();
}

await browser.close();
await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(`\n→ ${OUT}`);
