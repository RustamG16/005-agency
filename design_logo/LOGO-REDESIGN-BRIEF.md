# Convenium logo redesign — critique, 5 concepts, generation guide

Supersedes `LOGO-BRIEF.md` (which still references gold — **gold is retired, R5**:
accent is oxblood `#9E2B2B` / `#C1554D` on noir, max one accent detail, never a fill).

## 1. Critique of the current mark (serif wordmark + slashed V)

Keep: monochrome restraint, wordmark confidence, the slash instinct (it's the R5
"thin slash of light" motif trying to get out).
Kill: the hairline high-contrast serif (reads perfume/bridal, not a strategy-led
studio; clashes with Archivo Black site voice) · the V device (reads checkmark /
"versus" / strikethrough — never "elevation"; slash angle mismatches the V stem and
looks accidental) · hairline strokes (dead at 16px favicon) · the giant V splitting
the word into CON + ENIUM · extreme tracking (long, weak lockup; fails the 480px nav
track) · zero relationship to current tokens.

## 2. Hard rules for the new mark

- Tokens only: noir `#050505`, bone `#EEEDE8`, ink `#171717`; accent oxblood as at
  most ONE detail. Flat, single-weight, monochrome-capable.
- Wordmark spirit: Archivo Black — heavy, geometric, tight tracking, all caps.
- Legible 16px → signage. No gradients, bevels, shadows, glows, thin hairlines,
  literal elevators/buildings/arrows-in-circles.
- Must drop into: header (nav track), `app/icon.tsx` favicons, social avatar.
- Deliverables per direction: wordmark, monogram, horizontal + stacked lockups,
  noir-on-bone / bone-on-noir / one-accent variants, clearspace + min-size, SVG
  master + 16/32/180 favicons, and a one-line motion cue (site is motion-heavy).

## 3. Four concepts (C2 dropped by decision)

### C1 — The Seam ★ recommended
Heavy tight CONVENIUM; one thin diagonal CUT slices clean through the whole wordmark
(a 4–6° gap through the letterforms, not a drawn stroke). Accent variant: the cut is
oxblood. Monogram: solid square, same slice. Unifies logo + UI hairlines + R5 media
motif (door seam → canvas slash → mark).
Motion cue: the mark assembles closed, then the seam opens 1px→full on load.

### C2 — dropped by decision.

### C3 — The Ascender
Icon-free. Mid-word half-step baseline shift: CONVE sits low, NIUM steps up — the
promise typeset literally. Monogram: two offset stacked bars. Demands perfect optical
tuning; test at 14px before committing.
Motion cue: the raised half settles upward into place, elevator-stop easing.

### C4 — The Plaque
CONVENIUM STUDIO set small, centered, generously spaced inside a bone rectangle,
8px radius (exact `--radius-control`) — museum plaque; shares geometry with the
site's cards. Weak as favicon alone → pair with the C1 monogram.
Motion cue: plaque fades up as if a spotlight found it.

### C5 — The Counterform V
Two solid rising rectangular masses lean toward each other; the V is the NEGATIVE
space between them (doors opening, light between). Salvages the old V correctly:
carved light, not strokes. At 16px it's two bold shapes — bulletproof.
Motion cue: the two masses part; light widens between them.

## 4. Generation guide

### 4a. Claude Design (preferred — SVG-native, skip the trace step)

Settings: **Design system: None** (tokens live in this brief — don't let another
system leak in) · **Template: None** (no listed template fits a logo; don't force
Wireframe/UI mockups) · toggle the **code view (`</>`)** so output comes as
copyable SVG · pick the strongest available model.

Paste this whole file as the prompt, prefixed with:

> Design the 4 logo concepts below (C1, C3, C4, C5) as flat vector SVG. For each
> concept: wordmark + monogram on one artboard, geometric primitives and boolean
> cuts only, single solid color `#171717` on `#F8F7F2`, no gradients/strokes-as-
> hairlines/effects. 3 variations per concept. Snap to a 24-unit grid. After I pick
> one, produce the full variant set from §2.

Output: 4 concepts × 3 variations = 12 comps to judge with §5. Still verify the
final SVG by hand in Figma/Illustrator (grid snap, path cleanup) before shipping.

### 4b. AI image tools (fallback — exploration only)

Raster comps must be rebuilt as clean SVG; never ship a raster or auto-traced logo.
Process: 6–10 comps per chosen concept → pick 1–2 → rebuild in vector →
test 16px favicon, 40px nav, grayscale, 1-color print → then variants + favicons.

Base prompt (append the concept line):

> Minimal flat vector-style logo on plain background, single color near-black
> #171717 on warm off-white #F8F7F2. Heavy geometric sans-serif capitals, tight
> letter-spacing, extremely bold, flat solid shapes, no gradients, no shadows, no
> 3D, no texture, no decorative elements. Swiss design, luxury brand identity,
> presented straight-on, centered, lots of empty space around the mark.

- **C1:** Wordmark "CONVENIUM" in ultra-bold condensed capitals with one thin
  diagonal negative-space cut slicing through all letters at a steep angle, the two
  halves slightly separated.
- **C3:** Wordmark "CONVENIUM" ultra-bold capitals where the last four letters
  "NIUM" sit half a letter-height higher than "CONVE", sharing no baseline, flush
  tight tracking.
- **C4:** A rounded-corner off-white rectangular plaque containing the words
  "CONVENIUM STUDIO" in small widely-spaced bold capitals, centered, engraved-plate
  composition.
- **C5:** Abstract monogram: two solid vertical rectangular blocks leaning apart at
  the top so the empty space between them forms a sharp letter V of light.

Negative prompt / avoid: serif fonts, thin lines, gradients, gold, metallic,
mockups, photorealism, buildings, elevators, arrows, circles-around-letters.

## 5. Selection gate before vectorizing

Squint test (reads at 16px?) · silhouette unique in a row of studio logos? ·
means elevation without an arrow? · survives 1-color? · sits naturally next to
Archivo Black nav text? All five yes → vectorize. Any no → next comp.
