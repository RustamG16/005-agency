/**
 * encode-preview.mjs — turn a capture-preview.mjs frame folder into shipping media.
 *
 *   node scripts/encode-preview.mjs --site sonnwerk
 *   node scripts/encode-preview.mjs --site sonnwerk --portrait
 *
 * Out:
 *   public/works/<slug>/loop.mp4           1440×810   from the landscape pass
 *   public/works/<slug>/cover.jpg          1440×810
 *   public/works/<slug>/loop-portrait.mp4   960×1200  from the --portrait pass
 *   public/works/<slug>/cover-portrait.jpg  960×1200
 *
 * Two decisions worth knowing about.
 *
 * **No crossfade wrap.** A crossfaded loop is seamless at the wrap but has no true first
 * frame — its frame 0 is a blend of the tail, so the poster can never match it and every
 * hover starts with a visible pop. These are hover loops: the handover from cover to video
 * happens on *every* hover, the wrap only if someone lingers past six seconds. So the loop
 * runs forward-only from the opening screen and `cover.jpg` is extracted from the encoded
 * clip's own frame 0 — byte-identical handover. The beat lists hold ~1 s on a still frame at
 * both ends, so the wrap is a cut between two static images rather than a motion stutter.
 *
 * **Grade after scale, before yuv420p.** Guide §6 pulls the capture ~15% toward the house
 * grade so client work doesn't fight the page. Order matters: scaling a graded frame
 * re-crushes the shadows the colorbalance just lifted.
 */

import { spawn } from "node:child_process";
import { mkdir, stat, readFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? d : argv[i + 1];
};
const has = (n) => argv.includes(`--${n}`);

const SITE = flag("site", null);
if (!SITE) throw new Error("--site is required");
const PORTRAIT = has("portrait");
/** Input rate — must match what capture-preview.mjs ran at, or the clip changes length. */
const FPS = Number(flag("fps", 60));
/**
 * Output rate. Captured at 60 so the scrub is sampled finely, delivered at 30 because a
 * six-second muted hover loop gains nothing from 60 and costs roughly double the bitrate.
 */
const FPS_OUT = Number(flag("fps-out", 30));
/**
 * Per-site CRF. Content decides this, not taste: sonnwerk's journey is drone footage of a
 * hemp field, so nearly every pixel is high-frequency leaf detail and it encodes ~3× heavier
 * than meridian's cloud sea or urologie's flat editorial layout at the same CRF. 26 brings it
 * inside budget without visible mush at the size it actually plays.
 */
const CRF_BY_SITE = { sonnwerk: 26 };
const CRF = Number(flag("crf", CRF_BY_SITE[SITE] ?? 23));
/** JPEG quality for the cover, 2 (best) – 31. 4 keeps a 1440×810 plate under budget. */
const QV = Number(flag("qv", 4));

const IN = flag("in", `qa/preview/${SITE}${PORTRAIT ? "-portrait" : ""}`);
const OUTDIR = path.resolve(`public/works/${SITE}`);

/** Guide §6 — desaturate slightly, lift the blacks, cool the highlights a touch. */
const GRADE = "eq=saturation=0.88:contrast=1.04,colorbalance=rs=-0.02:bs=0.01";
const SIZE = PORTRAIT ? { w: 960, h: 1200 } : { w: 1440, h: 810 };

const loopName = PORTRAIT ? "loop-portrait.mp4" : "loop.mp4";
const coverName = PORTRAIT ? "cover-portrait.jpg" : "cover.jpg";
const loopPath = path.join(OUTDIR, loopName);
const coverPath = path.join(OUTDIR, coverName);

await mkdir(OUTDIR, { recursive: true });

// Report what the capture thought it produced, so a size mismatch is caught here rather
// than as a soft-looking video three steps later.
try {
  const m = JSON.parse(await readFile(path.join(IN, "manifest.json"), "utf8"));
  console.log(`  capture: ${m.frames}f @ ${m.fps}fps · native ${m.native.width}×${m.native.height}`);
  if (m.native.width < SIZE.w || m.native.height < SIZE.h) {
    console.warn(
      `  ! capture is smaller than the target ${SIZE.w}×${SIZE.h} — this will upscale and look soft`
    );
  }
} catch {
  console.warn("  ! no manifest.json in the capture folder");
}

const run = (args) =>
  new Promise((res, rej) => {
    const p = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr.on("data", (d) => (err += d));
    p.on("close", (code) => (code === 0 ? res() : rej(new Error(err.slice(-2000)))));
  });

console.log(`\n→ ${loopName}`);
await run([
  "-y",
  "-framerate", String(FPS),
  "-i", path.join(IN, "%06d.jpg"),
  "-vf", `scale=${SIZE.w}:${SIZE.h}:flags=lanczos,${GRADE},fps=${FPS_OUT},format=yuv420p`,
  "-c:v", "libx264",
  "-crf", String(CRF),
  "-preset", "slow",
  "-an",
  "-movflags", "+faststart",
  loopPath,
]);

console.log(`→ ${coverName}  (frame 0 of the encode — exact handover)`);
await run(["-y", "-i", loopPath, "-frames:v", "1", "-q:v", String(QV), coverPath]);

/**
 * Size budgets. Looser than guide §5, deliberately, and here is the reasoning so the next
 * person doesn't "fix" it back down:
 *
 * §5's 1.5 MB was written for a 896×1160 card thumbnail. These are full-bleed surfaces —
 * a 100vw homepage plate and a 480px hover panel — and the footage is real client video
 * (dense foliage, drone plates) rather than the graded studio stills the guide assumed.
 * Holding 1.5 MB here means CRF 26+, which visibly mushes the detail that is the whole
 * reason the client's site looks good.
 *
 * The weight is affordable because of how these play: `preload="none"`, one video active at
 * a time (useSingleActiveVideo), and the landscape loops *replace* the shared 7.3 MB
 * columns.mp4 the site shipped before. Net bytes go down, not up.
 *
 * Over-budget is a warning, not a failure — judge it in the frame.
 */
const BUDGET_KB = PORTRAIT ? { loop: 1800, cover: 200 } : { loop: 4000, cover: 260 };
let over = false;
for (const [f, cap] of [
  [loopPath, BUDGET_KB.loop],
  [coverPath, BUDGET_KB.cover],
]) {
  const kb = (await stat(f)).size / 1024;
  const bad = kb > cap;
  over ||= bad;
  console.log(
    `  ${path.basename(f).padEnd(22)} ${kb.toFixed(0).padStart(6)} KB` +
      `  ${bad ? `! over ${cap} KB budget` : `ok (<${cap})`}`
  );
}
if (over) console.log("\n  raise --crf / --qv, or shorten the beat list.");
