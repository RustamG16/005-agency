# Media production guide — About V3 / Two Lenses, One Direction

## 1. What this media system must communicate

> **Rustam/shared prompt authority — 2026-08-11:** use `google-flow-one-take-production-brief.md` for the current one-take run. Its section-specific A03, A06, A14 and V01/V04 prompts supersede the older generic copy/paste prompts in this guide wherever they differ. In particular, do not use the architecture-, stone- or sculpture-led A14 directions below.

The page is not asking visitors to admire two portraits. It must prove three things:

1. Rustam and Marija bring different, credible readings to the same problem.
2. Those readings converge into one decision and one accountable delivery relationship.
3. Convenium can create refined digital motion and visual systems without pretending to have an established studio-client history.

The visual motif is therefore **paired difference → visible interpretation → shared direction**. Every generated or recorded asset must support one of those beats.

## 2. Current Google workflow notes

These instructions were verified against Google's official help pages on 2026-08-10:

- [Create videos in Google Flow](https://support.google.com/flow/answer/16353334?hl=en)
- [Edit videos and build scenes in Flow](https://support.google.com/flow/answer/16935718?hl=en)
- [Flow models and supported features](https://support.google.com/flow/answer/16352836?hl=en)
- [Generate and edit images with Gemini Apps](https://support.google.com/gemini/answer/14286560?hl=en&p=generate_images&rd=1)

Google currently supports image generation/editing with Nano Banana models, multiple reference images, character consistency, Flow ingredients/references, start/end frames and short Veo/Omni video clips. Feature availability, model names, clip lengths and credit costs can vary by subscription and region; check the active model and cost shown in Flow before each batch.

### Recommended model posture

- **Fast composition tests:** Nano Banana 2.
- **Final identity-sensitive stills:** Nano Banana Pro when available.
- **Founder motion from a selected still:** Flow Video using Ingredients or First Frame. Prefer the highest-quality Veo option that supports the chosen reference mode.
- **10-second clips or video-to-video edits:** Gemini Omni Flash only if the account/region exposes the needed feature; otherwise use shorter Veo clips and edit externally.

Never depend on generated text inside images. All typography, labels, interface screens and provenance text must be added in the website or video edit.

## 3. Folder and filename contract

Prepare this structure before implementation:

```text
public/
  media/about-v3/
    portraits/
      rustam-opening.avif
      rustam-opening-mobile.avif
      marija-opening.avif
      marija-opening-mobile.avif
      founders-together.avif
    process/
      rustam-system-01.avif
      rustam-system-02.avif
      marija-communication-01.avif
      marija-communication-02.avif
      shared-brief-01.avif
    brief-demo/
      exclusive-warm.avif
      modern-established.avif
      memorable-quiet.avif
    showreel/
      about-showreel-16x9.mp4
      about-showreel-9x16.mp4
      about-showreel-preview.mp4
      about-showreel-poster.avif
      about-showreel-poster-mobile.avif
      about-showreel.en.vtt
      about-showreel-transcript.txt
    proof/
      marija-artifact-01.*
      marija-artifact-02.*
      founder-document-01.avif
```

Keep original masters outside `public/`, for example:

```text
media-masters/about-v3/YYYY-MM-DD/
```

Store a `provenance.csv` beside the masters with:

```text
filename,asset_id,creator,source,tool_model,date,reference_files,rights_owner,publication_approved,notes
```

## 4. Prepare the identity references

### Production ownership update — 2026-08-11

The Flow production is split into two independent runs. `google-flow-one-take-production-brief.md` generates only Rustam plus identity-neutral shared/demonstration assets. `google-flow-marija-one-take-production-brief.md` generates only Marija’s A04, A07-01, A07-02 and V02 assets under her control. A05/V03 joint-founder generation is deferred; the approved fallback pairs the separately approved A03 and A04 portraits in code. Neither solo run may request, infer or generate the other founder’s identity.

Do this before opening Nano Banana:

1. Choose one reference per founder with a clearly visible face, accurate current appearance, neutral lighting and no beauty filter.
2. Prefer a high-resolution original rather than a social-media screenshot.
3. Crop only enough to remove irrelevant background. Keep hairline, jaw, eyes, nose and ears visible.
4. Rename the references `rustam-reference-original.jpg` and `marija-reference-original.jpg`.
5. Obtain each founder's consent to upload the image to the selected Google service and publish derived outputs.
6. Do not use a third party's photograph unless its use and transformation rights are clear.
7. For the first identity test, request a plain portrait with no complex pose. Approve likeness before asking for the full scene.

## 5. Shared art-direction block

Append this block to every still prompt unless a prompt overrides it:

```text
Visual campaign: Convenium Studio, a founder-led boutique digital studio in Klagenfurt, Austria.
Photographic language: contemporary European editorial portraiture; intimate, observant and precise; real skin texture; realistic hands; restrained 35mm grain; soft highlight roll-off; rich blacks with preserved detail.
Environment: a credible small creative workspace with warm bone paper, black materials, dark natural wood, brushed metal, one laptop or monitor, printed layouts and restrained architectural detail.
Palette: near-black #1B1717, warm cotton #EDEBDD, paper #F5F3E8, charcoal and extremely limited deep cherry #810100. No orange, cyan, neon or gold interface accents.
Wardrobe: understated black, charcoal or warm neutral clothing with no visible brand marks.
Mood: intelligent, calm, deeply attentive, selective, never corporate or performative.
Camera: editorial full-frame photography, 50mm or 85mm portrait character, realistic depth of field, no fisheye or extreme bokeh.
Identity: preserve the supplied person's facial identity, age, skin tone, hair, proportions and distinguishing features. Do not beautify, masculinize, feminize, age-shift or merge identities.
No readable generated text, logos, watermarks, luxury clichés, champagne, sports cars, marble mansions, handshakes, generic smiling office teams, glossy science-fiction styling, glassmorphism, fake awards or fake client material.
```

## 6. Nano Banana still-image workflow

For each asset family:

1. Open Flow or Gemini Images on desktop.
2. Start a fresh project/chat named after the asset ID, such as `A03 Rustam Opening`.
3. Select Nano Banana 2 for fast composition candidates or Nano Banana Pro for the final identity-sensitive pass.
4. Upload the named identity reference as an ingredient/reference. If the asset contains both founders, upload both references and explicitly map each filename to the correct person.
5. Paste the asset prompt plus the shared art-direction block.
6. Generate **four** candidates for founder portraits or paired scenes; generate **two or three** for supporting stills.
7. Reject any candidate with identity drift, distorted hands, invented text, excessive luxury props or mismatched lighting.
8. Continue from only the strongest candidate. Use one corrective instruction at a time: crop, gaze, hand position, background simplification or lighting—not all at once.
9. Download the highest-resolution result. Google states that available image resolution depends on plan; use the highest offered output and do not repeatedly upscale a weak result.
10. Record the prompt, model, date, reference filenames and accepted/rejected output count in `provenance.csv`.
11. Keep the untouched downloaded file as the master. Crop, grade and optimize copies during implementation.

### Identity correction prompt

Use only when composition is good but identity has drifted:

```text
Change only the person's facial identity to match the uploaded reference more accurately. Preserve the current composition, pose, gaze direction, wardrobe, hands, camera position, background, lighting, color grade and crop. Restore the reference person's exact face shape, eyes, nose, jaw, hairline, age and natural skin texture. Do not beautify or stylize the face.
```

## 7. Copy/paste still prompts

### P01 — Rustam opening portrait / A03

**Input:** `rustam-reference-original.jpg` as identity reference.

```text
Create a vertical 4:5 editorial portrait of Rustam for the left half of a split-screen boutique studio website opening.

Rustam sits or stands on the outer-left side of the frame and turns slightly inward toward frame-right, as if listening to a collaborator across a central seam. His expression is focused and calm, not smiling at camera. A restrained screen glow and one printed systems diagram suggest design and engineering work without showing readable text. Preserve a quiet inner-right 35% of the frame so live website typography and the central seam remain clear.

Use controlled side lighting from frame-left, a near-black/charcoal background with warm cotton details, realistic skin and understated black clothing. The image must convey systems thinking, design judgment and technical calm—not a programmer stereotype.

Output composition must survive both 4:5 and 16:9 crops. Preserve exact supplied identity. [Append shared art-direction block.]
```

Generate four. Select the frame with the strongest inward gaze and cleanest negative space.

### P02 — Marija opening portrait / A04

**Input:** `marija-reference-original.jpg` as identity reference.

```text
Create a vertical 4:5 editorial portrait of Marija for the right half of a split-screen boutique studio website opening.

Marija sits or stands on the outer-right side of the frame and turns slightly inward toward frame-left, as if listening and responding to a collaborator across a central seam. Her expression is attentive, self-assured and nuanced, not a corporate smile. A small selection of tactile layouts, campaign sequencing cards or negotiation notes appears in soft focus without readable text. Preserve a quiet inner-left 35% of the frame for live website typography and the central seam.

Use the same apparent lens, camera height, tonal grade, background family and lighting quality as the approved Rustam opening portrait, while giving Marija a distinct posture. The image must communicate visual judgment, communication and client understanding—not influencer clichés.

Output composition must survive both 4:5 and 16:9 crops. Preserve exact supplied identity. [Append shared art-direction block.]
```

Generate four. Compare A03 and A04 side-by-side before accepting either. Their authority, scale and image quality must feel equal.

### P03 — Founders together / A05

**Inputs:** both identity references; optionally approved A03 and A04 as style references.

```text
Create a wide 16:9 observed editorial photograph of Rustam and Marija reviewing one project direction at a long working table in a small European creative studio.

Map the first uploaded reference to Rustam and the second uploaded reference to Marija. Do not blend or swap their identities. Rustam is comparing an interaction flow on a laptop with a printed layout; Marija is marking a content or visual-sequencing sheet. Their attention is on the same decision, not on the camera. Their hands and the shared material create a visual convergence near the center, while both faces remain outside a protected central 15% seam.

The moment should feel observed and real: incomplete notes, one metal ruler, warm bone paper, black samples and restrained dark wood. No handshake, presentation pose, fake client, extra people or readable generated text.

Preserve exact identities and realistic hands. [Append shared art-direction block.]
```

If either identity drifts, prefer a real first-party photo shoot. A technically polished fictional likeness is not acceptable.

### P04 — Rustam systems working still / A06

**Input:** Rustam reference or an approved existing Rustam image.

```text
Create a vertical 3:4 observed working portrait of Rustam arranging a digital interaction map and reviewing a motion prototype. Show one hand on a laptop trackpad and one hand aligning a printed flow sheet. Keep all screen and paper content abstract and unreadable so live captions can explain the evidence. Camera is slightly above table height, face in three-quarter view, concentration natural, no eye contact.

The image should communicate the connection between design decisions and implementation—not generic coding. Preserve exact identity and realistic hands. [Append shared art-direction block.]
```

### P05 — Marija communication working still / A07

**Input:** Marija reference.

```text
Create a vertical 3:4 observed working portrait of Marija sequencing a small set of campaign frames and preparing a concise meeting note. She compares tone, order and audience response rather than posing with a moodboard. One hand moves a warm-bone card, the other rests beside a black notebook. All generated text is absent or fully unreadable; real work artifacts will be composited or presented separately in the interface.

Camera is at table height with Marija in three-quarter view, calm concentration and no eye contact. The image should communicate negotiation preparation, visual editing and continuity of meaning—not influencer content creation. Preserve exact identity and realistic hands. [Append shared art-direction block.]
```

### P06 — Shared brief detail / supporting process

**No identity input required.**

```text
Create a wide 3:2 editorial detail photograph of two different pairs of hands working on the same ambiguous creative brief. One side organizes structure with a precise grid and interaction sequence; the other side organizes tone with image fragments and content rhythm. Both meet at one central decision card. No faces, no readable text, no logos and no fake client brand. Warm cotton paper, near-black card, dark wood and one thin cherry-red editor mark. [Append shared art-direction block, omitting identity lines.]
```

### P07 — Demonstration: exclusive, not cold / A14-1

```text
Create an 8:5 editorial concept frame that visually explores the tension “exclusive, but not cold” for a clearly fictional premium hospitality brief. Combine one severe dark architectural threshold with tactile warm light, natural textile, human-scale seating and a precise but welcoming spatial rhythm. No people, no brand name, no logo, no readable text and no finished website mockup. It must feel like a material and atmosphere study, not claimed client work. [Append shared art-direction block, omitting portrait instructions.]
```

### P08 — Demonstration: modern, still established / A14-2

```text
Create an 8:5 editorial concept frame exploring the tension “modern, but still established.” Pair a disciplined contemporary grid, brushed metal and sharp interface-like alignment with aged natural stone, archival paper and one restrained serif-shaped abstract form. No brand name, no logo, no readable text and no finished identity. It must read as a research/mood artifact for a fictional brief. [Append shared art-direction block, omitting portrait instructions.]
```

### P09 — Demonstration: memorable, not loud / A14-3

```text
Create an 8:5 editorial concept frame exploring “memorable without becoming loud.” Use one unmistakable sculptural silhouette, generous negative space, near-black and warm cotton surfaces, and a single small cherry-red alignment mark. The composition should be recognizable from shape and proportion, not from saturated color or visual noise. No brand, logo, readable text, client context or finished campaign. [Append shared art-direction block, omitting portrait instructions.]
```

## 8. Flow video workflow

Use video only after the corresponding still is accepted.

1. In the Flow project, choose **Video**.
2. Use **Ingredients** when maintaining a founder's identity across clips, or **Frames → First frame** when the approved still should be the exact opening composition.
3. Add the approved still and, if necessary, the clean identity reference. Explicitly state which ingredient is the person and which is style/composition.
4. Choose 16:9 for showreel clips. Generate a separate 9:16 version only for the clips that survive the showreel edit.
5. Choose 6–8 seconds for controlled micro-action. Longer is not better; the final edit will use roughly 1.5–4 seconds from each clip.
6. Generate two variants. Reject clips with identity drift, hand morphing, camera warping, invented screens, exaggerated facial motion or visible mouth speech.
7. Save the best clip to the Flow project. Flow can save frames from clips for later ingredients/start frames.
8. Download the highest-quality untouched selected clips with their prompt/model/reference metadata. Do not use Flow Scenebuilder or assemble a rough reel in Flow; the user will create the complete showreel in a different tool.

### V01 — Rustam micro-action

```text
Animate the approved Rustam portrait with restrained natural motion only. Rustam glances from a printed interaction map to the collaborator across frame-right, makes one small thoughtful hand adjustment, and settles. Slow controlled camera push of less than three percent. Preserve exact face, hair, body proportions, hands, wardrobe, background, lighting and crop. No speech, lip movement, smile, new objects, moving text, screen changes or dramatic camera motion. 6 seconds, cinematic natural timing.
```

### V02 — Marija micro-action

```text
Animate the approved Marija portrait with restrained natural motion only. Marija shifts one campaign-sequence card, glances toward the collaborator across frame-left, and settles with attentive confidence. Slow controlled camera push of less than three percent. Preserve exact face, hair, body proportions, hands, wardrobe, background, lighting and crop. No speech, lip movement, smile, new objects, moving text, screen changes or dramatic camera motion. 6 seconds, cinematic natural timing.
```

### V03 — Shared table convergence

```text
Animate the approved two-founder working still. Rustam slides one structured flow sheet toward the center while Marija places one visual-sequence card beside it; both pause over the same decision. Motion is small, credible and synchronized. Camera remains nearly locked with a subtle lateral drift under two percent. Preserve both exact identities and every hand. Do not add people, speech, smiles, handshakes, floating papers, changing screens or readable text. 8 seconds.
```

### V04 — Brief-detail convergence

```text
Animate the hands-only brief detail. The left hand aligns the structural grid, the right hand adjusts the tone sequence, and both stop at the central decision card. Overhead camera remains fixed. No new cards, no readable text, no morphing hands, no dramatic shadows. 6 seconds.
```

### Video rejection rule

One identity or hand error is enough to reject a clip. Do not hide defects with a fast edit if the frame can still be paused on the website.

## 9. Record the two real websites

For each site:

1. Use a clean browser profile with bookmarks, extensions, notifications and OS desktop hidden.
2. Set viewport to 1920×1080 or record at 2560×1440 and downsample later.
3. Record 60fps when available; 30fps is acceptable if every animation remains smooth.
4. Hide the cursor unless its motion is part of the interaction proof.
5. Disable unrelated chat widgets/cookie banners if legally and technically permitted.
6. Record one continuous 15–25 second journey: still opening frame, controlled scroll through the strongest interaction, brief hold on the resolved state.
7. Do not scroll faster than a viewer can perceive the transformation.
8. Capture a second pass at a narrower/mobile viewport for the 9:16 reel if the responsive behavior is worth proving.
9. Export/retain the highest-quality master. Do not screen-record an already compressed social video.
10. Provide project name, URL, your contribution, year and publication permission.

## 10. Work examples needed

The final showreel/evidence story needs **five categories**, not five clients:

| Category | Minimum evidence | Why it matters |
|---|---|---|
| Scroll/motion engineering | Two clean website recordings | Proves the specialist experience premium buyers are seeking. |
| Complete digital direction | One existing project loop plus one still showing its wider system | Shows the work is more than an isolated animation. |
| Visual/content communication | Two real Marija artifacts or one clearly labelled multi-frame demonstration | Keeps the two-founder proposition credible and balanced. |
| Systems/technical rigor | One real interaction map, component/system fragment or portfolio/CV evidence | Supports Rustam's engineering claim without dumping code on the page. |
| Human collaboration | Two founder portraits and one shared-working clip | Converts abstract capability into a trustworthy relationship. |

Do not add five weak projects just to create volume. Two strong real digital pieces, one honest visual/content demonstration, founder credentials and a visible method are sufficient for launch.

## 11. Showreel plan

### Tool boundary — user decision 2026-08-11

Google Flow is used only to create the approved founder/process stills and the four short motion source clips V01–V04. A different tool will assemble the showreel. Keep the two website recordings, real Marija artifacts, existing work loops/covers, music, typography, captions, transcript, title cards, timeline, transitions, posters and final exports outside Flow. Flow must not generate replacements for missing real proof or combine these materials into a reel.

### Duration and structure

Target **52–58 seconds**. The reel can contain sound after deliberate play, but the page preview remains muted.

| Time | Visual | Meaning | Source |
|---:|---|---|---|
| 00:00–00:03 | Two near-black halves, one thin seam; live/edit title “TWO LENSES / ONE DIRECTION” | Establish the concept | Code/editor typography, no generated text |
| 00:03–00:08 | Rustam and Marija micro-actions alternate, then share the frame | Two accountable people | V01 + V02 or real footage |
| 00:08–00:16 | Scroll website recording 1; interface structure occupies left then full frame | System and interaction | User recording A09 |
| 00:16–00:23 | Marija artifact sequence/campaign rhythm on right; joins with site footage | Meaning and communication | A08 real artifacts |
| 00:23–00:31 | Scroll website recording 2 with one carefully chosen convergence cut | High-end motion capability | User recording A09 |
| 00:31–00:38 | Rustam process still/clip + real system fragment | Decisions survive implementation | A06 + A16 |
| 00:38–00:45 | Marija process still/clip + real visual/content artifact | Decisions survive communication | A07 + A08 |
| 00:45–00:52 | Shared table convergence or hands-only brief convergence | Two readings become one decision | V03 or V04 |
| 00:52–00:57 | Strongest resolved digital frame; title “CONVENIUM STUDIO / KLAGENFURT” | Close with authorship | Cleared real work + editor type |

### Editing rules

- Use the central seam as an editorial cut point, not as a constant gimmick.
- Begin with paired frames, allow important work to become full-width, then return to the pair.
- Keep most shots 2–4 seconds; give the strongest interface transformation 6–8 seconds.
- Do not use fast glitch transitions, fake UI overlays, template zooms, AI morph transitions or motivational voiceover.
- Use hard cuts, restrained match cuts, sliding masks and two or three deliberate convergence moments.
- Add all type in the editor with Archivo Black/Inter or the site's licensed equivalents.
- If music is used, choose a licensed restrained percussive/architectural track. Record the source and license. Avoid trailer booms and generic luxury piano.
- Include an English `.vtt` caption file for any spoken words. If there is no speech, provide an adjacent transcript/description listing projects and contributions.

### Export

- Desktop master: H.264 MP4, 1920×1080, 24/25/30fps matching the dominant source, 8–12 Mbps VBR, AAC 48kHz if sound exists.
- Mobile master: H.264 MP4, 1080×1920, 30–45 seconds, manually reframed, 6–8 Mbps.
- Preview loop: muted H.264 MP4, 1920×1080, 8–12 seconds, no sound, target below 3MB.
- Poster: 1920×1080 AVIF/JPG and 1080×1350 mobile poster.
- Keep a high-quality mezzanine/master export outside the website for future recuts.

## 12. Marija content and artifact preparation

Marija should answer these in short factual notes; polished copy can be written afterward:

1. What was the large Instagram page about, approximately when did she run it, and what did she personally do?
2. Which pages or businesses did she support with SMM or graphic design, and which can be named or shown?
3. What type of negotiations or client conversations does she handle best?
4. Which languages can she confidently lead a professional project call in, and which can she support conversationally?
5. What does she notice in a client's language or reactions that changes a design/content decision?
6. Which two pieces of visual or social work best represent her judgment today?

For every artifact, attach this metadata:

```text
Title:
Year:
Context: personal / independent / employer / client / Convenium demonstration
Marija's contribution:
May the brand/page name be shown? yes/no
May the artifact be published? yes/no
What decision does it demonstrate?
```

## 13. How a new studio should show proof honestly

Use these labels consistently:

- **Founder career:** work or credentials earned before/alongside Convenium.
- **Independent work:** real project made by one founder outside a Convenium engagement.
- **Convenium demonstration:** a self-initiated study showing current capability; never called a client case.
- **Convenium standard:** a public operating commitment, not a claimed historic result.

Do not use employer logos as a client wall. Do not quote outcomes that cannot be verified. A new studio earns confidence through strong founder evidence, transparent provenance, thoughtful demonstrations, clear responsibility and a credible working method.

## 14. Final media acceptance checklist

- [ ] Rustam and Marija approve their likenesses.
- [ ] Paired portraits match in grade, lens, scale and authority.
- [ ] No generated readable text or fake interface is visible.
- [ ] Marija has at least two real or clearly labelled demonstration artifacts.
- [ ] Both website recordings are clean, smooth and rights-cleared.
- [ ] Every project is labelled founder career, independent work or demonstration.
- [ ] Desktop and mobile showreels are manually composed.
- [ ] Preview video is muted, compressed and under the agreed target.
- [ ] Captions/transcript and useful alt text are prepared.
- [ ] Music and source-media licenses are recorded.
- [ ] All masters and provenance records are archived outside `public/`.
