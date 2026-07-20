import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:3012";
const OUT = path.resolve("screenshots");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const errors = [];

// --- reduced motion ---
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`rm console: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`rm page: ${e.message}`));
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(800);
  const rm = await page.evaluate(() => ({
    hasLenisClass: document.documentElement.classList.contains("lenis"),
    hasLenisInstance: Boolean(window.__lenis),
    hasStaticBeats: Boolean(document.querySelector('[class*="beatsStatic"]')),
    hasStaticWorks: Boolean(document.querySelector('[class*="staticWrap"]')),
    hasPinStage: Boolean(document.querySelector('[class*="OpeningSequence_stage"]')),
  }));
  await page.screenshot({ path: path.join(OUT, "reduced-motion-hero.png") });
  console.log("reduced-motion", rm);
  const pass =
    !rm.hasLenisClass &&
    !rm.hasLenisInstance &&
    rm.hasStaticBeats &&
    rm.hasStaticWorks &&
    !rm.hasPinStage;
  console.log("reduced-motion pass:", pass);
  if (!pass) errors.push("reduced-motion probe failed");
  await ctx.close();
}

// --- keyboard jump with Lenis ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`desk console: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`desk page: ${e.message}`));
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await page.waitForFunction(() => window.__lenis, { timeout: 8000 });
  const before = await page.evaluate(() => window.scrollY);
  const sr = page.locator('[class*="srLink"]').nth(1);
  await sr.focus();
  await page.waitForTimeout(1400);
  const after = await page.evaluate(() => ({
    y: window.scrollY,
    hasLenis: Boolean(window.__lenis),
  }));
  await page.screenshot({ path: path.join(OUT, "keyboard-jump-case.png") });
  console.log("keyboard-jump", { before, ...after });
  if (!(after.hasLenis && after.y > before + 400)) {
    errors.push(`keyboard jump did not advance scroll (before=${before} after=${after.y})`);
  }
  await ctx.close();
}

// --- hover / scroll console cleanliness ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`hover console: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`hover page: ${e.message}`));
  await page.goto(BASE + "/", { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(400);
  const services = page.locator('section[aria-label="Services overview"]');
  await services.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const row = services.locator("a").first();
  if (await row.count()) await row.hover({ force: true });
  await page.waitForTimeout(200);
  const faqSection = page.locator('section[aria-label="Frequently asked questions"]');
  await faqSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const faq = faqSection.locator("button").nth(1);
  if (await faq.count()) await faq.click({ force: true });
  await page.waitForTimeout(300);
  await ctx.close();
}

await browser.close();

if (errors.length) {
  console.log("\n=== failures ===");
  errors.forEach((e) => console.log(e));
  process.exit(1);
}
console.log("\nAll home elevation probes passed.");
