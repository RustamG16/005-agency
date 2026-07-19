# Convenium Studio — Awwwards Audit (Interior Pages)

**Date:** 2026-07-19  
**Scope:** `/works`, `/services`, `/about`, `/contact`, `/privacy`, plus global chrome shared with interiors  
**Out of scope for edits this session:** `/` homepage and elevator journey (baseline-protected)

Rubric weights: Design 40 · Usability 30 · Creativity 20 · Content 10.

---

## Executive finding

The site is **two-tier**. The homepage has GSAP choreography (elevator journey, `HomepageReveals`). Interior pages have **zero GSAP** — motion is limited to video autoplay and ~180ms hover CSS. Layout and copy are strong; motion, interaction, and art direction on interiors are not. A juror who leaves `/` lands in a static brochure.

---

## Global (all interiors)

| Issue | Severity | Notes |
|-------|----------|-------|
| No smooth scroll | High | Native scroll only; ScrollTrigger never synced to a soft scroller |
| No page transitions | Medium | Hard cut between routes |
| No custom cursor | Medium | Missed editorial signal on work/hover |
| No surface texture | Medium | Flat bone/noir reads as digital-default |
| No `next/image` on interiors | Medium | Raw `<img>` / video posters |
| `columns.mp4` ~7MB shared | Medium | Hero + every work card |
| Gray-on-noir eyebrows (`#777771` on `#050505`) | Medium | Contrast risk on dark sections |
| Multiple videos can play at once (mobile) | Medium | No single-active lock |
| `/privacy` never sets `HeaderZone` | High | Header glyphs can render bone-on-bone |

**Motion inventory today:** homepage only (`OpeningSequence`, `HomepageReveals`). Interiors: CSS transitions + IntersectionObserver video play/pause.

---

## `/works` — current ≈6.2 → target 8.3

| Axis | Score | Notes |
|------|-------|-------|
| Design | 6.5 | Masonry of four cards; reads 3+1; competent, not memorable |
| Usability | 7 | Filters work but each sector isolates a single card |
| Creativity | 4.5 | Filter pills + card grid is portfolio-default |
| Content | 7 | Strong project names; **`outcome` never rendered** |

**Specific defects**

- Filter pills each isolate one card — pointless for n=4.
- Best copy in the data model (`outcome`, e.g. “From local signal to cultural frequency”) is unused on this page.
- Cards link to `/works#${slug}` (self-hash), not a case study.
- Shared `columns.mp4` with seek offsets — workable but not cinematic at index scale.

---

## `/services` — current ≈5.8 → target 8.1

| Axis | Score | Notes |
|------|-------|-------|
| Design | 6 | Five identical row modules |
| Usability | 7 | Jump list works; long scroll of sameness |
| Creativity | 4 | Most template-coded page on the site |
| Content | 7 | Clear roles and scope |

**Specific defects**

- Pattern: number / title / blurb / chip cloud / 21:9 strip — repeated five times, no motion.
- Gold used **5×** on indices (house rule: ≤3 gold uses per page).
- Scope chips read as SaaS tags.
- Media strips ~170px tall at 390px — thin and weak.

---

## `/about` — current ≈6.3 → target 8.2

| Axis | Score | Notes |
|------|-------|-------|
| Design | 6.5 | Good sequence; best copy on the site |
| Usability | 7 | Clear narrative arc |
| Creativity | 5 | Process is classic numbered-table template |
| Content | 8 | Principles, model, process are strong |

**Specific defects**

- Three principles rendered **twice** (AboutHero right rail + `Principles` grid).
- ProcessSteps = numbered table with no scroll relationship.
- StudioFilm overlay is `rgba(5,5,5,0.55)` over video — glassmorphism-lite, violates house spirit.
- CapabilitiesList = chip row, not an editorial index.
- AboutCta is a plain link button — no magnetic / presence moment.

---

## `/contact` — current ≈6.0 → target 8.0

| Axis | Score | Notes |
|------|-------|-------|
| Design | 6.5 | Solid two-column form layout |
| Usability | 6.5 | Form UX good except focus |
| Creativity | 4.5 | Status-dot availability is SaaS cliché |
| Content | 7 | Fit / response statements are honest |

**Specific defects**

- `outline: none` on inputs (`ContactForm.module.css`) — keyboard focus regression.
- Status-dot availability line reads product-UI, not studio.
- Email is quiet utility text, not a display moment.
- Submit is instant fake-success — no pending state.
- No entrance choreography on intro / form / ProjectFit.
- ProjectFit mobile image gap (layout).

---

## `/privacy` — current ≈4.2 → target 7.0

| Axis | Score | Notes |
|------|-------|-------|
| Design | 3.5 | Inline styles only |
| Usability | 6 | Readable but unfinished |
| Creativity | 2 | Literally says “This page is a placeholder.” |
| Content | 5 | Honest stub; incomplete policy |

**Specific defects**

- No CSS module, no editorial structure (sections for collect / use / retain / contact).
- No `HeaderZone theme="light"` → header contrast bug on bone page.

---

## What is already strong (do not discard)

- Token system (`STITCH-DESIGN` / `styles/tokens.css`) and three-font stack.
- Copy voice — especially about + project outcomes.
- HeaderZone theme flipping.
- Homepage elevator journey (protected).
- Content models (`Project.outcome`, `Service`, `processSteps`) are ready for elevation without inventing clients or awards.

---

## Session overrides (explicit)

Documented so verification does not flag intentional deviations:

1. **“No blanket scroll-fade”** → directed per-section reveals and scroll-progress interactions (not blanket opacity fades on every block).
2. **Grain at ~3.5%** → one global tactile signal; flat bone/noir alone reads as AI-default.
3. **GSAP on interiors** → already in the bundle via homepage; no net size penalty.
4. All other hard rules remain: palette, fonts, no Symbol Studio content, no fabricated proof, gold ≤3 per page.
