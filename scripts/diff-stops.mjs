/**
 * Pixel-diff two screenshot folders by matching stop index prefixes (00-, 01-, …).
 * Uses ffmpeg SSIM; fails if any pair has SSIM < THRESHOLD (default 0.985).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const A = path.resolve(process.env.DIFF_A ?? "screenshots/baseline/stops");
const B = path.resolve(process.env.DIFF_B ?? "screenshots/stops");
const THRESHOLD = Number(process.env.DIFF_THRESHOLD ?? 0.985);

function listStops(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .sort()
    .map((f) => ({ index: f.slice(0, 2), file: f, path: path.join(dir, f) }));
}

const aStops = listStops(A);
const bStops = listStops(B);

if (!aStops.length || aStops.length !== bStops.length) {
  console.error(`Count mismatch: A=${aStops.length} B=${bStops.length}`);
  process.exit(1);
}

let worst = 1;
let failures = 0;

for (let i = 0; i < aStops.length; i++) {
  const a = aStops[i];
  const b = bStops[i];
  if (a.index !== b.index) {
    console.error(`Index mismatch at ${i}: ${a.file} vs ${b.file}`);
    failures++;
    continue;
  }

  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", a.path, "-i", b.path, "-lavfi", "ssim", "-f", "null", "-"],
    { encoding: "utf8" }
  );
  const out = `${result.stdout || ""}\n${result.stderr || ""}`;
  const match = out.match(/All:([0-9.]+)/);
  const ssim = match ? Number(match[1]) : 0;
  const ok = ssim >= THRESHOLD;
  if (!ok) failures++;
  if (ssim < worst) worst = ssim;
  console.log(`${a.index}  SSIM=${ssim.toFixed(5)}  ${ok ? "ok" : "DRIFT"}  (${a.file} ↔ ${b.file})`);
}

console.log(`\nworst=${worst.toFixed(5)} threshold=${THRESHOLD} failures=${failures}`);
process.exit(failures ? 1 : 0);
