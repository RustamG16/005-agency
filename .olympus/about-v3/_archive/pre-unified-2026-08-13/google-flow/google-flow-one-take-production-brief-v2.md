# Google Flow one-take production brief — Convenium About V3 (v2)

Use with `google-flow-agent-instructions-v2.md`.

This version supersedes the split Rustam / Marija packets. Both founders are produced in **one session**, because the two hero portraits must match, and matching them across two separate runs is the single hardest thing in this campaign.

## Master request to the Flow Agent

Execute this brief as one continuous, organized production session. Validate the input pack first. If every REQUIRED input is present, proceed through all phases without asking for creative decisions. Generate only the specified quantities, select the strongest compliant outputs, animate only approved stills, organize everything, and finish with the audit report. Do not assemble a reel in Flow. Every selected asset remains `PENDING-HUMAN-APPROVAL` until the depicted founder approves likeness and rights.

---

## 1. What this campaign is

Convenium Studio is a new two-person studio in Klagenfurt, Austria. The `/about-v3` page argues that two people read the same problem differently and converge on one accountable direction.

The media has one job: make that difference **visible** without stating it.

### The organizing device

Rustam is lit from frame-left. Marija is lit from frame-right. Both turn inward, into the shadow between them. On the live page the two portraits sit side by side, so two light sources converge on one shared darkness.

This is why there are no symbolic objects in this brief — no converging arrows, no handshakes, no split seams drawn inside frames, no two-halves-of-a-whole compositions. The lighting carries the concept. Adding a metaphor on top would make it literal and cheap.

### The room

Every still is photographed in the same place: a converted upper-floor apartment room used as a two-person studio. Tall old windows, deep painted sills, walls originally white and unevenly warmed with age, one long dark-wood table, bare wood floor.

No plants, no shelving displays, no posters, no exposed brick, no concrete, no glass partitions, no open-plan office, no visible brand.

Winter daylight, one window, soft and directional, falling off quickly so the far side of every frame holds retained shadow.

**Set continuity outranks individual frame quality.** A beautiful image in the wrong room is a reject.

---

## 2. Section contract

Every asset answers one visible page section. No general mood images.

| Asset | Ratio | Page section | The exact job |
|---|---|---|---|
| A03 | 4:5 | Hero, left — "We build the system." | Rustam present and attentive, listening to someone across the seam |
| A03-M | 4:5 tight | Hero, mobile | Same portrait, recomposed for a stacked single column |
| A04 | 4:5 | Hero, right — "We protect how it is understood." | Marija with equal authority, attention on the person rather than the object |
| A04-M | 4:5 tight | Hero, mobile | Mirror of A03-M |
| A06-01 | 3:4 | Origins, Rustam primary | One visible system decision being made, not desk activity |
| A06-02 | 3:2 | Origins, Rustam detail | The evidence of that decision — screen and paper agreeing |
| A07-01 | 3:4 | Origins, Marija primary | One visible communication decision — choosing between two ways of saying the same thing |
| A07-02 | 3:2 | Origins, Marija detail | The evidence — an edit mark that changed a meaning |
| A13 | 16:9 | Conversation reel, poster | The one frame where both working surfaces meet |
| A13-M | 9:16 | Reel, mobile poster | Same moment, vertical |
| A14-01 | 8:5 | "Exclusive, but not cold." | Formality that was prepared for someone |
| A14-02 | 8:5 | "Modern, still established." | Two eras sharing one geometry |
| A14-03 | 8:5 | "Memorable, not loud." | One small permanent gesture |
| V01 | 16:9 | Reel source | Rustam, restrained motion |
| V02 | 16:9 | Reel source | Marija, restrained motion |
| V03 | 16:9 | Reel source | Two hands converging on one sheet |
| V04 | 16:9 | Reel source | The fold |

**Deliberately unillustrated:** the language-continuity module, the ownership table, the credibility ledger, and the inquiry form are code-native. Do not generate media for them. The ledger in particular is about verifiable claims, and photography would weaken it.

---

## 3. Input pack

Rename before upload. Unfiltered, full-resolution originals with consent to upload and transform.

### REQUIRED — identity

| Filename | What to provide |
|---|---|
| `rustam-ref-front.jpg` | Recent front-facing head-and-shoulders or waist-up photo. Neutral expression, even light, hairline / both eyes / nose / jaw / ears visible. Min 1600px short edge. |
| `rustam-ref-three-quarter.jpg` | Recent photo at a natural 30–45° angle. Same current hair and facial hair. No filter, no hard color cast. Min 1600px short edge. |
| `marija-ref-front.jpg` | Same specification. |
| `marija-ref-three-quarter.jpg` | Same specification. |

A phone photo is fine and often better than a styled one. Stand facing a window, plain wall behind, no direct sun, no smile, phone at eye height, have someone else take it. Take five, upload the two sharpest.

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
| `rustam-ref-body.jpg` / `marija-ref-body.jpg` | Body proportion and posture only. |

### Do not upload

Concept moodframes containing fictional people. `public/images/team/*.jpg` — both are placeholders. Symbol Studio or other agency screenshots. Unlicensed client material, private messages, confidential screens, or anything showing personal data.

---

## 4. Project organization

```text
00_INPUTS
01_IDENTITY_CALIBRATION
02_PORTRAITS
03_ENVIRONMENT
04_CONCEPT
05_VIDEO
06_SELECTED
90_REJECTED
99_REPORTS
```

Project name: `CONVENIUM_ABOUT_V3`

Candidates: `{ASSET-ID}-{short-name}-C01`, `C02`…
Selects: `{ASSET-ID}-{short-name}-SELECT-PENDING-HUMAN-APPROVAL`

Archive rejects in `90_REJECTED`. Never delete generation history.

---

## 5. Global art-direction block

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

Identity: preserve the named person's exact supplied identity, current
age, skin tone, face shape, eyes, nose, jaw, hairline, hair, natural
proportions and distinguishing features. Do not beautify, stylize,
age-shift, slim, enlarge or merge identities.

Never: fake awards, fake client work, extra people, handshakes, smiling
office teams, influencer poses, programmer stereotypes, architecture as
subject, exterior buildings, luxury interiors, hotel lobbies,
stone-and-metal moodboards, abstract sculptures, champagne, sports cars,
glassmorphism, floating paper, malformed hands, crushed blacks.
```

---

## 6. Phase 1 — identity calibration

Diagnostics, not website assets. Do these first and do not proceed until both are accurate.

### CAL-R / CAL-M

References: the two identity files for that person. Quantity: 2 each. Aspect: 4:5.

```text
Plain editorial identity calibration portrait of [Rustam / Marija], waist
up, against a warm neutral seamless background. Flat even light. Black or
charcoal unbranded shirt. Relaxed arms. Neutral attentive expression.
Direct or very slightly off-camera gaze.

Preserve this person's exact current identity and natural asymmetry from
the named reference photographs. No props, no text, no dramatic styling,
no beauty retouching, no colored light, no shallow depth of field.

This is an accuracy test, not a composition.
```

If neither variant is accurate, run one identity-only correction. If it is still wrong, stop and report — do not continue building a campaign around a stranger's face.

---

## 7. Phase 2 — the hero portraits

These two carry the page. They must look photographed in the same hour by the same person.

### A03 — Rustam, hero left

References: both Rustam identity files, plus the selected CAL-R.
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

### A04 — Marija, hero right

References: both Marija identity files, plus the selected CAL-M **and the selected A03** for lens, scale, camera height and grade.
Quantity: 4. Aspect: 4:5.

```text
Vertical 4:5 editorial portrait of Marija, waist up, in the same studio
room, photographed in the same session as the selected Rustam portrait.

She sits at the long dark table in the RIGHT portion of the frame, body
angled toward frame-left, head turned to look level and to the left at a
person outside the frame. Where Rustam looks down at the implication, she
looks directly at the person — her attention is on whether they have been
understood. Calm, direct, unhurried. Not smiling, not looking at camera.

Light enters from a tall window at frame-RIGHT and rakes across her. The
left side of her face falls into retained shadow. The wall behind her
darkens toward frame-left.

Keep the left 35 percent of the frame as quiet wall for live website
typography. Nothing may enter that area.

The table edge is visible at the bottom. One small deep-cherry object
near the lower-right corner, out of focus. Nothing else.

Match the selected Rustam portrait exactly in camera height, subject
scale within the frame, lens character, depth of field, black level,
warmth and grain. Same room, same table, same hour.

85mm, natural perspective. Plain black or charcoal top.

Preserve Marija's exact identity from the references. Do not borrow any
feature from the Rustam portrait.
```

Acceptance: mirrors A03 in scale and authority while reading as a different person with a different kind of attention; light unambiguously from frame-right; left 35% empty.

**Pair check before moving on.** Place the two selects side by side, Rustam left, Marija right. The light must come from the two outer edges and the shadows must meet in the middle. If they read as two different rooms, run the pair-match correction in §11 rather than regenerating.

### A03-M / A04-M — mobile

Quantity: 1 each. Aspect: 4:5, recomposed rather than cropped.

```text
Recompose the approved [Rustam / Marija] portrait for a narrow single
column. Move the subject to the horizontal centre and tighten to
chest-up. Keep the same light direction, room, wardrobe, expression,
gaze direction and grade. Reserve quiet space at the BOTTOM of the frame
rather than at the side, because the mobile layout stacks copy beneath
the image instead of beside it. Preserve exact identity.
```

---

## 8. Phase 2 — the origins stills

Two people, two different kinds of decision, same room, same session.

### A06-01 — Rustam, one system decision

References: Rustam identity set, selected A03.
Quantity: 3. Aspect: 3:4.

```text
Vertical 3:4 observed working photograph. Rustam is choosing which of
three interaction states survives into the build.

He is at the long table in three-quarter view, seen from slightly above
table height. An open laptop sits to his left showing one interface
layout. Three printed sheets lie in front of him, each showing the same
layout at a different state. His left hand rests on the trackpad. His
right hand has lifted ONE sheet a few centimetres clear of the other
two and holds it slightly apart — the decision is in that gap.

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

### A06-02 — Rustam, the evidence

References: Rustam identity set, selected A06-01.
Quantity: 2. Aspect: 3:2.

```text
Wide 3:2 observed detail from the same session as the selected Rustam
working photograph. Same table, same light, same hour.

The chosen printed sheet now lies flat, aligned edge-to-edge against the
base of the laptop so the printed layout and the screen layout sit in
one continuous line. One hand rests at the sheet's edge, having just
placed it. A thin metal ruler lies along the join, making the alignment
deliberate rather than accidental.

The two rejected sheets are pushed to the frame edge, partly out of
frame, face down.

Rustam is present only as a soft out-of-focus shoulder and forearm at
the frame edge. The evidence is the subject.

Camera low and oblique, close to table height, so the sheet and screen
compress into one plane.

Window light from frame-LEFT. Deep-cherry pencil visible once, at rest.

No text resolves at this distance. No anonymous stock-hands framing — the
arm connects visibly to a person. Match the working photograph in
wardrobe, grade, lens family and grain. Anatomically correct hand.
```

### A07-01 — Marija, one communication decision

References: Marija identity set, selected A04, selected A06-01 for session continuity.
Quantity: 3. Aspect: 3:4.

```text
Vertical 3:4 observed working photograph. Marija is choosing between two
ways of saying the same thing.

She is at the same long table in three-quarter view, seen from slightly
above table height. Two printed pages lie side by side in front of her —
visibly the same layout, differing only in their text blocks. She holds a
deep-cherry pencil and has just drawn a single line through one phrase on
the left page. Her other hand rests flat on the right page, holding it in
place for comparison.

She looks down at the two pages, comparing. Focused, unhurried, no
performance, no camera contact.

Window light from frame-RIGHT. Her left side falls into retained shadow.

No laptop in this frame — her decision is happening on paper, and the
difference from Rustam's frame should be immediately visible.

Pages are photographed at a distance where text reads as grey rhythm and
never resolves. The pencil line itself is clearly visible as a mark.

Match the Rustam working photograph in camera height, subject scale, lens
and grade. Same room, same session.

50mm. Preserve Marija's exact identity and anatomically correct hands.
```

Acceptance: two versions of one page are legible as a comparison; the pencil mark is the focal point; her action is unmistakably different from Rustam's without being lesser.

### A07-02 — Marija, the evidence

References: Marija identity set, selected A07-01.
Quantity: 2. Aspect: 3:2.

```text
Wide 3:2 observed detail from the same session as the selected Marija
working photograph.

Close on the marked page. One horizontal deep-cherry pencil line strikes
through a block of text. Directly above it sits a small proofreader's
caret — a simple inverted V — and a short handwritten replacement mark.
The handwriting is at an angle and scale where it is unmistakably
handwriting but no word can be read.

Her hand is still resting at the edge of the page, pencil held loosely,
mid-thought rather than mid-action.

Camera close and slightly oblique. Shallow but controlled depth of field
so the mark is sharp and the far edge of the page softens.

Window light from frame-RIGHT, raking low across the paper so its texture
and the pencil's indentation are visible.

Nothing else in frame. No laptop, no ruler, no second page.

Match the working photograph in grade, warmth and grain. Anatomically
correct hand. No readable words anywhere.
```

Acceptance: it reads as a decision that changed a meaning, not a decorative paper macro; the cherry mark is the only red in frame.

---

## 9. Phase 2 — the reel poster

### A13 — where the two surfaces meet

References: both identity sets optional; selected A06-02 and A07-02 for material continuity.
Quantity: 3. Aspect: 16:9.

```text
Wide 16:9 photograph taken from directly above the long dark table.

From the LEFT edge of the frame, Rustam's working surface extends inward:
laptop corner, aligned printed sheet, metal ruler.

From the RIGHT edge, Marija's surface extends inward: two compared pages,
the marked one on top, deep-cherry pencil at rest.

They meet at the centre of the frame, where a single cotton-white sheet
lies alone — untouched, unmarked, waiting. Both sets of materials are
angled toward it.

Two hands are present at the outer edges, each belonging to its own side,
neither touching the centre sheet yet. Forearms visible so the hands are
clearly attached to two different people.

Window light from frame-LEFT falls across the whole table, so the right
side of the surface sits in retained shadow. The centre sheet is the
brightest object in the frame.

Generous empty table around the arrangement. The composition must survive
having a play button placed at centre.

No readable text on any page. Exactly one deep-cherry object.
Anatomically correct hands. No faces.
```

Acceptance: the convergence reads instantly without a caption; the centre stays clear enough for overlay controls.

### A13-M — vertical poster

Quantity: 1. Aspect: 9:16.

```text
Recompose the approved overhead convergence for a vertical frame. The two
surfaces now enter from TOP and BOTTOM rather than left and right, still
meeting at the single cotton sheet in the centre. Preserve materials,
light direction, grade and hand positions.
```

---

## 10. Phase 2 — the three brief readings

**These three must not look like each other.** In the previous version of this brief they were three near-identical tabletop arrangements, which made the section read as one image repeated. Each of the three below has a different subject, a different distance and a different emotional register. They share only the room, the light and the grade.

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

Acceptance: the drawn-out chair is the whole image; if the chair were pushed in, the frame would say nothing.

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

Two eras, one geometry. The idea is that the alignment is exact — the new
object and the old object obey the same measurements.

No readable text, no visible brand on the laptop, no logo, no stone, no
metal samples, no architecture.
```

Acceptance: the shared edge alignment is unmistakable; it reads as one considered object, not a materials collage.

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

Acceptance: removing anything else would be impossible because there is nothing else; the fold is instantly the subject.

---

## 11. Corrective prompt library

One targeted correction round per asset family. One variable at a time.

### Identity-only

```text
Change only the named person's facial identity to match the uploaded
reference photographs more accurately. Preserve composition, pose, gaze,
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

### Pair-match

```text
Match only the apparent lens, camera height, subject scale, lighting
softness, black level, warmth and grain to the referenced paired
portrait. Preserve this person's exact identity, posture, inward gaze,
wardrobe, light direction, negative-space safe area and crop. Do not copy
or merge any feature of the other person.
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

## 12. Phase 3 — video

Animate only accepted stills. Two variants per clip. Use First Frame where the opening composition matters. Duration 6s with First Frame, or 8s if the selected reference mode requires it.

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

### V02 — Marija

First frame: selected A04.

```text
Animate the approved Marija portrait with restrained natural motion only.
She holds her level gaze, then tilts her head a few degrees — the small
movement of someone deciding whether what was just said is what was
meant. One slow blink. Slow controlled camera push under three percent.

Preserve exact face, hair, age, proportions, hands, wardrobe, background,
light direction, grade and crop. Same restrictions as V01. The motion
must feel like the same camera operator as V01.
```

### V03 — convergence

First frame: selected A13. Aspect 16:9.

```text
Animate the overhead convergence. The left hand slides the aligned sheet
one small distance toward the centre. The right hand moves the marked
page in from the other side. Both stop just short of the untouched centre
sheet and rest. The overhead camera stays completely fixed.

Preserve every material and position. No new object, no readable text, no
morphing hand, no extra finger, no camera movement, no floating paper.
```

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

## 13. Optional stretch asset

### A05 — both founders in one frame

**High risk.** Two-identity frames are where models merge faces. Attempt only after A03 and A04 are both approved, and only if credits allow. The page does not depend on it.

Quantity: 4. Aspect: 16:9.

```text
Wide 16:9 photograph of both founders at the long table in the studio
room, seen from the side so neither is nearer the camera.

Rustam sits at frame-left, Marija at frame-right, the width of the table
between them. Both look down at the single cotton sheet lying between
them. Neither looks at the other and neither looks at the camera. They
are looking at the same thing.

Window light from frame-left crosses the whole table. Rustam is lit
directly; Marija is lit by what reaches her, so she is the cooler and
softer of the two. The shadow between them is the darkest part of the
frame.

Preserve each person's exact separate identity from their own named
reference files. Do not blend, average, or transfer any feature between
them. Both faces fully visible, anatomically correct hands, no
handshake, no smiling, no posed team affect.

50mm, natural perspective, both subjects in focus.
```

Reject immediately on any feature transfer between the two faces. Fallback: the page pairs approved A03 and A04 in code, which is the current design and works.

---

## 14. Output audit

Required selects:

```text
A03-rustam-hero            A03-M-rustam-hero-mobile
A04-marija-hero            A04-M-marija-hero-mobile
A06-01-rustam-decision     A06-02-rustam-evidence
A07-01-marija-decision     A07-02-marija-evidence
A13-convergence            A13-M-convergence-vertical
A14-01-prepared-place      A14-02-one-geometry
A14-03-the-fold
V01-rustam  V02-marija  V03-convergence  V04-fold
```

Per asset, report:

```text
Asset ID / Flow name / generation type / model / aspect ratio / duration /
identity references / other references / candidates generated /
correction rounds / rejected outputs and reasons / selected because /
known risk / approval required from
```

Completion checklist:

- [ ] Both founders' identities accurate in every frame in which they appear.
- [ ] Light comes from frame-left in every Rustam frame and frame-right in every Marija frame.
- [ ] A03 and A04 read as one session: same room, camera height, scale, grade.
- [ ] Every frame is recognisably the same room.
- [ ] Exactly one deep-cherry object per image. Never two.
- [ ] No text resolves anywhere, and none was solved with blur or glare.
- [ ] Every visible hand is anatomically credible.
- [ ] The three A14 frames are visibly different from one another in subject, distance and register.
- [ ] Hero safe areas are empty: right 35% on A03, left 35% on A04, bottom on both mobile crops.
- [ ] A13 centre is clear enough for a play control.
- [ ] Concept frames are metadata-labelled Convenium demonstrations.
- [ ] No architecture-as-subject, luxury interior, moodboard or sculpture in any select.
- [ ] Every select maps to exactly one row of the section contract.
- [ ] Video contains no speech, morphing, screen change or camera warp.
- [ ] Selects, alternates and rejects are in their required collections.
- [ ] Report lists every unresolved rights, identity or crop risk.

---

## 15. Post-Flow download contract

Download the highest-resolution untouched select as the master. Do not repeatedly upscale a weak image.

Target website paths after post-production:

```text
public/media/about-v3/portraits/rustam-hero.avif
public/media/about-v3/portraits/rustam-hero-mobile.avif
public/media/about-v3/portraits/marija-hero.avif
public/media/about-v3/portraits/marija-hero-mobile.avif
public/media/about-v3/process/rustam-decision.avif
public/media/about-v3/process/rustam-evidence.avif
public/media/about-v3/process/marija-decision.avif
public/media/about-v3/process/marija-evidence.avif
public/media/about-v3/reel/convergence-poster.avif
public/media/about-v3/reel/convergence-poster-vertical.avif
public/media/about-v3/brief-demo/prepared-place.avif
public/media/about-v3/brief-demo/one-geometry.avif
public/media/about-v3/brief-demo/the-fold.avif
```

Archive masters outside `public/`. Record provenance as:

```text
filename,asset_id,creator,source,tool_model,date,reference_files,rights_owner,publication_approved,notes
```

---

## 16. What changed from v1, and why

| v1 | v2 | Reason |
|---|---|---|
| Split into Rustam and Marija packets | One session, both founders | The hero portraits must match; matching them across two runs is the hardest problem in the campaign and this removes it entirely |
| 5 of 7 stills were anonymous hands on a tabletop | 2 of 13 | v1 inverted its own placement map, which targets 55–65% people and caps material detail at 10–15% |
| Three A14 frames required to share tabletop, lens and grade | Three different subjects, distances and registers | They were one image generated three times, in a section about three different readings |
| Concept carried by symbolic props | Concept carried by light direction | Props state the idea; light demonstrates it and cannot be read as a claim |
| "Simple non-branded interface blocks with no text" | The unresolvable-scale rule | "Blocks" generate as wireframe stock; distance produces real-looking layouts that stay unreadable |
| A03 got 4 variants, A06-01 got 2 | Difficulty-weighted: 3 on the hard working frames, 3 on concept frames | Variant budget followed prominence rather than failure risk |
| Mobile was one filename in the download contract | A03-M, A04-M, A13-M with prompts | The hero safe area is a horizontal device; on a stacked mobile column it reserves the wrong axis |
| A13 reel poster deferred entirely | Specified, with a vertical variant | It is the largest visual on the page and currently renders a disabled button |
| Environment unspecified beyond "credible workspace" | One named room, held across every frame | Unspecified rooms generate a different studio every time, which is what made the set feel unrelated |
| Cherry "extremely limited" | Exactly once per image, as a real object | A countable rule is enforceable; a vague one is not |
