# PROMPT D — Claude Code (Opus 5 high / Sonnet max effort), run in Plan Mode

Bug-fix + polish pass on the redesigned homepage. Diagnose before changing:
open the running site, reproduce each issue, find the cause, THEN plan the fix.
Do not rebuild sections that work.

Read first: root `CLAUDE.md`, `DESIGN.md`,
`docs/superpowers/specs/2026-08-03-guide-corner-assistant-design.md` (note
amendments 9–11), `homepage/design/DESIGN-LOCK.md`. Invoke `frontend-design`
once up front; invoke `three-guide` for all robot work.

## 1 · Scroll/transition timing bugs  (skills: gsap-scrolltrigger, gsap-performance)
Symptoms, top of page downward:
a. Before the hero→next transition there is a beat of raw white space, then a
   black area; section text appears noticeably late.
b. After "Inside the process" ends, scrolling sticks briefly, then jumps to the
   film image.
Likely causes to check, in order: pinned triggers whose `end` doesn't match the
animation length (dead scroll = stuck feeling); `pinSpacing` gaps rendering as
white/black bands; reveal tweens with `start` positions that fire too late and
no `immediateRender` handling; missing `ScrollTrigger.refresh()` after
images/fonts/video load; missing `anticipatePin: 1`; trigger order needing
`refreshPriority`. Fix so that in BOTH scroll directions there is never blank
ground, never dead scroll distance, and text is on stage when its section is.
Verify by slow-scrolling the full page up and down.

## 2 · "How we work" — relayout, full width  (skills: frontend-design, gsap-scrolltrigger)
Current staggered 01/02/03 rows leave a dead right half (see screenshot 4).
Rebuild as a full-width composition: each row spans the container — number +
headline + copy on one side, a media slot filling the remainder so no side
reads as leftover. Keep the three items' copy exactly. Media: use existing
approved assets (process-film stills / `assets/` imagery) if suitable;
otherwise ship with a noir-treated placeholder block and OUTPUT A LIST of the
exact images to request from Russ (subject, aspect, min resolution) — do not
fabricate or pull stock. Entrances: staggered transform reveals per row,
custom ease, both directions clean.

## 3 · Footer  (skills: frontend-design, gsap-scrolltrigger)
a. CONVENIUM wordmark is STILL clipped at the right edge (screenshot 5). Stop
   sizing by viewport guesswork: size by measurement — container-query units or
   a JS fit (measure rendered width, scale to container, on resize too). The
   full word must be visible at 1440 and 390, flush, not overflowing.
b. It has no entrance: add a reveal — wordmark slides up from below its
   baseline (translateY + clip, transform-only) as the footer enters, once per
   direction, honoring reduced-motion.

## 4 · Robot fixes + interaction changes  (skills: three-guide, gsap-core)
a. **Drag is broken:** draggable zone is tiny and drag works exactly once per
   page load. Suspect: pointer listeners bound once and torn down on dragend,
   or state machine never leaves `dragging`/re-arms, or `setPointerCapture`
   released wrong. Fix: whole puck is the handle, pointer-capture drag,
   re-armable forever, position persisted and restored.
b. **Radial contents change (record as spec amendment 12):** REMOVE the four
   section-jump petals. The ring is now three petals: **Ask a question**,
   **Explain this section**, and one fun petal — **"Do a trick"**: plays a
   random unused GLB clip (spin/jump/flip — inspect `gltf.animations` and pick
   from what exists), eye does the CTA step during it, cooldown so it can't be
   spammed. Re-space the three petals evenly on the locked arc, same 44px
   geometry and label-index treatment (lock §4).
c. **Idle life is missing:** implement the spec's idle scheduler (decision 5)
   properly — random micro-acts every 6–14s from the GLB's own clip set
   INCLUDING the wave the model ships with; occasional wave guaranteed (e.g.
   every 3–5 idle ticks). Reduced-motion disables.
d. **Hints/pop-ups never appear:** debug why the bubble system is silent.
   Then: welcome line on first load ("welcome" beat, once per session) +
   per-section hint lines from the approved copy (spec decision 6, amendment
   10 for Selected Work's silence). Bubble per lock §5, auto-dismiss 6s,
   sessionStorage cap, never co-existing with the Ask panel.

## 5 · Verify  (per CLAUDE.md)
`npm run build` clean → slow full-page scroll both directions at 1440×900 and
390×844 with Playwright screenshots at each section boundary (no blank bands,
no dead scroll) → footer wordmark fully visible both sizes → drag the robot
three times in one session → open each petal → console clean throughout →
reduced-motion pass → grep guards (`OscarLomas3D` present, no `SYMBOL STUDIO`,
no `#FE552E`). List every deviation; fix or flag, never silently accept.

## Out of scope
Hero internals beyond the timing fix, Capabilities/FAQ internals, Ask LLM
route, per-page guide config (Cursor PROMPT-B still owns those).
