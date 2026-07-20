import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:4328";
const ROUTE = process.env.SCREEN_ROUTE ?? "/";
const STOPS = Number(process.env.SCREEN_STOPS ?? 14);
const WIDTH = Number(process.env.SCREEN_WIDTH ?? 1440);
const HEIGHT = Number(process.env.SCREEN_HEIGHT ?? 900);
const OUT_DIR = path.resolve("screenshots", "stops");
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: WIDTH, height: HEIGHT } });
const page = await context.newPage();
const errors = [];
page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
page.on("pageerror", (err) => errors.push(err.message));

await page.goto(`${BASE}${ROUTE}`, { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(500);
// Wait for Lenis mount when SmoothScroll is present (home/interior layouts)
await page.waitForFunction(() => !document.documentElement.classList.contains("lenis") || window.__lenis, {
  timeout: 5000,
}).catch(() => {});

// Freeze ambient motion so diffs measure scrub choreography, not autoplay/CSS pulse noise.
await page.addStyleTag({
  content: [
    "*, *::before, *::after { animation: none !important; transition: none !important; }",
    // Grain/cursor off for choreography diffs (verification protocol)
    "[class*='grain'], [class*='Grain'], [class*='cursor'], [class*='Cursor'] { opacity: 0 !important; visibility: hidden !important; }",
  ].join("\n"),
});
await page.evaluate(() => {
  document.querySelectorAll("video").forEach((v) => {
    try {
      v.pause();
      // Hero autoplay: pin to first frame. Scrub video is re-seeked by ScrollTrigger on scroll.
      if (v.className.includes("video") || v.autoplay) {
        v.currentTime = 0;
      }
    } catch {
      /* ignore */
    }
  });
});
await page.waitForTimeout(200);

const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const viewportH = HEIGHT;
const maxScroll = scrollHeight - viewportH;

for (let i = 0; i < STOPS; i++) {
  const y = Math.round((maxScroll * i) / (STOPS - 1));
  await page.evaluate((y) => {
    if (window.__lenis) {
      window.__lenis.scrollTo(y, { immediate: true });
    } else {
      window.scrollTo(0, y);
    }
  }, y);
  // Scrub: 0.3 + Lenis settle — give ScrollTrigger time to catch up
  await page.waitForTimeout(500);
  const file = path.join(OUT_DIR, `${String(i).padStart(2, "0")}-y${y}.png`);
  await page.screenshot({ path: file });
  console.log(`saved ${file}`);
}

await browser.close();

if (errors.length) {
  console.log("\n=== errors ===");
  errors.forEach((e) => console.log(e));
} else {
  console.log("\nNo console/page errors.");
}
