import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:4328";
const OUT_DIR = path.resolve("screenshots");
fs.mkdirSync(OUT_DIR, { recursive: true });

const ROUTES = (process.env.SCREEN_ROUTES ?? "/,/works,/services,/about,/contact,/privacy").split(",");
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const SCROLL = process.env.SCREEN_SCROLL === "1";

function slug(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
}

const browser = await chromium.launch({ channel: "chrome" });
const errors = [];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(`[${viewport.name}] console: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    errors.push(`[${viewport.name}] pageerror: ${err.message}`);
  });

  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
      await page.goto(url, { waitUntil: "load", timeout: 60000 });
    });
    await page.waitForTimeout(600);

    const file = path.join(OUT_DIR, `${slug(route)}-${viewport.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`saved ${file}`);

    if (SCROLL) {
      await page.mouse.wheel(0, viewport.height * 3);
      await page.waitForTimeout(400);
      const scrollFile = path.join(OUT_DIR, `${slug(route)}-${viewport.name}-scrolled.png`);
      await page.screenshot({ path: scrollFile, fullPage: false });
      console.log(`saved ${scrollFile}`);
    }
  }

  await context.close();
}

await browser.close();

if (errors.length) {
  console.log("\n=== console/page errors ===");
  for (const e of errors) console.log(e);
} else {
  console.log("\nNo console or page errors captured.");
}
