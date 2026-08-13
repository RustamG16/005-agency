# Google Flow one-take production brief — Rustam + shared assets

Use this file with `google-flow-agent-instructions.md`. Marija’s independent production packet is `google-flow-marija-one-take-production-brief.md` and is intentionally out of scope here.

## Master request to the Flow Agent

Execute this entire brief as one continuous, organized production session. This run contains only Rustam and identity-neutral shared/demonstration assets. Do not request, upload, depict, infer, or generate Marija. First validate the input pack and reference mappings. If every REQUIRED input is present, proceed through every phase without asking for creative decisions. Generate only the specified quantities, select the strongest compliant outputs, animate only selected stills, organize the resulting stills and short source clips, and finish with the requested audit report. Do not assemble or edit the showreel in Flow. Every selected Rustam asset remains `PENDING-HUMAN-APPROVAL` until Rustam approves his likeness and rights.

## 1. Campaign objective

Create Rustam’s missing generated media plus the identity-neutral shared-brief and demonstration frames for the Convenium Studio `/about-v3` page. Export only the specified Rustam and hands-only motion sources for a showreel that will be assembled in a different tool. The selected concept is **Two Lenses, One Direction**.

The visual system must prove:

1. Rustam brings systems, interaction, design, and implementation judgment.
2. Identity-neutral brief frames demonstrate visual/content judgment without depicting or impersonating Marija.
3. The wider page will later pair these outputs with Marija’s separately produced assets.

This is a new founder-led studio. Never fabricate an established Convenium client history. Generated brief frames are clearly self-initiated demonstrations.

### Section contract

Every output must answer its visible page section. Do not create general campaign mood images.

| Asset | Page section | Exact communication job |
|---|---|---|
| A03 | Opening — “We build the system.” | Present Rustam as an attentive founder who connects experience, interaction and implementation. |
| A06-01 | “Individual experience, brought together under one name.” | Show Rustam making one specific system decision rather than merely working at a desk. |
| A06-02 | Same origins section | Show the evidence of that decision: a relationship between an interaction state, a printed flow and implementation logic. |
| A14-00 | External showreel source | Show two different readings of one brief meeting at one decision without depicting either founder. |
| A14-01 | “Exclusive, but not cold.” | Translate restraint into a welcoming human interaction, not an architectural mood. |
| A14-02 | “Modern, still established.” | Translate current interface behavior and durable editorial order into one frame. |
| A14-03 | “Memorable, not loud.” | Translate restraint into one repeatable signature interaction or visual gesture. |
| V01 | External showreel source | Add restrained human motion to Rustam’s opening portrait. |
| V04 | External showreel source | Animate two readings converging on one decision. |

## 2. Input/reference pack

Rename inputs exactly before upload. Images should be unfiltered, full-resolution originals with upload/transformation/publication consent.

### REQUIRED identity references

| Filename | What to provide | Use |
|---|---|---|
| `rustam-ref-front.jpg` | Recent front-facing head-and-shoulders or waist-up real photo; neutral expression; even neutral light; hairline, both eyes, nose, jaw, and ears visible; minimum 1600px short edge | Primary Rustam facial identity |
| `rustam-ref-three-quarter.jpg` | Recent real photo at a natural 30–45° angle; same current hair/facial hair; no filter or hard color cast; minimum 1600px short edge | Rustam shape/depth identity support |

Do not use a social screenshot, beauty-filtered image, sunglasses, dramatic shadow, extreme smile, group photo, profile-only view, or an old appearance as the only identity source.

### REQUIRED visual-system reference

| Upload name | Source | Use |
|---|---|---|
| `about-v3-interface-reference.png` | Copy of `.olympus/about-v3/evidence/implementation-desktop-cycle2.png` | Palette, split seam, editorial restraint, light/noir balance only. Ignore all visible text and placeholder blocks. Never reproduce the interface inside a generated image. |

### Keep outside Flow — showreel-tool inputs

Do not upload the following into this Flow production run. Preserve them for the separate showreel tool:

- `site-recording-01.mp4` and `site-recording-02.mp4`.
- Real `marija-artifact-*` files.
- Existing work loops and covers under `public/works/`.
- Music, voice, typography, captions, transcripts, logos, or final title cards.
- Any showreel storyboard or editing-project file that is not needed to generate the two short source clips in this brief.

Flow must not grade, edit, restyle, trim, combine, or generate replacements for these materials.

### HELPFUL physical references

| Filename | What to provide | Use |
|---|---|---|
| `workspace-wide.jpg` | A clear wide photo of the real shared workspace, table, or credible working location | Environment/material truth only |
| `workspace-table.jpg` | Overhead/oblique detail of the real table, laptop, paper, notebook, and materials | Prop/material continuity only |
| `rustam-ref-body.jpg` | Real full- or three-quarter-body image in neutral fitted clothing | Body proportions and posture only |
| `system-interface-reference.png` | One rights-cleared screenshot of a real interface or interaction state Rustam designed/implemented; crop private data | Optional visual truth for A06-01/A06-02; preserve its overall layout but do not rely on generated readable text |

The existing `design_claude/me/Full-body_triptych,_three_distinct_views__202607230052.jpeg` may be uploaded as `rustam-generated-body-guide.jpg` only if Rustam confirms it is accurate. Label it as generated and secondary; never let it override the real identity photographs.

### Do not upload as references

- `.olympus/about-v3/concept-visuals/concept-2-two-lenses.png` or any concept moodframe containing fictional people.
- `public/images/team/rustam.jpg` or `public/images/team/marija.jpg`; both are placeholders.
- Any Marija photograph, avatar, body reference, artifact used as an identity reference, or generated Marija output. Her assets are produced in a separate run.
- Screenshots from Symbol Studio or other agencies.
- Unlicensed client material, private messages, confidential screens, or images with visible personal data.

## 3. Project organization

Create these collections:

```text
00_INPUTS
01_IDENTITY_CALIBRATION
02_STILLS_CANDIDATES
03_STILLS_SELECTED
04_VIDEO_CANDIDATES
05_VIDEO_SELECTED
06_EXTERNAL_SHOWREEL_HANDOFF
90_REJECTED
99_REPORTS
```

Project name: `CONVENIUM_ABOUT_V3_RUSTAM_SHARED`.

Candidate naming: `{ASSET-ID}-{short-name}-C01`, `C02`, etc.

Chosen naming: `{ASSET-ID}-{short-name}-SELECT-PENDING-HUMAN-APPROVAL`.

Archive rejected outputs in `90_REJECTED`; do not delete generation history.

## 4. Global art-direction block

Apply this to every generation unless a prompt explicitly overrides a line:

```text
Visual campaign: Convenium Studio, a founder-led boutique digital studio in Klagenfurt, Austria.

Photographic language: contemporary European editorial photography; intimate, observant, precise, calm; real skin texture; realistic anatomy and hands; restrained 35mm grain; soft highlight roll-off; rich blacks with preserved detail.

Environment: a credible small creative workspace with warm bone paper, near-black materials, dark natural wood, brushed metal, one laptop or monitor, printed layouts, and a simple unobtrusive background. Architecture is never the subject.

Palette: near-black #1B1717, warm cotton #EDEBDD, paper #F5F3E8, charcoal, and extremely limited deep cherry #810100. No orange, cyan, neon, or gold interface accents.

Wardrobe: understated black, charcoal, or warm-neutral clothing with no visible brand marks.

Mood: intelligent, calm, deeply attentive, selective, founder-led, never corporate, theatrical, or performative.

Camera: editorial full-frame photography, natural 50mm or 85mm portrait character, realistic depth of field, no fisheye, no wide-angle facial distortion, no extreme bokeh.

Identity: preserve the named person’s exact supplied identity, current age, skin tone, face shape, eyes, nose, jaw, hairline, hair, natural proportions, and distinguishing features. Do not beautify, stylize, age-shift, slim, enlarge, masculinize, feminize, or merge identities.

Exclusions: no readable generated text, logos, watermarks added as visual elements, fake client interfaces, fake awards, fake client material, extra people, handshakes, generic smiling office teams, influencer poses, programmer stereotypes, architecture-led imagery, exterior buildings, luxury interiors, hotel lobbies, severe doorways, stone-and-metal moodboards, abstract sculptures, champagne, sports cars, marble mansions, glossy science fiction, glassmorphism, floating paper, malformed hands, or crushed black detail.
```

## 5. Phase 1 — identity calibration

Generate two simple calibration portraits of Rustam before producing final scenes. These are diagnostics, not website assets.

### CAL-R — Rustam identity test

References: `rustam-ref-front.jpg`, `rustam-ref-three-quarter.jpg`; optional `rustam-ref-body.jpg`.

Quantity: 2. Aspect: 4:5.

```text
Create a plain contemporary editorial identity calibration portrait of Rustam from the waist up against a warm neutral seamless background. Natural even light, black or charcoal unbranded shirt, relaxed arms, neutral attentive expression, direct or very slightly off-camera gaze. Preserve Rustam’s exact current identity and natural asymmetry from the named references. No props, text, dramatic styling, beauty retouching, colored rim light, or exaggerated depth of field. This is an identity accuracy test, not a campaign composition.
```

Select the most accurate Rustam calibration. If neither is accurate, use one identity-only corrective pass. If still inaccurate, record the failure and use a real Rustam portrait rather than continuing with a fictional likeness.

## 6. Phase 2 — final still generation

### A03 — Rustam opening portrait

References: both Rustam identity files plus selected `CAL-R` only. Use the interface reference for palette/seam logic only.

Quantity: 4. Aspect: 4:5. Intended master: 1600×2000 or highest available.

```text
Create a vertical 4:5 editorial portrait of Rustam for the left half of the Convenium About V3 opening, directly supporting the live statement “We build the system.” Do not generate this text in the image.

Rustam is positioned on the outer-left side and turns slightly inward toward frame-right, as if listening to a collaborator across a central seam. His expression is focused, calm and receptive, not smiling at the camera. The composition may include one restrained printed interaction sequence at the lower edge, but no laptop hero pose and no readable text. Preserve a quiet inner-right 35 percent of the frame for live website typography and the central seam.

Use controlled soft side light from frame-left, a near-black/charcoal working environment with warm-cotton paper details, realistic skin, and understated black clothing. The background stays simple and secondary. Communicate systems thinking, design judgment, attentive listening and technical calm without a programmer stereotype or architecture imagery.

The composition must survive a 4:5 master and a later wide crop. Preserve Rustam’s exact identity. Apply the global art direction.
```

Acceptance: strongest inward gaze; inner-right safe area; no identity drift; no hand error; no cyan/green cast; paired scale must remain compatible with a separately produced A04.

Joint A05 is intentionally excluded. Do not generate a second founder or joint scene. The website fallback pairs independently approved A03 and A04 portraits in code.

### A06-01 — Rustam systems working portrait

References: Rustam identity set and selected A03. If supplied, use `system-interface-reference.png` only as the source of the interaction-state layout.

Quantity: 2. Aspect: 3:4.

```text
Create a vertical 3:4 observed working portrait for the About V3 section “Individual experience, brought together under one name.” Show Rustam making one visible system decision, not merely looking busy.

Rustam compares three interaction states: one state on a laptop or monitor, two matching states printed as simple frame diagrams. With one hand on the trackpad and the other hand physically isolating the chosen printed state, he is deciding which behavior should survive into implementation. If `system-interface-reference.png` is supplied, preserve its overall composition on the screen while keeping small text unreadable. If it is not supplied, use only simple non-branded interface blocks with no text.

Camera sits slightly above table height. Rustam appears in three-quarter view with natural concentration and no eye contact with the camera. His action must be immediately understandable from hand position and material arrangement.

Communicate the connection between experience design, interaction and implementation. No typing pose, code wall, decorative hardware, generic productivity scene or architecture background. Preserve Rustam’s exact identity and realistic hands. Apply the global art direction.
```

Acceptance: the chosen state is visually obvious; Rustam is making a decision; screen, paper and hand positions agree; no fake readable UI or malformed hand appears.

### A06-02 — Rustam systems detail

References: Rustam identity set and selected A06-01 for continuity. If supplied, use the same `system-interface-reference.png` as A06-01.

Quantity: 2. Aspect: 3:2.

```text
Create a wide 3:2 observed editorial detail from the exact same working session as A06-01 for the same “Individual experience” section.

Frame one natural hand aligning the selected printed interaction state directly beside its corresponding laptop state. Include one thin connector mark or ruler edge that makes the paper-to-screen relationship visually clear. Rustam may be partially visible in soft three-quarter profile, but the decision evidence is the focus. If `system-interface-reference.png` is supplied, preserve its large-scale state arrangement while keeping fine text unreadable. If it is absent, use clean abstract UI blocks only.

Match A06-01 in wardrobe, workspace, props, light, lens family and grade. No anonymous stock-hands look, invented readable copy, fake brand, code close-up, device glamour shot, architecture image or decorative material collage. Preserve exact identity where visible and keep every hand anatomically correct. Apply the global art direction.
```

Acceptance: the image reads as evidence of one decision; it clearly belongs to A06-01; it is useful at a 3:2 crop; no generated interface is presented as real client proof.

Select one A06-01 and one A06-02.

### A14-00 — shared brief detail

References: workspace references if present. No identity references required.

Quantity: 2. Aspect: 3:2.

```text
Create a wide 3:2 overhead editorial process photograph for a showreel transition about two readings becoming one decision. Do not depict Rustam, Marija or any identifiable person.

Two natural pairs of hands work on the same neutral brief. The left side arranges three simple interaction-state cards into a precise sequence. The right side arranges three image/tone cards into an audience rhythm. Both sides move toward one central near-black decision card marked only by a single deep-cherry line, with no readable words. The visual story must be obvious: different inputs, one agreed direction.

Use warm-cotton paper, near-black card, a real working tabletop, one metal ruler and restrained editor marks. No architecture images, moodboard interiors, fake brand, fake client screen, floating paper or decorative clutter. Hands must be anatomically realistic. Apply the global art direction without portrait/identity instructions.
```

### A14-01 — demonstration: exclusive, not cold

References: interface reference for palette and restraint only.

Quantity: 2. Aspect: 8:5. Intended master: 1600×1000 or highest available.

```text
Create an 8:5 photographic micro-scene for the About V3 demonstration “Exclusive, but not cold.” This image must show how restraint becomes welcoming through a human interaction, not through architecture.

At a small creative-studio table, one natural hand opens a severe near-black presentation folder toward another person outside the frame. Inside is warm-cotton paper, one tactile fabric or paper sample and one restrained deep-cherry editor mark. The gesture feels selective and carefully prepared, but openly offered rather than guarded. The emotional contrast is formal exterior, warm human invitation.

No faces, building, doorway, lobby, interior-design showcase, luxury object, brand, logo, readable text, finished website mockup or fake client material. Keep the folder, opening gesture and warm inner material inside the center 70 percent. Apply the global art direction without portrait/identity instructions.
```

Acceptance: the frame communicates welcome through the gesture; without the hand interaction it should not be selected.

### A14-02 — demonstration: modern, still established

References: interface reference for palette and editorial order only. If supplied, `system-interface-reference.png` may guide the non-readable interface-state structure.

Quantity: 2. Aspect: 8:5.

```text
Create an 8:5 observed editorial process frame for the About V3 demonstration “Modern, but still established.” Show a current interaction decision anchored by durable editorial order.

On one working surface, place a tablet or laptop showing three clean non-branded interface states with no readable text beside an archival-style printed page with a stable grid, generous margin and restrained serif hierarchy. One natural hand aligns the same content block across the digital and printed versions using a thin metal ruler. The contemporary behavior and established editorial logic must visibly agree.

No architecture, stone slab, building, luxury material board, fake brand, readable generated copy, finished identity or claimed client work. Keep the digital state, print grid and aligning hand inside the center 70 percent. Apply the global art direction without portrait/identity instructions.
```

Acceptance: viewers can see the same ordering principle in digital and print; it must not read as a generic materials moodboard.

### A14-03 — demonstration: memorable, not loud

References: interface reference for palette and restraint only.

Quantity: 2. Aspect: 8:5.

```text
Create an 8:5 observed editorial process frame for the About V3 demonstration “Memorable without becoming loud.” Show one restrained, repeatable signature interaction rather than an abstract sculpture.

Arrange three sequential interface-frame cards on warm-cotton paper. The first two are nearly identical and quiet; the third shows one single element completing a distinctive measured shift toward a thin deep-cherry alignment line. One natural hand holds the final card in place. Generous negative space makes the small change memorable. Recognition comes from repetition, timing and proportion rather than color volume.

No architecture, sculpture, surreal object, logo, readable text, fake brand, finished campaign, loud color, visual noise or decorative collage. Keep the three-frame sequence, final hand and signature alignment inside the center 70 percent. Apply the global art direction without portrait/identity instructions.
```

Acceptance: the one signature change is immediately identifiable; removing extra objects should make the frame stronger, not emptier.

Select one frame from each A14 family. The three selects must share the same tabletop, paper family, light, lens character and grade, but communicate three different decisions. Label all three `CONVENIUM-DEMONSTRATION` in metadata, not in image pixels.

## 7. Corrective prompt library

Use at most one targeted correction round per asset family.

### Identity-only correction

```text
Change only the named person’s facial identity to match the uploaded real identity references more accurately. Preserve the current composition, pose, gaze, expression, wardrobe, body proportions, hands, camera position, background, lighting, color grade, depth of field, and crop. Restore the reference person’s exact face shape, eyes, nose, jaw, hairline, current age, natural asymmetry, and real skin texture. Do not beautify or stylize the face.
```

### Hand-only correction

```text
Change only the malformed hand or fingers to anatomically correct natural human anatomy consistent with the current pose and action. Preserve identity, expression, body, composition, objects, lighting, grade, background, and crop. Do not add or remove objects, limbs, jewelry, text, or gestures.
```

### Pair-match correction

```text
Match only the apparent lens, camera height, subject scale, lighting softness, black level, warm-cotton balance, and restrained grain to the selected paired portrait. Preserve this person’s exact identity, posture, inward gaze, wardrobe, props, negative-space safe area, and crop. Do not copy or merge the other person’s features.
```

## 8. Phase 3 — video generation

Animate only accepted still selects. Generate two variants per clip. Use First Frame when exact opening composition is important. Use Ingredients/References only when the selected model supports them without dropping identity references. Prefer the highest-quality compatible model shown in Flow.

### V01 — Rustam micro-action

First frame: selected A03. Add Rustam identity references if the mode supports them. Quantity: 2. Aspect: 16:9 if Flow can reframe safely; otherwise retain the still’s native orientation for source and mark desktop reframe required. Duration: 6s with First Frame, or 8s if the selected reference mode only supports 8s.

```text
Animate the approved Rustam opening portrait with restrained natural motion only. Rustam glances from a printed interaction map toward the collaborator across frame-right, makes one small thoughtful hand adjustment, and settles. Add a slow controlled camera push below three percent. Preserve exact face, hair, age, body proportions, hands, wardrobe, background, lighting, grade, and crop. No speech, lip movement, smile, new object, moving text, screen change, floating paper, or dramatic camera motion. Cinematic natural timing.
```

### V04 — hands-only brief convergence

First frame: selected A14-00. Quantity: 2. Aspect: 16:9 or the closest safe wide mode. Duration: 6s First Frame or 8s when reference mode requires it.

```text
Animate the selected hands-only brief detail. The left hand aligns the structural grid, the right hand adjusts the tone sequence, and both stop at the central decision card. The overhead camera remains fixed. Preserve every material and card position. No new card, readable text, logo, morphing hand, extra finger, camera movement, dramatic shadow, or floating object.
```

Video rejection rule: one identity, hand, object-continuity, text, or camera-warp defect is sufficient to reject the clip. Do not hide a defect with trim speed or darkness.

## 9. Phase 4 — external showreel-tool handoff

Do not open Scenebuilder and do not create a timeline, reel, montage, music track, title card, voiceover, transition, poster, or finished showreel in Flow.

Place only these approved source clips in `06_EXTERNAL_SHOWREEL_HANDOFF`:

```text
V01-rustam-micro-action-SELECT-PENDING-HUMAN-APPROVAL
V04-brief-detail-convergence-SELECT-PENDING-HUMAN-APPROVAL
```

For each clip, preserve the full untouched output and provide its model, duration, aspect ratio, source still, identity references, and any known crop or continuity risk. These two clips are source material only. The separate showreel tool will combine them with real website recordings, real Marija artifacts, existing work media, live/editor typography, licensed music, captions, and final exports.

## 10. Final output audit

Required selected stills:

```text
A03-rustam-opening-SELECT-PENDING-HUMAN-APPROVAL
A06-01-rustam-systems-working-SELECT-PENDING-HUMAN-APPROVAL
A06-02-rustam-systems-detail-SELECT-PENDING-HUMAN-APPROVAL
A14-00-shared-brief-SELECT-PENDING-HUMAN-APPROVAL
A14-01-exclusive-warm-SELECT-PENDING-HUMAN-APPROVAL
A14-02-modern-established-SELECT-PENDING-HUMAN-APPROVAL
A14-03-memorable-quiet-SELECT-PENDING-HUMAN-APPROVAL
```

Required selected video sources:

```text
V01-rustam-micro-action-SELECT-PENDING-HUMAN-APPROVAL
V04-brief-detail-convergence-SELECT-PENDING-HUMAN-APPROVAL
```

For each selected asset, report:

```text
Asset ID:
Flow asset name:
Generation type:
Model:
Aspect ratio:
Duration (video):
Identity references:
Other references:
Candidates generated:
Correction rounds:
Rejected outputs and reasons:
Selected because:
Known risk:
Human approval required from:
```

Global completion checklist:

- [ ] Rustam identity appears accurate in every selected Rustam asset.
- [ ] No Marija likeness, identity reference, avatar, or inferred second founder appears anywhere in this run.
- [ ] A03 preserves the prescribed lens, camera-height, scale, grade, and safe area so Marija can independently produce a compatible A04.
- [ ] Every visible hand is anatomically credible.
- [ ] No generated readable text, fake interface, fake logo, or fake client context appears.
- [ ] All A14 frames are metadata-labelled Convenium demonstrations.
- [ ] No architecture-led image, luxury interior, stone-and-metal moodboard or abstract sculpture appears in any selected asset.
- [ ] Every selected image can be matched to one exact section job in the Section contract.
- [ ] No real work, Marija artifact, music, typography, or external showreel source was altered or replaced in Flow.
- [ ] Desktop and mobile safe areas remain usable.
- [ ] Video contains no speech/lip movement, morphing, changing screens, or camera warping.
- [ ] Selects, alternates, and rejects are in their required collections.
- [ ] `06_EXTERNAL_SHOWREEL_HANDOFF` contains only the two untouched selected source clips and their metadata.
- [ ] Final report lists every unresolved rights, identity, crop, or source-media risk.

## 11. Post-Flow download contract

Download the highest-resolution untouched select as the master. Do not repeatedly upscale a weak image. Conversion, art-directed crops, final grading, AVIF optimization, captions, live typography, and every showreel-editing task happen later in the separate showreel tool after human approval.

Target website filenames after post-production:

```text
public/media/about-v3/portraits/rustam-opening.avif
public/media/about-v3/portraits/rustam-opening-mobile.avif
public/media/about-v3/process/rustam-system-01.avif
public/media/about-v3/process/rustam-system-02.avif
public/media/about-v3/process/shared-brief-01.avif
public/media/about-v3/brief-demo/exclusive-warm.avif
public/media/about-v3/brief-demo/modern-established.avif
public/media/about-v3/brief-demo/memorable-quiet.avif
```

Archive masters outside `public/` and record provenance as:

```text
filename,asset_id,creator,source,tool_model,date,reference_files,rights_owner,publication_approved,notes
```

## 12. Current Flow capability notes

Checked against official Google help on 2026-08-11:

- Flow Agent on web/PC can batch-generate, edit selected media, rename assets, create collections, and archive unused assets.
- Flow can create images as standalone assets/ingredients and retain edit history.
- Flow can animate images and create video from text, ingredients/references, first frames, and supported video inputs.
- Model/feature compatibility, duration, region availability, and credit cost vary. Inspect the active model and credit cost before the run.
- As currently documented, first-frame video supports several short durations; Ingredients/References-to-Video may be limited to 8s on Veo models. Use the prompt’s fallback duration rule rather than dropping identity references.
- Scenebuilder is intentionally out of scope for this run because the showreel will be assembled in a different tool.

Official references:

- https://support.google.com/flow/answer/17093911?hl=en
- https://support.google.com/flow/answer/16729550?hl=en
- https://support.google.com/flow/answer/16353334?hl=en
- https://support.google.com/flow/answer/16352836?hl=en
- https://support.google.com/flow/answer/16935718?hl=en
