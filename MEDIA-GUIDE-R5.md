# Convenium Studio — R5 addendum: M1/M2 opening, red accent, Seedance 2 workflow

Supersedes M1/M2 in `MEDIA-GUIDE.md` (R4). Generation moves from Google Flow to
**Seedance 2.0** (720p tier). Accent is now **oxblood red**, not gold.

## R5 decisions (locked)

- **Accent:** ~~`--color-accent: #9E2B2B` (oxblood) on bone; `--color-accent-on-noir:
  #C1554D` on noir.~~ **Superseded.** The reds are now cherry `#810100`, maroon `#630000`,
  chili `#D73B3E` and chili-300 `#E5595C`, with fixed roles — see `DESIGN.md` → Red rule,
  which `CLAUDE.md` names as the only source of visual values. Gold `#B18A46` stays retired.
  Same ≤3-rendered-uses-per-page rule.
- **Motif — the thin slash of light.** One shape, three appearances: the red seam
  between the elevator doors (hero) → the red diagonal line across the masterpiece
  canvas (M2) → thin red hairlines in UI (nav-active underline, section rules,
  scroll-progress). All the same red.
- **Layout — centered masterpiece.** The artwork hangs dead-center on the *end wall*
  of the hall (one-point perspective), text zones left AND right. Replaces the R4
  left-third plate.

## Why centered wins for the scrub

The ride and the zoom happen along the hall's center axis, so optical flow is
radial and symmetric — no lateral parallax, no drift, reads smooth even when the
scroll speed varies. Text columns split apart (left column slides left, right slides
right, both fade) as the camera closes in — a strong, cheap-to-code effect that a
left-third layout can't do. The final push *into* the frame opening is done in
code (CSS transform scale on the still plate), so it stays pixel-crisp at any zoom.

### Plate geometry (centered, 16:9)

- Inner opening: portrait, **left 39.5%, top 18%, width 21%, height 47.5%**
  (opening center = 50% / 41.75%). On a 1920×1080 plate that's ≈ 403×513px,
  ratio 0.786 — matches the 448×580 card (0.772) almost exactly.
- **Card loop media:** Seedance 2 has no 4:5 output — generate case-study loops at
  **3:4**, center-crop ~3% of height to 448:580. Applies to generated loops only: the
  Selected Works cards now carry captures of real sites at 1440×810 and 960×1200, made by
  `scripts/capture-preview.mjs` — see `PROJECT-PREVIEW-GUIDE.md` §5.
- Text zones: **left 5%→35%**, **right 65%→95%** (light type on dark wall).
- Vanishing point dead center; horizon locked at ~55% height.

### The red slash is NOT baked into any asset

The canvas interior stays clean matte near-black in both stills and the ride —
cards would cover a painted slash anyway. The slash is a **DOM element**: it draws
itself diagonally across the empty canvas when the ride settles (motif appearance
#2), then wipes out as the first project card fades in. Code decides where the
accent shows; assets stay accent-free.

### Look target (locked to user reference, Brera-style)

Dark, moody museum wall — **not** bone. Warm deep gray (`#171717` ink family)
falling to near-noir at the frame edges; a single soft spotlight cone from above
is the only light source; the artwork is the brightest object in frame. Dark
polished tile floor with soft reflections. Optional: one thin low dark floor rail
(elegant single-bar, not velvet ropes). Bone `#EEEDE8` is retired from this
section — it belongs to the light sections of the site.

## Scrub research — what the asset must obey

- **Constant-speed motion in the asset; easing in code.** The scroll→currentTime
  mapping applies the deceleration. If the video also decelerates you get
  double-easing mush and a "dead" first half. Prompt for *constant slow dolly*.
- **One axis, one move.** Straight forward dolly only. No pan, tilt, shake, or rack
  focus — every frame is viewed as a paused still.
- **No motion blur, no flicker, no exposure shifts.** Constant lighting throughout.
- **All-keyframe re-encode** (`IMPLEMENTATION-PLAN.md` §17.1) stays mandatory.
- **Pin length:** ~100vh of scroll per 3–4s of footage → 10–12s ride ≈ 300–350vh.
- **No audio** — scrubbed video is muted; ignore Seedance's native audio.
- Canvas image-sequence fallback stays the option for Safari/mobile if currentTime
  scrubbing stutters in QA.

## Seedance 2.0 — confirmed limits (checked 2026-07)

- i2v with **native first + last frame conditioning** (`end_image_url`).
- Clip length 4–15s; aspect 21:9 / 16:9 / 4:3 / 1:1 / 3:4 / 9:16.
- 480p/720p/1080p tiers (we're capped at **720p** → upscale pipeline below).
- References via @Image tags; multi-shot in one prompt (not needed here).

## Generation order (anchor-first)

**Step A — generate M2 plate still first.** This is the single source of truth;
everything else is conditioned on it.

> **M2 FRAME prompt (16:9 still, seed with the user's Brera reference image):**
> "A dark, hushed museum gallery at night, matching the reference photo's mood and
> lighting: a vast deep warm-gray wall (#171717) falling to near-black at the
> edges, a single portrait-orientation artwork hanging dead center, slightly above
> eye level, lit by one soft dramatic spotlight cone from above — the artwork is
> the only bright object in the scene; heavy ornate dark bronze-black frame with
> faint worn bronze highlights, museum-grade, not gilded, no glow; inside the
> frame a clean empty matte near-black panel (#050505), nothing painted on it; a
> single thin low dark rail on the floor in front; dark polished tile floor with
> soft spotlight reflection; generous empty dark wall either side; no people, no
> text, no other artworks on this wall; muted desaturated cinematic grade, subtle
> 35mm grain, expensive, still."

Save: `public/images/works_plate.jpg`. Verify opening geometry against the numbers
above before proceeding; regenerate until it lands (this is cheaper than fixing M1).

**Step B — generate the elevator-POV first frame.**

> **M1-start FRAME prompt (16:9 still):**
> "First-person view from inside a dim elevator, dark bronze-black interior, doors
> fully open framing a long symmetrical minimalist museum hall in warm bone
> (#EEEDE8), polished concrete floor with soft reflections; evenly hung dark-framed
> artworks line both side walls; far away on the end wall, small and dead-center, a
> single larger artwork under a dedicated spotlight — near-black canvas with one
> thin oxblood red diagonal line; one-point perspective, vanishing point dead
> center; muted desaturated grade, subtle 35mm grain, no people, no text."

Save: `public/images/works_approach_start.jpg`.

**Step C — generate the ride (M1), first+last conditioned.**

> **M1 MOTION prompt (i2v, first frame = @Image1 elevator POV, `end_image_url` =
> @Image2 plate, 12s, 16:9, 720p):**
> "Starting from @Image1 and ending exactly on @Image2: a single continuous
> straight forward dolly at constant slow speed along the exact center axis of the
> hall, gliding out of the elevator and down the gallery, side artworks passing
> evenly left and right; camera height and horizon locked, no pan, no tilt, no
> handheld shake, no speed changes, lighting constant throughout; final composition
> matches the end frame exactly. No motion blur, no people, no flicker, no
> warping, no text."

**Step C-fallback — the reverse trick** (if the last second drifts off the plate):
generate the *pull-back* with the plate as the FIRST frame — "single continuous
straight backward dolly at constant slow speed away from the artwork, ending inside
the dim elevator, doors framing the view" (same constraints) — then reverse in
post. Guarantees a pixel-perfect final frame for the crossfade. Static hall =
reversed footage is undetectable.

## Post pipeline (720p source)

```bash
# 1. (fallback only) reverse
ffmpeg -i ride_raw.mp4 -vf reverse -an ride_fwd.mp4
# 2. upscale 720p → 1440p (Higgsfield upscale_video 2K, or Topaz / Real-ESRGAN)
# 3. grade + grain AFTER upscale (grain stays crisp at final res)
# 4. all-keyframe scrub encode
ffmpeg -i ride_1440_graded.mp4 -an -c:v libx264 -g 1 -crf 18 \
  -pix_fmt yuv420p -movflags +faststart works_approach.mp4
# 5. extract the true end frame as the plate poster
ffmpeg -sseof -0.1 -i works_approach.mp4 -frames:v 1 -q:v 2 works_approach_end.jpg
```

Upscaler caveat: AI upscale invents detail — fine on walls/floor/light, weakest on
ornate filigree. Keep the frame's ornament bold and simple, not lace-fine.

## Scroll choreography (code side)

1. Hero doors close → red seam (the motif's first appearance).
2. Pin section ~350vh; scrub `works_approach.mp4` linearly with eased mapping
   (ease-out on the last 15% so the arrival settles).
3. At progress 1.0, crossfade video → `works_plate.jpg` (identical frame).
4. Continue scroll: text columns split left/right + fade; CSS scale transform
   pushes into the frame opening until it fills the viewport.
5. Works cards render inside the near-black opening (`#050505` matches the card
   backdrop — seamless).
6. Red hairline (nav underline / progress bar) persists — motif's third appearance.

## Open item — hero regeneration

The hero's cyan/purple neon now clashes with the red world. Two options:
(a) regenerate hero with neon shifted warm-red/amber, or (b) keep cold neon as the
chromatic "before" and let the red door-seam be the single bridge. Decide before
regenerating the hero; (b) costs nothing and strengthens the motif story.
