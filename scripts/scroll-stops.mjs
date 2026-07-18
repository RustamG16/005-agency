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

const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const viewportH = HEIGHT;
const maxScroll = scrollHeight - viewportH;

for (let i = 0; i < STOPS; i++) {
  const y = Math.round((maxScroll * i) / (STOPS - 1));
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(350);
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
