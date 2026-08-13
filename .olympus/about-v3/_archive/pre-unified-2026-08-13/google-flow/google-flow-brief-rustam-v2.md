# Google Flow production brief — RUSTAM + shared world (v2)

**Run this first.** Use with `google-flow-agent-instructions-v2.md`.

Marija's packet is `google-flow-brief-marija-v2.md` and is intentionally out of scope here. Do not request, upload, depict, infer or generate Marija in this session.

This run does two jobs:

1. Produce every Rustam asset.
2. **Establish the photographic world** — the room, the light, the grade, the table — that Marija's separate run must match. The selects from this session become her reference set. Treat them accordingly: an inconsistent frame here becomes an inconsistent page later.

Project name: `CONVENIUM_ABOUT_V3_RUSTAM`

---

## Master request to the Flow Agent

Execute this brief as one continuous, organized production session. Validate the input pack first. If every REQUIRED input is present, proceed through all phases without asking for creative decisions. Generate only the specified quantities, select the strongest compliant outputs, animate only approved stills, and finish with the audit report. Do not assemble a reel in Flow. Every selected asset remains `PENDING-HUMAN-APPROVAL` until Rustam approves his likeness and rights.

---

## 1. The organizing device

Rustam is lit from frame-**left**. Marija, in her separate run, is lit from frame-right. Both turn inward, into the shadow between them.

On the live page the two portraits sit side by side, so two light sources converge on one shared darkness. That is the campaign concept rendered in light.

This is why there are no symbolic objects in this brief — no converging arrows, no handshakes, no split seams drawn inside frames. If a prompt seems to lack a metaphor, the lighting is carrying it. Do not add one.

**In this session, light comes from frame-left in every frame containing Rustam.** No exceptions.

## 2. The room

Every still is photographed in the same place: a converted upper-floor apartment room in Klagenfurt used as a two-person studio. Tall old windows with deep painted sills. Walls originally white, warmed and unevenly aged. One long dark-wood table. Bare wood floor.

No plants, no shelving displays, no posters, no brick, no concrete, no glass partitions, no open-plan office, no visible brand.

Winter daylight, one window, soft and directional, falling off quickly so the far side of every frame holds retained shadow.

**Set continuity outranks individual frame quality.** A beautiful image in the wrong room is a reject — and in this session it is worse than a reject, because it corrupts the reference set Marija's run depends on.

---

## 3. Section contract

| Asset | Ratio | Page section | The exact job |
|---|---|---|---|
| A03 | 4:5 | Hero, left — "We build the system." | Rustam present and attentive, listening to someone across the seam |
| A03-M | 4:5 tight | Hero, mobile | Same portrait, recomposed for a stacked single column |
| A06-01 | 3:4 | Origins, Rustam primary | One visible system decision being made, not desk activity |
| A06-02 | 3:2 | Origins, Rustam detail | The evidence of that decision — screen and paper agreeing |
| A14-01 | 8:5 | "Exclusive, but not cold." | Formality that was prepared for someone |
| A14-02 | 8:5 | "Modern, still established." | Two eras sharing one geometry |
| A14-03 | 8:5 | "Memorable, not loud." | One small permanent gesture |
| V01 | 16:9 | Reel source | Rustam, restrained motion |
| V04 | 16:9 | Reel source | The fold |

The A14 frames contain no people. They are in this session because they establish the room at zero identity risk, and because generating them early gives the agent a proven set of room, light and grade values before the identity-sensitive work begins.

**Not in this session:** A04, A04-M, A07-01, A07-02, V02 (Marija). A13, A13-M, V03 (convergence — requires both working surfaces to exist). A05 (joint frame).

---

## 4. Input pack

### REQUIRED — identity

| Filename | What to provide |
|---|---|
| `rustam-ref-front.jpg` | Recent front-facing head-and-shoulders or waist-up photo. Neutral expression, even light, hairline / both eyes / nose / jaw / ears visible. Min 1600px short edge. |
| `rustam-ref-three-quarter.jpg` | Recent photo at a natural 30–45° angle. Same current hair and facial hair. No filter, no hard color cast. Min 1600px short edge. |

A phone photo is fine and often better than a styled one. Face a window, plain wall behind, no direct sun, no smile, phone at eye height, someone else takes it. Take five, upload the two sharpest.

Do not use: social screenshots, beauty filters, sunglasses, dramatic shadow, group photos, profile-only views, or an outdated appearance.

### REQUIRED — visual system

| Upload name | Source | Use |
|---|---|---|
| `about-v3-interface-reference.png` | `.olympus/about-v3/evidence/implementation-desktop-cycle2.png` | Palette and editorial restraint only. Ignore its text. Never reproduce its layout in an image. |

### HELPFUL

| Filename | Use |
|---|---|
| `workspace-wide.jpg` | A phone photo of any real room you would accept as the studio. Environment and material truth only. |
| `workspace-table.jpg` | Oblique detail of the real table and materials. Prop continuity only. |
| `rustam-ref-body.jpg` | Body proportion and posture only. |

### Do not upload

Any Marija photograph, avatar, body reference or generated output — her assets are produced in a separate run. Concept moodframes containing fictional people. `public/images/team/*.jpg` — both are placeholders. Symbol Studio or other agency screenshots. Unlicensed client material or anything showing personal data.

---

## 5. Project organization

```text
00_INPUTS
01_IDENTITY_CALIBRATION
02_PORTRAITS
03_ENVIRONMENT
04_CONCEPT
05_VIDEO
06_SELECTED
07_HANDOFF_TO_MARIJA_RUN
90_REJECTED
99_REPORTS
```

Candidates: `{ASSET-ID}-{short-name}-C01`, `C02`…
Selects: `{ASSET-ID}-{short-name}-SELECT-PENDING-HUMAN-APPROVAL`

`07_HANDOFF_TO_MARIJA_RUN` must contain copies of the selected A03, A06-01 and A14-02 plus their generation metadata. These three are what the second session needs: A03 for scale and camera height, A06-01 for the working-session setup, A14-02 for the room's material and grade truth.

Archive rejects in `90_REJECTED`. Never delete generation history.

---

## 6. Global art-direction block

Prepend to every generation unless a prompt overrides a line.

```text
Convenium Studio, a two-person design studio in Klagenfurt, Austria.

Location: a converted upper-floor apartment room used as a studio. Tall
old windows with deep painted sills. Walls originally white, warmed and
unevenly aged. One long dark-wood table. Bare wood floor. No plants, no
shelving displays, no posters, no brick, no concrete, no glass
partitions, no open-plan office, no visible brand. The same room appears
in every frame.

Light: winter daylight from a single window. Soft, directional, slightly
cool, falling off quickly so the far side of the frame holds retained
shadow with detail. No artificial light, no colored rim light, no
practical lamps in frame.

Photography: contemporary European editorial. Observant, unhurried,
slightly cool, never glossy. Real skin texture with visible pores and
natural asymmetry. Realistic anatomy and hands. Fine 35mm grain. Soft
highlight roll-off with slight halation where light meets the window
edge. Rich blacks that retain detail.

Palette: near-black #1B1717, warm cotton #EDEBDD, paper #F5F3E8,
charcoal, natural skin. Deep cherry #810100 appears exactly once per
image as a small real object. No orange, cyan, teal, neon or gold. No
teal-and-orange grade.

Wardrobe: understated black, charcoal or warm-neutral. No visible brands,
no patterns, no jewelry beyond a plain ring or watch.

Camera: full-frame editorial character. Natural perspective. No fisheye,
no wide-angle facial distortion, no extreme bokeh.

Text rule: screens and printed pages appear, but no text is ever
readable. Achieve this by scale and distance, never by blur or glare.
Text is present as grey rhythm — lines, blocks, column edges, margins —
and never resolves into letterforms. Never generate letters, words,
numbers, logos, watermarks or interface labels.

Identity: preserve Rustam's exact supplied identity, current age, skin
tone, face shape, eyes, nose, jaw, hairline, hair, natural proportions
and distinguishing features. Do not beautify, stylize, age-shift, slim,
enlarge or merge identities.

Never: fake awards, fake client work, extra people, handshakes, smiling
office teams, influencer poses, programmer stereotypes, architecture as
subject, exterior buildings, luxury interiors, hotel lobbies,
stone-and-metal moodboards, abstract sculptures, champagne, sports cars,
glassmorphism, floating paper, malformed hands, crushed blacks.
```

---

## 7. Phase 1 — identity calibration

Diagnostic, not a website asset. Do not proceed until it is accurate.

### CAL-R

References: `rustam-ref-front.jpg`, `rustam-ref-three-quarter.jpg`; optional `rustam-ref-body.jpg`.
Quantity: 2. Aspect: 4:5.

```text
Plain editorial identity calibration portrait of Rustam, waist up,
against a warm neutral seamless background. Flat even light. Black or
charcoal unbranded shirt. Relaxed arms. Neutral attentive expression.
Direct or very slightly off-camera gaze.

Preserve Rustam's exact current identity and natural asymmetry from the
named reference photographs. No props, no text, no dramatic styling, no
beauty retouching, no colored light, no shallow depth of field.

This is an accuracy test, not a composition.
```

If neither variant is accurate, run one identity-only correction. If it is still wrong, stop and report — do not build a campaign around a stranger's face.

---

## 8. Phase 2 — the concept frames

Generate these **before** the identity work. They carry no identity risk, and their selects become the proven room, light and grade values for everything that follows.

**These three must not look like each other.** They share only the room, the light and the grade. Different subject, different distance, different emotional register.

### A14-01 — "Exclusive, but not cold."

Quantity: 3. Aspect: 8:5. Master 1600×1000 or higher.

```text
Wide 8:5 photograph of the studio room, empty of people, late afternoon.

The long dark table is set for a conversation between two. Two chairs.
One is pushed neatly in. The other has been drawn out and turned slightly
toward the viewer, ready for someone who has not yet arrived.

At that second place sits one sheet of warm cotton paper, placed square
and deliberate, and a single deep-cherry pencil laid beside it at a
precise angle. Nothing else on the table.

The room is severe — dark wood, bare walls, hard geometry, deep shadow in
the corners. The one drawn-out chair and the prepared page are the only
soft, human notes, and they are enough.

Window light from frame-left, low and warm at this hour, reaching only
the prepared place. The rest of the room recedes into retained shadow.

Wide, from standing height, slightly off-axis so the table recedes.

The feeling is: this room is not open to everyone, and you specifically
were expected.

No people, no faces, no readable text, no luxury styling, no hotel or
restaurant affect, no candles, no glassware.
```

Acceptance: the drawn-out chair is the whole image. If the chair were pushed in, the frame would say nothing.

### A14-02 — "Modern, still established."

Quantity: 3. Aspect: 8:5.

```text
Wide 8:5 still life on the long dark table, shot close and low.

A closed laptop lies flat. Resting squarely on top of it is a single
heavy old bound volume — cloth or leather spine, worn edges, clearly
decades older. The two objects are almost exactly the same width and are
aligned edge to edge with deliberate precision, so they read as one
stacked block rather than two objects.

Nothing else in frame. No open pages, no screen, no props, no material
samples, no moodboard arrangement.

Camera low, close to table height, three-quarter angle, so the stack has
weight and the aligned edges are the strongest line in the frame.

Window light from frame-left, raking across so the laptop's machined edge
and the book's worn cloth both show their texture in the same light.

Deep cherry appears once, as a thin ribbon bookmark emerging from the
volume's pages.

Two eras, one geometry. The alignment is exact — the new object and the
old object obey the same measurements.

No readable text, no visible brand on the laptop, no logo, no stone, no
metal samples, no architecture.
```

Acceptance: the shared edge alignment is unmistakable. It reads as one considered object, not a materials collage.

**This frame is the room's material reference for Marija's run.** Select the variant with the most legible wall tone, table grain and light falloff, not merely the most attractive stack.

### A14-03 — "Memorable, not loud."

Quantity: 3. Aspect: 8:5.

```text
Wide 8:5 frame of the studio wall, shot straight on.

Three identical printed sheets are pinned in a precise horizontal row on
the bare warm-white wall, evenly spaced, all the same layout.

The third sheet has one corner folded back. That is the only difference
between them, and it is small.

Nothing else in the frame. Enormous empty wall above and below the row.
The sheets occupy a narrow horizontal band across the middle third.

Window light from frame-left, grazing the wall so the folded corner casts
one small distinct shadow — the only shadow in the image, and the reason
the eye stops there.

Deep cherry appears once, as a single pin head on the third sheet.

Flat, frontal, quiet, almost nothing happening. The memory is the fold.

No hands, no people, no desk, no props, no readable text, no additional
marks, no color, no visual noise.
```

Acceptance: removing anything else would be impossible, because there is nothing else. The fold is instantly the subject.

---

## 9. Phase 3 — the hero portrait

### A03 — Rustam, hero left

References: both Rustam identity files, plus the selected CAL-R. Use the selected A14-02 for room, light and grade continuity.
Quantity: 4. Aspect: 4:5. Master 1600×2000 or higher.

```text
Vertical 4:5 editorial portrait of Rustam, waist up, in the studio room.

He sits at the long dark table in the LEFT portion of the frame, body
angled toward frame-right, head turned to look slightly down and to the
right at something outside the frame — a person across the table who is
mid-sentence. His expression is focused and receptive. He is not smiling
and not looking at the camera. He is listening while already thinking
about what it means.

Light enters from a tall window at frame-LEFT and rakes across him. The
right side of his face falls into retained shadow. The wall behind him
darkens toward frame-right.

Keep the right 35 percent of the frame as quiet wall for live website
typography. Nothing may enter that area — no objects, no highlights, no
strong texture.

The table edge is visible at the bottom. One small deep-cherry object
rests on it, near the lower-left corner, out of focus. Nothing else. No
laptop, no papers, no props.

85mm, natural perspective, moderate depth of field with the wall softly
separated. Plain black or charcoal shirt.

Preserve Rustam's exact identity from the references.
```

Acceptance: light unambiguously from frame-left; gaze inward and slightly down; right 35% empty; no identity drift; no hand error; grade neutral-cool with no green cast.

**Before selecting, read §13.** This frame sets the camera height, subject scale and grade that Marija's portrait must match. Choose the variant that is easiest to match, not merely the most striking one — an unusual camera angle here becomes an unmatched pair later.

### A03-M — mobile

References: selected A03. Quantity: 2. Aspect: 4:5, recomposed rather than cropped.

```text
Recompose the approved Rustam portrait for a narrow single column. Move
the subject to the horizontal centre and tighten to chest-up. Keep the
same light direction, room, wardrobe, expression, gaze direction and
grade. Reserve quiet space at the BOTTOM of the frame rather than at the
side, because the mobile layout stacks copy beneath the image instead of
beside it. Preserve exact identity.
```

---

## 10. Phase 4 — the origins stills

### A06-01 — one system decision

References: Rustam identity set, selected A03, selected A14-02.
Quantity: 3. Aspect: 3:4.

```text
Vertical 3:4 observed working photograph. Rustam is choosing which of
three interaction states survives into the build.

He is at the long table in three-quarter view, seen from slightly above
table height. An open laptop sits to his left showing one interface
layout. Three printed sheets lie in front of him, each showing the same
layout at a different state. His left hand rests on the trackpad. His
right hand has lifted ONE sheet a few centimetres clear of the other two
and holds it slightly apart — the decision is in that gap.

He looks down at the lifted sheet, not at the camera. Natural
concentration, no performance.

Window light from frame-LEFT. The laptop screen adds a cooler, weaker
fill on the shadow side of his face — visibly a different quality of
light from the window.

Screens and sheets are photographed at a distance where the layouts read
as grey rhythm — columns, rules, blocks, margins — and no text resolves.

One deep-cherry pencil lies on the table. Nothing else on the surface.

50mm, natural perspective. Preserve Rustam's exact identity and
anatomically correct hands.
```

Acceptance: the lifted sheet is immediately obvious; the gap between chosen and rejected is legible at a glance; screen, paper and hand all agree; no readable text; no typing pose.

**This frame is the working-session reference for Marija's run.** Its camera height and table framing must be reproducible.

### A06-02 — the evidence

References: Rustam identity set, selected A06-01.
Quantity: 2. Aspect: 3:2.

```text
Wide 3:2 observed detail from the same session as the selected Rustam
working photograph. Same table, same light, same hour.

The chosen printed sheet now lies flat, aligned edge-to-edge against the
base of the laptop so the printed layout and the screen layout sit in one
continuous line. One hand rests at the sheet's edge, having just placed
it. A thin metal ruler lies along the join, making the alignment
deliberate rather than accidental.

The two rejected sheets are pushed to the frame edge, partly out of
frame, face down.

Rustam is present only as a soft out-of-focus shoulder and forearm at the
frame edge. The evidence is the subject.

Camera low and oblique, close to table height, so the sheet and screen
compress into one plane.

Window light from frame-LEFT. Deep-cherry pencil visible once, at rest.

No text resolves at this distance. No anonymous stock-hands framing — the
arm connects visibly to a person. Match the working photograph in
wardrobe, grade, lens family and grain. Anatomically correct hand.
```

Acceptance: it reads as evidence of one decision; it clearly belongs to A06-01; no generated interface is presented as client proof.

---

## 11. Phase 5 — video

Animate only accepted stills. Two variants per clip. First Frame where the opening composition matters. Duration 6s with First Frame, or 8s if the selected reference mode requires it.

### V01 — Rustam

First frame: selected A03. Aspect 16:9 reframe, or native orientation marked for desktop reframe.

```text
Animate the approved Rustam portrait with restrained natural motion only.
He listens, gives one small nod of understanding, then his gaze shifts a
few degrees further down as the implication registers. One slow blink.
Slow controlled camera push under three percent.

Preserve exact face, hair, age, proportions, hands, wardrobe, background,
light direction, grade and crop. No speech, no lip movement, no smile, no
new object, no moving text, no screen change, no floating paper, no
dramatic camera motion.
```

**Note for the second run:** V02 must feel like the same camera operator. Record the model, mode, duration and push amount used here in the handoff report.

### V04 — the fold

First frame: selected A14-03. Aspect 16:9.

```text
Animate the three pinned sheets. Nothing moves except the folded corner
of the third sheet, which lifts a few degrees in a faint draught and
settles back. Its small shadow moves with it. The camera is completely
locked.

Preserve wall texture, sheet positions, pin positions, light and grade.
No hands, no people, no other movement, no camera motion.
```

**Video rejection rule:** one identity, hand, continuity, text or camera-warp defect rejects the clip. Never hide a defect with speed or darkness.

---

## 12. Corrective prompt library

One targeted correction round per asset family. One variable at a time.

### Identity-only

```text
Change only Rustam's facial identity to match the uploaded reference
photographs more accurately. Preserve composition, pose, gaze,
expression, wardrobe, body proportions, hands, camera position,
background, lighting, grade, depth of field and crop. Restore exact face
shape, eyes, nose, jaw, hairline, current age, natural asymmetry and real
skin texture. Do not beautify or stylize.
```

### Hand-only

```text
Change only the malformed hand or fingers to anatomically correct human
anatomy consistent with the current pose and action. Preserve identity,
expression, body, composition, objects, lighting, grade, background and
crop. Do not add or remove objects, limbs, jewelry, text or gestures.
```

### Set-continuity

```text
Change only the room to match the referenced approved frame — same wall
tone and texture, same table, same floor, same window position and size.
Preserve the subject's identity, pose, hands, wardrobe, light direction,
camera and crop.
```

### Cherry-discipline

```text
Reduce the deep-cherry elements to exactly one small real object.
Preserve everything else — subject, composition, light, grade and crop.
Do not replace the removed red with another color; the space it occupied
becomes neutral.
```

---

## 13. Handoff contract — what the Marija run inherits

This is the most important section in this file. The two hero portraits sit side by side on the live page. If they do not match, the page fails, and no amount of work in the second session can repair a badly chosen first portrait.

Place in `07_HANDOFF_TO_MARIJA_RUN`:

```text
A03-rustam-hero-SELECT-PENDING-HUMAN-APPROVAL
A06-01-rustam-decision-SELECT-PENDING-HUMAN-APPROVAL
A14-02-one-geometry-SELECT-PENDING-HUMAN-APPROVAL
```

And record these measured values in `99_REPORTS/handoff.md`, because the second session must reproduce them rather than guess:

```text
Image model and version used for A03:
Aspect ratio and output resolution:
Camera height relative to the seated subject (eye level / slightly above / slightly below):
Subject scale — approximate percentage of frame height occupied by the head:
Horizontal position of the subject's eyes as a percentage of frame width:
Lens character stated in the prompt (85mm):
Depth of field — how strongly the wall separates:
Wall tone in the lit area and in the shadow area:
Black level — how much detail survives in the darkest area:
Warmth of the daylight:
Grain amount:
Wardrobe: exact garment type and color used:
Which deep-cherry object was used and where it sat:
Correction rounds required, and for what:
```

Marija's brief instructs her session to match this list. Fill it in honestly — an approximate answer here produces a mismatched pair later.

---

## 14. Output audit

Required selects:

```text
A03-rustam-hero            A03-M-rustam-hero-mobile
A06-01-rustam-decision     A06-02-rustam-evidence
A14-01-prepared-place      A14-02-one-geometry
A14-03-the-fold
V01-rustam                 V04-fold
```

Per asset, report:

```text
Asset ID / Flow name / generation type / model / aspect ratio / duration /
identity references / other references / candidates generated /
correction rounds / rejected outputs and reasons / selected because /
known risk / approval required from
```

Completion checklist:

- [ ] Rustam's identity is accurate in every frame in which he appears.
- [ ] No Marija likeness, identity reference, avatar or inferred second founder appears anywhere in this run.
- [ ] Light comes from frame-left in every frame containing Rustam.
- [ ] Every frame is recognisably the same room.
- [ ] Exactly one deep-cherry object per image. Never two.
- [ ] No text resolves anywhere, and none was solved with blur or glare.
- [ ] Every visible hand is anatomically credible.
- [ ] The three A14 frames are visibly different from one another in subject, distance and register.
- [ ] A03 reserves the right 35% as empty wall; A03-M reserves the bottom.
- [ ] A14 frames are metadata-labelled Convenium demonstrations.
- [ ] No architecture-as-subject, luxury interior, moodboard or sculpture in any select.
- [ ] Every select maps to exactly one row of the section contract.
- [ ] Video contains no speech, morphing, screen change or camera warp.
- [ ] `07_HANDOFF_TO_MARIJA_RUN` contains the three named selects.
- [ ] `99_REPORTS/handoff.md` is filled in completely, with measured values rather than estimates.
- [ ] Report lists every unresolved rights, identity or crop risk.

---

## 15. Post-Flow download contract

Download the highest-resolution untouched select as the master. Do not repeatedly upscale a weak image.

Target website paths after post-production:

```text
public/media/about-v3/portraits/rustam-hero.avif
public/media/about-v3/portraits/rustam-hero-mobile.avif
public/media/about-v3/process/rustam-decision.avif
public/media/about-v3/process/rustam-evidence.avif
public/media/about-v3/brief-demo/prepared-place.avif
public/media/about-v3/brief-demo/one-geometry.avif
public/media/about-v3/brief-demo/the-fold.avif
```

Archive masters outside `public/`. Record provenance as:

```text
filename,asset_id,creator,source,tool_model,date,reference_files,rights_owner,publication_approved,notes
```
