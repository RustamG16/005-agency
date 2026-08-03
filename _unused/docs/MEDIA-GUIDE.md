# Convenium Studio — Homepage Media Guide (Google Flow) · R4

Generation spec for the homepage + `/about` media. **You generate in Google Flow
(Veo for clips, Imagen for stills)**; this file gives the prompts, the reference to
seed each shot, aspect ratios, durations, seams, and the exact `public/` filename to
save to. Project *card* content (the looping project imagery) has its own file —
`SELECTED-WORKS-CARD-GUIDE.md`.

**R4 changes:** M1 is replaced (the framed dolly → a full **elevator-POV ride into
the gallery**); M2 is the **upgraded spotlight plate**; new **F1–F4** cover the
founders (the AI-orchestrator pull-back, her graphic-design + SMM shots, the
two-shot) and **S1** the AI studio. Section fillers M4–M7 are retained.

## The world — and why it's the bridge (keep every shot in it)

A quiet, high-end museum/gallery in Convenium's palette. Warm bone walls
(`#EEEDE8` / `#F8F7F2`), polished concrete floor with soft reflections, dark
bronze-black artwork frames, a single thin **gold** accent line (`#B18A46`) used at
most once per shot. Cinematic, still, expensive. **Muted grade — roughly
`brightness 0.78, saturate 0.78, contrast 1.08`.**

This grade is not just mood — it is the **cohesion bridge**. The desert hero is the
loud chromatic "before"; every shot after the doors open must already live in the
bone/noir/gold world the rest of the site is built from, so the ride *delivers* the
viewer home instead of cutting to a different look. Match this grade on every asset
below. No people unless a shot says so. **No text baked into any asset** (all type is
added in code).

## Global rules

- **Palette only:** noir `#050505`, bone `#EEEDE8` / `#F8F7F2`, ink `#171717`, gray
  `#777771` / `#CAC8C0`, gold `#B18A46` (≤1 use per shot). No other hues, no
  gradients-as-decoration, no glassmorphism, no sci-fi glow.
- **Aspect:** 16:9 for full-bleed / section media; portrait 4:5 for anything that
  renders *inside* the artwork frame; 3:4 or 4:5 for portraits (stated per shot).
- **Loops:** anything that plays behind UI must **loop seamlessly** (first frame ==
  last frame; no hard cut, no fade to black).
- **Motion:** slow and deliberate — dolly / push-ins at ≤ a few percent per second.
  Nothing whip-fast; the scrub maps motion to scroll.
- **No baked text / logos / fake awards / legible AI words / malformed type / stock
  smiles.** Type and names are added in the interface.
- **Deliver:** MP4 (H.264, yuv420p) for video, JPG/PNG for stills. For scrub clips
  also run the all-keyframe re-encode the project already uses (see
  `IMPLEMENTATION-PLAN.md`) so scrubbing is smooth.

## Reference images already in the repo (seed Flow with these)

| Use as reference | Path |
|---|---|
| Gallery frame plate (works background) | `assets/images/Gallery_terminal_wall_design_2K_202607191843.jpeg` |
| Hero end frame | `public/images/poster-hero-end.jpg` |
| Existing gallery approach end frame | `public/images/gallery_final.jpg` |
| Existing column stills (mood) | `public/images/still-columns-*.jpg` |

**Plate geometry (reuse in code + when framing shots):** on the 16:9 plate the
frame's inner "screen" opening is ≈ **left 24.5%, top 18%, width 21%, height 47.5%**
(portrait ~4:5). The empty bone wall to the right (≈ 37%→96% width) is the text zone.

---

## SHOT LIST — the opening

### M1 — Elevator-POV ride into the gallery *(replaces the old framed dolly)*

The single travelling shot that plays after the doors open. The effect: **the viewer
stepped into the elevator in the hero and rides straight out into Convenium's
gallery, all the way to the one piece that matters.**

- **First frame:** point-of-view from **inside the elevator**, doors open, looking out
  into a long minimalist gallery hall. The hall is **full of other framed art**
  (bone-and-noir abstract pieces, evenly hung, evenly lit) — a real collection, not
  an empty room. In the **far corner**, small, the **one masterpiece** is already
  visible under a faint spotlight — you can tell it's the destination.
- **Middle:** one continuous forward glide out of the lift and **through** the hall,
  passing the other art left and right (they read as good but ordinary), the corner
  piece growing as you approach.
- **Last frame:** the camera **locks on the masterpiece** and settles into the plate
  composition — the piece **left third**, empty **bone wall filling the right**. The
  masterpiece is **clearly the best in the room**: a **fancier, heavier bronze-black
  frame**, a **dedicated spotlight**, visibly more presence than the surrounding
  pieces. This last frame must match `Gallery_terminal_wall_design` so code can
  cross-fade to the still plate seamlessly.
- **Prompt:** *"First-person point of view stepping out of an open elevator into a
  long minimalist museum gallery with warm bone walls and a polished concrete floor
  with soft reflections; the hall is lined with evenly hung dark bronze-black framed
  artworks under soft directional lighting; in the far corner one larger artwork sits
  under a dedicated spotlight in a heavier ornate bronze-black frame, clearly the
  centrepiece. Slow continuous forward glide through the hall passing the other
  artworks, decelerating to a dead stop with the centrepiece on the left third and
  empty bone wall filling the right. One faint gold accent line inside the
  centrepiece frame. Muted desaturated color grade, cinematic, no people, no text."*
- **Aspect:** 16:9. **Duration:** 10–12s. **Motion:** one continuous forward push,
  decelerating to a dead stop on the final composition. **Loop:** no (scrubbed, ends
  held).
- **Grade:** the bone/noir world grade above — this is the bridge shot; get it exactly
  on palette.
- **Save:** `public/media/works_approach.mp4` + poster of the last frame →
  `public/images/works_approach_end.jpg`.

### M2 — Spotlight plate (the upgraded end-still, cards render inside)

The held destination. Same as today's plate but **upgraded**: fancier frame,
dedicated spotlight, and it must read as *the best piece in a full room*. We render
project cards over the opening, so keep a **clean near-black interior**.

- **Reference/seed:** `Gallery_terminal_wall_design`, matched to M1's last frame.
- **Prompt:** *"A single large artwork under a dedicated spotlight on a warm bone
  museum wall, in a heavy ornate dark bronze-black frame more elaborate than the
  plainer frames faintly visible further down the hall; the interior of the frame is
  a clean near-black matte panel (#050505) with a subtle soft-box reflection, one
  faint gold accent line; empty bone wall to the right; polished concrete floor with
  soft reflection; muted grade, no people, no text."*
- **Aspect:** 16:9, **still** (or a 6s near-still loop with only faint light drift).
- **Geometry:** keep the inner opening at **24.5% / 18% / 21% / 47.5%**.
- **Save:** `public/images/works_plate.jpg` (+ `public/media/works_plate.mp4` if you
  do the drift loop).

### M3 — Hero end-frame upgrade *(optional)*

Only if the current hero hold frame feels weak behind the closing doors.
- **Prompt:** *"Final frame of a cinematic elevator/threshold scene, figure implied
  not shown, dusk tones pulled toward a muted bone-and-noir palette, one faint gold
  edge of light, grain, no text."* **Aspect:** 16:9.
- **Save:** `public/images/poster-hero-end.jpg` (overwrite).

---

## SHOT LIST — the founders (new)

The story: a couple in Klagenfurt, Austria — **him** directing a semi-autonomous AI
pipeline (ex-Infineon digital engineer), **her** doing graphic design + social. These
anchor the homepage `Founders` diptych and the `/about` studio page. **Client will
supply real photos of the two of them;** generate these as the art-directed
placeholders / stylised composites now, and as the fallback if real footage isn't
used. Keep faces natural and secondary; no direct eye contact except where noted.

### F1 — The orchestrator pull-back (him)

The signature founder shot. He directs the AI army.

- **Beat:** he sits at a dark desk, **head down**, working on a single screen in a
  near-black studio. He **lifts his head**; as he does, the camera **pulls back and
  up** to reveal, ranked behind him in the dark, an **"army" of AI** — a receding
  formation of identical dim silhouetted figures / glowing monitors / a cathedral of
  server light — all facing the same way he is. He reads as the **conductor** of it.
- **Prompt:** *"A man at a dark minimalist desk in a near-black studio, lit by one
  screen, head lowered in focus; he raises his head and the camera slowly pulls back
  and rises to reveal behind him a vast receding formation of identical dim
  silhouetted figures and softly glowing monitors arranged like an orchestra in the
  dark, all oriented the same direction; he is the single lit conductor at the front.
  Warm bone key light on him, deep noir surroundings, one faint gold accent, subtle
  35mm grain, muted grade, cinematic, no text, no logos."*
- **Aspect:** 16:9. **Duration:** 6–8s. **Motion:** one slow pull-back + rise; can
  hold on the reveal. **Loop:** optional short hold-loop for ambient use.
- **Save:** `public/media/founder_orchestrator.mp4` + last-frame still →
  `public/images/founder_orchestrator.jpg`.

### F2 — Her, graphic design (the craft)

The human, tactile counterweight to F1's machine.

- **Prompt (portrait):** *"A woman graphic designer at a bone-white studio table by a
  window, reviewing a single printed sheet, aligning a layout against a metal ruler;
  around her, editorial spreads, type specimens, poster proofs and material swatches
  in noir, bone and warm gray; soft directional daylight, shallow depth of field,
  one faint gold object, muted grade, editorial, tactile, no text, no logos."*
- **Aspect:** 3:4 portrait + a companion **4:5 top-down** of the hands-on-layout
  detail for the craft strip.
- **Save:** `public/images/founder_design_portrait.jpg`,
  `public/images/founder_design_detail.jpg`.
- **Craft strip (for /about):** generate **4–5** 4:5 stills of her *output* — a poster,
  an editorial spread, a type specimen, an identity study, a packaging mock — same
  palette, no legible text/logos, abstract system-y. Save under
  `public/studio/design/craft-1.jpg … craft-5.jpg`.

### F3 — Her, social (the channel)

SMM shown as a controlled signal, not clutter.

- **Prompt (still or slow loop):** *"A calm wall of phone-format content frames — a
  grid of vertical story/post tiles in noir and bone with one gold accent — softly
  lit in a dark studio; a woman stands composed before it, arranging the brand's
  public voice; muted grade, editorial, orderly, no legible text, no logos."*
- **Plus:** a set of **6–8 individual 9:16 tiles** (abstract, palette-locked) that the
  interface stacks into the slow **content column** beside her SMM statement — these
  read as an always-on feed. Save under `public/studio/social/tile-1.jpg …
  tile-8.jpg`; wall shot → `public/images/founder_social.jpg`.
- **Aspect:** wall 16:9 or 4:5; tiles 9:16. **Motion:** if a loop, only a faint drift.

### F4 — The two-shot (the couple)

The human anchor that says "couple + studio" directly.

- **Prompt:** *"A two-person layout review at a large working table in a warm-bone,
  dark-wood studio, observed rather than posed — a couple looking together at one
  printed layout, one gold object on the table, soft window light, shallow depth of
  field, muted grade, editorial, no text, no logos."*
- **Aspect:** 4:5. **Save:** `public/images/founders_two_shot.jpg`.

### S1 — AI-generated studio interior

The environment the founders live in; also the `/about` establishing frame.

- **Prompt:** *"An empty high-end European creative studio after hours: a long shared
  bone-and-dark-wood table, print shelves, pinned identity studies on a far wall, one
  bank of dim monitors, polished concrete, warm bone light with a calm dark region
  for copy, one restrained gold detail, subtle 35mm grain, muted grade, no people, no
  text."*
- **Aspect:** 16:9. **Save:** `public/images/studio_interior.jpg` (+ optional slow
  10s drift loop `public/media/studio_interior.mp4`).

---

## Section fillers (retained — kill the empty homepage zones)

All 16:9 unless noted, muted grade, loop seamlessly, no text. Use where a section
reads thin after the whitespace pass.

- **M4 — Capabilities / ServicesPreview accent.** *"Extreme macro of layered
  paper/print samples and a single bronze foil edge on a bone surface, shallow depth
  of field, slow parallax drift, muted grade, no text."* Portrait 4:5 or square.
  **Save:** `public/media/cap_accent.mp4`.
- **M5 — HowItsMade / process b-roll.** *"Slow overhead glide across a studio table:
  pinned brand boards, type specimens, a bronze ruler, monochrome palette with one
  gold chip, muted grade, no people, no text."* 16:9, 8s loop. **Save:**
  `public/media/process_broll.mp4`.
- **M6 — Principles / statement backing.** *"Barely-moving close-up of matte bone
  plaster wall with raking light, faint grain, almost imperceptible drift."* 16:9,
  10s loop. **Save:** `public/media/principles_texture.mp4`.
- **M7 — Footer echo.** A ~6s, very dark, ~8%-opacity loop of the hero's elevator
  interior for the footer backdrop (the one hero echo). **Save:**
  `public/media/footer_echo.mp4`.

---

## Save-location summary

| Asset | Path |
|---|---|
| M1 elevator-POV ride + poster | `public/media/works_approach.mp4`, `public/images/works_approach_end.jpg` |
| M2 spotlight plate | `public/images/works_plate.jpg` (+ `public/media/works_plate.mp4`) |
| M3 hero end (optional) | `public/images/poster-hero-end.jpg` |
| F1 orchestrator pull-back | `public/media/founder_orchestrator.mp4`, `public/images/founder_orchestrator.jpg` |
| F2 her — design | `public/images/founder_design_portrait.jpg`, `founder_design_detail.jpg`, `public/studio/design/craft-1…5.jpg` |
| F3 her — social | `public/images/founder_social.jpg`, `public/studio/social/tile-1…8.jpg` |
| F4 two-shot | `public/images/founders_two_shot.jpg` |
| S1 studio interior | `public/images/studio_interior.jpg` (+ `public/media/studio_interior.mp4`) |
| M4 capabilities accent | `public/media/cap_accent.mp4` |
| M5 process b-roll | `public/media/process_broll.mp4` |
| M6 principles texture | `public/media/principles_texture.mp4` |
| M7 footer echo | `public/media/footer_echo.mp4` |

Project card imagery (inside the frame per project) is **not** here — see
`SELECTED-WORKS-CARD-GUIDE.md`.

## After generating

Drop files at the paths above, then the Phase-1/2 build (see `HOMEPAGE-FIX-GUIDE.md`)
swaps the placeholder media for these. Re-run the QA-loop prompt. Keep gold to **≤3
total rendered uses per page** even though several source clips each contain a gold
accent — the code decides which surface shows it. When the client supplies **real**
photos/clips of the two of them, swap those in over F1–F4 (keep the same crops and
palette grade so the page doesn't shift).
