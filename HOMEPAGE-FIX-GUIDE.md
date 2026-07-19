# Convenium Studio — Homepage Fix Guide

Standalone guide for the current round of homepage work. Earlier fix plans
(Pass 2 / Pass 3) are implemented and live in `/archive`. This file is the single
source for the homepage.

**Executor:** Cursor Composer (Agent mode, repo root = this folder).
**Bound by:** `CLAUDE.md` (tokens only — no gradients/glass, gold ≤3 per page,
fonts via `next/font`, no Symbol Studio content), `IMPLEMENTATION-PLAN.md` §0
protocol, `STITCH-DESIGN.md` (visual values), `symbol-studio-design-audit.md` +
`audit-notes.json` (measured geometry — override guesses), `.claude/skills/frontend-design`.
**Companion guides:** `MEDIA-GUIDE.md` (Google Flow media), `SELECTED-WORKS-CARD-GUIDE.md`
(project card content).
**Scope:** Homepage only. Desktop-first (1920×1080 / 1440×900); mobile +
reduced-motion stay on the existing static fallbacks. The `/works` **page is a
later phase** — for now the "See my works" button is just a link to it.

---

## Where we are

Stage 1 shipped: `OpeningSequence.tsx` merged Hero + WorksFrame into one always-on
desktop pin (doors close → 3 beats → doors open → works scrub/cases). **We are now
revising that choreography** per client direction. This revision replaces the old
"Stage 1 / Stage 2" in this guide; the whitespace pass survives as the new Stage 2.

## The revised opening — authoritative flow

```
① HERO FILM plays
② scroll → DOORS CLOSE over it
③ on the shut doors: ONE QUESTION — "Are you ready to level up your design?"
④ DOORS OPEN → SPLIT SECTION (pinned, scroll-scrubbed):
      LEFT  = manifesto text — the 3 beats (Welcome to Convenium / We do not
              decorate businesses / We take them to another level), + optional extra line
      RIGHT = the scrub video in a proper frame (smaller, not full-bleed)
      text + video are driven together by scroll
⑤ keep scrolling → ZOOM INTO the right-hand frame; it grows until it PINS FULLSCREEN
      and lands exactly on the gallery-wall plate (frame left, empty wall right).
      The video's final frame becomes a STILL (the plate) — no more video from here.
⑥ WORKS SHOWCASE (inline on the homepage): inside the framed artwork opening, each
      project plays a seamless LOOP of its imagery; the empty right wall carries that
      project's text; scroll swaps projects. A "SEE MY WORKS" button links to /works.
```

## Locked decisions (do not re-litigate)

- **One continuous experience, no click for the transition.** ②→⑥ is all scroll; the
  zoom-into-frame (⑤) happens on continued scroll, not a button. The only button is
  "See my works" → `/works`.
- **Split layout:** manifesto text LEFT, framed video RIGHT.
- **Frame = a window.** The gallery-wall plate is the background; project loops render
  **inside the artwork opening**; case text sits on the **empty right wall**. This is
  what fixes both "video not framed" and "too much whitespace."
- **Scrub feel = frame-by-frame, no auto-play.** The manifesto/split timeline tracks
  scroll position tightly with a hair of smoothing and **no snap** (snap was the
  earlier bounce-back + "plays by itself" feel). See "Scrub feel" below.
- **Media is placeholder-first.** Build the structure/motion now with existing assets;
  real media comes from `MEDIA-GUIDE.md` + `SELECTED-WORKS-CARD-GUIDE.md` and is
  swapped in after.

## Assets & geometry

- **Gallery plate:** `assets/images/Gallery_terminal_wall_design_2K_202607191843.jpeg`
  (2752×1536, 16:9). Copy into `public/images/works_plate.jpg` for use. Inner frame
  opening ≈ **left 24.5%, top 18%, width 21%, height 47.5%** (portrait ~4:5) — the card
  region, and it matches the existing `frameSlot` coords. Right wall (≈37%→96% width) =
  text zone.
- **Placeholder media until Flow assets land:** split-frame video = existing
  `public/media/gallery_scrub.mp4`; plate = the JPEG above; project loops = existing
  `public/images/still-columns-*.jpg`.

---

## PHASE 1 (finish) — curtain → split → zoom → inline works showcase

Build on `OpeningSequence.tsx` (keep it the single desktop pin; keep the existing
static/mobile/reduced-motion fallbacks). One master scroll-scrubbed timeline,
sequential labels, `immediateRender: false`, never two `autoAlpha>0` states at once.

### A — Doors + single question (replaces the 3-beats-on-doors)
- Hero holds its final frame (existing `ended`/poster logic stays). On first scroll,
  doors slide in from both edges and meet center (`power4.in`, hard stop). **Always-on**
  — mount the pin unconditionally on desktop + no-reduced-motion; never gate on video
  `ended`. If the film hasn't ended when the doors shut, seek it to its final frame
  (guarded try/catch) under the cover of the shut doors.
- On the shut doors, show ONE line: **"Are you ready to level up your design?"** It
  fades in as the doors meet and holds while shut (it does not need to scrub through
  multiple states — one question, centered, bone type). Then doors open.

### B — Split section (text left / video right)
- Doors open to reveal a two-column pinned split: manifesto text (the 3 beats, stacked
  or sequentially revealed by scroll) on the LEFT; the framed scrub video on the RIGHT
  (~half width, a defined frame with 8/10px radius + 1px hairline, on `--color-noir`).
- The video is scrubbed by scroll (drive `currentTime`); the beats reveal in step with
  the same scroll. Both are one timeline — no independent auto-play.
- Optional extra manifesto line under the beats (draft one if the client hasn't given
  it; keep it in the same voice).

### C — Zoom into the frame → pin fullscreen
- Continued scroll scales/moves the right-hand frame up until it fills the viewport and
  lands EXACTLY on the plate composition (frame left, empty wall right). At the end of
  the zoom, cross-fade the scrub video's last frame to the still plate
  (`works_plate.jpg`) — from here it's a still, not video. The transition must be
  continuous (the framed thing you were watching becomes the fullscreen gallery).

### D — Inline works showcase (in the frame)
- On the pinned plate: inside the frame opening (24.5%/18%/21%/47.5%), render the active
  project's seamless image loop; on the right wall render that project's text (index,
  name, sector — scope, year, outcome from `content/projects.ts`).
- Scroll swaps projects (cross-fade the frame contents + update wall text; never two at
  once). Implement the loop + hover per `SELECTED-WORKS-CARD-GUIDE.md` (extend the
  `Project` type with `loop: string[]` and optional `nav`).
- Add a **"See my works"** button (on the wall, below the text) linking to `/works`.
- Release the pin after the last project.

### Scrub feel (applies to the whole pinned timeline)
- `scrub: 0.3` (tight, near-1:1, a hair of smoothing so it's smooth but tracks the
  wheel) — NOT the old `1.35`. **Remove the `snap` config entirely.** Nothing animates
  unless scroll drives it; stopping freezes on the current frame. This is the
  "frame-by-frame like a video" behavior the client asked for and it also removes the
  bounce-back (which was caused by snap).
- After the pin mounts: `ScrollTrigger.sort()` + `ScrollTrigger.refresh()` so downstream
  `HomepageReveals` triggers (ServicesPreview etc.) measure against the final pin height
  and don't fire early.

### Fallbacks (unchanged)
- Reduced-motion / mobile: no pin, no doors, no zoom. Show the question + manifesto as
  stacked static text, then the works as the existing static grid/stack (project
  `poster` stills, no loops/hover). Simple cuts.

### Accept (show evidence)
- Reload + immediately scroll ×5: doors close, the question shows, doors open onto the
  split, manifesto + framed video scrub together — never skipped, regardless of whether
  the film finished.
- Continued scroll zooms the right frame to fullscreen and lands on the plate; the
  works showcase runs inside the frame with text on the right wall; projects swap on
  scroll; "See my works" links to `/works`.
- Slow single-notch and fast-flick wheel: the timeline tracks the wheel, freezes when
  you stop, **never snaps backward**.
- `npm run build` clean; console clean after scroll + hover; Playwright full-page +
  500px-interval screenshots at 1440×900 and 390×844; reduced-motion path renders the
  static question + manifesto + static works.

---

## STAGE 2 — Homepage whitespace / balance pass (C.R.A.P.)

Do this after Phase 1 and after the Flow media is dropped in (filling empty sections
depends on that media). The *works* whitespace is now solved by the frame model, so
this shrinks to the lower sections.

- **`ServicesPreview` (capabilities):** kill the dead right zone below "FIVE
  DISCIPLINES…" — fill the right column (CTA + supporting line or the `cap_accent`
  media from `MEDIA-GUIDE.md`), pull the discipline list into a two-column lockup
  sharing the heading's top edge, or cap the head height + tighten `--space-7` padding.
  Pick per the reference PNGs in `assets/design/` + `audit-notes.json`. The heading must
  not float alone above emptiness.
- **`ProcessFilm`, `Principles`, `Faq`, opening-scene exit:** no section where empty
  space exceeds ~45% of the viewport without a dominant type/media element making it
  read as composed. Statement sections cap ~70vh unless they carry full-bleed media or
  a filled second column. Use the `process_broll` / `principles_texture` fillers where
  a section is thin.
- Reuse existing treatments (hairline rows, micro-label eyebrows, 8/10px radius); kill
  one-offs. Gold ≤3 uses on the page.

### Accept
- Full-page screenshots at 1440×900 and 390×844; per section name the C.R.A.P. rule
  anchoring it, confirmed against the matching reference PNG; zero >45% dead-space
  sections. `npm run build` clean; console clean.

---

## Cursor Composer prompts

### Prompt — Finish Phase 1 (paste verbatim)

```
Read CLAUDE.md, HOMEPAGE-FIX-GUIDE.md (the "revised opening", "Locked decisions",
"Assets & geometry" and "PHASE 1 (finish)" sections), SELECTED-WORKS-CARD-GUIDE.md,
STITCH-DESIGN.md, symbol-studio-design-audit.md and audit-notes.json. Apply
.claude/skills/frontend-design.

First produce a short implementation plan (files changed, the master-timeline label
structure, how the split→zoom→showcase is built, the Project type change, how the
static/mobile/reduced-motion fallbacks are preserved) and WAIT for my approval before
editing.

Then implement the revised Phase 1 on OpeningSequence.tsx, one scroll-scrubbed pinned
timeline:
- Doors close on first scroll (always-on; never gated on video ended; seek hero video
  to its final frame under the shut doors, guarded).
- On the shut doors show ONE line: "Are you ready to level up your design?" (fades in,
  holds while shut), then doors open.
- Doors open onto a SPLIT: manifesto 3 beats LEFT, framed scrub video RIGHT (~half
  width, 8/10px radius + 1px hairline, on --color-noir); beats + video scrub together.
- Continued scroll ZOOMS the right frame until it pins fullscreen and lands on the
  gallery plate composition; cross-fade the video's last frame to the still plate
  (copy assets/images/Gallery_terminal_wall_design_2K_202607191843.jpeg to
  public/images/works_plate.jpg). Frame opening = left 24.5% / top 18% / width 21% /
  height 47.5%.
- Inline WORKS SHOWCASE on the pinned plate: active project's seamless loop inside the
  frame opening, its text on the right wall (from content/projects.ts), scroll swaps
  projects (cross-fade, never two at once). Extend Project with loop: string[] and
  optional nav; implement loop + hover per SELECTED-WORKS-CARD-GUIDE.md. Use existing
  still-columns-*.jpg as placeholder loop frames until Flow assets land. Add a "See my
  works" button on the wall linking to /works.
- Scrub feel: scrub: 0.3, NO snap (remove snap entirely) so it's frame-by-frame and
  never bounces back. After the pin mounts, ScrollTrigger.sort() + refresh().
- Keep static/mobile/reduced-motion fallbacks: static question + manifesto + existing
  static works grid (posters, no loops/hover).

Do NOT touch ServicesPreview or the lower sections (that is Stage 2). Do NOT build the
/works page (the button is just a link).

Run the Phase-1 Accept check in the guide and show evidence: npm run build output, and
Playwright full-page + 500px-interval screenshots at 1440x900 and 390x844 proving
(a) doors→question→split→zoom→showcase all on scroll ×5, (b) manifesto never skipped,
(c) no backward snap, (d) reduced-motion static path intact. List any deviation; do
not mark done until all Accept bullets pass.
```

### Prompt — Stage 2 (whitespace)

```
Read CLAUDE.md and HOMEPAGE-FIX-GUIDE.md ("STAGE 2"), plus the reference PNGs in
assets/design/ and audit-notes.json (these override guesses). Apply
.claude/skills/frontend-design. Phase 1 must be signed off and the Flow media dropped
into public/.

Implement STAGE 2 only: homepage whitespace/balance pass (C.R.A.P.). Fix the
ServicesPreview "FIVE DISCIPLINES…" dead right zone (fill the right column / two-column
lockup / cap height — per the reference; heading must not float above a blank right
half; you may use public/media/cap_accent.mp4). Audit ProcessFilm, Principles, Faq and
the opening-scene exit: no section >45% uncomposed empty space; statement sections cap
~70vh unless they carry full-bleed media or a filled second column (use
process_broll / principles_texture fillers where thin). Reuse existing
hairline/eyebrow/radius treatments; gold ≤3 uses. Homepage only.

Run the STAGE 2 Accept check: full-page screenshots at 1440x900 and 390x844; per
section name the C.R.A.P. rule and confirm against the reference PNG; zero >45%
dead-space sections. npm run build clean, console clean. Do not mark done until all
Accept bullets pass.
```

---

## Verification QA-loop prompt (run after the stage prompts, per viewport)

```
You have browser automation (navigate, resize, screenshot, read console). Confirm you have them before starting; if not, stop and tell me.

GOAL: the homepage renders clean at every viewport below. "Clean" = no horizontal overflow, no uncomposed whitespace >~2x the section's own rhythm, no misaligned or overlapping/z-conflicting elements, no fixed widths breaking at narrow viewports, and consistent vertical rhythm between sections.

SETUP
1. Start the dev server if it isn't running; wait until it actually responds (poll, don't assume). Report the URL.
2. Viewports to test, in this order: 375x812, 768x1024, 1440x900, 1920x1080.

PER VIEWPORT — do NOT move on until this one is clean:
3. Screenshot full page (not just the fold). Scroll through and screenshot every ~800px so pinned/scroll-triggered sections are captured mid-animation, not just at rest.
4. Check for, and for each finding record {viewport, section, file, element/class}:
   - horizontal overflow / content clipping (also check document.scrollWidth > innerWidth)
   - whitespace gaps >~2x surrounding rhythm — give the exact element and measured px
   - text misaligned vs its container or siblings
   - overlapping / z-index-conflicting elements
   - fixed widths that don't reflow at narrow viewports
   - inconsistent vertical rhythm between sections
   - console errors/warnings (capture after scroll AND after hover on interactive elements)
5. PATCH each issue in the real file — name the file + selector, make the edit. Don't just describe it.
6. Re-screenshot the SAME viewport and confirm the issue is gone before the next issue.
7. Before leaving this viewport, re-check the OTHER viewports' key sections aren't regressed by your patch (a fix at 375 must not break 1440).

STOP CONDITION: only stop when all four viewports pass step 4 with zero findings. If an issue can't be fixed without a design decision, list it as BLOCKED with options and keep going.

OUTPUT: a table of every issue {viewport | section | file | fix | before/after shot}, then a one-line confirmation per viewport that it's clean.

CONSTRAINTS: obey CLAUDE.md (tokens only, no gradients/glass, gold ≤3/page, fonts via next/font). Don't ship reference PNGs as page images. Don't invent copy or assets.
```

---

## Order of operations

1. **Finish Phase 1** in Cursor (structure + motion, placeholder media).
2. **Generate media** in Google Flow per `MEDIA-GUIDE.md` + project cards per
   `SELECTED-WORKS-CARD-GUIDE.md`; drop into `public/`; swap out placeholders.
3. **Stage 2** whitespace pass.
4. **QA-loop** prompt across all four viewports.
5. **Later phase:** build the `/works` page, reusing the card/frame system proven here.
   Append a `## /works — Fix Guide` section to THIS file; don't spawn new plan files.
