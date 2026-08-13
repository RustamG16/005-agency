# Google Flow production instructions — About V3, Rustam-first pass

Use this file with `google-flow-media-brief.md`.

This pass creates every approved About V3 media asset that does **not** require Marija's identity. It may establish sets and continuity plates for later Marija scenes, but it must never invent, approximate, substitute, or depict Marija. Genuine joint-founder shots remain deferred.

## 1. Project setup

- Google Flow project: `CONVENIUM_ABOUT_V3_RUSTAM_FIRST`
- Use Flow on desktop/web with the Agent enabled.
- Add the project-wide instruction block from section 5 to **Agent Instructions**.
- Keep **Confirm before generating: Always** for the first pass. Generation spends Flow credits.
- Preserve generation history. Do not delete rejected variants.

Collections:

```text
00_INPUTS
01_WORLD_CALIBRATION
02_HERO
03_FOUNDER_REVEAL
04_PROCESS_PLATES
05_CONCEPT_DIRECTIONS
06_SELECTED_PENDING_APPROVAL
90_REJECTED
99_REPORTS
```

## 2. References to upload

Rename copies before uploading. Do not move or rename the originals on disk.

| Upload name | Local source | Use in Flow | Never use for |
| --- | --- | --- | --- |
| `office-environment-reference.jpg` | `C:/Users/Rustam Gurbanov/Downloads/d1b7232e-2496-4bd2-a161-2c11a822848a.png_202608121208.jpeg` | The definitive office architecture, furniture, presentation wall, windows, shelving, plants, materials and daylight | Founder identity or exact generated text |
| `hero-composition-reference.png` | `C:/Users/Rustam Gurbanov/.codex/generated_images/019ff5ab-ad1d-7bd1-8b79-43d2a8911d77/exec-91208d95-aa95-465b-a0a7-458eb5bbabc7.png` | Hero composition, acrylic-layer scale, ivory/black/red balance and faceless framing | A final shippable asset or a source of founder identity |
| `reveal-lighting-reference.jpg` | `C:/Users/Rustam Gurbanov/Downloads/Marketing agency Momentum.jfif` | Red-panel lighting, silhouette anticipation, reflective depth and dark-stage energy only | Layout, typography, five-person staging or agency identity |
| `about-interface-reference.png` | `.olympus/about-v3/evidence/implementation-desktop-cycle2.png` | Convenium palette, typography posture and editorial restraint only | Generated UI, readable text, or a layout to copy inside a photograph |
| `services-office-continuity.jpg` | Optional: export one clean frame from a current Services video showing the same office without a face in the foreground | Current lighting grade and physical continuity with Services | Reusing the Services action, shot or composition |
| `rustam-id-front.jpg` | New original camera photo; see section 2 | Rustam's primary face identity | Lighting, wardrobe or environment style |
| `rustam-id-three-quarter.jpg` | New original camera photo; see section 2 | Rustam's secondary face identity and depth | A generated pose sheet |
| `rustam-id-full-body.jpg` | New original camera photo; see section 2 | Current body proportions, posture and wardrobe fit | Face replacement or invented tattoos |
| `rustam-walk-performance.mp4` | New original 10-second tripod recording; see section 2 | Preferred reveal timing, gait, body, face and stopping pose | Background/style truth |

### Rustam identity — original-reference protocol

Do **not** use the current reusable Flow Character as the sole identity source. Its portrait/body views are generated derivatives and have already drifted from Rustam's real face. Never promote a generated portrait, body sheet or later output into the project's identity authority.

Use three new, original, unedited camera photographs on every identity-sensitive still:

- `rustam-id-front.jpg`: head and shoulders, directly front-facing, neutral expression, both eyes/ears/jaw/hairline visible, minimum 2000px short edge.
- `rustam-id-three-quarter.jpg`: natural 30–45 degree angle, same-day appearance and expression, minimum 2000px short edge.
- `rustam-id-full-body.jpg`: front-facing full body, relaxed neutral stance, current proportions and intended black wardrobe, minimum 2500px long edge.

Capture rules:

- use the original camera files, not screenshots, social downloads, WhatsApp compression or generated images;
- photograph in soft neutral daylight against a plain light-grey or warm-white wall;
- camera at eye/chest height, approximately 1.5–2.5m away; use a normal/telephoto phone lens rather than ultra-wide;
- disable beauty filters, portrait blur, HDR effects that change skin, colored light and dramatic shadow;
- keep current hair and facial hair consistent across all references;
- use a long-sleeved black overshirt if exact tattoo continuity is not documented; never let Flow invent or redesign tattoos.

For the reveal video, record `rustam-walk-performance.mp4`:

- exactly 10 seconds, 16:9 landscape, 4K preferred or clean 1080p;
- phone/camera locked on a tripod, eye-level, no zoom, no stabilization crop changes;
- plain neutral background and even frontal light so identity stays visible to the model;
- Rustam begins full-body and distant, walks toward camera, stops in portrait framing, faces the lens and holds still for the last second;
- no speech, smile, hand gesture, turn, speed ramp or other person;
- wear the same black wardrobe specified for the final reveal.

Because Google currently lists uploaded-video editing as unavailable in the EEA, do not make the Austria workflow depend on video-to-video editing. Use this real performance as the motion, gait, timing and framing reference while generating from the three original identity photographs plus approved first/last frames. If uploaded-video editing later becomes available in the account, it becomes the preferred route because it can preserve the real performance more directly. The existing Flow Character may be added only as a **secondary** cue after the real originals, never as the primary or only reference.

## 3. Reference hierarchy

When references conflict, follow this order:

1. `rustam-id-front.jpg`, `rustam-id-three-quarter.jpg` and `rustam-id-full-body.jpg` — Rustam's real identity and proportions.
2. `rustam-walk-performance.mp4` — Rustam's real reveal motion, gait and timing.
3. `office-environment-reference.jpg` — office architecture and material continuity.
4. Approved world-calibration frames generated in this project — camera, grade and updated set continuity, never identity.
5. `hero-composition-reference.png` — hero layout and acrylic-layer composition only.
6. `reveal-lighting-reference.jpg` — reveal lighting only.
7. `about-interface-reference.png` — palette and editorial restraint only.
8. Existing Flow Character — optional secondary cue only; never identity authority.

Never average references. Explicitly state the role of each reference in every prompt.

## 4. Shared visual bible

### Location boundary — mandatory

The About page uses **two unrelated physical locations**:

1. **Convenium office:** warm daylight office shown only by `office-environment-reference`. This location is used for process scenes.
2. **Founder reveal studio:** an independent black-and-red stage informed only by `reveal-lighting-reference`. It is not the office at night, a transformed office, or another camera angle of the office.

Never place the office window, blinds, presentation board, desks, monitors, shelving, plants, logo wall or office props in the reveal studio. Never apply the reveal studio's red panels or saturated red lighting to the office.

### Convenium office

All About process plates belong to the same office already seen in Services:

- tall window on frame-left with black horizontal blinds;
- warm off-white walls;
- large black presentation board on the rear wall;
- two black desks forming one working island;
- black mesh chairs;
- dark shelving on frame-right;
- restrained plants and books;
- warm natural daylight with directional window shadows;
- near-black, warm ivory and one restrained deep-cherry accent.

The office must remain recognizably the same room. About footage must not reproduce the Services videos. Services shows what Convenium makes; About shows how the founders listen, interpret, challenge, choose and maintain continuity.

### Wardrobe

Rustam wears understated black or charcoal tailoring/overshirt with no visible logo or pattern. Preserve the same wardrobe across H01, R01 and J00. No tie, sportswear, jewelry statement or corporate suit styling.

### Camera and grade

- Contemporary European editorial cinema.
- Natural perspective: 40–65mm full-frame character; avoid wide-angle facial distortion.
- Controlled camera: locked, very slow push, or deliberate lateral move under 4% of frame width.
- Rich blacks retain texture. Skin remains natural when revealed.
- Warm ivory daylight for the office process world.
- Saturated deep red is reserved for the founder-reveal transformation and small continuity objects elsewhere.
- No teal/orange grade, neon, glossy corporate commercial or extreme bokeh.

### Text and screens

Do not invent readable words, letters, numbers, logos, labels, watermarks or interface copy. However, when editing `office-environment-reference`, preserve the existing Convenium wall mark, existing presentation-board content and existing shelf signage exactly as photographed. The restriction applies to newly invented content, not to inherited details that establish the office's identity.

### Recurring objects

Use the same:

- long black working table;
- warm-ivory notebook;
- deep-cherry pencil;
- transparent acrylic layers;
- off-white paper cards;
- thin red line connecting decisions;
- black presentation wall;
- selected concept board.

Object position may change through the story, but design, material and scale must remain consistent.

## 5. Project-wide Flow Agent instruction block

Paste the following into Flow Agent Instructions:

```text
You are producing the Rustam-first media pass for Convenium Studio's About V3 page.

Execute only asset IDs listed in the supplied google-flow-media-brief.md. This pass may depict Rustam only by using his original uploaded identity photographs and real walk-performance video as the primary sources. It must never depict, infer, approximate, replace or generate Marija. It must never create a second female founder, a generic stand-in for Marija, a joint-founder scene, or a face on Marija's reserved side. Any asset requiring Marija remains DEFERRED-MARIJA.

Use office-environment-reference.jpg as the definitive physical room. Preserve the same window, blinds, black board, desk island, chairs, shelves, plants, wall tone and material family across every office frame. The About actions must be different from the Services videos: no repeated service-production shot, no generic typing, no staged camera work, no social-media filming and no repeated composition.

Use rustam-id-front.jpg, rustam-id-three-quarter.jpg and rustam-id-full-body.jpg as Rustam's immutable identity references. For motion, use rustam-walk-performance.mp4 as the primary performance source. Never create or use a generated portrait/body sheet as identity authority. Never continue an identity chain from one generated portrait into another generation. Preserve Rustam's current face, age, hair, facial hair, skin tone, body proportions and distinguishing features. Never beautify, slim, enlarge, age-shift or merge him. Identity drift, malformed hands or a stranger's face rejects the output.

Use hero-composition-reference.png only for the faceless hero's composition and acrylic-layer scale. Use reveal-lighting-reference.jpg only for red backlight, silhouettes and reflective depth. Never copy its five-person layout, typography or agency expression. Use about-interface-reference.png only for the Convenium ivory/black/deep-red palette and editorial restraint.

No generated readable text, letters, numbers, logos, interface labels or watermarks. Screens and papers show only abstract blocks, grids, rules and image fields at unresolvable scale. Apollo screens and proof work are real source media and are not generated in Flow.

Generate reference stills before motion. A video can be generated only from an accepted first frame. Create only the stated number of candidates. Allow one targeted correction round per asset family. Correct one variable at a time and preserve all accepted invariants.

Every selected output is SELECT-PENDING-HUMAN-APPROVAL, never FINAL. Record asset ID, model, aspect ratio, duration, reference files, character reference, candidate count, correction count, rejection reasons and unresolved risks. Preserve generation history and archive rejects.

Reject generic agency scenes, handshakes, smiling teams, open-plan offices, glass partitions, exposed brick, fake luxury props, floating interfaces, fake code, invented client work, fake awards, dramatic camera warping, speech/lip movement, morphing hands, generated text, duplicated red accents, or an office that no longer matches the reference.
```

## 6. Model and generation rules

- Check the active Flow model and displayed credit cost before each batch; availability and costs can change.
- Use the best available Nano Banana image model for identity-sensitive stills and continuity frames.
- For Rustam's reveal in Austria, use `rustam-walk-performance.mp4` as the performance reference and generate from the three original identity photos plus approved first/last frames. Google currently lists uploaded-video editing as unavailable in the EEA.
- If uploaded-video editing later becomes available in the account, prefer editing `rustam-walk-performance.mp4`, with the original photos included as identity ingredients when supported.
- If 10-second video-to-video is unavailable, use an identity-referenced 8-second workflow and create the extra two seconds later from the real performance/approved portrait hold. Never remove the original identity references merely to reach ten seconds.
- Generate two video variants maximum per approved first frame.
- Use First Frame or First + Last Frame when available. Do not rely on text-only video for identity-sensitive work.
- Save accepted video frames back into the project for future continuation.

Official Flow references:

- https://support.google.com/flow/answer/17093911?hl=en
- https://support.google.com/flow/answer/16729550?hl=en
- https://support.google.com/flow/answer/16353334?hl=en
- https://support.google.com/flow/answer/16352836?hl=en
- https://support.google.com/flow/answer/16935718?hl=en

## 7. Generation order

1. Validate the three original Rustam photos and the real walk-performance video. Reject generated derivatives as identity inputs.
2. Create office world-calibration frame `O00`.
3. Create Rustam hero frame `H01-R`.
4. Create reveal environment `R00`, Rustam reveal first/last frames `R01-R-F0/F1`, then `R01-R` video and `F01` portrait.
5. Create empty process continuity plates `D00`, `I00` and `J00`.
6. Create the three visual-direction boards `C01–C03` and selected state `C04`.
7. Audit, rename and organize selects.
8. Stop. Do not generate Marija, joint scenes, Apollo UI, Sonnwerk proof or Meridian proof.

## 8. Quality control

Reject or correct any output with:

- identity drift or invented second founder;
- Marija or a substitute woman anywhere in the frame;
- malformed hands, extra fingers, fused acrylic panels or inconsistent body proportions;
- office architecture drifting between scenes;
- wrong window, missing black board, different desks or a new open-plan office;
- repeated Services action/composition;
- readable generated text, fake logos or invented interface content;
- red lighting outside the reveal world except for one small continuity accent;
- facial reveal in the faceless hero;
- face visible before the correct reveal beat;
- camera warp, speed ramp, speech or lip movement;
- mobile-unsafe crop or essential subject crossing the centre crop boundary;
- generic stock-agency affect.

## 9. Final versus visual-development material

`SELECT-PENDING-HUMAN-APPROVAL` means technically usable but still requires Rustam's approval of identity, action, rights and continuity.

`VISUAL-DEVELOPMENT-ONLY` means composition/reference material that must never ship. This includes generated calibration frames, rejected candidates and any frame containing fictional/unapproved identity.

No asset becomes final until it is selected, exported, provenance-recorded and approved by the depicted person.
