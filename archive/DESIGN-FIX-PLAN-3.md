# Convenium Studio — Design Fix Plan, Pass 3 (QA)

Executed by Claude Code (Sonnet, Ultracode). Follow `CLAUDE.md` and IMPLEMENTATION-PLAN.md §0. Apply `.claude/skills/frontend-design`. This pass fixes verified bugs from live QA screenshots plus a site-wide balance audit. Every fix has an acceptance check — do not report done without running it.

---

## STATUS — code audit 2026-07-19 (read this first)

Pass 3 (FIX 1–6) was implemented at a structural level but **live QA on the homepage exposed behavioral bugs the original fixes did not fully solve.** Current state per fix:

| Fix | State | Notes |
|---|---|---|
| FIX 1 — hero hold on last frame | ✅ done | `ended`/`waiting` state machine + poster fallback in `Hero.tsx`; no hardcoded pause. |
| FIX 2 — elevator doors | ⚠️ regressed by design | Doors exist and close/open, but the sequence only mounts **after** the video ends (`!transitionReady` guard) → manifesto is skipped on early scroll; and the doors open onto black with Works as a *separate* pin below. See PASS 3B Stage 1. |
| FIX 3 — hero grade / gold / footer echo | ◑ partial | Grade + single gold scroll line done. Footer elevator echo unverified — leave as-is for now. |
| FIX 4 — one master timeline for beats | ✅ done | Beats run on one scrubbed timeline in `Hero.tsx`. |
| FIX 5 — works scrub pacing | ✅ done (structure) | 2.5-unit approach, `scrub: 1.2`, handoff window, per-case snap in `WorksFrame.tsx`. Video sizing + snap feel still wrong — see PASS 3B Stages 1–2. |
| FIX 6 — whitespace/balance | ◑ partial | Homepage `ServicesPreview` heading still leaves a large dead right zone; other sections un-audited. See PASS 3B Stage 3. |

**What is LEFT for the homepage is defined in PASS 3B below. Do PASS 3B, not FIX 1–6, unless a fix is referenced by a stage.**

---

## FIX 1 — Hero: stuck playback + hold on the LAST frame

**Observed:** video freezes mid-way (character standing at doors) instead of finishing.

**Required behavior:** the film plays once to its natural end and holds the final frame. No hardcoded pause timestamp.

- Remove any `T_ENTER`-style `currentTime` pause logic entirely.
- Hold via the `ended` event: `video.addEventListener('ended', ...)` with no `loop` attribute; keep the last frame displayed (do not reset `currentTime`).
- Guard against mid-play stalls: `preload="auto"`, and if `waiting` fires longer than 2s, show the poster of the final frame instead of a frozen buffer frame.
- The `SCROLL TO GO UP` indicator appears on `ended` (or after 1s of `waiting` fallback), not on a timer.
- Annotations keep their load-sequenced entrance but must be finished before the video ends (compress stagger if needed).

**Accept:** reload 3× — video reaches its true final frame every time; indicator appears only after it ends; no frozen mid-frame.

## FIX 2 — Restore the elevator-door transition

The two black panels sliding in from the sides were in the previous build and specified in DESIGN-FIX-PLAN-2 FIX 1.4 — the implementation dropped them. Restore:

- On first scroll past the ended hero: pin, two `#050505` panels slide from left and right edges to meet at center, ~600ms, `power4.in`, meeting with a hard stop (optional 1px bone seam flash ≤80ms at contact).
- At full black, release the pin directly into the `GOING UP.` state — the door black IS the next section's background, one continuous surface, no gap, no fade.
- Scrolling back up reverses: doors open to reveal the held final frame.
- Reduced motion: simple cut to black.

**Accept:** scroll down then up across the boundary 5× — doors close and open symmetrically, no flash of unstyled section between hero and GOING UP.

## FIX 3 — Hero repetition (C.R.A.P.)

**Problem:** the hero's dusk colors appear nowhere else, so the film reads as a foreign object rather than chapter one.

Keep the film colorful — it is the narrative "before" world — but tie it to the system from both directions:

1. Apply the approved grade from DESIGN.md so it sits closer to the palette: `brightness(0.78) saturate(0.78) contrast(1.08)` + 16–22% black overlay. Do not go monochrome.
2. All overlay UI in the hero uses only system tokens: bone text, hairline leaders, gold used once (the scroll indicator line may be gold — this is one of the page's three gold moments).
3. Close the loop at the end: the footer ("LET'S FIND YOUR NEXT FLOOR.") gets a barely visible backdrop — the hero's elevator-interior final frame at ~8% opacity under the black, so the story's first image faintly returns at the exit. One echo, not a pattern fill.

**Accept:** side-by-side screenshots hero vs. footer vs. any middle section — hero no longer reads as a different site; gold count per page ≤3.

## FIX 4 — Text animation system: stuck, early, overlapping

**Observed:** (a) intro caption text clipped/garbled under the process image; (b) `GOING UP.` and `LOUD.` rendered on top of each other with both semi-visible.

Root causes to fix, not patch:

- **Overlapping pinned states:** GOING UP and the three manifesto words live in one pinned region with independent tweens. Rebuild as ONE master timeline with sequential labels (`goingUp` → `loud` → `precise` → `unforgettable`), each state entering only after the previous fully exits (`autoAlpha`, `immediateRender: false`). At no scroll position may two states have `autoAlpha > 0` simultaneously — enforce with `set` calls at label boundaries.
- **Early triggers:** reveal animations fire before their section is on screen because pin spacers shift trigger positions. Recalculate: create all ScrollTriggers in DOM order or set `refreshPriority`, and call `ScrollTrigger.refresh()` after pins mount. Reveal triggers use `start: "top 85%"` measured post-refresh.
- **Clipped text:** the reveal mask (`overflow: hidden` line-mask) is cutting descenders and colliding with sibling layout (image 2's caption). Masks wrap ONLY the animated line, sized to `1.1em` line-height, never a parent with mixed content. Any caption under media is a separate element outside the media's mask.
- Restrict the reveal system to section headings and media blocks only (plan-2 FIX 6 rule) — remove it from captions, list rows and body copy.

**Accept:** slow-scroll the full page and screenshot every 500px: no clipped glyphs, no two overlapping pinned states, nothing animating while off-screen.

## FIX 5 — Works gallery scrub: pacing + handoff lock

**Observed:** scrub is too fast and choppy; cases start after an awkward gap.

- **Pacing:** the scrub range is too short. Set the pinned distance so the full video maps to ≥250vh of scroll (`end: "+=250%"`), `scrub: 1.2` for smoothing. Verify the file in use is the all-keyframe re-encode (`ffprobe`: every frame keyframe) — if not, re-encode per plan-2 FIX 3.
- **Handoff:** overlap the acts. During the last ~12% of the video's scroll range, case 01's poster and wall text already animate in, so by the time the final frame locks, case 01 is seated in the frame. Add a snap point exactly at video end (`snap` to the label) so the section rests on: final frame + case 01 in place.
- After the lock, continued scroll swaps cases 02–04 (as built), each with its own snap label.
- Scrolling upward reverses the handoff cleanly (case 01 leaves, video scrubs backward).

**Accept:** at 1440×900, scrub the section with slow and fast wheel input — video motion is smooth (no frame jumps), case 01 is fully seated at video end, snaps rest at intended states, reverse works.

## FIX 6 — Whitespace and balance audit (C.R.A.P. pass)

Image 5's pattern (huge dead zone right of/below a left-aligned block) repeats across the site. Audit EVERY section on every route at 1440 and 390 against:

- **Contrast:** each viewport needs one dominant element (scale or value). If a section's biggest object is empty space, it fails.
- **Repetition:** components reuse the same patterns — hairline rows, micro-label + rule eyebrows, media radius 8/10px, gold ≤3 per page. Kill one-off treatments.
- **Alignment:** everything sits on the 12-col grid; left text blocks pair with right-column content that shares their top edge or baseline. No floating orphans.
- **Proximity:** caption belongs to its media (≤16px), heading to its body (≤24px); unrelated groups separated by ≥80px or a hairline.

Mandatory applications:

1. **Team section (image 5):** heading + body move ONTO the film's dark left zone as overlay (per original spec), section height = video height, max 100vh. The empty bone block below the video is deleted.
2. Statement sections cap at 70vh unless they contain full-bleed media or a filled second column (plan-2 FIX 5 rules — re-verify each was actually applied: services hero index column, studio hero still/principles, footer contact column).
3. Intro section (image 2): the process image + caption group right-aligns into a defined column with the caption cleanly under the image; body text column and image column share top alignment.

**Accept:** full-page screenshots of all 5 routes at both widths; for each section state which C.R.A.P. rule anchors it; zero sections where empty space exceeds ~45% of the viewport without being composed negative space (i.e., type scale or media makes the emptiness read as intentional).

---

## Execution order

1. **Phase A — FIX 4** (animation system rebuild): everything else depends on stable triggers.
2. **Phase B — FIX 1 + FIX 2** (hero hold + doors): one timeline, test as a unit.
3. **Phase C — FIX 5** (gallery pacing): re-encode check first.
4. **Phase D — FIX 3 + FIX 6** (grade, echo, balance audit): visual pass, then full §0.3 verification: clean build, Playwright full-page + 500px-interval scroll screenshots at 1440/390, console clean after scroll+hover on all routes, deviations report in `qa/`.

Per-phase prompt: "Read CLAUDE.md and DESIGN-FIX-PLAN-3.md. Execute Phase <X> exactly. Run the Accept check for each fix in the phase and show the evidence (screenshots/ffprobe output) before marking done."

---
---

# PASS 3B — Remaining homepage work (live-QA driven)

Source: live QA by the client on the running homepage. This supersedes FIX 2/5/6 where they conflict. **Scope = homepage only.** Other routes come in a later pass. Three stages, run in order — Stage 1 is the foundation and must be signed off before Stage 2/3.

## Design decisions already made (do not re-litigate)

1. **One continuous pinned "curtain" scene.** Hero → manifesto → Selected Work is ONE pinned screen. The doors are the transition device and the content **behind the closed doors swaps from Hero to Selected Work while the doors are shut** — so when the doors open, Selected Work is already in place of the hero. Selected Work must NOT be a separate pinned section that scrolls up from below.
2. **Selected Work video = smaller framed panel**, not full-bleed. The scrub video lives inside a defined editorial frame (~55–62% of viewport width) with composed elements around it. This intentionally hides the clip's low quality and fixes the "doesn't fill the width" letterbox by making the smaller size deliberate.
3. Everything else stays bound to `CLAUDE.md` tokens and rules (no gradients/glass, gold ≤3 per page, fonts via `next/font`, no Symbol Studio content).

---

## STAGE 1 — Unified pinned curtain: always-on manifesto + behind-the-doors swap into Works

**This is the big one.** It merges the Hero pinned sequence and the Works pinned sequence into a single pinned choreography so the Hero→Work switch happens behind the closed doors.

### Bugs this fixes
- **B1 — Manifesto skipped.** In `Hero.tsx` the door/beat `useGSAP` returns early `if (reducedMotion || isMobile || !transitionReady) return;`. The pinned ScrollTrigger only exists once the video has `ended`/`stalled`. Scroll before the film ends → no pin → the page scrolls straight past the doors + beats into the next section. **The manifesto must play on every scroll-down regardless of video state.**
- **B2 — Works "comes afterwards."** Today `Hero` reopens its doors onto its own (faded-to-black) layer, releases its pin, and `WorksFrame` — a *separate* pinned section — then scrolls up from below. The client wants the door-open to reveal Work itself, with the Hero→Work swap having already happened behind the shut doors.
- **B3 — Scroll snap fights the user.** Both `Hero` and `WorksFrame` snap configs snap to the *nearest* stop with no direction lock, so a short scroll bounces back to the previous state. Feels broken in both the manifesto and the works scrub.

### Target architecture
Create ONE pinned component (suggested: `components/sections/home/OpeningSequence.tsx` replacing the separate `Hero` + `WorksFrame` pins on desktop; keep the existing static/mobile/reduced-motion fallbacks intact). It holds, stacked in one pinned stage:

- **Layer A — hero media** (`hero_autoplay.mp4` + grade + scrim + overlay line), holds its final frame.
- **Layer B — works gallery** (the framed scrub video + case posters + wall text — Stage 2 builds the framing; Stage 1 just needs Layer B mounted and swappable).
- **Doors** — two `#050505` panels above both layers.
- **Beats** — three manifesto lines above the doors.

One master scrubbed timeline, sequential labels, `immediateRender: false`, no two `autoAlpha>0` states overlapping (FIX 4 rule still applies):

```
label 0  heroHold   Layer A visible, doors open off-screen, held final frame + scroll cue
label 1  doorsShut  doors slide in from both edges → meet center (power4.in, hard stop)
label 2  beat1      "Welcome to Convenium"          (cross-fade, on the shut doors)
label 3  beat2      "We do not decorate businesses"
label 4  beat3      "We take them to another level"
   ── behind the still-shut doors: set Layer A autoAlpha 0, Layer B autoAlpha 1 (the SWAP) ──
label 5  doorsOpen  doors slide back to the edges → reveal Layer B (Selected Work)
label 6  worksApproach  gallery scrub push-in (Stage 2 video)
label 7+ case01 … case04  each case posters into the frame, wall text typesets
   ── release pin ──
```

### Requirements
1. **Always-on.** The pinned timeline mounts on desktop + no-reduced-motion **unconditionally** — never gated on `transitionReady`/video `ended`. Remove the `!transitionReady` guard.
2. **Video handling under the doors.** When `doorsShut` completes, if the hero video has not reached its end, seek it to its final frame (`video.currentTime = video.duration` guarded in try/catch) or freeze it — it's fully covered by the opaque doors, so quality/exact frame doesn't matter. Keep the FIX 1 `ended`/poster hold for the un-scrolled case.
3. **The swap is invisible.** Layer A→B crossfade happens only between `beat3` exit and `doorsOpen` start, while doors are fully shut. At no scroll position are both layers visible with the doors open.
4. **Snap fix (B3).** Use directional snapping so a partial scroll never reverses:
   `snap: { snapTo: <label progress array>, directional: true, duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: "power2.out", inertia: false }` (or `snapTo: "labelsDirectional"` if labels are placed at rest points). Snap rests only at meaningful states: `heroHold`, each `beat`, `doorsOpen`/first case, each case. Raise `scrub` toward `1.2–1.5` for smoothing. Verify a slow half-notch scroll advances-or-holds but never yanks back.
5. **Reduced motion / mobile.** Keep the existing static fallbacks: stacked beats then the static Works grid/stack. No pin, no doors, simple cut.
6. **Reveal-trigger recalculation.** After the merged pin mounts, `ScrollTrigger.sort()` + `refresh()` so downstream `HomepageReveals` triggers (`ServicesPreview` etc.) measure against the new pin height and don't fire early (FIX 4 rule).

### Accept (show evidence before marking done)
- Reload and immediately scroll (before the film ends) **5×**: doors always close, all three beats play in order, doors open onto Selected Work — manifesto is never skipped.
- Across the doors boundary the background behind the doors is Selected Work, not the hero frame and not a bare black gap.
- Slow single-notch and fast-flick wheel input in both the beats region and the works region: state advances or holds, **never snaps backward** to the previous state.
- `npm run build` clean; console clean after scroll + hover; Playwright full-page + 500px-interval screenshots at 1440×900 and 390×844; reduced-motion path still renders stacked beats + static works.

---

## STAGE 2 — Selected Work as a smaller framed, composed panel

Depends on Stage 1 (Layer B). Rebuild `WorksFrame` media from full-bleed letterbox to a deliberate framed composition.

### Bug this fixes
- **B4 — video not full width + low quality visible.** `.mediaBox { width: min(100%, calc(100svh * 16 / 9)) }` letterboxes on short-wide viewports (the client's case) and shows the clip at full size where its low quality reads. Making it a smaller intentional frame both removes the "not full width" complaint (the size is now clearly by design) and shrinks the clip so pixel-level quality is not legible.

### Requirements
1. **Framed panel.** The scrub video sits in a centered/left editorial frame ~55–62% of viewport width, max ~62vh tall, with an 8/10px media radius per tokens and a 1px hairline frame. Section background stays `--color-noir`. The scrub still drives `video.currentTime`; case posters (`.frameSlot`) and wall text reposition to the new frame geometry.
2. **Compose the surround so the screen doesn't read empty (FIX 6 C.R.A.P.).** Fill the space around the smaller frame with system elements: the `Selected Work` eyebrow, a large case index, the case name/meta/outcome as wall text beside the frame, and a hairline baseline rule. One dominant element per state (the framed film or the case name).
3. **Optional quality mask.** A very light grain/vignette over the framed video is allowed to further disguise the clip; no gradients/glass — a subtle noise texture or a `--color-noir` vignette only.
4. Preserve the accessible `srList` focus-jump nav and the static mobile/reduced-motion grid.

### Accept
- At 1440×900, 1920×1080, and a short-wide window (e.g. 1680×820): the frame is a consistent deliberate size, never a letterboxed full-bleed with black bars that looks broken; surrounding composition fills the viewport (no >45% dead space).
- Scrub still plays the video smoothly inside the frame; cases 01–04 poster into the frame with wall text; reverse works.
- `npm run build` clean; console clean; screenshots at both widths.

---

## STAGE 3 — Homepage whitespace / balance pass (FIX 6, homepage only)

Depends on nothing in 1–2 but do it last so it measures the final layout.

### Bug this fixes
- **B5 — capabilities/services dead zone.** `ServicesPreview` heading `max-width: 14ch` in a `1fr auto` head grid leaves a huge empty right zone below "FIVE DISCIPLINES. ONE CONNECTED SYSTEM." (see client screenshot). This is under-built vs the reference, not intentional negative space. The same left-block-plus-dead-right-zone pattern recurs down the page.

### Requirements
Audit every homepage section at 1440 and 390 against C.R.A.P. (Contrast / Repetition / Alignment / Proximity). For each, either fill/compose the space or cap the section height so emptiness reads intentional. Mandatory:
1. **`ServicesPreview` (capabilities):** kill the dead right zone. Either (a) let the `View all services` CTA + a short supporting line occupy the right column aligned to the heading baseline, or (b) pull the discipline list up to share the heading's top edge in a two-column lockup, or (c) cap the head block height and tighten `--space-7` padding — pick per the reference PNGs in `assets/design/` and the measured geometry in `audit-notes.json` (these override guesses). Heading should not float alone above emptiness.
2. **Every other homepage section** (`ProcessFilm`, `Principles`, `Faq`, and the merged opening scene's exit): no section where empty space exceeds ~45% of the viewport without a dominant type/media element making it read as composed. Statement sections cap ~70vh unless they carry full-bleed media or a filled second column.
3. Reuse existing components/treatments (hairline rows, micro-label eyebrows, 8/10px media radius); kill one-offs. Gold ≤3 uses on the page.

### Accept
- Full-page screenshots of the homepage at 1440×900 and 390×844; for each section name the C.R.A.P. rule that anchors it and confirm it against the matching reference PNG.
- Zero sections with >45% uncomposed empty space. `ServicesPreview` heading no longer sits above a blank right half.
- `npm run build` clean; console clean.

---

## Cursor Composer prompts (one per stage — paste verbatim, run in order)

> Each prompt assumes Cursor has the repo open. They tell Cursor to read the rules, do exactly one stage, and prove the Accept check before stopping. Do not run Stage 2/3 until Stage 1 is signed off.

### Prompt — Stage 1

```
Read CLAUDE.md, DESIGN-FIX-PLAN-3.md (the STATUS table + "PASS 3B" → "STAGE 1" section), STITCH-DESIGN.md, symbol-studio-design-audit.md and audit-notes.json. Apply .claude/skills/frontend-design.

Implement PASS 3B STAGE 1 only: the unified pinned "curtain" scene. Merge the Hero pinned sequence and the WorksFrame pinned sequence into ONE pinned choreography so the Hero→Selected-Work switch happens BEHIND the closed doors, per the label timeline in the plan.

Hard requirements from the plan:
- The pinned manifesto (doors close → 3 beats → doors open) must run on EVERY scroll-down regardless of video state. Remove the `!transitionReady` gate; mount the pin unconditionally on desktop + no-reduced-motion.
- While the doors are shut, if the hero video hasn't ended, seek it to its final frame (guarded try/catch); keep the existing FIX 1 ended/poster hold for the un-scrolled case.
- Crossfade hero layer → works layer only while the doors are fully shut (between beat3 exit and doors-open). Never both visible with doors open.
- Doors open reveal the Selected Work layer already in place — Work is NOT a separate pin scrolling up from below.
- Directional snapping so a partial scroll never bounces back: snapTo the label rest points, directional: true, duration {min:0.2,max:0.6}, delay 0.05, inertia false; scrub 1.2–1.5. Rests only at heroHold, each beat, doors-open/first case, each case.
- Keep static/mobile/reduced-motion fallbacks (stacked beats + static works grid). After the pin mounts, ScrollTrigger.sort() + refresh() so downstream reveals don't fire early.

Do NOT restyle the Works video framing yet (that is Stage 2) and do NOT touch ServicesPreview (Stage 3).

When done, run the STAGE 1 Accept check and show evidence: npm run build output, and Playwright full-page + 500px-interval screenshots at 1440x900 and 390x844 proving (a) manifesto plays on early scroll ×5, (b) doors open onto Work not black, (c) no backward snap on slow/fast wheel. List any deviation; do not mark done until all Accept bullets pass.
```

### Prompt — Stage 2

```
Read CLAUDE.md and DESIGN-FIX-PLAN-3.md ("PASS 3B" → "STAGE 2"). Apply .claude/skills/frontend-design. Stage 1 must already be merged and signed off.

Implement STAGE 2 only: rebuild the Selected Work media from full-bleed letterbox into a smaller, deliberate framed editorial panel (~55–62% viewport width, ≤~62vh, 8/10px radius, 1px hairline frame) on --color-noir. The scrub still drives video.currentTime; reposition the case-poster slot and wall text to the new frame. Compose the surround (Selected Work eyebrow, large case index, case name/meta/outcome, hairline baseline) so no state has >45% dead space. Optional subtle grain/vignette to mask clip quality — no gradients or glass. Keep the accessible focus-jump nav and the static mobile/reduced-motion grid.

Run the STAGE 2 Accept check: screenshots at 1440x900, 1920x1080, and a short-wide window (~1680x820) proving the frame is a consistent intentional size (no broken-looking letterbox), the surround fills the screen, and the scrub + case handoff still work. npm run build clean, console clean. Do not mark done until all Accept bullets pass.
```

### Prompt — Stage 3

```
Read CLAUDE.md and DESIGN-FIX-PLAN-3.md ("PASS 3B" → "STAGE 3"), plus the reference PNGs in assets/design/ and audit-notes.json (these override guesses). Apply .claude/skills/frontend-design.

Implement STAGE 3 only: a homepage whitespace/balance pass (C.R.A.P.). Fix the ServicesPreview "FIVE DISCIPLINES…" dead right zone (heading must not float above a blank right half — fill the right column, pull the list into a two-column lockup, or cap the head height + tighten padding, per the reference). Then audit ProcessFilm, Principles, Faq and the opening scene's exit: no section may have >45% uncomposed empty space; statement sections cap ~70vh unless they carry full-bleed media or a filled second column. Reuse existing hairline/eyebrow/radius treatments; gold ≤3 uses on the page. Homepage only.

Run the STAGE 3 Accept check: full-page screenshots at 1440x900 and 390x844; for each section name the C.R.A.P. rule anchoring it and confirm against the matching reference PNG; confirm zero >45% dead-space sections. npm run build clean, console clean. Do not mark done until all Accept bullets pass.
```

---

## After the homepage

Once Stages 1–3 are signed off, repeat the same loop per route (services, works, about/studio, contact): live-QA screenshot → list bugs against C.R.A.P. + the reference PNGs → add a `PASS 3C — <route>` section here with staged fixes + a Cursor prompt each. Keep appending to THIS file; do not spawn new plan files.
