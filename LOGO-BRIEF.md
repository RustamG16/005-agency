# Convenium Studio — Logo Design Brief

A working brief for creating the Convenium Studio mark. Use it as a designer brief or
as the source text for an AI logo/image tool. Grounded in the identity the site
already establishes. **Design values below are taken from the live code — `styles/tokens.css`,
`app/fonts.ts`, `styles/globals.css` — not from any brief doc** (verified against
`localhost:3010`).

## The brand in one breath

Convenium is a strategy-led design studio. The core line is **"We do not decorate
businesses. We take them to another level."** The whole site runs on a vertical,
architectural metaphor — an elevator / thresholds / floors ("Let's find your next
floor"), doors that close and open, and a quiet museum where the work hangs in a
frame. The tone is confident, restrained, expensive. Not playful, not techy, not
decorative.

Personality: precise, editorial, calm, high-status. The logo should feel like it
belongs on a bronze plaque in a gallery, not on a startup landing page.

## Non-negotiables (verified from `styles/tokens.css`, `app/fonts.ts`, `styles/globals.css`)

- **Color tokens (exact):** ~~`--color-noir #050505`, `--color-bone #eeede8`,
  `--color-paper #f8f7f2`, `--color-ink #171717`, `--color-gray #777771`,
  `--color-hairline #cac8c0`, `--color-gold #b18a46`~~ — **stale, do not use.** These were
  read from `styles/tokens.css` at the time and every one has changed since. Current:
  noir `#1B1717`, cotton `#EDEBDD`, paper `#F5F3E8`, ink `#241F1F`, gray `#6E6963`,
  hairline `#D6D2C2`, cherry `#810100`. **Gold is retired** — the "one gold detail in the
  mark" guidance below no longer applies; a mark that needs an accent uses cherry, and
  `DESIGN.md` → Red rule governs which red is legal where. Re-read `DESIGN.md` before
  drawing anything.
- **Type (exact):** `--font-family-display` = **Archivo Black** (400);
  `--font-family-serif` = **Newsreader** (400/500 + italic); `--font-family-ui` =
  **Inter** (400/500/600) — all via `next/font`. A wordmark uses Archivo Black or a
  custom face in that spirit — heavy, geometric, tightly set.
- **Radius tokens:** `--radius-control` / `--radius-media` = **8px**, `--radius-card`
  = **10px**. If the mark sits in a frame/container, match these.
- **No** gradients, glows, glassmorphism, bevels, drop shadows, emoji-style icons, or
  literal skyscraper/elevator clip-art. The metaphor is expressed abstractly.
- Must be **single-weight, flat, monochrome-capable**, and legible at **16px favicon**
  through architectural signage scale.
- Current placeholder is a **"CS" monogram** (header, top-left) and `app/icon.tsx` /
  `app/apple-icon.tsx` favicons — any new mark must drop into those.

## Deliverables to produce from a chosen direction

- **Wordmark** — "CONVENIUM" (and a "CONVENIUM STUDIO" lockup).
- **Monogram** — "CS" (or single-glyph) for the favicon, header, and social avatar.
- **Combination lockup** — monogram + wordmark, horizontal and stacked.
- **Color variants** — noir-on-bone, bone-on-noir, and a single-gold-accent version.
- **Clearspace + min-size** rules; **SVG master** (crisp at any scale), plus the 16 /
  32 / 180px favicon set.
- Optional **motion cue** — the site is motion-heavy, so note how the mark animates
  (e.g., a mark that "opens" or "levels up" on load), even if the static form ships first.

---

## Five directions

Each is a distinct concept. Pick one to develop (or blend two — e.g. a Level monogram
inside a Frame). Each includes form notes and a generation prompt you can adapt.

### 1 — The Level Mark
**Idea:** the "take them to another level" line made geometric — a mark that *rises*.
A monogram where a horizontal floor-line steps up, or the counter of the letter lifts
one notch above its baseline. Reads as elevation without drawing an elevator.
**Form:** heavy geometric "C"/"CS"; one internal stroke breaks the baseline and steps
up a level; the single gold detail is that raised step-line. Confident negative space.
**Motion tie-in:** on load, the step-line rises into place (echoes "going up").
**Prompt:** *"Minimal geometric monogram logo for a high-end design studio, letters C
and S, one horizontal line that steps up a level to suggest elevation, heavy flat
single-weight strokes, monochrome black on bone, one thin gold accent line, no
gradients, no 3D, gallery-plaque restraint, vector."*

### 2 — The Threshold (Doors)
**Idea:** the site's signature door-close moment as a mark. Two solid forms meet at a
center seam; the thin gap between them is the logo's charged negative space — and can
resolve into a "C" or an "I"/"1" (level one).
**Form:** two bronze-black blocks nearly touching; the hairline seam is the hero. At
small sizes the seam becomes a single vertical stroke. Optional gold glint in the seam.
**Motion tie-in:** the two halves close together to form the mark, then the site begins.
**Prompt:** *"Abstract logotype mark of two heavy rectangular forms meeting at a
razor-thin central seam, negative-space gap forming a subtle letter C, flat monochrome
bronze-black on warm bone, a single faint gold line in the seam, architectural,
minimal, no gradients, vector."*

### 3 — The Frame / Window
**Idea:** "the work in the frame" — the gallery window that anchors the whole site.
The monogram lives inside a precise rectangular frame; the studio *presents* its
initial like an exhibited piece.
**Form:** a thin, exact rectangular frame (portrait, ~4:5, echoing the site's
`24.5/18/21/47.5` opening) containing a tightly-set "CS" or "C". The frame is the
constant; the contents can change (a system, not a one-off). Gold reserved for a single
corner tick or the inner bevel line.
**Motion tie-in:** the frame draws on, then the monogram fades in inside it (mirrors
the zoom-into-frame transition).
**Prompt:** *"Logo of a precise thin rectangular gallery frame containing a heavy
geometric monogram CS, portrait proportion, flat monochrome black on bone, one small
gold corner accent, museum/editorial feel, no gradients, no shadow, vector."*

### 4 — The Wordmark (typographic, restraint-first)
**Idea:** no symbol — the word carries it. "CONVENIUM" in Archivo Black, tightly
tracked, all caps, with exactly one deliberate detail that tells the story.
**Form:** the detail options — (a) a gold underscore under the wordmark = the "next
floor" line; (b) the "V" cut to a sharp upward apex (a subtle ascent); (c) the dot of
an "I" raised a level. One idea only; everything else is dead-plain and perfectly
kerned. "STUDIO" sits small in Inter beneath, letter-spaced.
**Motion tie-in:** the underscore line sweeps in left-to-right on load.
**Prompt:** *"Heavy geometric all-caps wordmark 'CONVENIUM', tightly tracked, flat
black on bone, a single thin gold underline beneath the word, small letter-spaced
'STUDIO' below, editorial, minimal, high-end studio branding, no gradients, vector."*

### 5 — The Connected System (node)
**Idea:** "Five disciplines. One connected system." A mark of a single continuous line
or a small constellation of connected points — five nodes joined into one form that
also reads as "C" or "CS".
**Form:** one unbroken geometric line that turns through five points and closes into a
"C"; or five dots linked by hairlines with one gold node. Systematic, engineered, not
organic. Must still resolve to a solid glyph at favicon size.
**Motion tie-in:** the line draws itself point-to-point, then settles.
**Prompt:** *"Minimal monoline logo mark, a single continuous geometric line passing
through five connected points and closing into a letter C, one point highlighted in
gold, flat monochrome on bone, systematic and precise, no gradients, no 3D, vector."*

---

## How to use this

1. Pick a direction (or a blend). If generating with AI, run its prompt 4–8× at square
   and export SVG-tracing candidates.
2. Redraw the winner cleanly as an **SVG** (AI logos are never production-clean) —
   single path, true monochrome, correct kerning.
3. Test it at 16px, in bone-on-noir and noir-on-bone, and dropped into the header +
   `app/icon.tsx`.
4. Keep gold to a single accent, and confirm it still reads with gold removed
   (monochrome must stand alone).

Tell me a direction and I can draft starter **SVG** marks for it, or generate image
explorations to react to.
