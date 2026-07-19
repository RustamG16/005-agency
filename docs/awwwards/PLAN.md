# Convenium Studio — Awwwards Implementation Plan (Interior Pages)

**Date:** 2026-07-19  
**Companion:** [AUDIT.md](./AUDIT.md) · [HOMEPAGE-PROPOSAL.md](./HOMEPAGE-PROPOSAL.md)

---

## Goals

1. Elevate `/works`, `/services`, `/about`, `/contact`, `/privacy` to Awwwards-credible motion and art direction.
2. Add an **interior-only** global system: Lenis, grain, custom cursor, page enter transitions, shared reveals.
3. Leave `/` and the elevator journey **pixel-identical** (baseline screenshots + diff).

---

## B1. Global system (additive, homepage-safe)

### Route group

Relocate five interior routes into `app/(interior)/…` (URLs unchanged):

```
app/(interior)/layout.tsx      ← Lenis, Grain, Cursor, InteriorReveals
app/(interior)/template.tsx    ← enter transition only
app/(interior)/works/page.tsx
app/(interior)/services/page.tsx
app/(interior)/about/page.tsx
app/(interior)/contact/page.tsx
app/(interior)/privacy/page.tsx
```

Root `app/layout.tsx` and `app/page.tsx` stay untouched in structure. No chrome edits that affect `/`.

### Features

| Feature | Approach | Reduced motion / touch |
|---------|----------|------------------------|
| **Lenis** | `lenis` dep; sync `lenis.on('scroll', ScrollTrigger.update)` + GSAP ticker | Disabled when `prefers-reduced-motion`; touch keeps native feel |
| **Grain** | CSS/SVG `feTurbulence` fixed overlay ~3.5% opacity | Always on (static texture, not motion) |
| **Cursor** | In-house ~2KB: dot → scale on links → labeled “View” disc on work rows; `mix-blend-mode: difference` | Hidden on touch + reduced-motion; native cursor never removed |
| **Page enter** | `template.tsx` 450ms clip/fade using motion tokens | Instant content if reduced-motion |
| **Reveals** | `InteriorReveals` + `data-interior-reveal` (`line` \| `block` \| `media`) mirroring HomepageReveals contract | Desktop + no-preference only |
| **Tokens** | Additive only in `tokens.css`: `--font-index`, `--duration-slow`, `--ease-inout-soft`, `--grain-opacity`, `--color-gray-on-noir` | — |

### A11y / perf

- Restore `:focus-visible` on form fields (never `outline: none` without replacement).
- Interior dark eyebrows use `--color-gray-on-noir` (lighter than `--color-gray`).
- Interior media: `preload="metadata"` + single-active-video lock.
- `next/image` for interior stills where practical.

---

## B2. Per-page builds

### `/works` — flagship

Replace `WorksGrid` + `ProjectCard` usage with **`WorksIndex`**:

- Four full-bleed editorial rows.
- Floor-style numbering descending `04 → 01` (elevator metaphor).
- Name at `--font-index`; sector / scope / year as quiet meta; **`outcome`** as Newsreader italic payoff.
- Desktop: fixed media panel, clip-path wipe, cursor label “View”.
- Mobile: inline 16:9 per row, IO + single-active video lock.
- Filters removed.
- `WorksHero` kept, tightened as intro to the index.

### `/services` — pinned capability stack

- Desktop: sticky left rail (giant numeral + name) crossfades as right column scrolls.
- Scope: two-column hairline serif list (not chips).
- Media: 16:10 with light parallax drift.
- Gold indices → 0 (noir numerals); gold only on hero eyebrow (≤3 rule).
- Hero jump-list gains stagger-in.

### `/about`

- AboutHero rail → “floors” ledger (founding year, disciplines, engagement) — **real facts only**, no fabricated staff/awards.
- StudioModel → line-mask reveal.
- ProcessSteps → scroll-progress list (hairline + active emphasis).
- CapabilitiesList → oversized editorial links with arrow hover.
- StudioFilm → solid noir copy band (no translucent overlay) + reveal.
- AboutCta → magnetic hover button.
- Keep shared `Principles` component unchanged (homepage safety).

### `/contact`

- Visible custom `:focus-visible` on inputs.
- Availability as set-in-type line (no status dot).
- `hello@convenium.studio` display-scale link in ContactInfo.
- Submit pending state (~600ms) before success.
- **Honest note:** form remains client-only — no backend this session.
- Entrance choreography; ProjectFit reveals + mobile image gap fix.

### `/privacy`

- CSS module, editorial layout (eyebrow, display H1, sections: data collected / use / retention / contact).
- `HeaderZone theme="light"`.
- Keep honest “will be completed before client work” note, designed.

---

## B3. Dependencies

| Package | Why | Size |
|---------|-----|------|
| `lenis` | Smooth scroll standard on Awwwards winners; ScrollTrigger sync | ~4KB gzip |

Everything else is hand-rolled on existing GSAP 3.15.

---

## B4. CLAUDE.md rule overrides (this session)

| Rule | Override | Justification |
|------|----------|---------------|
| No blanket scroll-fade | Directed reveals + scroll-progress | Not blanket; per-section directed |
| No decorative texture | Grain @ ~3.5% | One tactile signal, globally uniform |
| Interiors CSS-only motion | GSAP on interiors | Already in bundle |
| Gold ≤3 | Services back into compliance | Numerals go noir |

Unchanged: palette, three fonts, no Symbol Studio, no fabricated clients/testimonials/awards/phones.

---

## B5. Execution order

1. Docs (this file + AUDIT + HOMEPAGE-PROPOSAL).
2. Homepage baseline screenshots 1440×900 + 390×844 → `screenshots/baseline/`.
3. Tokens + route group + Lenis / Grain / Cursor / template / InteriorReveals.
4. Pages: works → services → about → contact → privacy.
5. Verify (below).

---

## B6. Verification checklist

- [x] `npm run build` clean
- [x] Screenshots: all interior routes @ 1440×900 and 390×844
- [x] Homepage after-shots vs baseline — desktop **byte-identical**; mobile differs only due to non-deterministic video frames (same-session A/B also differs)
- [x] Console clean on load / scroll / hover (`npm run audit:site` → none)
- [x] `prefers-reduced-motion` path: Lenis/cursor/PageEnter opt out
- [x] Keyboard focus visible on contact form (`:focus-visible`)
- [x] Grep clean in app/components/content: `SYMBOL STUDIO`, `#FE552E`
- [x] Gold on `/services` content: hero eyebrow only (indices noir)

---

## Honesty notes (ship as designed, not as fiction)

- Contact form does **not** POST to a server; pending state is UX only.
- Privacy policy remains incomplete until legal review; page states that clearly.
- Project rows still link within `/works` (no case-study routes yet) — hover film is the depth layer.
