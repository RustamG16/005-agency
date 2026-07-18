import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:4328";
const OUT_DIR = path.resolve("screenshots", "interactions");
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const errors = [];

// --- Mobile menu test ---
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`mobile-menu pageerror: ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForTimeout(500);

  await page.getByRole("button", { name: "Menu" }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(OUT_DIR, "mobile-menu-open.png") });

  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  console.log("body overflow while menu open:", bodyOverflow);

  const activeTag = await page.evaluate(() => document.activeElement?.textContent?.trim());
  console.log("focused element on open:", activeTag);

  // Tab through and confirm focus stays trapped (loop back to first focusable)
  const focusSequence = [];
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    const el = await page.evaluate(() => document.activeElement?.textContent?.trim()?.slice(0, 30));
    focusSequence.push(el);
  }
  console.log("focus sequence:", focusSequence);

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const overlayOpenAfterEscape = await page.evaluate(() => {
    const el = document.querySelector('[role="dialog"]');
    return el?.getAttribute("data-open");
  });
  console.log("overlay data-open after Escape:", overlayOpenAfterEscape);
  await page.screenshot({ path: path.join(OUT_DIR, "mobile-menu-closed.png") });

  await context.close();
}

// --- FAQ accordion test ---
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`faq pageerror: ${e.message}`));
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.evaluate(() => document.querySelector("h2")?.scrollIntoView());
  const faqButtons = page.locator('[aria-controls^="faq-panel-"]');
  const count = await faqButtons.count();
  console.log("faq items:", count);

  const secondButton = faqButtons.nth(1);
  await secondButton.scrollIntoViewIfNeeded();
  const beforeExpanded = await secondButton.getAttribute("aria-expanded");
  await secondButton.click();
  await page.waitForTimeout(400);
  const afterExpanded = await secondButton.getAttribute("aria-expanded");
  console.log("faq[1] aria-expanded before/after click:", beforeExpanded, afterExpanded);
  await page.screenshot({ path: path.join(OUT_DIR, "faq-open.png") });

  await context.close();
}

// --- Project card hover reveal test ---
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(`card-hover pageerror: ${e.message}`));
  await page.goto(`${BASE}/works`, { waitUntil: "load" });
  await page.waitForTimeout(800);

  const card = page.locator("article").first();
  await card.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(OUT_DIR, "card-before-hover.png") });

  await card.hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, "card-after-hover.png") });

  const videoState = await card.evaluate((el) => {
    const v = el.querySelector("video");
    return { paused: v?.paused, currentTime: v?.currentTime };
  });
  console.log("card video state after hover:", JSON.stringify(videoState));

  await context.close();
}

await browser.close();

if (errors.length) {
  console.log("\n=== errors ===");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nNo page errors.");
}
