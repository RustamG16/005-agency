# About V3 — Confirmed UI Lockups, Sequence, and Motion Context

Status: **curated approval record for planning; implementation is not authorized**  
Updated: 2026-08-13  
Route: `/about-v3`

This folder contains the complete working UI sequence accepted or carried forward during the section-by-section discussion. Some images contain known stale media or copy details; those exceptions are stated here. A lockup is a composition and interaction reference, not a production-ready bitmap to place on the webpage. Rebuild its layout, type, rules, diagrams, and controls as responsive HTML/CSS.

## Files in sequence

### `01a-opening-founder-walk.png`

Section: **01 — Founder-walk opening hero**

Purpose: introduce Rustam on the left and Marija on the right through one silent black/red studio film. The film plays autonomously and is not tied to scroll progress.

Important: both figures are provisional visual placeholders until original founder identity packs are supplied. Do not ship or use their generated faces as identity authorities.

Motion contract:

- One approximately 10-second forward-playing film; fixed camera and scale.
- No decoder plates in the current opening direction.
- No scroll scrub, reverse playback, or camera zoom.
- The final frame holds both founders inside predetermined 4:5 crop-safe regions.
- Once the film is substantially outside the viewport, pause it for performance.
- Reduced motion starts from the strongest completed paired frame.

### `01b-opening-split-transition.png`

State: **opening-to-profile transition midpoint**

Purpose: explain the browser-built handoff from one wide film to two founder cards.

Motion contract:

- After the film endpoint, a short GSAP timeline duplicates the same frame into two synchronized masked layers.
- The original wide layer fades while Rustam's left crop and Marija's right crop contract into portrait containers.
- The camera and people remain visually stationary. Only masks, transforms, spacing, divider, and opacity change.
- Use a short soft pin only for this interface transition. A second deliberate scroll/swipe skips directly to completion.
- Scrolling upward keeps the completed state and does not reverse or replay the walk.

### `02-founder-profile-endpoint.png`

Section: **02 — Founder profile endpoint**

Purpose: permanent 50/50 introduction after the opening film.

Motion contract:

- Each live crop crossfades to a matched high-resolution 4:5 still after the cards settle.
- Founder names, responsibilities, and statements enter only after the media is stable.
- Both founders retain equal visual authority.
- The displayed people are placeholders pending approved original source media.

### `03-your-idea-is-enough.png`

Section: **03 — Your Idea Is Enough**

Purpose: introduce the client's fragile, criticized, or incomplete idea as the compact business companion.

Known replacement: if this mockup contains the earlier baby/creature interpretation, replace that subject with the constant-scale robot defined by `08a-constant-scale-avatar-correction.png`. The page composition remains the UI reference; the old creature is not a production asset.

Motion contract:

- Normal scroll; no pin and no scrub.
- Prefer a quiet ambient loop or still with minimal companion breathing/core-light behavior.
- The message is safe reception and understanding, not literal therapy or medical treatment.

### `04-idea-analysis-lab.png`

Section: **04 — We Read Between the Lines**  
Source: `../idea-analysis-lab-web-mockup/section-04-idea-analysis-lab-webpage.png`

Purpose: Marija carefully analyzes the same vulnerable business companion and converts ambiguous signals into `IDEA PROFILE / 01` with `CORE`, `AUDIENCE`, `FEELING`, and `TENSION`.

Media boundary: the generated layer supplies the companion, observation cradle, laboratory atmosphere, and later Marija's physical action. All dossier text and indicators remain live UI.

Motion contract:

- Normal document scroll; no pin and no scroll scrub.
- Preferred media is a restrained 6–8-second silent ambient loop: soft companion breathing, one scanner pass, one writing gesture, and a quiet hold.
- Live profile markers may enter once with a short GSAP timeline after the section crosses the viewport threshold.
- Do not reverse the diagnostic action when scrolling upward.
- Reduced motion displays the approved endpoint still with all live labels already resolved.

### `05-three-rehabilitation-programs.png`

Section: **05 — One Diagnosis, Three Ways Forward**  
Source: `../three-rehabilitation-programs-web-mockup/section-05-three-rehabilitation-programs-webpage.png`

Purpose: Marija and Rustam turn one diagnosis into three credible programs: Restore, Adapt, and Evolve. The center companion is real; the three alternatives are projections, not clones.

Media boundary: generated media supplies founders, companion, cradle, reflections, and projection light. Program names, descriptions, selection states, and lines remain live UI.

Motion contract:

- Normal document scroll; no pin and no scrub.
- A forward-playing 6–8-second loop may show both founders annotating shared evidence before the three projections illuminate sequentially and hold.
- If implemented as still media, use one short GSAP entrance timeline for the three program panels with a restrained 80–120 ms stagger.
- Do not mark any program as selected in this section.
- Reset any physical video loop through a brief reflection sweep or controlled blackout, never visible reversal.
- Reduced motion shows all three directions already visible.

### `06-apollo-system-intake.png`

Section: **06 — Meet the System Behind the Work**  
Source: `../apollo-system-intake-web-mockup/section-06-apollo-system-intake-webpage.png`

Purpose: Rustam entrusts Apollo with the same compact companion and one approved plan. This introduces the system before execution begins.

Media boundary: generated media supplies Rustam, Apollo, companion, plan tablet, environment, and lighting. Page copy and any system labels remain live UI.

Motion contract:

- One quiet 7–9-second forward-playing handoff film: approach, presentation, examination, careful receipt, plan illumination, hold.
- No scroll scrub and no reversing the handoff.
- Scroll may trigger play once when the section is substantially visible. Returning upward shows the accepted endpoint rather than replaying the exchange.
- No construction, specialist activation, treatment, or finished output appears here.
- Reduced motion uses the endpoint still with Apollo safely holding the assignment.

### `07-apollo-orchestration-atlas.png`

Section: **07 — The Right Specialist for Every Task**  
Source: `../apollo-orchestration-atlas-web-mockup/section-07-apollo-orchestration-atlas-webpage.png`

Purpose: explain the public-safe orchestration model: Apollo decomposes the approved direction, matches bounded work to specialized professional agents, equips them with the appropriate skill, coordinates dependencies, and returns integrated work to Rustam for final direction.

Public sequence:

`APPROVED PLAN -> APOLLO / ORCHESTRATOR -> SPECIALIST LANES -> INTEGRATION -> RUSTAM / FINAL DIRECTION`

The explanatory verbs are:

`DECOMPOSE -> MATCH -> EQUIP -> COORDINATE -> VERIFY`

Illustrative lanes:

- Visual Director + Asset Generation
- Content Strategist + Messaging
- Design Engineer + Interface Systems
- Motion Specialist + GSAP
- Quality Critic + Accessibility and QA

Media boundary: generated stills supply Apollo, five anonymous specialists, the same companion, and coordinated environments. The orchestration map, relationships, lane names, numbers, and detail panels are browser UI. Do not flatten the full architecture into one image.

Motion contract:

- This is the only confirmed section that may justify a bounded pinned sequence because the relationship between five lanes is difficult to explain linearly.
- Recommended desktop behavior: a short pinned GSAP timeline progresses through five labeled states. Pin a stable outer wrapper and animate children, never the pinned element itself.
- Use one ScrollTrigger on the top-level timeline. Do not attach separate ScrollTriggers to child tweens.
- The diagram progress may use a modest numeric scrub for responsiveness; specialist media clips themselves play forward and are not scrubbed or reversed.
- Animate node/card movement with `x`, `y`, `scale`, and `autoAlpha`. Do not animate `width`, `height`, `top`, or `left` when transforms can express the same result.
- Keep simultaneous layers bounded. Pause or remove inactive media; do not run seven videos at once.
- Mobile should become a normal vertical sequence with discrete once-per-entry reveals and no pin.
- Reduced motion shows the complete architecture and integrated endpoint immediately.
- Public safety: never expose real prompts, commands, chain-of-thought, model configuration, private agent instructions, hidden routing criteria, or sufficient logic to reproduce Apollo.

### `08-delivery-ui-composition.png`

Section: **08 — Built to Work / delivery resolution**

Purpose: close the companion metaphor before moving into real proof.

Known mandatory replacement: the human child in this older mockup is superseded. Replace it with the exact compact robot companion shown in `08a-constant-scale-avatar-correction.png`. The companion remains the same physical size as at intake; it becomes coherent and functional but does not grow.

Motion contract:

- One forward 8–10-second integration/recovery reveal may be used after corrected keyframes are approved.
- Apollo's specialist apparatus retracts; contributions resolve into a coherent environment; the same small companion activates and takes one confident step.
- No transformation into an adult body, large animal, hero, logo, or superior mascot.
- No scrub or reverse. Returning upward shows the completed state.
- Reduced motion shows the compact repaired endpoint immediately.

### `08a-constant-scale-avatar-correction.png`

Type: **mandatory character correction sheet, not a webpage UI**

Purpose: replace every earlier baby, biological animal, enlarged adult creature, or growing mascot depiction throughout Sections 03–08.

Locked rule:

`DECONSTRUCTED -> REASSEMBLING -> COHERENT`

All three states occupy the same compact scale and silhouette box. Improvement means structural coherence, not physical growth.

### `09-real-work-comparison.png`

Section: **09 — Proof in Practice**

Purpose: end the metaphor and show real proposal-stage website work through before/after comparison modules.

Content correction: the UI structure and slider treatment are the reference. Production content must follow the current proof decision in `../MEDIA-GENERATION-PLAN-V2.md` and the authoritative handoff. Do not trust project names or placeholder old captures baked into this mockup without verifying the supplied sources.

Motion/interaction contract:

- The comparison is direct manipulation, not a scroll animation.
- Use an accessible pointer, touch, and keyboard-operable before/after divider.
- Do not autoplay both sides or add decorative parallax.
- Use real matched captures only. No fake legacy sites, invented results, launch claims, metrics, or testimonials.
- Simple once-only text entrances may use GSAP, but the comparison remains user-controlled.

### `10-inquiry-requirement.md`

Section: **10 — Inquiry**

No UI image has been approved or generated yet. This requirement file is intentionally present so the sequence is complete and a future chat cannot silently omit the closing section.

## Full page sequence

| Order | Section | Status | Relationship to confirmed folder |
| --- | --- | --- | --- |
| 01 | Founder-walk opening hero | Working direction; final identity media deferred | `01a-opening-founder-walk.png` and `01b-opening-split-transition.png` |
| 02 | 50/50 founder profiles | Working direction; matched identity stills deferred | `02-founder-profile-endpoint.png` |
| 03 | Your Idea Is Enough | Working UI; old subject must be replaced | `03-your-idea-is-enough.png` plus avatar correction |
| 04 | We Read Between the Lines | Locked | `04-idea-analysis-lab.png` |
| 05 | One Diagnosis, Three Ways Forward | Locked | `05-three-rehabilitation-programs.png` |
| 06 | Meet the System Behind the Work | Locked | `06-apollo-system-intake.png` |
| 07 | The Right Specialist for Every Task | Locked | `07-apollo-orchestration-atlas.png` |
| 08 | Built to Work / recovery endpoint | Working UI with mandatory avatar replacement | `08-delivery-ui-composition.png` and `08a-constant-scale-avatar-correction.png` |
| 09 | Proof in Practice | Working UI; source/project labels require verification | `09-real-work-comparison.png` |
| 10 | Inquiry CTA | Required closing section; UI not generated yet | `10-inquiry-requirement.md` |

## Page-level motion rhythm

The site must not feel like every section uses the same scroll trick.

1. **Hero media:** autonomous forward-playing film, not scroll-scrubbed.
2. **Hero-to-profiles:** one short, browser-built GSAP transition after the film ends; this is pending, not part of the confirmed files here.
3. **Sections 03–06:** normal scroll with restrained media playback and occasional discrete UI entrances.
4. **Section 07:** optional bounded pin because orchestration has five dependent states.
5. **Section 08:** forward-playing recovery reveal, not scrubbed or reversed.
6. **Section 09:** direct-manipulation before/after sliders; do not add ornamental scroll animation.
7. **Section 10:** short functional CTA response only.

This produces three distinct interaction families rather than repeating one technique:

- autonomous cinematic media;
- discrete UI timelines;
- one justified scroll-linked system explanation.

## GSAP implementation guidance for the later build phase

The project already contains `gsap`, `@gsap/react`, Next.js, React, and Lenis. Do not add another animation dependency.

- Use `@gsap/react` and `useGSAP()` for scoped setup and automatic cleanup in client components.
- Register `ScrollTrigger` once before use.
- Use `gsap.timeline()` with labels for multi-step sequences rather than chained delays.
- Put ScrollTrigger on the top-level timeline only.
- Use `gsap.matchMedia()` for desktop/mobile branching and `prefers-reduced-motion`.
- Use transforms and `autoAlpha`; reserve `will-change` for elements actively animating.
- Refresh ScrollTrigger only after media/fonts/layout changes that affect measurements, not continuously.
- When Lenis is active, integrate it through the project's existing scroll bridge; do not create a second smooth-scroll instance.
- Create triggers in page order and destroy/revert them on component unmount.
- No production markers.

The motion specification is intentionally recorded now so media endpoints and crop-safe compositions are correct. Actual timelines, selectors, trigger distances, and performance tuning should be written only after all UI lockups and media are approved and implementation authorization is granted.

## Accessibility and interruption rules

- `prefers-reduced-motion: reduce` must remove pins, scrub, repeated loops, and spatial transformations that are not essential.
- Every video is muted, `playsInline`, and accompanied by a poster.
- Pause media substantially outside the viewport.
- Never trap scrolling for a cinematic sequence.
- If a future section temporarily pins during autonomous video, a second deliberate wheel/swipe must skip to the completed state.
- Keyboard and touch users must be able to operate proof sliders and explicit replay controls.
- Content cannot depend on motion completion to become readable.

## Source of truth and update rule

- Approval status comes from `../MEDIA-PLANNING-HANDOFF.md` plus later explicit user approvals.
- Production requirements come from `../MEDIA-GENERATION-PLAN-V2.md`.
- When the user locks another UI mockup, copy it into this folder with its section-prefixed filename and update this file in the same turn.
- Do not replace an existing confirmed file with a new variant unless the user explicitly approves the replacement.
- Do not delete rejected or superseded evidence without separate cleanup approval.
- Do not edit `/about-v3` until the full media plan and later implementation plan are approved.
