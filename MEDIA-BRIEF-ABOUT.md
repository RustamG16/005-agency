# Media brief — /about (The Monolith)

The page ships **complete without any of these files**. Every surface listed here already
has a code-drawn placeholder that is token-true and looks intentional (ported verbatim
from `about_us/Monolith Preview.dc.html`). Drop a real file at the exact path below and
it takes over automatically — no code change, no rebuild logic.

How the swap works: optional URLs are probed with `fetch(..., { method: "HEAD" })` before
anything is attached to the DOM or to a texture loader. A missing file leaves the
placeholder in place — the JS never throws, though the browser's own network panel still
logs a 404 for the probe itself (a DevTools artifact of the technique, not an app error).

---

## 1. Fracture plates — the exploded shard faces (chapter 3)

Seven bone-ground, ink-graphic plates ride the front shard layer and fade in as the
monolith explodes. Six of them (kinds 0–5) are real-file overrides; the seventh (the
X-box, kind 6) always stays code-drawn — there's no `plate-07.jpg` slot.

| Path | Placeholder currently shown |
|---|---|
| `public/images/about/plates/plate-01.jpg` | Ruled lines + two stacked bars — kind 0 |
| `public/images/about/plates/plate-02.jpg` | 448 × 580 face-ratio spec box — kind 1 |
| `public/images/about/plates/plate-03.jpg` | Giant cropped "C" — kind 2 |
| `public/images/about/plates/plate-04.jpg` | Five stacked bars — kind 3 |
| `public/images/about/plates/plate-05.jpg` | Dot grid — kind 4 |
| `public/images/about/plates/plate-06.jpg` | 12-column grid + label — kind 5 |
| — (always code-drawn, no override) | Cross-box + circle — kind 6 |

**Specs:** 1:1 square, **1024×1024**, JPG, ≤250 KB each. No red anywhere (the accent is
code-only). No faces. Text is fine — these are brand plates.

**Best source: your own work.** Real crops from Convenium projects — a logo lockup, a
poster, a packaging flat, a type specimen — square-cropped and graded below beat anything
generated.

If you want generated stand-ins, the plates want to look *printed*, not *rendered*. Six
distinct subjects, one per plate, so the fracture doesn't repeat itself:

> **Plate 01 — type specimen sheet:** A single printed type specimen sheet lying flat on a
> plain seamless backdrop — a full alphabet and numeral set in a bold display face, set at
> three sizes, printed in near-black ink on warm off-white paper — shot straight down,
> even soft studio light, no shadows falling across the sheet, monochrome only — near-black
> ink on warm off-white paper, square 1:1, no hands, no people, no colour, premium and
> minimal.

> **Plate 02 — folded poster:** A single large poster folded into quarters, corners
> squared, resting on a plain seamless backdrop — visible fold creases, a bold geometric
> layout printed in near-black ink on warm off-white stock — shot straight down, even soft
> studio light, no shadows falling across the poster, monochrome only — near-black ink on
> warm off-white paper, square 1:1, no hands, no people, no colour, premium and minimal.

> **Plate 03 — business-card stack:** A neat stack of business cards, fanned slightly at
> one corner, resting on a plain seamless backdrop — crisp die-cut edges, a minimal printed
> mark visible on the top card in near-black ink on warm off-white card stock — shot
> straight down, even soft studio light, no shadows falling across the stack, monochrome
> only — near-black ink on warm off-white paper, square 1:1, no hands, no people, no
> colour, premium and minimal.

> **Plate 04 — embossed swatch book:** A small bound swatch book of heavy cotton paper,
> fanned open, with a blind-embossed geometric mark pressed into the top visible sheet, no
> ink, resting on a plain seamless backdrop — one low, even raking light so the relief
> reads through soft micro-shadow only, otherwise flat and shadow-free framing, monochrome
> only — near-black ink on warm off-white paper, square 1:1, no hands, no people, no
> colour, premium and minimal.

> **Plate 05 — brand-manual spread:** An open spread of a printed brand guidelines manual
> lying flat on a plain seamless backdrop — a dense grid of diagrams and captions printed
> in near-black ink on warm off-white paper, natural page curve at the spine — shot
> straight down, even soft studio light, no shadows falling across the pages, monochrome
> only — near-black ink on warm off-white paper, square 1:1, no hands, no people, no
> colour, premium and minimal.

> **Plate 06 — packaging flat:** A flattened cardboard packaging die-line, folds pressed
> open, resting on a plain seamless backdrop — visible score lines and a minimal printed
> mark in near-black ink on warm off-white board — shot straight down, even soft studio
> light, no shadows falling across the board, monochrome only — near-black ink on warm
> off-white paper, square 1:1, no hands, no people, no colour, premium and minimal.

**Grade to match the site:** desaturate fully, crush blacks toward `#171717`, lift paper
whites toward `#EEEDE8`, no vignette.

```bash
# square crop + grade + resize — run once per plate, swapping in/out filenames
ffmpeg -i in.jpg -vf "crop='min(iw,ih)':'min(iw,ih)',scale=1024:1024,format=gray,eq=contrast=1.06" -q:v 3 plate-01.jpg
```

---

## 2. Front cover — optional, off by default (chapters 1–2)

| Path | Behavior with no file |
|---|---|
| `public/images/about/monolith-cover.jpg` | Nothing — pure ink face, exactly the .dc reference |

**Specs:** 448:580 ratio — **896×1160**, JPG, ≤400 KB.

The .dc design has no front-face artwork at all — the monument reads by light alone. This
slot doesn't exist in the reference; it's an optional addition for a future pitch variant.
If present, a cover plane appears on the front face during chapters 1–2 and fades out with
the chapter-3 fracture — the code creates the mesh and its timeline fade only once the file
is confirmed present, so an absent file costs nothing (no extra geometry, no extra draw
call).

> **Optional cover prompt:** A monochrome wordmark composition on a matte near-black
> ground, the letterforms catching a single raking light from the upper right, printed
> book-cover style — near-black ink ground, warm off-white type, portrait 448:580 ratio,
> no hands, no people, no colour, premium and minimal.

---

## 3. Screen loop — chapter 5

The front face becomes a screen. With no video present it shows the .dc scanline frame
(ink ground, hairline scanlines, inner registration box). With a video present, it plays
**inside that same frame** as a genuine `VideoTexture` — muted, looped, playing only while
chapter 5 is on screen.

| Path |
|---|
| `public/videos/loops/loop-a.mp4` |

**Specs:** 1:1, **1080×1080**, 6–8 s, seamless loop, constant motion speed, **audio
stripped**, no cuts, no flicker, no baked text or logos, no faces, no red.

Only one slot — the .dc reference doesn't cycle multiple loops or formats.

> **Loop A — kinetic type proof:** Macro of heavy black sans-serif letterforms sliding and
> locking into place across a bone-white paper surface, flat even lighting, subtle paper
> texture, constant slow lateral motion, seamless loop, no cuts, no flicker, monochrome
> only — near-black ink on warm off-white.

```bash
ffmpeg -i in.mp4 -an -vf "crop='min(iw,ih)':'min(iw,ih)',scale=1080:1080" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart loop-a.mp4
```

This is **never scrubbed** — normal encode is correct, no all-keyframe pass needed.

---

## 4. Portraits — the founder cards (chapter 5)

| Path | Status |
|---|---|
| `public/images/team/marija.jpg` | Placeholder committed — real photo overwrites in place |
| `public/images/team/rustam.jpg` | Same |

**Specs:** 3:4, **1200×1600**, JPG ≤400 KB.

Real photographs, not generated — these are the two people the page is about, and the
whole argument of the page is that the work is made by hand. Grade both identically: black
and white, ink-duotone (blacks toward `#171717`, whites toward `#EEEDE8`), matte, no heavy
vignette. The CSS applies `grayscale(1) contrast(1.06)` on top, so grade for a neutral
starting point rather than pre-crushing.

```bash
ffmpeg -i in.jpg -vf "crop='min(iw,ih*0.75)':'min(ih,iw/0.75)',scale=1200:1600,format=gray,eq=contrast=1.04" -q:v 3 marija.jpg
```

---

## Request list for Russ

1. **6 fracture plates** (generate from the prompts above, or better — real Convenium
   crops).
2. **Portraits** — overwrite the two placeholders in place with real photos.
3. **Loop A** — the video you already have, encoded per §3.
4. **Front cover** — optional, only if there's artwork strong enough to earn replacing the
   pure-ink face.
