import { chromium } from "playwright";

const BASE = process.env.SCREEN_BASE_URL ?? "http://localhost:4328";
const ROUTES = ["/", "/works", "/services", "/about", "/contact", "/privacy"];

const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const issues = [];
page.on("console", (msg) => {
  if (msg.type() === "error") issues.push(`[console] ${page.url()}: ${msg.text()}`);
});
page.on("pageerror", (err) => issues.push(`[pageerror] ${page.url()}: ${err.message}`));
page.on("response", (res) => {
  if (res.status() >= 400) issues.push(`[http ${res.status()}] ${res.url()}`);
});

for (const route of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(500);

  // scroll through the whole page in steps to trigger lazy/IO-driven behavior
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((scrollHeight * i) / steps));
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  // hover first interactive card/link if present
  const firstCard = page.locator("article").first();
  if (await firstCard.count()) {
    await firstCard.hover().catch(() => {});
    await page.waitForTimeout(300);
  }

  console.log(`checked ${route} (scrollHeight=${scrollHeight})`);
}

await browser.close();

console.log("\n=== issues ===");
if (issues.length === 0) {
  console.log("none");
} else {
  issues.forEach((i) => console.log(i));
}
