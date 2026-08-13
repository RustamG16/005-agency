# About V3 — Media Planning Handoff

Status: **planning and visual direction only**  
Implementation approval: **not granted**  
Page-code edits: **do not begin until the user approves the final implementation plan**

This is the authoritative media handoff for the Convenium `/about-v3` redesign. It consolidates the decisions made during the media discussion and supersedes earlier speculative Flow prompts or storyboard logic where they conflict with this document.

## 1. Core creative direction

The page should demonstrate the maximum range of Convenium's capabilities while remaining smooth, controlled, readable, and coherent. Motion is encouraged when it explains a transition, establishes spatial continuity, or provides meaningful cinematic emphasis. Avoid repetitive motion patterns and gratuitous animation.

The approved visual master is:

- `C:\Users\Rustam Gurbanov\Downloads\hero-composition-reference_202608131312.jpeg`

Every section should feel like part of the same website and use the visual grammar of that reference:

- warm ivory paper-like field;
- near-black condensed display typography;
- restrained serif supporting copy;
- small burgundy labels;
- thin burgundy axes and registration marks;
- precise central symmetry or controlled editorial tension;
- transparent acrylic/glass-like physical media where appropriate;
- people or hands entering from frame edges;
- generous whitespace and tactile editorial composition;
- black navigation pill, logo at top left, and burgundy project CTA at top right where the global shell is visible.

Do not copy another website's distinctive composition. Use the approved image as Convenium's own style authority and extend its underlying visual system.

## 2. People and identity rules

- The team is Rustam and **Marija**.
- In the hero, Rustam is on the **left** and Marija is on the **right**.
- The hero remains faceless.
- Face reveal happens only in the separate founder-reveal section below the hero.
- Rustam media is produced first.
- Marija-only media and joint media remain explicit placeholders until her source material is supplied and that generation pass is approved.
- Do not create a fake Marija likeness.
- For Rustam, use original real photographs as the identity authority on every identity-sensitive generation.
- Do not use a generated portrait or generated body sheet as the only identity reference for later generations; that compounds likeness drift.
- Preferred Rustam reference pack: neutral front portrait, neutral three-quarter portrait, and neutral full-body photograph, with even lighting and a plain background.
- If tattoos are not accurately documented, use long sleeves rather than inventing or mutating them.

Earlier portrait reference:

- `C:\Users\Rustam Gurbanov\Downloads\A_striking_close-up_editorial_portrait_202608112204.jpeg`

This portrait contains green lighting and should not be used unchanged as the master identity reference. A corrected neutral-light version may be used after Rustam confirms the likeness.

## 3. Locations must remain separate

There are two completely different environments. They must never be merged.

### A. Convenium office

Reference:

- `C:\Users\Rustam Gurbanov\Downloads\d1b7232e-2496-4bd2-a161-2c11a822848a.png_202608121208.jpeg`

Use for the working-process sections only. Preserve the recognizable office identity:

- window and blinds;
- warm daylight direction;
- shared dark desk and chairs;
- shelving, plants, and wall board;
- existing Convenium/brand material and established visual details.

Do not redesign the room, replace the wall, remove its established brand details, or turn it into a generic office. The Services page already uses five videos in this office. About V3 should use the same environment but tell different stories and must not duplicate the Services-page scenes.

### B. Founder-reveal stage

Reference:

- `C:\Users\Rustam Gurbanov\Downloads\Marketing agency Momentum.jfif`

Use only for the cinematic founder reveal. It is a black-and-burgundy/red stage, not an office. Do not add desks, windows, shelves, wall boards, plants, or office signage. Do not use the office reference in the same generation prompt.

The lighting should begin as silhouette-producing backlight and resolve into flattering, neutral frontal face light. Avoid green or teal lighting.

## 4. Authoritative page sequence and media role

### 01 — Hero: two perspectives, one accountable direction

Purpose: introduce the dual perspective without revealing faces.

Approval status: **locked by user on 2026-08-13**.

Media:

- Use the approved hero composition as the visual master.
- Rustam is cropped at the left edge; Marija is cropped at the right edge.
- Hands and two transparent acrylic decoder plates form the central composition.
- Faces remain outside the crop or fully concealed.
- Each plate contains controlled fragments that carry no complete meaning on their own:
  - Rustam's plate contributes structure, systems, hierarchy, and interface fragments;
  - Marija's plate contributes context, meaning, language, and communication fragments.
- Only when the two plates align at the centre do the fragments resolve into one coherent editorial digital experience.
- The final decoded state should be recognisable as a refined website/interface composition rather than a decorative abstract collage.

Motion:

- Use one silent, seamless, approximately 7–9-second loop video. It autoplays muted and `playsInline`; it is not controlled by scroll.
- Start: both plates are held apart and remain individually unreadable.
- Middle: both founders move the plates inward; a narrow overlap begins to reveal partial meaning.
- End: the plates align into one decoded digital composition; both founders make the final adjustment together with equal authority.
- Loop exit: both founders lift the completed composition out of frame together, concealing the replacement with the clean starting state. Do not visibly reverse or unbuild the action.
- Use video for hands, clothing, acrylic movement, reflections, and the physical loop. Use code only for crisp interface overlays, the burgundy registration response, and optional initial page settle.
- Do not pin or scrub the hero. Pause the loop when sufficiently outside the viewport; normal scrolling always continues.
- Mobile requires an art-directed crop/edit that preserves both hands, both plates, and the central decoded state. Do not rely on an automatic centre crop.
- Reduced motion shows the strongest completed-state poster with a short opacity transition and no looping movement.
- Do not make the hero transform into or physically travel into the next section.
- Normal scrolling should lead to Section 02.

Approved visual-development storyboard:

- `_archive\pre-unified-2026-08-13\media\rejected-or-superseded\hero-decoder-storyboard\01-start-separate.png`
- `_archive\pre-unified-2026-08-13\media\rejected-or-superseded\hero-decoder-storyboard\02-mid-aligning.png`
- `_archive\pre-unified-2026-08-13\media\rejected-or-superseded\hero-decoder-storyboard\03-end-decoded.png`

These files include explanatory arrows and labels and are planning references only. Production media must remove the annotations and generated interface text.

Rejected hero alternatives retained as review evidence:

- `_archive\pre-unified-2026-08-13\media\rejected-or-superseded\hero-optical-lens-storyboard\`
- `_archive\pre-unified-2026-08-13\media\rejected-or-superseded\hero-moire-storyboard\`

### 02 — Founder reveal

Purpose: introduce the two founders as the people behind the two perspectives.

Approval status: **locked by user on 2026-08-13**.

Media:

- One silent, approximately 10-second, wide 16:9 video.
- Separate red/black reveal stage.
- Rustam walks on the left; Marija walks on the right.
- Both face and walk toward the camera.
- They begin as silhouettes.
- Faces become visible only when they approach portrait distance.
- Final video frame must allow clean portrait crops of both people.
- Generate matching high-resolution end-state portrait stills for Rustam and Marija; until Marija's source exists, use an explicit placeholder on her side.

Do **not** ask the video model to create the split-card interface. The video model generates the walk and lighting reveal only. The website creates the split using code.

Locked split mechanism:

- There is no camera zoom during or after the walk.
- The original 16:9 video retains its fixed camera, scale, and framing through the founders' stopping point.
- Its final composition must place each founder inside a preplanned 4:5 crop-safe region.
- At the split, the browser overlays two synchronized copies of the same video at the same playhead: one masked around Rustam and one masked around Marija.
- The original wide layer dims and fades while the two crop containers narrow and move apart into equal 4:5 portrait cards.
- The founders remain visually stationary during this interface transition; only masks, containers, spacing, divider, and layer opacity change.
- Each moving crop then crossfades into a matched high-resolution still using a restrained blur at the substitution boundary.
- Names and roles appear only after both cards settle.

Approved transition-mechanics storyboard:

- `media\founder-reveal-transition-storyboard\01-wide-video-endpoint.png`
- `media\founder-reveal-transition-storyboard\02-code-split-in-progress.png`
- `media\founder-reveal-transition-storyboard\03-completed-profile-cards.png`

These are identity-safe planning frames. Their arrows, labels, silhouettes, and placeholder profiles must not ship as production media.

Recommended playback and interaction state machine:

`not started -> playing and temporarily pinned -> splitting -> completed -> normal scrolling`

Detailed behavior:

1. The wide video starts once when roughly 45–55% of the section is visible.
2. The walking video plays autonomously at normal speed. It is not scrubbed, reversed, accelerated, or paused by scrolling.
3. While it plays, the section may be softly pinned so ordinary continued scrolling does not prematurely tear the user away from the reveal.
4. If the user keeps scrolling during the video, the walk continues uninterrupted.
5. A second strong wheel gesture or deliberate swipe should allow the user to skip to the completed card state; do not trap the user for the entire ten seconds.
6. When the founders stop at portrait distance and the faces are revealed, the interface split begins automatically.
7. A thin burgundy vertical divider appears at center.
8. The same synchronized video is rendered in two crop containers: the left crop follows Rustam; the right crop follows Marija.
9. The containers reshape into two taller portrait cards over approximately 1.0–1.4 seconds using a strong ease-in-out curve such as `cubic-bezier(0.77, 0, 0.175, 1)`.
10. Crossfade from the final moving frame to matched high-resolution still portraits. A subtle blur of roughly 2px may mask the moving-to-still substitution.
11. Names and roles fade in only after the cards settle.
12. The pin releases and scrolling continues normally into Section 03.
13. When scrolling upward, retain the completed two-card state. Do not reverse the walk.
14. Replay only after page refresh or through a small explicit replay control.

Reduced-motion behavior is a necessary accessibility fallback, not the main creative direction: show the final paired portrait composition with a short opacity transition and no walking/pinning sequence.

### 03 — A Little Like Therapy

Purpose: begin the process with Marija's consulting/discovery work and show that understanding comes before execution.

Media:

- Convenium office environment.
- Consultation moment led by Marija.
- Human, attentive, editorial—not a generic meeting or staged corporate handshake.
- Rustam may be absent or secondary.
- Marija remains a placeholder until her identity pack is supplied.

Potential scene: Marija at the shared desk listening while notes, language fragments, audience tensions, or transparent editorial layers form around the discussion.

### 04 — We Read Between the Lines

Purpose: translate the vulnerable, partially expressed idea into a clear diagnostic profile before any design or implementation begins.

Approval status: **locked by user on 2026-08-13**.

Media:

- Continue the idea-creature narrative from Section 03. The same small, visibly vulnerable creature is brought into a controlled editorial analysis lab.
- Marija leads the scene. Her likeness remains a placeholder until her approved identity sources are supplied.
- The creature rests safely in a transparent observation cradle; the setup must feel caring and precise, never surgical, cruel, grotesque, or medical-horror.
- Marija observes, takes notes, and converts ambiguous signals into a concise `IDEA PROFILE / 01` with four public-facing dimensions: `CORE`, `AUDIENCE`, `FEELING`, and `TENSION`.
- The approved webpage composition uses a large laboratory media field on the left and the emerging dossier/profile system on the right beneath the heading `WE READ BETWEEN THE LINES.`
- The lab extends the page's ivory/black/burgundy editorial world. It is a conceptual process environment and must not be confused with the black/red founder-reveal stage.
- The creature is diagnosed and understood here, but it does not grow, heal completely, or become a finished product yet.

Motion:

- Prefer one restrained 6–8-second silent loop or a mostly-static scene with small continuous actions: creature breathing, a soft scanner pass, Marija writing one note, and profile markers resolving.
- Do not scroll-scrub or pin this section. Normal scrolling continues.
- Keep all readable profile labels as live interface typography; generated media supplies the creature, lab, lighting, and human action only.
- The endpoint is a completed dossier ready to be passed to Rustam in Section 05.

Approved visual-development mockup:

- `media/idea-analysis-lab-web-mockup/section-04-idea-analysis-lab-webpage.png`

Avoid exposing the full internal methodology.

### 05 — One Diagnosis, Three Ways Forward

Purpose: show Marija and Rustam analyzing one shared diagnosis together and turning it into three credible rehabilitation concepts for the idea-creature.

Approval status: **locked by user on 2026-08-13**.

Media:

- Continue in the controlled editorial analysis lab from Section 04.
- The real vulnerable idea-creature remains safe, unchanged, and physically present in one central transparent observation cradle.
- Marija appears on the left and Rustam on the right as equal collaborators. Both likenesses remain anonymous placeholders until approved original identity sources are supplied.
- Three transparent projection chambers show possible future states rather than three physical clones:
  - `01 / RESTORE`: repair damage while preserving the idea's original character;
  - `02 / ADAPT`: strengthen its structure and responsiveness for the environment it must enter;
  - `03 / EVOLVE`: pursue a bolder, more expressive version of its potential.
- All three programs derive visibly from the same `IDEA PROFILE / 01` dossier created in Section 04.
- None is presented as selected yet, and no rehabilitation begins in this section.
- Maintain the ivory/black/burgundy editorial system and avoid medical-horror or generic science-fiction aesthetics.

Motion:

- Prefer a restrained 6–8-second silent loop: both founders annotate the shared evidence, then the three projections illuminate sequentially and hold together.
- Do not scroll-scrub or pin the section. Do not visibly reverse the projections to reset; use a short controlled lab blackout or reflection sweep to conceal the loop seam.
- Keep program names and explanatory language as live HTML; production media provides people, creature, laboratory, reflections, and projection light only.

Approved visual-development mockup:

- `media/three-rehabilitation-programs-web-mockup/section-05-three-rehabilitation-programs-webpage.png`

### 06 — Meet the System Behind the Work

Purpose: introduce Apollo as the embodied system and show Rustam entrusting it with the vulnerable idea-creature and the client-approved plan.

Approval status: **locked by user on 2026-08-13**.

Media:

- Rustam approaches Apollo carrying the same vulnerable idea-creature and the single approved plan.
- Apollo uses the user-supplied character references as strict identity authority: cracked ivory marble anatomy, fine gold fissures, dark mechanical channels, cyan eyes and chest core, ivory drape, and orbital halo.
- Apollo leans down and receives the creature carefully. The exchange communicates responsibility, not worship, sacrifice, or loss of human accountability.
- The approved plan appears as a thin transparent burgundy-lit tablet beside the handoff.
- No construction, treatment, agent activation, transformation, or finished output appears yet.
- The endpoint is Apollo acknowledging the assignment with the creature and plan safely in his care.

Motion:

- One quiet 7–9-second forward-playing handoff film may be used: approach, presentation, examination, receipt, plan illumination, hold.
- Do not scrub or reverse the exchange. Returning upward shows the accepted endpoint.
- Cyan remains confined to Apollo's intrinsic character details; the surrounding environment remains ivory/black/burgundy.

Approved visual-development mockup:

- `media/apollo-system-intake-web-mockup/section-06-apollo-system-intake-webpage.png`

Apollo identity authorities:

- `C:\Users\Rustam Gurbanov\Desktop\convenium_mvp\src\assets\media\gods\Apollo\Character_202607032015.jpeg`
- `C:\Users\Rustam Gurbanov\Desktop\convenium_mvp\src\assets\media\gods\Apollo\dont_change_anything_202607032014.jpeg`

### 07 — The Right Specialist for Every Task

Purpose: explain how Apollo decomposes the approved direction, assigns each bounded task to the appropriate professional agent, attaches the relevant specialist skill, coordinates dependencies, and integrates reviewed results under Rustam's final direction.

Approval status: **locked by user on 2026-08-13**.

Proposed public architecture:

- `APPROVED PLAN` enters `APOLLO / ORCHESTRATOR`.
- Apollo routes bounded work to five illustrative specialist lanes:
  - `VISUAL DIRECTOR` + `ASSET GENERATION`;
  - `CONTENT STRATEGIST` + `MESSAGING`;
  - `DESIGN ENGINEER` + `INTERFACE SYSTEMS`;
  - `MOTION SPECIALIST` + `GSAP`;
  - `QUALITY CRITIC` + `ACCESSIBILITY + QA`.
- Specialist results return through `INTEGRATION` to `RUSTAM / FINAL DIRECTION`.
- The explanatory sequence is `DECOMPOSE → MATCH → EQUIP → COORDINATE → VERIFY`.

Media metaphor:

- Apollo acts as chief physician/director in one coherent rehabilitation environment.
- Five anonymous specialist doctors each make one gentle symbolic improvement to the same idea-creature: visual identity, message, experience, motion, and quality.
- Use multiple editorial frames plus one orchestration diagram and one integrated-care endpoint.
- The companion becomes more stable and supported but is not yet fully repaired, coherent, or revealed.
- Avoid literal medical procedures, hospital clichés, autonomous-agent chaos, and the implication that specialists work without shared direction.

Public-safety boundary:

- Explain roles, skill categories, handoffs, dependencies, review, and human accountability.
- Do not publish prompts, chain-of-thought, private agent instructions, exact commands, model configuration, hidden routing rules, or enough logic to reproduce Apollo.
- The external Apollo repository is an internal operating system, not a plugin or Apollo.io integration.

Approved visual-development mockup:

- `media/apollo-orchestration-atlas-web-mockup/section-07-apollo-orchestration-atlas-webpage.png`

### 08 — Built to Grow

Purpose: deliver the emotional payoff of the creature narrative by revealing the coherent digital environment produced by Apollo's coordinated specialists and showing the idea ready to grow in the real world.

Approval status: **direction proposed; awaiting user review**.

Proposed media direction:

- Begin with the final integrated-care state from Section 07.
- The separate specialist apparatus retracts and its contributions resolve into one unified architectural environment around the creature.
- The environment represents the complete business-growth system: brand expression, content, responsive website, motion, engineering, accessibility, and quality working as one whole.
- Apollo remains behind the system as its architect/orchestrator; Rustam returns at the exit as the accountable founder receiving and reviewing the result.
- The treatment chamber opens and the same compact companion emerges repaired, coherent, active, and recognizably continuous at exactly the same physical scale as its vulnerable earlier state.
- Do not turn the creature into a logo, superhero, robot, or unrelated mascot. Its repaired marks may remain as subtle gold/burgundy seams to preserve its history.
- End with the same-size repaired companion taking one confident step into the completed environment rather than posing as a trophy.

Motion:

- Prefer one cinematic 8–10-second forward-playing reveal: integration, architectural resolution, chamber opening, first confident step, hold.
- Do not loop, scrub, or reverse the transformation. Returning upward shows the completed same-size state without replay.
- Reduced motion shows the completed environment with the same-size repaired companion already outside the chamber.

Message boundary:

- This demonstrates Convenium's intended production capability and process, not a claim that a specific client has launched or achieved measurable results.
- Avoid metrics, employee-equivalence counts, testimonials, or guaranteed business outcomes.

### 09 — Proof: Sonnwerk and Meridian

Purpose: show concrete redesign capability while accurately describing the commercial stage.

Use only these two projects on About V3 because all four projects already appear on Selected Work.

#### Sonnwerk

- Old: `https://sonn-werk.at/`
- New: `https://rustamg16.github.io/002-sonnwerk/`
- Existing assets: `media\work_examples\rustam\sonnwerk\`

#### Meridian

- Existing assets: `media\work_examples\rustam\meridian\`

Truth rules:

- These clients already had established branding and concepts used for years.
- Convenium did not replace branding that did not need replacement.
- The work focuses on improving the websites and digital expression.
- Projects are in proposal/negotiation stages and have not launched.
- Do not invent performance metrics, testimonials, approvals, launch claims, or client outcomes.
- Safe language: proposed redesign, concept direction, website transformation, or selected proposal work.

Media treatment:

- Use supplied covers, monitor images, or loops.
- Present old/new or problem/proposed-direction evidence where source material supports it.
- Keep the page treatment editorial and consistent with the approved hero style instead of duplicating the Selected Work page cards.

### 10 — Inquiry

Purpose: turn the story into a confident invitation to start a project.

Media:

- No new character generation is necessary.
- Prefer a typography-led closing composition using the ivory field, burgundy axes, tactile marks, and a clear project CTA.
- Motion should be short, responsive, and functional—not another cinematic sequence.

## 5. Recommended production workflow

Use a hybrid workflow:

1. Lock each section's storyboard and media function before generating final assets.
2. Use Codex image generation for art direction, identity-controlled stills, environment-controlled stills, and start/mid/end keyframes.
3. Use original Rustam photographs with every Rustam identity-sensitive generation.
4. Keep Marija and joint outputs as labeled placeholders until her identity references are available.
5. Produce video-ready keyframes only after a section's still composition is approved.
6. Use Seedance 2.5 to connect approved keyframes for cinematic video.
7. Use browser code—CSS/GSAP—for typography, navigation, grids, cropping, the reveal-card split, and scroll orchestration.
8. Generate a small representative batch first, review identity/environment consistency, and only then scale production.
9. Preserve prompt, model/version, source-reference list, and selected/rejected status for every final asset.

## 6. Required reference assignment

Never pass every reference into one generation. Assign only the references needed for that asset.

| Asset type | Required references | Explicitly exclude |
| --- | --- | --- |
| Hero extension/mockup | approved hero style master | office and reveal-stage references |
| Rustam portrait | original Rustam identity photos + hero style master if an editorial treatment is required | Marija placeholder, office unless the portrait is located there |
| Reveal video/keyframes | reveal-stage reference + original identity sources for the people shown | office reference |
| Office process still/video | office reference + identity source for the person shown + hero style master for graphic treatment | reveal-stage reference |
| Proof section | Sonnwerk/Meridian supplied work assets + hero style master | founder stage and generic office generation |
| Apollo/system visualization | approved page style + public-safe abstract system content | private Apollo prompts and internal decision logic |

## 7. Existing media inventory and status

### Authoritative or usable

- `concept-storyboard-v2\01-hero-master-style.jpeg` — authoritative hero/style master copy.
- `work_examples\rustam\sonnwerk\` — supplied project media; inspect individual files before placement.
- `work_examples\rustam\meridian\` — supplied project media; inspect individual files before placement.
- `work_examples\marija\` — supplied SMM examples; retain for later Marija/content pass.

### Exploratory, not final

- `_archive\pre-unified-2026-08-13\media\rejected-or-superseded\concept-storyboard\` — first exploratory storyboard set; its visual language predates the final style master.
- `concept-storyboard-v2\02-founder-reveal.png`
- `concept-storyboard-v2\03-consultation.png`
- `concept-storyboard-v2\04-interpretation.png`

These may help discuss composition, but they are not approved production assets.

### Superseded transition mockups

- `concept-storyboard-v2\02a-transition-mid.png`
- `concept-storyboard-v2\02b-transition-end.png`

These depict an earlier hero-to-stage morph idea. That idea is rejected. The hero now remains independent, followed by a separately entering wide reveal video.

### Rejected Flow output

- `flow\`

The batch is rejected because it merged the office and reveal stage and failed to preserve the exact office identity. Do not use these images as generation references or production assets. They may be retained temporarily as failure evidence.

Deletion status: the user requested unused-data cleanup, but the exact deletion scope was not confirmed. Do not delete `flow\`, exploratory storyboards, or deprecated documents until the user identifies which categories should be removed.

## 8. Media still needed

Required before final generation:

- original neutral Rustam identity pack: front, three-quarter, full body;
- Marija identity pack for her portrait, consultation scene, and joint scenes;
- approved clothing direction for both founders in the reveal;
- confirmation of the final reveal-stage framing and face-light timing;
- final Meridian old/current/proposal evidence and exact URLs if comparison copy requires them;
- the old version for the third project if it is ever reintroduced elsewhere (not needed for the current About proof pair).

Helpful:

- screenshots of the five existing Services videos so About scenes can avoid duplicate actions;
- Marija's strongest Canva/SMM examples labeled by client, role, and permission status;
- examples of GPT-assisted imagery that show range without revealing private client data;
- source files or exports for proof-section media at desktop and mobile crops.

## 9. Decisions still to lock before the implementation plan

1. Consultation section: still image with code-driven layers, or a short office video distinct from Services?
2. Which exact Marija examples support the consulting and SMM story?
3. Three directions: real concept examples, abstract generated directions, or a combination?
4. Apollo surface: which public-safe artifacts may be shown without disclosing internal prompts or decision logic?
5. Coming next: ongoing partnership, iteration/optimization, or a concrete delivery roadmap?
6. Proof: exact Meridian old/new source and accurate proposal-stage wording.
7. Cleanup: delete only failed Flow images, also delete superseded storyboard images, or preserve all rejected work as evidence?

## 9A. Production lock — AV3-03 companion master

Locked by user on 2026-08-13 when instructing the production workflow to continue to the next batch.

- The approved companion authority is the low, compact robot saved under `media/production/AV3-03-COMPANION-MASTER/`.
- Locked production files: neutral master, deconstructed state, reassembling state, coherent/repaired state, and four-state expression sheet.
- Every state remains the same apparent physical size and preserves the oversized ivory head, two glossy black eye modules, tiny body, four short limbs, triangular side fins, burgundy cable tail, amber core, and restrained brass seams.
- The generation record preserves prompts, reference authority, processing notes, and provenance: `media/production/AV3-03-COMPANION-MASTER/GENERATION-RECORD.md`.
- This lock governs companion identity and recovery continuity across Sections 03–08. It does not lock Section 03 human staging, authorize video generation, or authorize `/about-v3` implementation.
- Next production gate: approve the exact `AV3-04-LAB-CLEAN-PLATE` still batch before external generation.

## 9B. Production lock — AV3-04 laboratory plates

Locked by user on 2026-08-13.

- The approved identity-free Section 04 laboratory is saved under `media/production/AV3-04-LAB-CLEAN-PLATE/`.
- Locked production files: clean 16:9 laboratory plate, companion-in-cradle 16:9 plate, and art-directed 4:5 mobile plate.
- The clean and companion plates share one fixed camera, cradle geometry, physical apparatus, near-black/ivory/burgundy lighting, and desktop right-side interface-safe area.
- The mobile plate preserves the complete cradle and locked compact companion in a deliberate vertical composition rather than an automatic crop.
- No person, Marija placeholder, office details, founder-stage elements, surgical imagery, readable generated text, logo, or watermark appears.
- Prompts, reference authorities, source sizes, processing, and provenance are recorded in `media/production/AV3-04-LAB-CLEAN-PLATE/GENERATION-RECORD.md`.
- This lock authorizes these stills as Section 04 media authorities. It does not authorize the deferred Marija performance layer, video generation, or `/about-v3` implementation.
- Next production gate: approve the exact `AV3-05-PROGRAM-PROJECTIONS` still batch before external generation.

## 9C. Production lock — AV3-05 program projections

Locked by user on 2026-08-13.

- The approved identity-free Section 05 projection system is saved under `media/production/AV3-05-PROGRAM-PROJECTIONS/`.
- Locked production files: individual `RESTORE`, `ADAPT`, and `EVOLVE` chamber studies; the corrected shared three-program scene; and the stable reduced-motion hold.
- Every projection preserves the same compact companion identity, silhouette, and apparent physical scale. The three states express repair, responsiveness, and coherent activation without growth, new anatomy, heroic mutation, or physical cloning.
- The corrected shared scene retains one real deconstructed companion below three equally available projected directions. The rejected first shared-scene attempt is recorded but is not included in the delivery folder.
- Program labels and descriptions remain live HTML; no generated readable text is embedded in the media.
- Prompts, source authorities, rejected-output count, processing, and provenance are recorded in `media/production/AV3-05-PROGRAM-PROJECTIONS/GENERATION-RECORD.md`.
- This lock authorizes these stills as Section 05 projection authorities. It does not authorize the deferred Rustam/Marija collaboration layer, video generation, or `/about-v3` implementation.
- Next production gate: approve the exact `AV3-06-APOLLO-MASTER` still batch before external generation.

## 9D. Production lock — AV3-06 Apollo master

Locked by user on 2026-08-13.

- The approved public-facing Apollo authority is saved under `media/production/AV3-06-APOLLO-MASTER/`.
- Locked production files: neutral full-body master, empty-handed receiving pose, public-safe directing/orchestration pose, and restrained system-active close-up.
- Every frame preserves Apollo's face, curled marble hair, cracked ivory anatomy, fine gold fissures, dark mechanical channels, cyan eyes/core, ivory drape, and orbital halo.
- Cyan remains intrinsic to Apollo and a few halo/system points; the environment remains near-black, ivory, gold, and restrained burgundy.
- No private prompts, hidden routing, reproducible orchestration logic, people, companion, readable generated text, logo, watermark, worship, ritual, or combat imagery appears.
- Prompts, source-reference roles, processing, and provenance are recorded in `media/production/AV3-06-APOLLO-MASTER/GENERATION-RECORD.md`.
- This lock authorizes these stills as Apollo identity authorities for Sections 06–08. It does not authorize private-system disclosure, video generation, or `/about-v3` implementation.
- The user approved `AV3-07-ORCHESTRATION-MEDIA-SET` and the remaining media-production plan on 2026-08-13. Production still proceeds section-by-section with explicit batch scope and review locks.

## 9E. Production lock — AV3-07 orchestration media

Locked by user on 2026-08-13.

- The approved Section 07 orchestration media is saved under `media/production/AV3-07-ORCHESTRATION-MEDIA-SET/`.
- Locked production files: work-package decomposition, five bounded specialist-treatment stills, integrated-care endpoint, and the 4K orchestration overview.
- Apollo remains consistent with AV3-06. The companion remains one physical subject at the AV3-03 locked compact scale and visibly mid-reassembly, preserving Section 08 for the coherent endpoint.
- Specialist presence is anonymous and non-identifiable: close treatment frames show black-gloved hands only. Contributions are expressed through physical material, hierarchy, modular-interface, timing, and verification studies.
- No baked-in text, real prompt, command, private skill, hidden check, reproducible orchestration logic, logo, watermark, or invented operational claim appears.
- All semantic labels, arrows, lane names, node relationships, and tooltips remain browser-owned and must be implemented accessibly later.
- Prompts, references, processing, and provenance are recorded in `media/production/AV3-07-ORCHESTRATION-MEDIA-SET/GENERATION-RECORD.md`.
- This lock authorizes these stills as Section 07 media authorities. It does not authorize video generation or `/about-v3` implementation.
- The user approved the exact `AV3-08-RECOVERY-ENDPOINT` still batch on 2026-08-13. Video remains a separate Higgsfield-only approval gate after its stills are locked.

## 9F. Production lock — AV3-08 recovery endpoint

Locked by user on 2026-08-13.

- The approved Section 08 recovery media is saved under `media/production/AV3-08-RECOVERY-ENDPOINT/`.
- Locked production files: integration start, apparatus-retraction midpoint, same-size coherent endpoint, art-directed mobile endpoint, and reduced-motion poster.
- The sequence continues directly from the AV3-07 integration endpoint. The apparatus retracts, final panels seat, the amber core activates, and the same compact companion becomes coherent without growing, aging, becoming humanoid, or changing species.
- Apollo remains calm and secondary. Cyan stays intrinsic to Apollo; amber stays intrinsic to the companion. No people, generated readable text, UI, logo, or watermark appears.
- The mobile endpoint is deliberately recomposed rather than automatically center-cropped. The reduced-motion poster communicates completion without sequential motion.
- Prompts, references, processing, rejected-output count, and provenance are recorded in `media/production/AV3-08-RECOVERY-ENDPOINT/GENERATION-RECORD.md`.
- This lock authorizes these five stills as Section 08 recovery authorities. It does not authorize video generation or `/about-v3` implementation.
- Any 8–10-second forward recovery reveal remains a separate Higgsfield-only batch requiring its exact outputs to be restated before generation. The next non-video phase is `AV3-09` proof-source preparation.

## 9G. Implementation candidates — AV3-06 Rustam / Apollo handoff

Generated and integrated on 2026-08-13 under the user's explicit instruction to skip intermediate approval and polish later.

- The two 4K master keyframes are saved under `media/production/AV3-06-RUSTAM-APOLLO-HANDOFF/`.
- Start: Rustam presents the same compact companion and one thin approved-plan tablet to empty-handed Apollo.
- Endpoint: Apollo carefully holds the same companion and plan while Rustam remains present at the left.
- Both generations included the original neutral Rustam full-body, front-face and facial-detail references; the locked Apollo and companion authorities were supplied beside them.
- One candidate per state was generated with GPT Image 2 at 12 credits each. Balance moved from 732 to 708 credits. No retry and no additional video job occurred.
- `/about-v3` uses a user-controlled browser-native crossfade between optimized WebP derivatives. This satisfies the handoff narrative at lower cost than the optional S06 video.
- The two stills are implementation candidates, not user-locked final authorities. Identity detail, wardrobe/tattoo treatment and crop may be polished later as requested.
- Exact prompts, URLs, hashes, reference roles, cost and review notes are recorded in `media/production/AV3-06-RUSTAM-APOLLO-HANDOFF/GENERATION-RECORD.md`.

## 10. Approval boundary

This document does not approve a new media generation, page implementation, dependency, or destructive cleanup. Follow `../10-unified-completion-plan.md` and `../NEXT-CHAT-START.md`: resolve the four Slice A decisions first, use the mandatory prompt/role/placement/reference/output/quote card before every Higgsfield submission, and prefer locked stills plus browser-native motion. Only explicit implementation authorization permits editing `/about-v3`.

## 11. Remaining-generation provider decision

Updated by user on 2026-08-13.

- Route all remaining external image and video generation through the authenticated Higgsfield integration.
- Higgsfield's complete model catalog does not currently expose a model named Sora. Do not label another model as Sora.
- For remaining image generation, use Higgsfield `GPT Image 2` only as the explicitly disclosed fallback when a Sora model is unavailable. Identity-sensitive founder media remains blocked by the applicable first-party source packs and permissions.
- For remaining video generation, use Higgsfield `Seedance 2.0` by default, with locked start/end references where continuity matters, normal-speed forward action, and generated audio disabled unless separately approved.
- Existing locked OpenAI-generated stills remain authoritative and are not regenerated solely because the production provider changed.
- Every Higgsfield batch still requires an exact output scope before submission, followed by human review and a separate lock. This provider decision does not authorize `/about-v3` implementation.

## 12. Unified completion-plan proposal

The user paused further generation on 2026-08-13 after the 8-second 1080p AV3-08-V01 candidate cost 72 credits. All future generation remains paused until the remaining list, cost tiers, and implementation relationship are approved.

- Proposed authoritative completion plan: `.olympus/about-v3/10-unified-completion-plan.md`.
- Recommended non-hero defaults: 480p for small in-layout clips, 720p for prominent half-width clips, 5–6 seconds by default, one candidate, silent, and a fresh quote before submission.
- Browser implementation should carry masks, crops, diagrams, comparison sliders, scanner passes, labels, state transitions, reduced motion, and responsive behavior; paid video is reserved for physical founder/character action.
- Existing locked media remains authoritative. Existing AV3-08-V01 remains a review candidate; do not regenerate it merely to reduce resolution because its 72-credit cost has already been incurred.
- `/about-v3` already contains an earlier Two Lenses scaffold. It is reusable technical material but must be reconciled with the newer ten-section companion/Apollo story before implementation proceeds.

## 13. Mandatory prompt-and-placement preflight

Added by user direction on 2026-08-13.

- Before every image or video generation, Apollo must remind the user of the asset's exact page section, display placement, narrative role, and relationship to browser-built HTML/CSS/GSAP.
- Apollo must show the complete final generation prompt verbatim, all separate constraints, model/provider, references and their roles, exact output specifications, acceptance criteria, rejection fallback, fresh credit quote, current balance, and cost ceiling.
- Generation may begin only after the user approves the exact displayed asset version. Broad plan approval or approval of “all remaining media” does not replace this prompt-level gate.
- If the prompt, references, model, count, resolution, duration, audio state, or quoted price changes, Apollo must show a revised preflight and obtain new approval.
