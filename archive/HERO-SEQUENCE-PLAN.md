# Hero Sequence Plan — overlay → doors close → beats → doors open → Works

**For:** Claude Code (Sonnet). Follow `IMPLEMENTATION-PLAN.md` §0 protocol and `CLAUDE.md` hard rules.
**Scope:** Homepage only. Desktop-first (target 1920×1080). Mobile/reduced-motion stay static.

## 0. The one thing to understand first
**~85% of this already exists. Do NOT rebuild — re-sequence, re-copy, and add one overlay.**

| Piece you need | Already built in | What to do |
| --- | --- | --- |
| Hero video that plays once to the end | `Hero.tsx` (`<video>` + phase machine) | **keep exactly as-is — no scroll scrub on the hero** |
| Elevator doors closing on scroll | `Hero.tsx` `useGSAP` "hero-doors" + `.door*` in `Hero.module.css` | keep as the transition out of the hero |
| Pinned + scrubbed + snapped text-beat engine | `Manifesto.tsx` | keep the machinery, **replace the words with the 3 new beats** |
| Old beat words (GOING UP / LOUD / PRECISE / UNFORGETTABLE) | `Manifesto.tsx` `WORDS` | **delete — not needed** |
| Works gallery reveal | `WorksFrame.tsx` `WorksFramePinned()` | keep; add opening doors in front of it |
| "We do not decorate businesses…" copy | `WorksFrame.tsx` `SectionHead()` | becomes beat 2; remove the heading from Works |

GSAP + ScrollTrigger installed (`gsap@3.15`, `@gsap/react`), registered in `components/motion/gsap.ts`. No new deps.

## 1. Target sequence (desktop)

```
HERO  (video plays once, NOT scroll-animated)
   • video autoplays to its end and holds the final frame (existing behavior)
   • static overlay text box (opacity) sits on the video the whole time:
        "Most brands are not underperforming. They are under-leveled."
   • when the film ends, the existing scroll cue appears

DOORS CLOSE (on scroll) → full black                      ← existing hero-doors trigger

BEATS  (pinned, black screen — the repurposed Manifesto section)
   scroll drives three beats, one at a time, on black:
        beat 1:  "Welcome to Convenium"
        beat 2:  "We do not decorate businesses"
        beat 3:  "We take them to another level"

DOORS OPEN → reveal WORKS                                  ← new door-open at Works entry
   then the existing gallery scrub + case studies play as before
```

Why the seam is invisible: the hero doors close to `--color-noir`, and the beat section is already noir, so "doors closed → beats on black → doors open" reads as one continuous dark screen even though it spans three components.

## 2. Decisions locked in (change here before starting if you disagree)
- **Hero is NOT converted to a scrubbed timeline.** The video just plays once. The only hero change is adding the static overlay text box.
- **All beat text lives on the black screen**, not on the video. The single thing on the video is "Most brands are not underperforming. They are under-leveled."
- **The 3 beats replace the old Manifesto words entirely.** Drop the `01/02/03` index + meta chips (`ATTENTION/MEANING/MEMORY`); the new beats are plain full-sentence lines.
- **Remove `<Intro />` from `app/page.tsx`** — its headline is now the hero overlay. Keep the `Intro` file for reference. (If you want to preserve its body paragraph + `Fig.01` image, fold them into `ServicesPreview`; default is to drop them.)
- **Remove `WorksFrame` `SectionHead` heading** — that copy is now beat 2. Keep the "Selected Work" eyebrow if wanted.
- Mobile (≤768px) and `prefers-reduced-motion`: **no new pinning/doors**. Overlay + beats render as plain static stacked text. Reuse the existing `useIsMobile` / `useReducedMotion` guards already in these components.

## 3. Steps (each independently buildable + verifiable)

### Step 1 — Hero static overlay
Files: `components/sections/home/Hero.tsx`, `Hero.module.css`

1. Add ONE overlay layer inside `.frame`, above `.scrim` and **below the doors** (so the closing doors cover it): a text box with
   `"Most brands are not underperforming. They are under-leveled."`
2. Style with existing type tokens (Archivo Black / Newsreader per `STITCH-DESIGN.md`), bone text, `text-shadow` like `.annotationLabel`. Fade in via opacity on mount (CSS transition or a one-shot `gsap.to` — **not** scroll-driven).
3. **Do not touch** the video phase machine or the `hero-doors` ScrollTrigger — doors still close on first scroll exactly as today.
4. Reduced-motion / mobile: render the overlay as visible static text (it already is if you use CSS opacity with a `prefers-reduced-motion` fallback to `opacity:1`).

**Verify:** load `/`, video plays once, the line is legible over it; first scroll closes the doors to black.

### Step 2 — Replace Manifesto content with the 3 beats
Files: `components/sections/home/Manifesto.tsx`, `Manifesto.module.css`, `app/page.tsx`

1. In `app/page.tsx`, set order to `<Hero /> <Manifesto /> <ServicesPreview /> <WorksFrame /> …` and **remove `<Intro />`**.
2. In `Manifesto.tsx`, replace the `WORDS` array with three items:
   ```
   "Welcome to Convenium"
   "We do not decorate businesses"
   "We take them to another level"
   ```
   - Keep the pin + `scrub` + `snap` timeline machinery unchanged (it already does "text beat animation by scroll").
   - `beats = words.length - 1` becomes 2 automatically — snap still works.
   - Beat 1 is pre-seated visible when the section pins (matches "doors just closed → first line already there"). Beats 2 and 3 arrive on scroll.
3. Remove the `level` / `levelIndex` / `levelMeta` markup and the `GOING UP.` kicker branch — render each beat as one line using the existing `.word` / `.wordLong` classes. Apply `.wordLong` to any line over ~10 chars so the long sentences don't clip.
4. Keep `HeaderZone theme="dark"` + noir background for continuity with the closed doors.
5. Update the static/reduced-motion fallback list to the 3 new lines (no index chips).
6. Confirm `refreshPriority` still descends in DOM order: hero-doors 30 → manifesto 20 → works 10 (already true — don't disturb).

**Verify:** after the doors close, scrolling runs Welcome → We do not decorate businesses → We take them to another level, one at a time, snapping between them, no overlap, reverses cleanly.

### Step 3 — Works door-open reveal
Files: `components/sections/home/WorksFrame.tsx`, `WorksFrame.module.css`

1. Add two `.door` panels (mirror `Hero.module.css` `.door/.doorLeft/.doorRight`) as the **first children** of the pinned Works stage, `z-index` above the media, starting **closed** (`xPercent: 0`, covering the frame).
2. On Works entry (an `onEnter` at the pin start, or the first `0→~0.06` of the existing works timeline), tween them apart (`xPercent: -100 / 100`, `ease: power4.out`). Then the existing gallery scrub proceeds untouched.
3. Delete `SectionHead`'s `<h2>` (copy is now beat 2). Keep the eyebrow if wanted.
4. Static/mobile path: no doors.

**Verify:** entering Works, the black doors part to reveal the gallery, then the existing scrub + cases play as before. The last beat ("…another level") flows straight into the doors opening.

### Step 4 — 1920×1080 responsiveness
1. Add a viewport to `scripts/screenshot.mjs` `VIEWPORTS`: `{ name: "desktop-fhd", width: 1920, height: 1080, deviceScaleFactor: 1 }`.
2. At 1920×1080 confirm:
   - Hero overlay line fits ~2 lines without overflow — size with `clamp()`.
   - Beat lines are full sentences (longer than the old single words): make sure "We do not decorate businesses" / "We take them to another level" scale to fill the frame without clipping. Reuse/relax the `.wordLong` threshold and use `clamp()` font-size.
   - Doors cover full 1920 width with no center seam gap (`width:50%` each).
   - Pin scroll distances (`end: "+=NN%"`) feel unhurried at 1080px tall; nudge the Manifesto `end` if beats feel rushed.
3. Use existing tokens/spacing; no new hard-coded px where a token exists.

### Step 5 — Guardrails (do not break)
- Keep all `useReducedMotion` / `useIsMobile` early-returns; new motion is desktop-only.
- No gradients, glassmorphism, blanket scroll-fades, or a 4th gold accent (`CLAUDE.md`).
- Don't scrub the original hero source (`CLAUDE.md`, `IMPLEMENTATION-PLAN.md §17.1`).
- Keep `refreshPriority` 30 → 20 → 10 in DOM order or pins mis-measure.
- Hero overlay must sit **under** the doors so the close covers it.

## 4. Verification loop (after each step, per CLAUDE.md)
1. `npm run build` clean.
2. `SCREEN_SCROLL=1 npm run screenshot` with the 1920×1080 viewport added — full-page + scrolled shots of `/`.
3. Scroll `/` top→bottom then bottom→top: confirm overlay → doors close → 3 beats → doors open → gallery, with no flashes, overlaps, or jumps. Check console for errors after scroll.
4. List any deviation rather than silently accepting it.

## 5. Suggested commit order
1. Hero static overlay (Step 1)
2. `page.tsx` re-order + remove Intro + Manifesto 3-beat swap (Step 2)
3. Works door-open reveal + SectionHead cleanup (Step 3)
4. 1920×1080 pass + screenshot viewport (Step 4)
