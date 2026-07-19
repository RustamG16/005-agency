# Convenium Studio — Homepage Media Guide (Google Flow)

Generation spec for the homepage media. **You generate in Google Flow (Veo)**; this
file gives the prompts, the reference image to seed each shot, aspect ratios,
durations, and the exact `public/` filename to save to. Project *card* content
(the looping project imagery) has its own file — see `SELECTED-WORKS-CARD-GUIDE.md`.

## The world (keep every shot in it)

A quiet, high-end museum/gallery. Warm bone walls (`#EEEDE8`/`#F8F7F2`), polished
concrete floor with soft reflections, one dark bronze-black artwork frame, a single
thin **gold** accent line (`#B18A46`) used at most once per shot. Cinematic, still,
expensive. Muted grade — roughly `brightness 0.78, saturate 0.78, contrast 1.08`.
No people unless a shot says so. **No text baked into any asset** (all type is added
in code).

## Global rules

- **Palette only:** noir `#050505`, bone `#EEEDE8`/`#F8F7F2`, ink `#171717`, gray
  `#777771`/`#CAC8C0`, gold `#B18A46` (≤1 use per shot). No other hues, no gradients-as-decoration, no glassmorphism.
- **Aspect:** 16:9 for full-bleed/section media; portrait 4:5 for anything that
  renders *inside* the artwork frame. Stated per shot.
- **Loops:** anything that plays behind UI must **loop seamlessly** (first frame ==
  last frame; no hard cut, no fade to black).
- **Motion:** slow and deliberate — dolly/push-ins at ≤ a few percent per second.
  Nothing whip-fast; the scrub maps motion to scroll.
- **Deliver:** MP4 (H.264, yuv420p) for video, JPG/PNG for stills. Save to the path
  given. For scrub clips also run the all-keyframe re-encode the project already uses
  (see `IMPLEMENTATION-PLAN.md`) so scrubbing is smooth.

## Reference images already in the repo (seed Flow with these)

| Use as reference | Path |
|---|---|
| Gallery frame plate (the works background) | `assets/images/Gallery_terminal_wall_design_2K_202607191843.jpeg` |
| Hero end frame | `public/images/poster-hero-end.jpg` |
| Existing gallery approach end frame | `public/images/gallery_final.jpg` |
| Existing column stills (mood) | `public/images/still-columns-*.jpg` |

**Plate geometry (reuse in code + when framing shots):** on the 16:9 plate the frame's
inner "screen" opening is ≈ **left 24.5%, top 18%, width 21%, height 47.5%** (portrait,
~4:5). The empty bone wall to the right (≈ 37%→96% width) is the text zone.

---

## SHOT LIST

### M1 — Split-section scrub (the framed video, right half of the manifesto section)

The clip that plays on the RIGHT of the split section and then, as the user keeps
scrolling, **zooms until it pins fullscreen and lands exactly on the plate
composition** (frame left, empty wall right). So this shot must *end* on a framing
that matches `Gallery_terminal_wall_design`.

- **Reference/seed:** `Gallery_terminal_wall_design_2K_202607191843.jpeg` (end frame).
- **Prompt:** *"Slow cinematic dolly forward through a minimalist museum hall toward
  a single large dark bronze-black framed artwork on a warm bone wall, polished
  concrete floor with soft reflections, one faint gold accent line inside the frame,
  soft directional gallery lighting, muted desaturated color grade, no people, no
  text. The camera glides forward and settles with the framed artwork on the left
  third and empty bone wall filling the right, holding steady on the final frame."*
- **Aspect:** 16:9. **Duration:** 8–10s. **Motion:** one continuous forward push,
  decelerating to a dead stop on the final composition.
- **Loop:** no (it's scrubbed and ends held). **Save:** `public/media/works_approach.mp4`
  + poster of the last frame → `public/images/works_approach_end.jpg`.

### M2 — Empty-frame plate variant (for rendering cards inside)

The current plate has a dark artwork inside the frame. We render project cards over
that opening, but a **cleaner near-black interior** makes the cards read better.

- **Reference/seed:** the same plate.
- **Prompt:** *"Same museum wall and dark bronze-black frame, but the interior of the
  frame is a clean near-black matte panel (#050505) with subtle soft-box reflection,
  no artwork, no gold line; warm bone wall to the right, polished concrete floor, muted
  grade, no people, no text."*
- **Aspect:** 16:9, **still** (or a 6s near-still loop with only faint light drift).
- **Save:** `public/images/works_plate.jpg` (and `works_plate.mp4` if you do the drift
  loop). Keep the inner opening at the same 24.5%/18%/21%/47.5% geometry.

### M3 — Hero end-frame upgrade *(optional)*

Only if the current hero hold frame feels weak behind the closing doors.
- **Prompt:** *"Final frame of a cinematic elevator/threshold scene, figure implied
  not shown, dusk tones pulled toward a muted bone-and-noir palette, one faint gold
  edge of light, grain, no text."* **Aspect:** 16:9. **Save:** `public/images/poster-hero-end.jpg` (overwrite).

### Section fillers (kill the empty homepage zones)

These fill the sections that currently read empty. All 16:9 unless noted, muted grade,
loop seamlessly, no text.

- **M4 — Capabilities / ServicesPreview accent.** A quiet supporting visual for the
  right column of "FIVE DISCIPLINES…". *"Extreme macro of layered paper/print samples
  and a single bronze foil edge on a bone surface, shallow depth of field, slow
  parallax drift, muted grade, no text."* Portrait 4:5 or square. **Save:**
  `public/media/cap_accent.mp4`.
- **M5 — Process/ProcessFilm b-roll** *(if that section is thin).* *"Slow overhead
  glide across a studio table: pinned brand boards, type specimens, a bronze ruler,
  monochrome palette with one gold chip, muted grade, no people, no text."* 16:9,
  8s loop. **Save:** `public/media/process_broll.mp4`.
- **M6 — Principles / statement backing.** A near-still texture so the statement
  doesn't float on flat bone. *"Barely-moving close-up of matte bone plaster wall with
  raking light, faint grain, almost imperceptible drift."* 16:9, 10s loop. **Save:**
  `public/media/principles_texture.mp4`.
- **M7 — Footer echo** *(ties to the hero, one echo only).* A ~6s, very dark, ~8%-opacity
  loop of the hero's elevator interior for the footer backdrop. **Save:**
  `public/media/footer_echo.mp4`.

---

## Save-location summary

| Asset | Path |
|---|---|
| M1 split scrub + poster | `public/media/works_approach.mp4`, `public/images/works_approach_end.jpg` |
| M2 empty-frame plate | `public/images/works_plate.jpg` (+ `public/media/works_plate.mp4`) |
| M3 hero end (optional) | `public/images/poster-hero-end.jpg` |
| M4 capabilities accent | `public/media/cap_accent.mp4` |
| M5 process b-roll | `public/media/process_broll.mp4` |
| M6 principles texture | `public/media/principles_texture.mp4` |
| M7 footer echo | `public/media/footer_echo.mp4` |

Project card imagery (inside the frame per project) is **not** here — see
`SELECTED-WORKS-CARD-GUIDE.md`.

## After generating

Drop files at the paths above, then the Phase-1 Cursor build (see
`HOMEPAGE-FIX-GUIDE.md`) swaps the placeholder media for these. Re-run the QA-loop
prompt. Keep gold to ≤3 total uses across the rendered page even though several
source clips each contain a gold accent — the code decides which surface.
