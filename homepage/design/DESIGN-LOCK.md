# Design lock — the corner guide (2026-08-03)

Composition, proportion, colour and states only. Every number below was read off
a live three.js render of `uploads/repo_robot.glb` under the shipped key light,
measured on the rendered pixels — not estimated. The board that produced them is
`Guide Radial Menu.dc.html` + `guide-radial.js` at the project root; item ids
(1C, 4F, 5C…) refer to tiles on that board.

Flag: the brief named `Guide Radial Menu.dc.html` + `guide-radial.js` as existing
files. They did not exist — the project held `Robot Recolor Lab.dc.html`,
`robot-lab.js`, `The Guide - Home.dc.html` and `guide-scene.js`. Both files were
built for this pass under the names the brief uses. `askGuide()` was not touched.

## 1 · Texture + red remap — the map is KEPT (reversal a)

| Thing | Locked value |
|---|---|
| Technique | draw base-colour map to canvas → walk pixels → RGB→HSL → rewrite red band → `CanvasTexture` (`flipY false`, `SRGBColorSpace`), 512² |
| Red band | `h ≤ 26° \|\| h ≥ 332°` and `s ≥ 0.14`, `0.04 < l < 0.97`. Outside the band: untouched |
| Target | cherry `#810100` → h 0.5°, s 0.99 |
| Lightness | re-centred on the band's own mean → 0.25, contrast × 1.18, then γ 0.68 (the lifted curve) |
| Body material | `MeshStandardMaterial`, map = remapped, roughness 0.85, metalness 0.15, normalMap kept at normalScale 0.6 |
| Parts material | flat noir `#1B1717`, roughness 0.9, metalness 0.1, normalMap 0.6 — parts map NOT used |
| Eye | sphere per eye bone, emissive paper `#F5F3E8`, emissiveIntensity **1.35**, CTA step **1.9**, `toneMapped: false`, radius 3.4% / forward 24.4% of robot height (unchanged, baked per mirrored bone) |
| Light | unchanged — key `0xFFF1E0` @ 4.0 from (-3.2, 4.4, 3.4) + ambient `0x8D867D` @ 0.45, no shadow maps |

Measured (236px render, full figure, body mean relative luminance Y):

| Variant | Y | vs cotton | vs noir | Verdict |
|---|---|---|---|---|
| Shipped map (control) | 0.135 | 4.74:1 | 3.13:1 | reference only |
| Cherry, flat field | 0.056 | 8.27:1 | **1.79:1** | fails on noir |
| Chili | 0.116 | 5.27:1 | 2.81:1 | holds, hue reads pink-toy |
| **Cherry, lifted curve** | **0.085** | **6.47:1** | **2.29:1** | **locked** |

Eye, measured as mark area above Y 0.45 in a 196px head-frame render:
chili @1 → 4px² (never crosses the threshold — not a mark any more);
chili @2.6 → 9px² (blooms, no edge); **paper @1.35 → 413px² at Y 0.98 (locked)**.

## 2 · Framing in the puck

- Framing is a kept-model-height **span**, not a scalar: `robotHeight = worldH × 0.74`
  is retired. Locked span **0.02 → 1.10** (waist-up) = robot height 1.02 × disc height.
- Puck 104px desktop, **76px ≤ 520px**. Crown lands 16px below the disc's top edge
  at 104px — that is the headroom the bubble needs.
- Full figure (span −0.16→1.16, the old 0.74) loses the eye in the 76px squint test;
  head-and-shoulders (0.30→1.06) reads but kills all arm movement inside the disc.

## 3 · Puck treatment — ground-adaptive ring

| State | Cotton | Noir |
|---|---|---|
| Disc | noir `#1B1717` | ink `#241F1F` |
| Rest | no ring | 1px gray `#6E6963` |
| Hover / open | 1px hairline `#D6D2C2` | 1px cotton `#EDEBDD` |
| Dragging | 1px gray `#6E6963` + scale 0.97 | 1px cotton |
| Armed over drop target | 1px cherry `#810100` | 1px chili `#D73B3E` (graphic) |

Retired: the 1px chili ring at 55% opacity — the body now carries "there is red
here", and an opacity value is not in the token set.

## 4 · Radial geometry

| Thing | Locked value |
|---|---|
| Petals | 6 (5 chapters + Ask), **44px** circles (was 52) |
| Radius | **148** (120 and 132 collide at any legible petal size) |
| Arc | **176° → 276°** (screen convention: 180 = left, 270 = up), step 20°, chord 51.4px → 7.4px air |
| Mark | two-digit Archivo Black at 15px, cotton on noir petal fill `#241F1F` |
| Labels | **always-visible label index**, right-aligned outside the fan: right edge at r + petal/2 + 34 + puck/2 from the dock's right, 24px rows / 30px pitch, Inter 12px uppercase ls 0.1em. Ordered so 01 pairs with the lowest petal. Hover either half → both light (cherry on cotton, chili-300 on noir) |
| Ask petal | same geometry, paper `#F5F3E8` fill + ink glyph + hairline ring, 8px extra separation in the index |
| ≤ 520px | ring dropped; the index alone becomes the stack — 44px rows, number + label, right-aligned above a 76px puck |
| Motion | petals scale 0.86→1 + opacity, 260ms `--ease-out-sharp`, 26ms stagger; index rows translateX 10→0, +40ms offset |

## 5 · Speech bubble (reversal b)

- Squared paper bubble: paper ground, 1px hairline, **radius 2**, padding 12/14,
  min 176px, max **264px** `box-sizing: border-box`, no shadow, paper on both grounds.
- Anchor: `Head_05` projected with `camera.project` every frame + a crown offset
  (bone → model top) measured once at load. Bubble bottom sits 12px above the crown.
- Tail: 11px square rotated 45°, paper, hairline on the two exposed sides, slides
  along the bottom edge, clamped 18px from either end; past that the bubble shifts
  and the tail pins. Flips below the puck (tail to the top edge) when the crown is
  within one bubble-height of the top edge.
- Content: eyebrow `GUIDE — 0n/06` (Inter 11px, gray) + one Newsreader line at
  17px. **The brief is dropped from the bubble and moves into the Ask panel.**
- Motion: opacity + clip-path inset(0 0 100% 0)→inset(0) + 4px rise, 320ms
  `--ease-out-sharp`; exit 200ms. Position is never transitioned.

## 6 · Ask panel

- 360px paper card, radius 10px, 1px hairline, padding 16, docked to the puck's
  right edge, 16px above it. Log ceiling 300px, scrolls; input row pinned with a
  1px hairline top rule.
- Question: Inter 14px ink in a cotton `#EDEBDD` block, radius 8, max 82%, right.
  Answer: Newsreader 17px ink on bare paper, left. Contrast is ground, not colour.
- Chips: 1px hairline outline, radius 8, Inter 11px uppercase gray → ink on hover.
  Send affordance: "ASK", cherry on paper.
- ≤ 460px: sheet inset 12px, 44vh log, the puck stands down (opacity 0) and a
  28px robot mark appears in the sheet header.
- **Bubble and panel never co-exist.** Opening Ask (or the ring) retires the
  bubble in 160ms; the ring closes when Ask opens.

## 7 · States

idle · hover · menu open · dragging (walk clip, scale 0.97) · armed over a drop
target (target gets a 1px cherry/chili outline at 6px offset) · talking (Talk
clip + bubble) · ask open · reduced-motion (no sway, no clip, all durations 0ms).
Focus: 2px ink on cotton / 2px cotton on noir, outline only — 4px offset on the
puck, 3px on a petal, 4px on the input. No shadow anywhere.

## Deviations — flagged, not folded in

1. **§6 accent budget changes.** Rendered red is now: body field (cherry, film +
   live, counts once), nav-active underline, CTA email hover. The eye is no
   longer red and the connector is gone — three uses, and chili disappears from
   this component entirely.
2. **Petal size and arc moved** from 52px / 90° to 44px / 100°: six petals do not
   fit at any of the three radii you asked me to test.
3. **A fourth petal-content option** was added (4F, ring + label index) because
   none of the three specified options fits six always-visible labels.
4. **Framing became a span** rather than a scalar (item 2).
5. **The bubble anchor adds a measured crown offset** to the bone projection —
   `Head_05` alone puts the tail on his face.
6. **Ask log copy is placeholder.** Five exchanges were needed to settle scroll
   behaviour; the answers are written from existing site copy and are NOT approved.

Colophon requirement holds: `Robot: "REPO Robot" by OscarLomas3D (CC BY 4.0)`
renders in the board footer and must render in the page footer.
