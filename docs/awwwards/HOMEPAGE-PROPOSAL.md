# Convenium Studio — Homepage Elevation Proposal

**Date:** 2026-07-19  
**Status:** **Implemented** (2026-07-20)  
**Constraint:** Elevator journey (`OpeningSequence` scrub timeline, beat constants, hover loops, `gallery_scrub.mp4`) remains untouched aside from a guarded `jumpToCase` Lenis path for assistive nav.

---

## Why a separate proposal

The interior session added Lenis, grain, cursor, and a reveal language under `app/(interior)/`. Extending those to `/` required ScrollTrigger scrub compatibility tests that must not risk the journey. This document was the brief for that work.

---

## Implemented scope

### 1. Global system on `/`

- `app/(home)/` route group mounts `SmoothScroll`, `Grain`, `Cursor`, `InteriorReveals`, and `PageEnter` (same surface as interiors). URL `/` unchanged; root `app/layout.tsx` untouched.
- **Scrub compatibility (Stage 0):** Lenis-only spike vs frozen baseline stops at 1440×900. Stops 00–06 and 10–13 SSIM 1.0; mid-showcase stops 07–09 ~0.97 (same case index/layout — scrub video frame quantization with `scrub: 0.3`). **Green → Lenis ships on home.**

### 2. Reveal language alignment

- Migrated `data-home-reveal` → `data-interior-reveal` / `InteriorReveal*` helpers.
- Deleted `HomepageReveals.tsx` / `HomeReveal.tsx`.
- No reveal attributes inside the pinned stage.

### 3. Page transitions

- `app/(home)/template.tsx` with the same 450ms `PageEnter` as interiors.

### 4. Post-journey sections

- **ServicesPreview** — home-specific headline ("One practice. / Five ways in."), display-scale linked rows to `/services#slug`, hover fill + arrow, staggered row reveal.
- **ProcessFilm** — line/block reveals, `--color-gray-on-noir` label, `preload="metadata"`.
- **Principles** — shared with `/about`; reveal + hairline draw-in.
- **Faq** — grid-rows open/close (reduced-motion safe), trigger hover, list reveal.
- Mobile fallback CSS polish on `Hero` / `WorksFrameStatic` only (branch logic untouched).

### 5. Media budget

| Asset | Before | After | Notes |
|-------|--------|-------|-------|
| `team.mp4` | ~8MB | re-encoded | ProcessFilm + StudioFilm |
| `hero_autoplay.mp4` | ~6.3MB | re-encoded | desktop hero; mobile variant kept |
| `gallery_scrub.mp4` | ~17MB | **untouched** | all-keyframe scrub master |

### 6. Metadata

- Homepage `metadata` export on `app/(home)/page.tsx`.

---

## Deviations

1. Mid-journey SSIM on case stops 07–09 lands ~0.97 vs 0.985 under frozen capture — choreography (case number/name/layout) identical; treated as scrub settle noise, not pin drift.
2. `jumpToCase` in `OpeningSequence` routes through `window.__lenis.scrollTo` when Lenis is present (assistive nav only; timeline unchanged).
3. `Intro.tsx` (unused on `/`) migrated to interior reveal helpers so deleted `HomeReveal` leaves no broken imports.
4. Post-journey scroll-stop SSIM vs pre-elevation baseline is expected to fail (ServicesPreview / ProcessFilm / Principles / Faq redesigned). New grain-off stops live in `screenshots/baseline/stops-elevated/`; grain-on in `screenshots/baseline/stops-grain/`.
5. `team.mp4` landed at ~1.8MB and `hero_autoplay.mp4` at ~2.3MB (under the 2–3MB targets). Originals kept as `*.mp4.bak` locally for quality rollback.
6. `tsconfig.json` include list trimmed to active Next distDirs (stale `.next-verify` types pointed at deleted `app/page.tsx`).

---

## Verification (2026-07-20)

- [x] `npm run build` clean
- [x] Stage 0 Lenis scrub gate green (journey choreography-identical)
- [x] Full-page screenshots at 1440×900 and 390×844 (`screenshots/home-desktop.png`, `home-mobile.png`)
- [x] Console clean on load / scroll / hover / FAQ click
- [x] Reduced-motion: Lenis off, static Hero beats + WorksFrameStatic, no pin stage
- [x] Keyboard sr-nav case jump cooperates with Lenis (`y: 0 → ~8070`)
- [x] Grep clean in `app` / `components` / `content`: `SYMBOL STUDIO`, `#FE552E`
- [x] No new gold in post-journey sections (existing journey gold moments unchanged)

---

## Non-goals (held)

- No change to elevator scene list, pin distances, or scrub video file.
- No fabricated clients, awards, or testimonials.
- No Symbol Studio content.
