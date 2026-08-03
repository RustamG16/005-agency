# Cursor — Plan-Mode Prompt (Convenium R4)

Paste the block below into **Cursor in Plan / Ask mode** at the repo root. It makes
Cursor read the R4 guides and produce an implementation plan **and stop for your
approval** before editing. After you approve, use the "Build" block at the bottom to
switch it into Agent mode.

---

## PLAN-MODE PROMPT (paste verbatim)

```
You are in PLAN MODE. Produce an implementation plan and WAIT for my approval before
editing any file. Do not write code yet.

Read, in full, before planning:
- CLAUDE.md (hard rules)
- HOMEPAGE-FIX-GUIDE.md — the R4 plan. Focus on: "What changed in R4", "The cohesion
  system", "The revised opening — authoritative flow", "Homepage section order",
  "HowItsMade", "Founders", "Testimonials slot", "/about rewrite", "Locked decisions",
  "Assets & geometry", and the PHASE 1–3 sections.
- MEDIA-GUIDE.md (R4) — the media that will be swapped in (esp. M1 elevator-POV ride,
  M2 spotlight plate, F1–F4 founders, S1 studio).
- SELECTED-WORKS-CARD-GUIDE.md, DESIGN.md, symbol-studio-design-audit.md,
  audit-notes.json (measured geometry overrides guesses).
- Apply the .claude/skills/frontend-design skill throughout.

Then produce a plan covering EXACTLY this scope, no more:

PHASE 1 — Opening (OpeningSequence.tsx), one scroll-scrubbed pinned timeline:
- Doors close on first scroll (always-on; never gated on video `ended`; seek hero
  video to its final frame under the shut doors, guarded).
- Eyebrow "GOING UP" + ONE line "Are you ready to level up your design?" on the shut
  doors (fades in, holds), then doors open.
- Doors open STRAIGHT INTO the elevator-POV ride (no framed video card): scrub the POV
  clip's currentTime by scroll; reveal the numbered manifesto beats (left, on the
  site grid) in step; add the single gold manifesto level indicator.
- Continued scroll LOCKS the camera on the masterpiece and pins fullscreen on the
  plate composition; cross-fade the clip's last frame to the still plate; add the thin
  gold baseline under the piece. Frame opening = left 24.5% / top 18% / width 21% /
  height 47.5%.
- Inline WORKS SHOWCASE on the plate: active project's seamless loop inside the frame
  opening, text on the right wall (content/projects.ts), scroll swaps projects
  (cross-fade, never two at once); loop + hover per SELECTED-WORKS-CARD-GUIDE.md;
  "See my works" → /works.
- COHESION CHROME through the ride + showcase: eyebrow micro-label, 1px hairline
  (#CAC8C0), floor-style numbering, site type system only (Archivo Black / Newsreader
  / Inter). Manage the pin-release SEAM: continue the bone field + a hairline + the
  numbering into the next section so it doesn't read as a cut.
- Scrub feel: scrub: 0.3, NO snap (remove snap entirely); after the pin mounts,
  ScrollTrigger.sort() + refresh().
- Placeholder media until Flow lands: POV ride = public/media/gallery_scrub.mp4;
  plate = public/images/works_plate.jpg; loops = public/images/still-columns-*.jpg.
- Keep the static / mobile / reduced-motion fallbacks (no pin/doors/ride; static
  question + manifesto + existing static works grid).

PHASE 2 — New sections + /about:
- HowItsMade (homepage): eyebrow "HOW THE WORK GETS MADE"; the 01/02/03 workflow
  (Direction / Production / Finishing) as an earned numbered sequence; a restrained
  economics lockup (≈€30–40k → about half; weeks → days; 2 people → agency-grade
  output) — hairline dividers, ≤1 gold, no gradient stat cards.
- Founders (replaces the fictional ProcessFilm copy): "Two people, one system"
  diptych — him (Direction & the pipeline; ex-Infineon; orchestrator shot F1) / her
  (Design & social; F2/F3); a hairline who-does-what ledger; the two-shot (F4) as the
  smaller anchor; bone field continued from the seam.
- Testimonials slot: content/testimonials.ts shipped as an EMPTY array; the section
  renders nothing when empty (no placeholder copy on the live page); eyebrow "IN THEIR
  WORDS"; quote in Newsreader at display scale, attribution in Inter.
- /about rewrite: true two-person Klagenfurt story; "One system, two hands" — expand
  the diptych; SHOWCASE HER explicitly with (1) a graphic-design craft strip/mosaic +
  window portrait and (2) an SMM palette-locked vertical content-tile column framed as
  "the brand's highest-frequency surface"; reuse the 01/02/03 workflow in ProcessSteps;
  keep StudioFilm/AboutCta, retune copy, no translucent glass panel.

PHASE 3 — Media swap + whitespace pass (after Flow media is dropped in): swap
placeholders for MEDIA-GUIDE.md assets; no section >~45% uncomposed empty space;
statement sections cap ~70vh unless carrying full-bleed media or a filled 2nd column.

In the plan, specify: files changed per phase; the master-timeline LABEL structure
(heroHold → doorsShut → questionHold → doorsOpen → rideScrub → lock → plateLand →
case01…caseNN → seam) and where the cohesion chrome + gold thread attach; the
content/testimonials.ts + any Project/type changes; how the seam hand-off is
implemented; and how the static/mobile/reduced-motion fallbacks are preserved. Flag
any CLAUDE.md rule you'd need to bend (and why) and any place the audit geometry
conflicts with the guide. THEN STOP and wait for my approval.
```

---

## BUILD (after you approve the plan — switch Cursor to Agent mode)

```
Approved. Implement the plan in order: Phase 1, then Phase 2. Do NOT start Phase 3
until I've dropped the Flow media into public/. Do NOT touch anything outside the
scope above (no /works page build — the button is just a link).

Follow the guide's "Accept" checks and show evidence: npm run build output, and
Playwright full-page + 500px-interval screenshots at 1440x900 and 390x844 proving
(a) doors → GOING UP + question → POV ride + manifesto → lock → spotlight plate →
works showcase, all on scroll ×5; (b) the manifesto is never skipped and never snaps
backward; (c) the COHESION SEAM check — a screenshot straddling the journey→HowItsMade
boundary shows eyebrow + hairline + numbering + gold + shared bone field on both
sides; (d) HowItsMade shows the 01/02/03 workflow + economics lockup; (e) Founders
shows the diptych; (f) /about shows her design strip + SMM content column; (g) the
empty testimonials slot renders nothing; (h) the reduced-motion static path is intact.

Then run the QA-loop prompt in HOMEPAGE-FIX-GUIDE.md across 375x812, 768x1024,
1440x900, 1920x1080. List any deviation; do not mark done until all Accept bullets
pass. Grep clean for "SYMBOL STUDIO" and "#FE552E"; gold ≤3 rendered uses per page.
```
