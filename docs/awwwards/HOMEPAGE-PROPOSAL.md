# Convenium Studio — Homepage Elevation Proposal (Doc Only)

**Date:** 2026-07-19  
**Status:** Spec for a later session — **no homepage edits in the interior elevation session.**  
**Constraint:** Elevator journey (`OpeningSequence` / scrub) remains untouched in every variant.

---

## Why a separate proposal

The interior session adds Lenis, grain, cursor, and a reveal language under `app/(interior)/`. Extending those to `/` requires ScrollTrigger scrub compatibility tests that must not risk the journey. This document is the brief for that work.

---

## Proposed scope (later session)

### 1. Global system on `/`

- Mount Lenis + Grain + Cursor from a shared provider **or** promote interior primitives to root with a feature flag.
- **Scrub compatibility protocol (required before merge):**
  1. Baseline elevator screenshots at fixed scroll stops (existing `scripts/scroll-stops.mjs`).
  2. Enable Lenis; re-capture identical stops.
  3. Diff; if any pin/scrub drift > 1px or video frame mismatch, try `ScrollTrigger.normalizeScroll` / Lenis `syncTouch` options; if still failing, keep Lenis interior-only.
  4. Reduced-motion: journey already degrades — confirm Lenis off does not break pins.

### 2. Reveal language alignment

- Adopt `data-interior-reveal`-equivalent (or unify to one attr) for post-journey sections:
  - `ServicesPreview`
  - `Principles`
  - `Faq`
- Do **not** attach reveals inside pinned scrub sections.

### 3. Page transitions

- Unify enter choreography with interiors once root `template.tsx` is safe (App Router: enter-only, no exit).
- Avoid wrapping the elevator in transition wrappers that remount video.

### 4. Media budget

| Asset | Approx size | Proposal |
|-------|-------------|----------|
| `gallery_scrub.mp4` | ~17MB | Re-encode all-keyframe scrub master if not already; bitrate pass for delivery |
| `team.mp4` | ~8MB | Poster + shorter loop or lower bitrate for ProcessFilm / StudioFilm |
| `columns.mp4` | ~7MB | Already shared; consider poster-first + deferred decode on interiors (done in interior session) |

Targets: sub-4s LCP on mid-tier mobile; no simultaneous autoplay of hero + team.

### 5. Type scale

- Align post-journey display moments with `--font-index` where a second “index” moment appears (optional; only if it does not fight manifesto scale).
- Keep hero / manifesto tokens as-is.

### 6. Cursor on homepage

- Same component; add `data-cursor="view"` only on work wall interactive regions if they become clickable beyond scrub.
- Never hide native cursor; never attach magnetic pull inside scrub pins (conflict with drag/scroll feel).

---

## Non-goals

- No change to elevator scene list, pin distances, or scrub video file without a separate Russ-approved shot plan.
- No fabricated clients, awards, or testimonials on homepage either.
- No Symbol Studio content.

---

## Suggested later-session order

1. Scrub + Lenis spike on a branch (protocol above).
2. If green: grain + cursor on `/`.
3. Post-journey reveals.
4. Media re-encode passes.
5. Full homepage screenshot + scroll-stop regression vs current baseline.

---

## Success criteria

- Elevator journey frame-identical at documented scroll stops.
- Interior + home share one motion vocabulary without two-tier feel.
- Lighthouse / INP not regress beyond agreed budget after Lenis.
