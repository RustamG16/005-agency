---
name: Convenium Studio
description: A warm editorial studio system for turning unfinished ideas into accountable, coherent digital work.
colors:
  noir: "#1b1717"
  cotton: "#edebdd"
  paper: "#f5f3e8"
  ink: "#241f1f"
  gray: "#6e6963"
  gray-on-noir: "#a8a29a"
  hairline: "#d6d2c2"
  cherry: "#810100"
  maroon: "#630000"
  chili: "#d73b3e"
  chili-soft: "#e5595c"
  wordmark: "#2a2424"
typography:
  hero:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "clamp(2.75rem, 1.171rem + 6.476vw, 7rem)"
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.67vw, 4rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  manifesto:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "clamp(4rem, 1.77rem + 9.14vw, 10rem)"
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Archivo Black, Arial Black, sans-serif"
    fontSize: "clamp(1.5rem, 1.29rem + 0.86vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "normal"
  body:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.125rem, 1.03rem + 0.38vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(0.6875rem, 0.664rem + 0.095vw, 0.75rem)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  control: "8px"
  media: "8px"
  card: "10px"
spacing:
  1: "8px"
  2: "16px"
  3: "24px"
  4: "40px"
  5: "48px"
  6: "80px"
  7: "120px"
  container: "clamp(1rem, 0.443rem + 2.286vw, 2.5rem)"
components:
  editorial-link:
    textColor: "{colors.cherry}"
    typography: "{typography.label}"
    padding: "0 0 6px"
  program-tab:
    backgroundColor: "{colors.cotton}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "24px clamp(20px, 3vw, 42px)"
  program-tab-active:
    backgroundColor: "{colors.cherry}"
    textColor: "{colors.cotton}"
    typography: "{typography.title}"
    padding: "24px clamp(20px, 3vw, 42px)"
  handoff-control:
    backgroundColor: "{colors.noir}"
    textColor: "{colors.cotton}"
    typography: "{typography.label}"
    padding: "22px 26px"
  evidence-card:
    backgroundColor: "{colors.noir}"
    textColor: "{colors.cotton}"
    typography: "{typography.title}"
---

# Design System: Convenium Studio

## Overview

**Creative North Star: "The Accountable Atelier"**

Convenium is a warm editorial studio, not a technology showroom. Warm ivory paper, near-black rooms, cherry interventions, tactile campaign media, and thin registration geometry give unfinished ideas a place to be examined with care. Compressed Archivo Black makes the decisive claims; Newsreader slows the explanatory voice; Inter keeps controls and metadata exact.

The system expresses one durable thesis: unfinished ideas deserve careful diagnosis, bounded direction, accountable coordination, and a coherent result. `/about-v3` makes that thesis visible through ten chapters: thesis, founders, arrival, diagnosis, three futures, system intake, orchestration, recovery, proof, and inquiry. Its first viewport is a dark editorial stage with an oversized thesis, an honest founder-film production hold, compact supporting copy, and a single anchor into the story.

This record describes the shipped, code-led Olympus direction. No concept-roll seed key applies. The build's world and tokens are authoritative; production gaps and unverified evidence stay visibly disclosed rather than being disguised as polish.

**Key Characteristics:**

- Warm cotton and noir chapter fields interrupted by disciplined cherry, never a rainbow palette.
- Monumental compressed display type paired with reflective serif prose and compact neutral UI text.
- Thin rules, registration marks, asymmetric editorial grids, and large protected media fields.
- Tactile generated or supplied media with explicit provenance and honest production-status language.
- Restrained, forward motion that clarifies state, handoff, selection, or reveal.
- Founder accountability and public process boundaries embedded in the interface.

## Colors

The palette behaves like ink, paper, and one controlled red signal: tonal alternation builds the world, while accent color marks decisions and responsibility.

### Primary

- **Cherry:** The only red used as a solid interface field with cotton text, and the principal accent for links and selected states on cotton.
- **Maroon:** A depth step for hover fills, dark borders, and the darker band of a red surface; never body text and never a peer swatch beside cherry.
- **Chili:** A high-energy graphic signal for rules, dots, marks, and display text at 24px or larger on noir.
- **Soft Chili:** The accessible red for body-size accent text on noir.

### Neutral

- **Noir:** The warm near-black ground for the hero, diagnosis, handoff, recovery, inquiry, and shared chrome.
- **Cotton:** The primary light page field and inverse text on noir or red.
- **Paper:** A lifted light surface used where content needs a quieter secondary plane.
- **Ink:** Primary reading text on cotton.
- **Gray:** Secondary copy and metadata on light fields.
- **Gray on Noir:** Accessible secondary copy on dark fields.
- **Hairline:** Dividers, editorial grids, and structural borders on light fields.
- **Wordmark:** A deliberately low-contrast dark tone for the oversized footer signature.

### Named Rules

**The Three-Red Rule.** Cherry selects, maroon deepens, and chili signals; the roles are not interchangeable.

**The Cotton-on-Red Rule.** Cotton is the text color on every cherry or maroon field; never place noir text on those reds.

**The One-Signal Rule.** Keep interface accents inside the red family. Cyan may appear only when it is intrinsic to the supplied Apollo imagery, never as a competing UI accent.

## Typography

**Display Font:** Archivo Black (with Arial Black fallback)<br>
**Body Font:** Newsreader (with Georgia fallback)<br>
**UI Font:** Inter (with sans-serif fallback)

**Character:** Archivo Black compresses decisive statements into architectural masses. Newsreader brings judgment and humanity to explanations, while Inter keeps actions, indices, and evidence metadata quiet and precise.

### Hierarchy

- **Hero** (400, fluid 44–112px token, 0.84 line-height): Opening claims with a short measure and tight negative tracking; `/about-v3` enlarges its thesis locally when the viewport supports it.
- **Manifesto** (400, fluid 64–160px, approximately 0.84 line-height): Rare full-field statements and oversized wordmarks.
- **Display** (400, fluid 36–64px, approximately 0.9 line-height): Section headings and decisive component titles.
- **Title** (400, fluid 24–36px, approximately 0.95 line-height): Card, program, founder, and lane titles.
- **Body** (400, fluid 18–22px, 1.4 line-height): Editorial explanation, usually Newsreader and held to a 38–58ch measure.
- **Label** (500, fluid 11–12px, 0.08em tracking): Short functional controls, indices, provenance, status, and evidence metadata in Inter.

### Named Rules

**The Three-Voice Rule.** Archivo Black decides, Newsreader explains, and Inter operates; do not swap their responsibilities for novelty.

**The Short-Display Rule.** Oversized uppercase display copy stays concise enough to remain a composed shape, not a dense paragraph.

## Layout

The system uses a fluid page inset from 16px to 40px, an 8px spacing base, and long vertical chapter intervals from 96px to 160px on desktop. Hairlines establish grouping before panels or background cards do. Reading copy remains narrow while media, stage imagery, and proof fields are allowed to carry most of the width.

`/about-v3` is a ten-section linear narrative. Desktop compositions alternate single-stage, two-column, and weighted split grids: founder profiles divide equally; diagnosis, orchestration, and recovery pair evidence with a live record; proof resolves into two columns. At 1000px, dense diagnostic and atlas splits stack and five specialist lanes reduce to three columns. At 767px, the hero becomes an 860px composed stage, every major split becomes one column, program tabs become a three-column selector above their panel, founder profiles stack, specialist lanes become two columns, and vertical section padding resolves to 88px.

**The Bounded-Process Rule.** Make the public route, roles, states, and review points legible; do not expose private prompts or hidden internal routing.

**The Protected-Media Rule.** Place critical copy in deliberate negative space or under a controlled overlay, never across an uncontrolled focal subject.

## Elevation & Depth

The system is flat by default. Depth comes from alternating cotton and noir fields, darker nested surfaces, photographic light, image overlays, and occasional inset registration lines—not generic card shadows. The hero alone uses a restrained red atmospheric glow to establish its dark stage; functional content remains structurally flat.

**The Tonal-Depth Rule.** Separate layers with field color, hairlines, crop, and light before considering shadow.

## Shapes

The dominant form language is rectangular and editorial: square stage edges, one-pixel rules, clipped media, and asymmetric grid divisions. Shared controls and conventional media may use gentle 8px corners, with 10px reserved for established card surfaces. Circles belong to sparse registration targets and status geometry, not ornamental badge systems.

**The Registration Rule.** Thin geometric marks may clarify alignment, capture, state, or sequence; every mark needs a structural reading.

## Components

### Editorial Links

- **Shape:** Flat text with a one-pixel underline and a small CSS-drawn directional chevron.
- **Color:** Cherry on cotton; current color on dark fields.
- **Behavior:** The underline and direction remain visible without hover, and keyboard focus receives a clear outline.

### Program Selector

- **Shape:** Three large ruled tabs beside or above a media panel; desktop rows have a 150px minimum height.
- **Default:** Cotton field, ink title, compact index, and Newsreader explanation.
- **Selected / Hover / Focus:** Cherry field with cotton content and a short sharp transition; the selected state is exposed through tabs semantics.
- **Responsive:** At mobile size the tabs share one row, secondary descriptions and decorative chevrons disappear, and the selected panel follows below.

### Dossier / Live Record

- **Shape:** A dark stacked record divided by translucent one-pixel rules.
- **Typography:** Inter for question labels and numbering, Newsreader for the live response.
- **Color:** Soft Chili marks the row number; gray-on-noir carries supporting content.

### Handoff Control

- **Shape:** A full-width ruled action beneath two 16:9 handoff frames, changing to 4:5 on mobile.
- **Behavior:** The pressed state is explicit; images crossfade and settle without playful overshoot. Hover deepens to maroon.
- **Status:** A compact translucent status plate reports whether the approved direction is ready or accepted.

### Evidence Cards

- **Shape:** Large 4:3 media followed by a ruled, two-column evidence caption; the mobile caption stacks.
- **Behavior:** Hover gently restores saturation and scales media to 1.025. Focus preserves a visible route to the work index.
- **Truthfulness:** Proposal evidence is labelled as proposed craft, never as shipped client outcomes.

### Recovery Media

- **Shape:** A ruled 16:9 video panel with a compact metadata and playback row.
- **Behavior:** Playback is user-controlled, forward-only, replayable after completion, and pauses when the panel leaves view.
- **Fallback:** The poster carries the essential final state; reduced motion removes nonessential transitions.

## Do's and Don'ts

### Do:

- **Do** alternate cotton and noir chapter fields to pace long stories and make transitions legible.
- **Do** use cherry for decisions and selected states, maroon for depth, and Soft Chili for small red text on noir.
- **Do** keep tactile media provenance, proposal status, production holds, and public process boundaries visible in the interface.
- **Do** preserve keyboard semantics, readable mobile order, WCAG AA text contrast, poster fallbacks, and coherent reduced-motion behavior.
- **Do** let generated or supplied media carry material texture while interface typography remains real, selectable text.

### Don't:

- **Don't** fabricate testimonials, outcomes, client evidence, founder material, or hidden process detail to make a section feel complete.
- **Don't** introduce gold, orange, generic cyan UI, glass blobs, glossy science-fiction surfaces, or decorative 3D icons into this warm editorial world.
- **Don't** repeat kicker or eyebrow labels as a default pre-heading device; use compact metadata only when it communicates orientation, status, provenance, or action.
- **Don't** use Unicode glyphs as interface icons; draw simple geometry in CSS or use an intentional inline SVG when an icon is necessary.
- **Don't** add procedural SVG grain. Texture belongs to authored raster media and controlled photographic treatment, not a universal noise layer.
- **Don't** use Chili for body-size text on noir or place noir text on cherry or maroon.
