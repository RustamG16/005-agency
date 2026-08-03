# Convenium Studio — Robot concept prompts

**Status:** Stage 1, look-lock. Page design happens after a concept is picked and meshed.

## How this works

**Stage 1 — lock the look.** Five finished renders in the Convenium palette. Pick one. These are
for your eyes, not for the mesh pipeline.

**Stage 2 — build the mesh.** The approved design is re-rendered as a flat-lit grey model, then a
four-view turnaround, then reconstructed. Prompts are further down; ignore them until Stage 1 is
settled.

The two stages are deliberately different because an image that looks good and an image that
reconstructs well are close to opposites. Stage 2 explains why.

---

## Two objects, not one

| | About | Home |
| --- | --- | --- |
| Object | The monolith | The robot |
| Source | Procedural — `BoxGeometry` in `monolith.ts` | Generated image → reconstructed mesh |
| Download cost | Zero | Mesh budget (bottom of file) |
| Asset work | None. Colour and surface are a materials edit in `monolith.ts` | Everything here |

Different routes, so never the same frame budget. `three` is a shared chunk, so the second scene
costs almost nothing in bundle terms.

**This reopens the concept pick.** SLAB and STACK were strong only while the robot and the
monolith were the same object. With the monolith staying a card-ratio slab on About, a slab robot
on home reads as the same object twice and pays a mesh budget to duplicate something already
free. Revised order: **LENS**, then **COMPANION**, then **ARM**, with STACK and SLAB last.

---

# Stage 1 — Look-lock prompts

## Shared visual DNA

Inlined into all five. This is the constant:

> Matte machined body in warm near-black `#241F1F` with fine milled edges, tight panel gaps, and
> chamfers catching a cool bone `#D6D2C2` highlight. Sparse brushed warm-cream `#EDEBDD`
> detailing. Eye: a deep glossy black lens dome set in a concentric machined bezel, ringed by
> about sixty tiny emissive red LEDs in `#D73B3E` casting a faint glow onto the bezel. Recessed
> cavities read deep oxblood `#630000`. Lighting: one warm key from upper-left, a weak cool fill
> from lower-right, low ambient — form comes from light, not from texture. Minimal shadow. Flat
> warm near-black `#1B1717` background. Three-quarter view, physical product photography realism,
> sharp focus. No text, no logos, no watermark.

The lighting recipe mirrors `monolith.ts` exactly — warm key, weak cool fill, low ambient — so
whichever concept you pick already sits in the same light as the About object.

---

### 1. THE LENS — a body-less eye

A machined disc, dinner-plate size, hovering and tilting. No arms, no legs. It emotes purely
through tilt, iris aperture and ring brightness. **My pick:** most distinct from the About slab,
cleanest to reconstruct, impossible to make look bad.

```
A single floating robotic eye module, no body, shaped like a thick machined disc about the size
of a dinner plate, hovering and tilted slightly forward as if noticing something. Matte warm
near-black #241F1F anodized housing with concentric turned rings stepping down toward the centre,
fine milled chamfers catching a cool bone #D6D2C2 highlight, and three small recessed mounting
bosses on the rim whose cavities read deep oxblood #630000. At the centre, a deep glossy black
lens dome with visible internal aperture blades, set in a concentric machined bezel and
surrounded by a ring of about sixty tiny emissive red LEDs in #D73B3E glowing softly and casting
a faint red wash onto the bezel. A thin brushed warm-cream #EDEBDD index mark on the outer rim.
Lighting: one warm key from upper-left, a weak cool fill from lower-right, low ambient, minimal
shadow. Flat warm near-black #1B1717 background. Three-quarter view, physical product photography
realism, macro sharpness. No text, no logos, no watermark.
```

---

### 2. THE COMPANION — a small character

Knee-high, stocky, oversized rounded head on a compact body — the proportion that reads friendly
rather than threatening. Warmest option. Most work to reconstruct and rig.

```
A small stocky bipedal companion robot, knee-height, friendly proportions with an oversized
rounded head on a compact body. Smooth matte warm near-black #241F1F outer shell panels with
tight visible seams and chamfer highlights in cool bone #D6D2C2, revealing a brushed warm-cream
#EDEBDD inner frame at the shoulder, elbow, hip and knee joints, with deep oxblood #630000
visible in the joint recesses. The face is a single large circular eye: a deep glossy black lens
dome in a concentric machined bezel, ringed by about sixty tiny emissive red LEDs in #D73B3E
glowing softly. Short arms ending in simple three-finger grippers, flat wide feet. Standing at
rest with a slight head tilt, arms held a little away from the body. Lighting: one warm key from
upper-left, a weak cool fill from lower-right, low ambient, minimal shadow. Flat warm near-black
#1B1717 background. Three-quarter view, physical product photography realism, sharp focus. No
text, no logos, no watermark.
```

---

### 3. THE ARM — a tool, not a creature

No body. A precision articulated arm on a low base, lens at the tip. Reads as studio equipment —
a thing that makes rather than a thing that is. Most sophisticated, least warm.

```
A precision articulated robotic arm mounted on a low circular machined base, four joints, no
humanoid body. Matte warm near-black #241F1F anodized segments with milled chamfers catching a
cool bone #D6D2C2 highlight, exposed brushed warm-cream #EDEBDD rotary joint collars, and fine
cable channels whose recesses read deep oxblood #630000. At the arm's tip, a camera head: a deep
glossy black lens dome in a concentric machined bezel, ringed by about sixty tiny emissive red
LEDs in #D73B3E glowing softly, angled slightly downward as if inspecting something just out of
frame. The arm posed in a relaxed open curve, clear of itself and of the base. Lighting: one warm
key from upper-left, a weak cool fill from lower-right, low ambient, minimal shadow. Flat warm
near-black #1B1717 background. Three-quarter view, physical product photography realism, sharp
focus. No text, no logos, no watermark.
```

---

### 4. THE STACK — segments that come apart

A vertical column of five machined segments, lens at the top, levitating with visible gaps. Each
rotates independently. Now overlaps the About monolith's vocabulary.

```
A minimalist robot built as a vertical stack of five separate machined segments floating one
above another with visible clear gaps between them, no legs, no arms. Each segment is a rounded
rectangular block in matte warm near-black #241F1F with milled chamfers catching a cool bone
#D6D2C2 highlight, tight panel lines, and noticeably different proportions from its neighbours;
the gaps reveal deep oxblood #630000 interior faces. The top segment is the head: a deep glossy
black lens dome in a concentric machined bezel, ringed by about sixty tiny emissive red LEDs in
#D73B3E glowing softly. Faint brushed warm-cream #EDEBDD registration marks aligning the segment
edges. Lighting: one warm key from upper-left, a weak cool fill from lower-right, low ambient,
minimal shadow. Flat warm near-black #1B1717 background. Three-quarter view, physical product
photography realism, sharp focus. No text, no logos, no watermark.
```

---

### 5. THE SLAB — the monolith as a robot

Card-ratio slab, hovering upright, one lens in the upper third, arms folded flush into side
channels. Only build this if you decide the monolith should be retired from About instead.

```
A minimalist hovering robot shaped like a tall rectangular monolith, portrait proportions roughly
448 by 580, floating upright with no legs. Matte machined body in warm near-black #241F1F with
fine milled edges, tight horizontal panel gaps, and chamfers catching a cool bone #D6D2C2
highlight. A single circular eye set into the upper third of the front face: a deep glossy black
lens dome in a concentric machined bezel, ringed by about sixty tiny emissive red LEDs in #D73B3E
glowing softly. Two slim articulated arms folded flush into recessed channels on either side,
barely visible, the channel interiors reading deep oxblood #630000. Sparse brushed warm-cream
#EDEBDD detailing on one edge seam. Lighting: one warm key from upper-left, a weak cool fill from
lower-right, low ambient, minimal shadow. Flat warm near-black #1B1717 background. Three-quarter
view, physical product photography realism, sharp focus. No text, no logos, no watermark.
```

---

### Optional variations once you have a favourite

Run on the approved still, one at a time, to pressure-test the design before meshing:

- `Same object, front view, straight on, identical lighting and materials.` — Checks the design
  survives symmetry. Many concepts only work in three-quarter.
- `Same object, lens aperture wide open and LED ring at full brightness.` — Its "awake" state.
- `Same object, LEDs off, lens dark.` — Its resting state. If it's dead-looking here, the design
  is leaning on the glow instead of the form.

---

# Stage 2 — Mesh prompts

**Do not start this until a Stage 1 concept is approved.**

## Why the mesh image is a grey model

Every item below is a geometry error in the output mesh, not a stylistic preference:

| In the image | In the mesh |
| --- | --- |
| Glossy black lens dome | Specular highlight baked as a raised bump; black-on-black gives no shape cue |
| Emissive LED glow | Bloom read as swollen geometry; the ring loses its groove |
| Ink body on noir background | No silhouette to segment against — the worst failure mode |
| Cast shadow, rim light, ambient occlusion | Permanent dents and creases |
| Macro depth of field | Blurred regions reconstruct as smeared, low-detail surface |
| Sixty sub-pixel LEDs, hairline gaps | Sub-pixel detail becomes surface noise |
| Transparency, reflections | Undefined depth; holes and spikes |

So the mesh input is a **flat-lit untextured grey model**. Colour returns as three.js material
values at runtime, which `CLAUDE.md` requires anyway.

## Reconstruction-safe constant

> Untextured grey model, clay render. Uniform matte mid-grey surface across the entire object, no
> gloss, no specular highlights, no reflections, no transparency, no emissive glow, no colour
> variation. Completely flat even diffuse lighting from all directions, no cast shadows, no
> ambient occlusion, no rim light, no vignette. Plain flat light-grey background, clearly
> separated in value from the object. Object centred and complete in frame with generous margin,
> nothing cropped or touching an edge. Entire object in sharp focus, no depth of field, no motion
> blur. Neutral three-quarter view at eye level, slight perspective. Simple readable forms; every
> feature large enough to be unmistakable. Industrial design clay model photograph. No text, no
> logos, no watermark.

The eye changes: the glossy dome becomes a **matte domed disc recessed into a stepped bezel**, and
the LED ring becomes a **shallow circular groove with about twenty evenly spaced dimples**. Both
are features the reconstruction can resolve. Sixty sub-pixel out and become ring noise — add the
extra density as an instanced ring in three.js.

## Conversion prompt

Run this on the approved Stage 1 still:

```
Using this exact object design, re-render it as an untextured grey model, clay render. Uniform
matte mid-grey surface across the entire object, no gloss, no specular highlights, no
reflections, no transparency, no emissive glow, no colour variation. Replace the glossy lens dome
with a smooth matte domed disc recessed into a stepped circular bezel, and replace the LED ring
with a shallow circular groove containing about twenty evenly spaced round dimples. Completely
flat even diffuse lighting from all directions, no cast shadows, no ambient occlusion, no rim
light, no vignette. Plain flat light-grey background, clearly separated in value from the object.
Object centred and complete in frame with generous margin, nothing cropped or touching an edge.
Entire object in sharp focus, no depth of field, no motion blur. Neutral three-quarter view at
eye level. Keep every proportion, panel line and feature identical to the source. Industrial
design clay model photograph. No text, no logos, no watermark.
```

## Pose corrections by concept

Apply to the conversion prompt for whichever concept you picked. These are not style notes —
each one prevents a specific reconstruction failure.

- **LENS** — enlarge the three mounting bosses and the rim index notch. A featureless disc has no
  asymmetry to lock rotation against.
- **COMPANION** — hold the arms clear of the torso, head level not tilted, thicken the fingers.
  Limbs touching the body fuse into it and are lost permanently; thin protrusions become stubs.
- **ARM** — open relaxed curve, no segment overlapping or touching another, segments thickened.
  A folded pose self-occludes and welds into one lump.
- **STACK** — reconstruct **one segment at a time** and stack them in three.js. Floating
  separated parts are a known weak case, and you need separate meshes to animate the separation.
- **SLAB** — cut the arm channels deep and wide so they read as cavities, not as surface lines.

## Turnaround

Run on the approved grey-model still:

```
Using this exact object design, generate a four-view orthographic turnaround sheet: front view,
left side view, back view, and three-quarter view, arranged in a single row, all at identical
scale and identical eye level, each fully in frame with margin. Plain flat light-grey background.
Uniform matte mid-grey surface, completely flat even lighting, no cast shadows, no reflections,
no specular highlights, no ambient occlusion. Keep every proportion, panel line, chamfer and
feature identical across all four views. No text, no labels, no watermark.
```

Verify before meshing: same silhouette height in all four views, same feature count, no view lit
differently. One inconsistent view is worse than three views.

---

## Material mapping — applied in three.js, not in the image

| Feature | Token | Value |
| --- | --- | --- |
| Machined body | `--color-ink` | `#241F1F` |
| Scene ground | `--color-noir` | `#1B1717` |
| Brushed detail, index marks | `--color-cotton` | `#EDEBDD` |
| Chamfer highlight | `--color-hairline` | `#D6D2C2` |
| LED ring, emissive marks | `--red-chili` | `#D73B3E` |
| Ignition seam only | `--red-chili-300` | `#E5595C` |
| Recessed cavities | `--red-maroon` | `#630000` |

Body is ink on a noir ground — two warm near-blacks a half-step apart, separated by the key
light, exactly as `monolith.ts` sets it up. The LED ring is chili, not chili-300, because the red
rule in `DESIGN.md` makes chili the graphic-only red: rules, dots, marks. An LED ring is dots.
Chili-300 stays reserved for the ignition seam so that beat reads as the same event on both pages.

## Mesh budget

- Hunyuan3D output is dense and unoptimized — expect 100k+ triangles and tens of megabytes raw.
- Decimate to **under 40k triangles** before it goes near the page.
- Compress with **Draco or meshopt**; target **under 2MB** over the wire.
- Bake nothing. Materials come from tokens at runtime.

For reference: the monolith is 24 boxes sharing one `BoxGeometry` and one `MeshStandardMaterial`
— roughly 25 draw calls, no shadow map, pixel ratio capped at 1.5, rendering only while an
`IntersectionObserver` reports the stage visible, on the GSAP ticker Lenis already drives. A
single decimated robot at that budget is comfortably affordable.
