# MEDIA-GUIDE-HOME — hero film pipeline (Omni Flash)

The hero film must show the SAME robot the live page renders. That match is
guaranteed by generating the video FROM the built scene, in this order. Do not
generate the video before step 2 exists.

## §1 Pipeline order

1. Build the page per `HOME-GUIDE-SPEC.md` with the film absent (supported
   fallback state — first-frame still or ink panel).
2. Capture the first-frame still from the live scene (§2). → Marija
3. Generate the film in Omni Flash using that still, image-to-video (§3). → Marija
4. Re-encode all-keyframe (§4), drop files into `public/videos/`, wire the
   scrub. → Claude
5. Verify scrub both directions, then capture mobile poster stills (§5).

## §2 First-frame capture (Claude does this after the build)

- Dev-only helper (same idea as `__monolithProgress`): pose the recolored robot
  in "hero start" — centered-right, facing ~20° off camera, eye lit, standing
  on an unlit noir floor, warm key from upper-left, grain overlay ON.
- Playwright screenshot the canvas stage at exactly **1920×1080**, save to
  `homepage/assets/hero-first-frame.png`. This exact file is both the video
  poster AND the Omni Flash input image.

## §3 Omni Flash settings + prompt (Marija runs this)

| Setting | Value |
|---|---|
| Mode | **Image to video** (input: `hero-first-frame.png`) |
| Aspect ratio | 16:9 |
| Resolution | 1080p (1920×1080) |
| Duration | **10s** (use the max) |
| Camera | Static / locked if the option exists |

Prompt (paste as-is):

> Static locked camera, single continuous shot, no cuts. A small matte
> charcoal-black robot with one glowing red eye stands on a dark warm-black
> studio floor (#1B1717), lit by a single warm key light from the upper left,
> subtle film grain, soft contact shadow only. The robot wakes: head tilts up,
> the red eye brightens, it looks left, then right, curious. It takes two small
> steps toward the camera and gives one slow nod to the viewer. Then it turns,
> walks forward-down, and exits COMPLETELY through the bottom edge of the
> frame. Final second: the empty light pool on the floor, nothing else. Matte
> surfaces, no gloss, no reflections of color. Monochrome scene — the only
> color is the robot's red eye. No text, no logos, no lens flare, consistent
> exposure and lighting throughout.

Retry guidance: reject takes where (a) the robot's colors drift from the input
still, (b) the camera moves, (c) the robot does not fully exit the frame, or
(d) exposure pumps. The full exit is non-negotiable — it is the handoff.

## §4 All-keyframe re-encode (repo §17.1 — NEVER scrub the raw file)

Desktop scrub file:

    ffmpeg -i hero-raw.mp4 -an -vf "scale=1920:1080" -c:v libx264 -profile:v high \
      -crf 20 -preset slow -g 1 -keyint_min 1 -pix_fmt yuv420p \
      public/videos/hero-guide-scrub.mp4

Lighter variant for ≤768px intro autoplay (not scrubbed on mobile):

    ffmpeg -i hero-raw.mp4 -an -vf "scale=1280:720" -c:v libx264 \
      -crf 23 -preset slow -movflags +faststart -pix_fmt yuv420p \
      public/videos/hero-guide-mobile.mp4

Poster (first frame, for the `poster` attribute — should be pixel-identical to
`hero-first-frame.png`):

    ffmpeg -i public/videos/hero-guide-scrub.mp4 -frames:v 1 -q:v 2 \
      public/images/poster-hero-guide.jpg

Note: `-g 1` inflates file size (~every frame is a keyframe) — that is the
point; it is what makes bidirectional scrubbing frame-accurate. Expect roughly
15–35MB for 10s; acceptable for a lazy-loaded hero. If it lands heavier, raise
`-crf` toward 23 before touching `-g`.

## §5 Fallback / poster inventory

- `public/images/poster-hero-guide.jpg` — scrub poster + reduced-motion hero.
- 2–3 robot stills for mobile chapters (capture from the live scene at chapter
  poses, 2× DPR): `public/images/guide-pose-{a,b,c}.png`, transparent bg.
- The page must build and run clean if NONE of these exist yet (spec §7).
