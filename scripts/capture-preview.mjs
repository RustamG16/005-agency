/**
 * capture-preview.mjs — deterministic frame-render capture of a live site.
 *
 * Drives the page frame-by-frame instead of screen-recording it, so the output is
 * identical on every run and independent of machine speed. See PROJECT-PREVIEW-GUIDE.md.
 *
 *   node scripts/capture-preview.mjs --site sonnwerk               # 6s card loop, landscape
 *   node scripts/capture-preview.mjs --site sonnwerk --portrait    # 6s card loop, 4:5
 *   node scripts/capture-preview.mjs --site sonnwerk --set nav     # 28s walkthrough
 *   node scripts/capture-preview.mjs --site sonnwerk --only 5      # single beat, for tuning
 *
 * Three viewports, and they are not interchangeable. `--portrait` exists because the
 * showcase hover panel is 4:5 and guide §4a forbids cropping a desktop capture to
 * portrait — so the portrait pair is captured at a genuinely narrow viewport instead,
 * where the site lays itself out for a phone. 480×600 @ dSF 2 lands natively on 960×1200.
 *
 * Then assemble (see scripts/encode-preview.sh for the full chain):
 *   ffmpeg -framerate 60 -i qa/preview/sonnwerk/%06d.jpg \
 *     -vf "scale=1440:810:flags=lanczos,format=yuv420p" \
 *     -c:v libx264 -crf 21 -preset slow -an -movflags +faststart loop.mp4
 */

import { chromium } from "playwright";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// ─── args ────────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? d : argv[i + 1];
};
const has = (n) => argv.includes(`--${n}`);

const SITE = flag("site", "sonnwerk");
const FPS = Number(flag("fps", 60));
const MOBILE = has("mobile");
const PORTRAIT = has("portrait");
/** Which beat list to run: "card" (6 s loop) or "nav" (long walkthrough). */
const SET = flag("set", "card");
const ONLY = flag("only", null) === null ? null : Number(flag("only"));
const SUFFIX = PORTRAIT ? "-portrait" : MOBILE ? "-mobile" : "";
const OUT = flag("out", `qa/preview/${SITE}${SUFFIX}${SET === "nav" ? "-nav" : ""}`);

// Portrait is captured at 480 CSS px so the site serves its phone layout, then doubled
// by the device scale factor to land on 960×1200 natively — no upscale, no crop, no bars.
const VIEWPORT = PORTRAIT
  ? { width: 480, height: 600 }
  : MOBILE
    ? { width: 390, height: 844 }
    : { width: 1920, height: 1080 };
const DSF = PORTRAIT ? 2 : 1;

// ─── site definitions ────────────────────────────────────────────────────────
//
// Beats are declarative. `at` / `from` / `to` are *progress within the target
// section* (0..1), so a viewport change re-resolves them instead of drifting.
//
//   { kind: "hold",   target, at,        dur }
//   { kind: "glide",  target, from, to,   dur }
//   { kind: "hover",  target, at, el, video, dur }   // pointerenter + currentTime scrub
//
// End the last beat where the first began → the loop wraps with no crossfade.
//
// `sequences[]` warms canvas image sequences before frame 0. `videos[]` names videos
// that play on their own (autoplay/loop); they get paused at load and driven off the
// capture clock every frame, same as a hover video — otherwise they advance on the wall
// clock and two runs differ.
//
// `beats` is the 6 s card loop. `navBeats` is the long walkthrough (guide §4b).

const SITES = {
  sonnwerk: {
    url: "https://rustamg16.github.io/002-sonnwerk/",
    // Preload the canvas image sequence before frame 0, or the capture records
    // stale/blank canvas frames (the site streams every 8th frame first).
    sequences: [
      { base: "/002-sonnwerk/media/journey/frame_", pad: 4, ext: ".webp", count: 384 },
    ],
    // One idea: the field → harvest ride. 6.0 s.
    //
    // `to` is set by the source sequence's own frame rate, not by how much of the section
    // fits. The journey is 384 frames authored at 24 fps, so advancing 0.33 of it across
    // 4 s runs at ~32 sequence-frames/s — near native. An earlier cut at 0.60 ran it at
    // ~57/s and read as a fast-forward.
    //
    // 0.33 rather than 0.30 because the stage crossfade is scroll-driven: holding at 0.30
    // parks mid-fade with the hero headline still ghosted over the harvest copy.
    beats: [
      { kind: "hold", target: "section.journey", at: 0.0, dur: 1.0, label: "opening screen" },
      { kind: "glide", target: "section.journey", from: 0.0, to: 0.33, dur: 4.0, label: "the ride" },
      { kind: "hold", target: "section.journey", at: 0.33, dur: 1.0, label: "settle" },
    ],
    navBeats: [
      { kind: "hold", target: "section.journey", at: 0.0, dur: 1.2, label: "hero" },
      { kind: "glide", target: "section.journey", from: 0.0, to: 1.0, dur: 8.0, label: "the ride" },
      { kind: "glide", target: ".paper-section.warum", from: 0.0, to: 1.0, dur: 3.0, label: "principles" },
      { kind: "glide", target: "section.cats", from: 0.0, to: 0.15, dur: 1.4, label: "grid in" },
      { kind: "hold", target: "section.cats", at: 0.15, dur: 1.0, label: "grid hold" },
      {
        kind: "hover",
        target: "section.cats",
        at: 0.15,
        el: "section.cats a:nth-of-type(1)",
        video: "section.cats a:nth-of-type(1) video",
        dur: 2.5,
        label: "hover: Öl",
      },
      {
        kind: "hover",
        target: "section.cats",
        at: 0.15,
        el: "section.cats a:nth-of-type(4)",
        video: "section.cats a:nth-of-type(4) video",
        dur: 2.0,
        label: "hover: Balsam",
      },
      { kind: "glide", target: "section.dogband", from: 0.0, to: 1.0, dur: 2.2, label: "dog band" },
      { kind: "glide", target: ".paper-act", from: 0.0, to: 0.25, dur: 1.6, label: "gallery in" },
      { kind: "hold", target: ".paper-act", at: 0.25, dur: 0.8, label: "gallery hold" },
      { kind: "hold", target: ".paper-act", at: 0.65, dur: 2.0, label: "voices" },
      { kind: "glide", target: "section.trust", from: 0.0, to: 1.0, dur: 2.3, label: "trust + footer" },
    ],
  },

  meridian: {
    url: "https://rustamg16.github.io/003-meridian-mvp/",
    // Three sequences on the site; only `hero` is on the card-loop path. The other two
    // (dining 120+, spa 84+) drive the `.scrub-teaser` sections — warm them too if a beat
    // ever scrolls there, or the canvas records blank.
    sequences: [
      { base: "/003-meridian-mvp/frames/hero/frame_", pad: 4, ext: ".webp", count: 181 },
    ],
    // One idea: the ARRIVAL — descending through the cloud sea onto the resort. The
    // wordmark sits in a DOM overlay, which is exactly why this is captured in a browser
    // rather than rebuilt from the frames with ffmpeg. 6.0 s.
    beats: [
      { kind: "hold", target: "#top", at: 0.0, dur: 1.0, label: "opening screen" },
      { kind: "glide", target: "#top", from: 0.0, to: 0.55, dur: 4.0, label: "the arrival" },
      { kind: "hold", target: "#top", at: 0.55, dur: 1.0, label: "settle" },
    ],
  },

  "sr-urologie": {
    url: "https://sr-urologie.netlify.app/",
    // Plain DOM, no sequence. The hero film autoplays and loops (8 s, 1920×1080) — it is
    // the only motion the hero has, so it carries the opening beat while the page holds
    // still. Driven off the capture clock via `videos` below.
    videos: [".hero-video"],
    beats: [
      { kind: "hold", target: "#top", at: 0.0, dur: 2.5, label: "opening screen" },
      { kind: "glide", target: "#leistungen", from: 0.0, to: 0.5, dur: 2.0, label: "leistungen" },
      { kind: "glide", target: "#galerie", from: 0.0, to: 0.35, dur: 1.5, label: "galerie" },
    ],
  },

  // Serving an unbuilt Vite index (requests /src/main.tsx, renders blank) — capture will
  // record a white page until the Pages deploy is fixed. Cover plates are built from repo
  // assets in the meantime; see PROJECT-PREVIEW-GUIDE.md.
  education4students: {
    url: "https://rustamg16.github.io/education-hub-connect/",
    beats: [],
  },

  // Fill these in after running the three probes in PROJECT-PREVIEW-GUIDE.md §8.
  russolutions: { url: "https://russolutions.netlify.app/", beats: [] },
};

const cfg = SITES[SITE];
if (!cfg) throw new Error(`Unknown site "${SITE}". Known: ${Object.keys(SITES).join(", ")}`);

const beatSet = SET === "nav" ? cfg.navBeats : cfg.beats;
if (!beatSet?.length) throw new Error(`No "${SET}" beats defined for "${SITE}" yet — see guide §8.`);

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ─── run ─────────────────────────────────────────────────────────────────────

const outDir = path.resolve(OUT);
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: [
    "--hide-scrollbars",
    "--force-color-profile=srgb",
    "--disable-features=PaintHolding",
    "--autoplay-policy=no-user-gesture-required",
  ],
});
const page = await browser.newPage({
  viewport: VIEWPORT,
  deviceScaleFactor: DSF,
  reducedMotion: "no-preference",
  colorScheme: "light",
});

console.log(
  `→ ${cfg.url}  @ ${VIEWPORT.width}×${VIEWPORT.height} ×${DSF}` +
    `  ${FPS}fps  set=${SET}`
);
await page.goto(cfg.url, { waitUntil: "networkidle", timeout: 90_000 });

// 1. neutralise smooth-scroll hijack --------------------------------------------------
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  try {
    if (window.lenis && typeof window.lenis.destroy === "function") window.lenis.destroy();
  } catch {}
});

// 2. warm fonts ------------------------------------------------------------------------
await page.evaluate(() => document.fonts.ready);

// 3. warm the canvas image sequences ---------------------------------------------------
for (const s of cfg.sequences ?? []) {
  const loaded = await page.evaluate(async (s) => {
    const jobs = [];
    for (let i = 1; i <= s.count; i++) {
      const id = String(i).padStart(s.pad, "0");
      jobs.push(
        new Promise((res) => {
          const img = new Image();
          img.onload = () => res(1);
          img.onerror = () => res(0);
          img.src = `${s.base}${id}${s.ext}`;
        })
      );
    }
    return (await Promise.all(jobs)).reduce((a, b) => a + b, 0);
  }, s);
  console.log(`  sequence warmed: ${loaded}/${s.count}  ${s.base}`);
  if (loaded < s.count) throw new Error(`Sequence ${s.base} incomplete — refusing to capture.`);
}

// 3b. pin every self-playing video ------------------------------------------------------
// Autoplay/loop videos advance on the wall clock, so they are the one thing left that
// makes two runs differ. Pause them here; §6 sets currentTime per frame.
for (const sel of cfg.videos ?? []) {
  const info = await page.evaluate(async (sel) => {
    const v = document.querySelector(sel);
    if (!v) return null;
    v.muted = true;
    v.preload = "auto";
    if (v.readyState < 2) {
      await new Promise((r) => {
        v.addEventListener("loadeddata", r, { once: true });
        setTimeout(r, 8000);
      });
    }
    v.pause();
    v.currentTime = 0;
    return { dur: v.duration, w: v.videoWidth, h: v.videoHeight };
  }, sel);
  if (!info) throw new Error(`Video not found: ${sel}`);
  console.log(`  video pinned: ${sel}  ${info.dur}s  ${info.w}×${info.h}`);
}

// 4. warm every hover video used by a beat --------------------------------------------
for (const b of beatSet.filter((b) => b.kind === "hover")) {
  await page.evaluate(async (sel) => {
    const v = document.querySelector(sel);
    if (!v) return;
    v.preload = "auto";
    v.muted = true;
    v.load();
    await new Promise((r) => {
      if (v.readyState >= 2) return r();
      v.addEventListener("loadeddata", r, { once: true });
      setTimeout(r, 8000);
    });
    v.pause();
  }, b.video);
}

// 5. resolve section geometry ---------------------------------------------------------
const geom = await page.evaluate((targets) => {
  const out = {};
  for (const sel of targets) {
    const el = document.querySelector(sel);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    out[sel] = { top: Math.round(r.top + scrollY), height: Math.round(r.height) };
  }
  out.__doc = {
    height: document.documentElement.scrollHeight,
    max: document.documentElement.scrollHeight - innerHeight,
  };
  return out;
}, [...new Set(beatSet.map((b) => b.target))]);

console.table(geom);

// progress within a section → absolute scrollY, clamped to the document
const resolve = (sel, p) => {
  const g = geom[sel];
  if (!g) throw new Error(`Beat target not found: ${sel}`);
  const travel = Math.max(0, g.height - VIEWPORT.height);
  return Math.min(g.top + travel * p, geom.__doc.max);
};

// 6. capture ---------------------------------------------------------------------------
const beats = ONLY === null ? beatSet : [beatSet[ONLY - 1]];
let frame = 0;
const manifest = [];

for (const [i, b] of beats.entries()) {
  const n = Math.max(1, Math.round(b.dur * FPS));
  const startFrame = frame;

  if (b.kind === "hover") {
    await page.evaluate((y) => window.scrollTo(0, y), resolve(b.target, b.at));
    await settle(page);
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      el?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }));
      el?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      el?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    }, b.el);
  }

  for (let f = 0; f < n; f++) {
    const p = n === 1 ? 0 : f / (n - 1);

    if (b.kind === "glide") {
      const y = resolve(b.target, b.from + (b.to - b.from) * easeInOutCubic(p));
      await page.evaluate((v) => window.scrollTo(0, v), Math.round(y));
    } else if (b.kind === "hold") {
      await page.evaluate((v) => window.scrollTo(0, v), Math.round(resolve(b.target, b.at)));
    } else if (b.kind === "hover") {
      await page.evaluate(
        ([sel, t]) => {
          const v = document.querySelector(sel);
          if (v) {
            v.pause();
            v.currentTime = Math.min(t, (v.duration || t) - 0.001);
          }
        },
        [b.video, p * b.dur]
      );
    }

    // Drive CSS/WAAPI animations off the capture clock, not the wall clock.
    await page.evaluate((tMs) => {
      for (const a of document.getAnimations()) {
        try {
          a.pause();
          a.currentTime = tMs;
        } catch {}
      }
    }, ((startFrame + f) / FPS) * 1000);

    // Same treatment for self-playing videos: wrap on their own duration so an 8 s film
    // under a 6 s capture reads as continuous rather than freezing at the end.
    if (cfg.videos?.length) {
      await page.evaluate(
        ([sels, t]) => {
          for (const sel of sels) {
            const v = document.querySelector(sel);
            if (!v || !v.duration) continue;
            v.pause();
            v.currentTime = t % v.duration;
          }
        },
        [cfg.videos, (startFrame + f) / FPS]
      );
    }

    await settle(page);
    await page.screenshot({
      path: path.join(outDir, `${String(frame + 1).padStart(6, "0")}.jpg`),
      type: "jpeg",
      quality: 95,
      animations: "disabled",
    });
    frame++;
  }

  if (b.kind === "hover") {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      el?.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }));
      el?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
    }, b.el);
  }

  manifest.push({ beat: i + 1, label: b.label, kind: b.kind, frames: n, first: startFrame + 1, last: frame });
  console.log(`  ${String(i + 1).padStart(2)}. ${(b.label ?? b.kind).padEnd(18)} ${String(n).padStart(4)}f  → ${frame}`);
}

await writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      site: SITE,
      url: cfg.url,
      set: SET,
      viewport: { ...VIEWPORT, deviceScaleFactor: DSF },
      native: { width: VIEWPORT.width * DSF, height: VIEWPORT.height * DSF },
      fps: FPS,
      frames: frame,
      geom,
      beats: manifest,
    },
    null,
    2
  )
);

await browser.close();

const secs = (frame / FPS).toFixed(2);
console.log(`\n✓ ${frame} frames · ${secs}s @ ${FPS}fps → ${outDir}`);
console.log(`\n  node scripts/encode-preview.mjs --site ${SITE}${PORTRAIT ? " --portrait" : ""}`);

/** Two rAFs: one for the site's scroll handler, one for paint to land. */
async function settle(pg) {
  await pg.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
  );
}
