# CONVENIUM STUDIO — Google Flow Media Guide

## Goal

Create the two missing media systems needed by the approved site direction:

1. **The Work:** a continuous gallery film reused across four project-card hover reveals.
2. **The People:** a continuous late-night studio film for the team section.

The supplied desert elevator video remains the hero. Do not regenerate it during this phase.

## Current Google Flow setup

Google Flow currently supports image creation with Nano Banana models and video creation from text, ingredients, frames and other videos. Model availability and credit cost can vary by account and region, so check the active model before every generation.

Recommended settings:

- Image anchors: **Nano Banana 2** for iterations; **Nano Banana Pro** for the final controlled anchor if available.
- Video: **Veo 3.1 Lite**, `8 seconds`, `16:9`, highest resolution available.
- Alternative: **Gemini Omni Flash** when you need to edit an uploaded generation or maintain references through a revision.
- Audio: request no dialogue, music or sound design; the website must also mute the file in code.
- Outputs per attempt: `2` variations where credits allow.
- Delivery: download the highest-quality MP4 available.

Why this workflow:

- Nano Banana establishes composition and art direction before spending video credits.
- A first-frame image gives the video model a stable environment.
- Veo 3.1 Lite supports short website-ready clips and frame-led generation.
- One gallery master reused through four crops keeps the work grid cohesive and light.

## Global visual bible

Use this block in every image and video prompt:

> Cinematic European creative-studio art direction. Controlled, editorial and tactile. Deep noir black, warm bone white, brushed metal and extremely restrained old-gold details. Strong negative space, precise geometry, realistic materials, subtle 35mm film grain, rich blacks with preserved detail, soft highlight rolloff, no glossy sci-fi styling. Photorealistic, premium commercial cinematography. No logos, no watermarks, no captions, no legible words, no malformed letters, no cuts, no dissolves, no montage.

## Continuity rules

- Every clip is one uninterrupted camera take.
- No cuts, dissolves, flashes used as edits or time jumps.
- Camera motion must be physically plausible and slow enough for hover or scroll use.
- Do not generate readable brand names inside media. Website typography will be added in HTML.
- Keep important subjects inside the central `70%` so desktop and mobile crops remain usable.
- Leave at least one calm negative-space zone for interface copy.
- Avoid fast hand motion, crowds, direct eye contact and complex reflections that encourage morphing.
- Choose one approved anchor image before generating its video.
- If a result changes architecture, faces, posters or lighting mid-shot, reject it rather than trying to hide the error.

## Asset 01 — The Work / Gallery master

### Website role

- Selected-work grid hover reveal.
- One master video reused across VANTA, AUREL, NULL/ONE and FERRO.
- Each card uses a different crop, object position and playback offset.

### Target file

`work_gallery_master.mp4`

### Nano Banana anchor prompt

> Create a single photorealistic cinematic frame inside a large contemporary identity-design gallery at night. The camera is at human eye level, positioned obliquely to a long sequence of warm bone-white gallery walls. Oversized black typographic posters, sculptural letterforms and embedded landscape-format screens repeat along the walls, but all visible typography is abstract and unreadable. The screens display restrained black, bone and old-gold motion-identity compositions. Polished dark concrete floor with subtle reflections, brushed black metal details, large areas of negative space, no visitors. Compose for a smooth lateral camera move from left to right with clear foreground, middle-ground and background layers creating parallax. Distribute interesting poster and screen details across the entire 16:9 width so four different vertical crops remain useful. Cinematic European creative-studio art direction. Controlled, editorial and tactile. Deep noir black, warm bone white, brushed metal and extremely restrained old-gold details. Realistic materials, subtle 35mm film grain, rich blacks with preserved detail, soft highlight rolloff. No logos, no watermarks, no captions, no legible words, no malformed letters, no people, no fisheye distortion. 16:9.

### Anchor acceptance checklist

- Clear sideways path exists for the camera.
- At least four distinct poster/screen zones are visible across the width.
- No readable fake text.
- Black, bone and gold dominate; no strong blue, red or purple.
- Architecture looks physically coherent.
- No essential object touches the frame edge.

### Veo 3.1 Lite prompt

Add the approved Nano Banana image as the **start frame**, then use:

> One continuous eight-second shot. The camera performs a perfectly smooth, slow lateral dolly from left to right along the gallery wall at constant human eye height. Foreground wall edges and sculptural letterforms pass close to camera, producing elegant parallax, while oversized posters and screens slide across the composition. Screen content moves subtly: abstract typographic shapes translate, crop and lock into place with restrained editorial motion. The gallery architecture, poster designs, lighting and screen positions remain consistent for the entire take. No people enter. Camera speed remains constant and ends while still moving laterally so the clip can loop or pause cleanly. Premium commercial cinematography, realistic motion blur, subtle film grain, deep detailed blacks, warm bone surfaces and rare old-gold highlights. Silent atmosphere; no dialogue, no music, no sound effects. No cuts, no dissolves, no teleporting, no sudden zoom, no speed ramp, no camera shake, no flicker, no changing architecture, no readable words, no logos, no watermarks.

### Optional end-frame method

If the account exposes first-and-last-frame generation:

1. Duplicate the approved anchor in Nano Banana.
2. Ask Nano Banana to move the camera approximately `2.5 meters` to the right while preserving the exact gallery, posters, lighting and lens.
3. Use the original as the start frame and the shifted image as the end frame.
4. Generate with Veo 3.1 Lite.

Do not use the two-frame method if the end frame changes poster content or architecture. A consistent first-frame-only generation is preferable to a forced morph.

### Stitch placeholder instruction

Handled by `STITCH-PROMPTS.md` Step 11. Attach a still exported from this master and use one short prompt targeting one card, for example:

> Duplicate the selected-work screen as a new screen showing the hover state of the VANTA card: the card photo is replaced by a crop of the uploaded gallery columns image, slightly zoomed, with the project name still visible on top.

### Website crop map

| Card | Crop | Playback offset |
| --- | --- | --- |
| VANTA | Left third; foreground poster edge | `0.0s` |
| AUREL | Center-left; bone wall and gold screen | `1.7s` |
| NULL/ONE | Center-right; embedded digital screen | `3.4s` |
| FERRO | Right third; dark metal and sculptural type | `5.1s` |

These offsets are implementation notes, not separate video exports.

## Asset 02 — The People / Night studio

### Website role

- Full-width team section.
- Human counterpoint to the controlled graphic sections.
- Shows collaboration without becoming a corporate team portrait.

### Target file

`team_night_studio.mp4`

### Nano Banana anchor prompt

> Create a photorealistic cinematic wide frame of a small four-person creative team working late in a refined design studio. They are observed naturally in silhouette and three-quarter profile, not posing. One person pins a print to a wall, two people quietly review layouts at a large table, and one person works at a dim monitor. A large window reveals soft city bokeh at night. The room contains physical paper mockups, typography specimens, cutting mats and restrained architectural furniture. Lighting is low-key and realistic: deep black shadows with preserved detail, warm bone task lights and one very subtle old-gold practical reflection. Leave the upper-left portion calm and dark for overlaid website copy. Faces are not prominent; hands are simple and mostly still. Cinematic European creative-studio art direction, controlled, editorial and tactile, subtle 35mm film grain, realistic materials, soft highlight rolloff. No logos, no visible brand names, no readable screen text, no watermarks, no neon colors, no corporate office, no people looking at camera. 16:9.

### Anchor acceptance checklist

- Exactly three to four people; no duplicated bodies.
- Silhouettes and profiles remain individually readable.
- A calm copy-safe area exists at upper-left.
- Hands are not central or highly visible.
- The studio feels used and specific, not like a stock office.
- City lights remain background texture rather than the subject.

### Veo 3.1 Lite prompt

Add the approved Nano Banana image as the **start frame**, then use:

> One continuous eight-second observational shot. The camera makes an extremely slow, smooth push forward with a slight drift to the right, as if entering the studio quietly. The four-person team continues subtle believable work: one person adjusts a single print on the wall, two exchange one printed sheet across the table, and the person at the monitor makes a small seated movement. City bokeh outside the window drifts naturally with parallax. Paper edges move slightly from indoor air. Maintain the exact same people, clothing, room layout, furniture, print wall and lighting throughout. Keep the upper-left negative-space area dark and calm for website copy. Premium low-light commercial cinematography, realistic motion blur, subtle film grain, rich detailed blacks, warm bone task light and one restrained old-gold reflection. No one looks at camera. Silent atmosphere; no dialogue, no music, no sound effects. No cuts, no dissolves, no time lapse, no sudden gestures, no face changes, no duplicated people, no extra limbs, no changing clothes, no morphing furniture, no camera shake, no flicker, no readable text, no logos, no watermarks.

### Stitch placeholder instruction

Handled by `STITCH-PROMPTS.md` Step 8. Attach a still exported from this clip with the prompt:

> In the team section, use the uploaded night studio photo as a full-width background image. Overlay in the upper-left dark area: Archivo Black uppercase heading "SMALL TEAM. SERIOUS LIFT." in bone white, and below it a short serif line about the team.

## Existing hero — integration notes

### Current role

The existing `assets/hero_video.mp4` is the complete Ground Level chapter. It should not be extended with invented cuts.

### Stitch instruction

Handled by `STITCH-PROMPTS.md` Steps 1, 3 and 4. Stitch only receives a screenshot of the film plus short single-purpose prompts; the doors-close transition and "GOING UP." threshold are represented as a separate static black screen, never described as motion inside a Stitch prompt.

### Brand continuity

The existing `CONVENIUM STUDIO` elevator signage is intentional and establishes the studio inside the story. Preserve it. Do not generate competing studio names in any additional media.

## Flow production procedure

1. Create a Flow project named `CONVENIUM_MEDIA`.
2. Create collections: `01_GALLERY`, `02_TEAM`, `SELECTS`, `REJECTS`.
3. Generate `4` Nano Banana anchor options for the gallery.
4. Select one anchor using the acceptance checklist; do not average incompatible directions.
5. Generate two Veo variations from that anchor.
6. Reject any clip with cuts, architectural drift, fake text or unstable screens.
7. Repeat the same image-first workflow for the team film.
8. Download the highest-quality MP4 available.
9. Keep original generations untouched; make revisions as new versions.
10. Add the approved anchor images to Stitch before asking it to design media cards.

## Quality-control checklist

### Technical

- `16:9` landscape.
- `8 seconds` target.
- Highest resolution available; use `1080p` when exposed by the account.
- No audio required; mute again in the website.
- No visible watermark in the intended production tier, where permitted by Google's plan and regional rules.
- No baked-in text or captions.

### Visual

- Single continuous take.
- No dissolve or hidden edit.
- Stable people, architecture, posters and lighting.
- Motion remains smooth when played at normal speed and when paused on arbitrary frames.
- First and last frames are both usable poster frames.
- Enough negative space remains for interface overlays.
- The two clips feel like the same brand world.

### Website readiness

- Important action survives center and vertical card crops.
- No critical detail sits behind anticipated text.
- Gallery clip supports four visibly different crops.
- Team clip reads clearly at reduced brightness.
- Poster images have been exported for reduced-motion and mobile fallbacks.

## Do not generate

- Separate unrelated videos for every project card.
- Fast montages or reels containing internal edits.
- Readable fake brand names inside AI media.
- Close-up talking heads.
- Busy crowds or complex hand choreography.
- Bright orange, cyan or magenta accents in the new gallery and studio assets.
- Elevator-themed stock icons or literal floor-button graphics.
- Media that imitates Symbol Studio's actual projects or assets.

## Reference documentation

- Google Flow model and feature support: https://support.google.com/flow/answer/16352836
- Creating videos with frames and ingredients: https://support.google.com/flow/answer/16353334
- Managing Flow projects and assets: https://support.google.com/labs/answer/16935308
- Google DeepMind Veo overview: https://deepmind.google/technologies/veo/
