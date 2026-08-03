# Convenium Studio — Homepage Fix Guide (R4: cohesion + story)

Single source for the current round of homepage + `/about` work. Supersedes the
"revised opening" in earlier passes. Earlier fix plans (Pass 2 / Pass 3) are
implemented and live in `/archive`.

**Executor:** Cursor Composer (Agent mode, repo root = this folder).
**Bound by:** `CLAUDE.md` (tokens only — no gradients/glass, gold ≤3 per page,
fonts via `next/font`, no Symbol Studio content), `DESIGN.md` (visual values +
elevator narrative), `symbol-studio-design-audit.md` + `audit-notes.json`
(measured geometry — override guesses), `.claude/skills/frontend-design`.
**Companion guides:** `MEDIA-GUIDE.md` (Google Flow media — the new elevator-POV
clip, the founder shots, the studio), `SELECTED-WORKS-CARD-GUIDE.md` (project-card
content).
**Scope:** Homepage + `/about`. Desktop-first (1920×1080 / 1440×900); mobile +
reduced-motion stay on the existing static fallbacks.

---

## What changed in R4 (read this first)

Three client directions drive this revision:

1. **The opening must belong to the rest of the site.** Today the desert hero and
   the elevator journey read as a *different website* from the disciplined
   noir/bone/gold editorial sections below. The narrative intent (chromatic "before"
   → controlled "after") is right, but the seam is unmanaged, so it reads as
   disconnected rather than as a deliberate compression. R4 adds a **bridging
   system** (below) so the journey *delivers* you into the site's world instead of
   cutting to it.

2. **New elevator video — a ride into the gallery.** The framed scrub video is
   replaced by a single **elevator-POV travelling shot**: you step out of the lift
   from the hero and move through Convenium's gallery to the one piece that matters.
   Full shot spec below and in `MEDIA-GUIDE.md` (M1).

3. **Tell the real story, sell the real model.** Convenium is a **two-person,
   semi-autonomous digital agency**: a couple in Klagenfurt, Austria — one directing
   an AI production pipeline (ex-Infineon digital engineer), one running graphic
   design + social. Two new homepage sections (**Founders** and **How the work gets
   made**) and a rewritten `/about` carry this. Testimonials become a real slot the
   client will fill.

---

## The cohesion system (the R4 centrepiece)

**Diagnosis.** The sections below the fold already share a vocabulary: uppercase
micro-label eyebrows, 1px hairlines, floor-style numbering, Archivo Black display +
Newsreader serif, a single gold thread (`#B18A46`, ≤3 uses), bone/noir fields. The
hero + journey use *none* of it — no eyebrow, no hairline, no numbering, no gold, a
bespoke type treatment, and a warm photographic grade that never resolves into the
site palette. So the eye reads "two sites."

**Fix — make the gallery the bridge, then thread the chrome through the journey.**

1. **The gallery is rendered in the site's world.** The new elevator-POV clip and the
   spotlight end-plate are graded to the exact palette — warm bone walls
   (`#EEEDE8`/`#F8F7F2`), noir (`#050505`), one gold accent (`#B18A46`). The desert
   hero is the chromatic "before"; the moment the doors open you are already inside
   the bone/noir/gold world the rest of the page lives in. Arrival = arrival home.
   (Grade spec in `MEDIA-GUIDE.md`.)

2. **Carry the editorial chrome into the journey.** During the split/manifesto and
   the works showcase, mount the same devices every section below uses:
   - a top-left **eyebrow** micro-label (uppercase, 11–13px, Inter, restrained
     tracking) — e.g. `GOING UP` on the shut doors, `SELECTED WORK` on the plate;
   - a **1px hairline** (`#CAC8C0`) anchoring the lockup, as in `ServicesPreview`/
     `Principles`;
   - **floor-style numbering** for the manifesto beats and the case index, reusing
     the numeral treatment already in `Principles`/`ProjectCard`.

3. **One gold thread, spanning both worlds.** Gold appears in the journey exactly
   once — the **manifesto level indicator** (this is gold-use #2 in `DESIGN.md`'s
   three-use rule) — and once as a **thin gold baseline under the spotlight piece**.
   That is the single accent that also appears in `START A PROJECT` and the footer,
   so the same material runs from lift to footer. Keep the page total at ≤3 rendered
   gold surfaces (the film's warm light doesn't count).

4. **Type continuity.** The question line, manifesto beats, and case text use the
   site type system exactly — Archivo Black for display, Newsreader for the editorial
   payoff line, Inter for labels — at the section scale and line-heights in
   `DESIGN.md`. No journey-only font treatment.

5. **Better split layout (client note 3).** Rebuild the manifesto split on the site's
   grid so it reads as a *pinned Convenium section*, not an interstitial: 12-col,
   40–48px primary inset, reading column ≤600px, eyebrow + hairline lockup top-left,
   manifesto beats left as a numbered stack, media right. Same margins and rhythm as
   `ServicesPreview`.

6. **Manage the seam.** When the showcase pin releases, hand off into the next
   section instead of cutting: the plate's **bone wall colour continues** as the next
   section's background field for one section, a **hairline persists** across the
   boundary, and the **numbering continues** (works were the last numbered block;
   the next eyebrow picks up the sequence). No hard jump from pinned cinema to flat
   editorial.

7. **Wordmark thread.** The `CONVENIUM STUDIO` wordmark enters once the rider commits
   to the lift (per `DESIGN.md`) and pays off oversized in the footer close — brand
   identity present in both worlds.

**Acceptance for cohesion:** screenshot the last frame of the journey and the first
editorial section together — a stranger should not be able to tell where "the
intro" ends. Eyebrow, hairline, numbering, gold, and type are present on both sides
of the seam.

---

## The revised opening — authoritative flow

```
① HERO FILM plays (desert / elevator threshold — unchanged, graded "before" world)
② scroll → DOORS CLOSE over it (power4.in, hard stop)
③ on the shut doors: ONE QUESTION — "Are you ready to level up your design?"
      (eyebrow GOING UP above it; bone type; holds while shut)
④ DOORS OPEN → ELEVATOR-POV RIDE (pinned, scroll-scrubbed):
      the camera moves OUT of the lift and THROUGH Convenium's gallery — a hall
      full of other art — toward the one piece in the far corner.
      LEFT  = manifesto beats (numbered, reveal in step with the ride)
      the ride is scrubbed by scroll; beats + travel are one timeline
⑤ camera LOCKS on the masterpiece → it settles into the plate composition and
      PINS FULLSCREEN: the hero piece in a fancier frame under a spotlight, clearly
      the best work in the room, empty bone wall to the right for text. The clip's
      last frame cross-fades to the still plate — video ends here.
⑥ WORKS SHOWCASE (inline): inside the framed opening each project plays a seamless
      loop; the empty right wall carries that project's text; scroll swaps projects.
      A "SEE MY WORKS" button links to /works. Pin releases into the seam hand-off.
```

Difference from R3: the right-hand *framed* scrub video is gone. Doors now open
straight into the **moving POV** (client note 3 — keep the idea, better layout). The
frame only *forms* at lock-on (⑤). The split still has manifesto-left, media-right,
but the media is the full travelling ride, framed by the section grid rather than by
a literal video card.

## Homepage section order (R4)

```
1. OpeningSequence   hero → doors → question → POV ride + manifesto → lock → works showcase
2. HowItsMade        semi-autonomous agency: the workflow + the economics (fills Symbol "stats" gap)
3. Founders          "Two people, one system" — the couple, Klagenfurt (replaces ProcessFilm copy)
4. ServicesPreview   five disciplines (unchanged content)
5. Testimonials      real client quotes — CLIENT-PROVIDED slot (see below)
6. Principles        How We Work (kept)
7. Faq
8. Footer            oversized "TAKE IT HIGHER." close + wordmark
```

Narrative: **what** (the work in the gallery) → **how** (the AI pipeline) → **who**
(the couple) → **what we offer** (services) → **proof** (testimonials) → **how we
work** (principles) → **questions** → **invitation**.

---

## New section — `HowItsMade` (semi-autonomous agency)

The differentiator, told straight and honestly. Convenium delivers agency-grade,
scroll-animated work because production is **semi-autonomous** — a human-directed AI
pipeline compresses the *making*, never the *judgment*.

**Copy direction (draft; client to confirm):**
- Eyebrow: `HOW THE WORK GETS MADE`
- Headline (Archivo Black): `Agency output. Studio overhead.`
- Newsreader payoff: `The lift is automated. The judgment isn't.`
- Body: a two-person studio that runs like an agency because a directed AI pipeline
  does the production while the humans keep the strategy, the taste, and the final
  pass.

**The workflow, as a real 3-step sequence** (numbering is honest here — it *is* a
sequence, so floor numbering is earned):

| Floor | Stage | Who | What happens |
| --- | --- | --- | --- |
| 01 | Direction | Human | Strategy, positioning, art direction — the decisions worth owning. |
| 02 | Production | AI pipeline (directed) | Identity, pages, film and campaigns generated and iterated fast. |
| 03 | Finishing | Human | QA, hand-final, the taste pass before anything ships. |

**The economics (his own offer — allowed; not fabricated client data).** Present as a
restrained stat lockup, not a SaaS metric wall:
- `≈ €30–40k` agency price → `about half` at Convenium
- `weeks` → `days` on delivery
- `2 people` → `agency-grade output`

Keep it disciplined: one gold accent max in this section, hairline dividers, no
gradient stat cards. This section fills the gap where Symbol Studio runs its
"+30–40% sales / −20–30% loss" block — but with our *own* verifiable claim.

## New section — `Founders` (Two people, one system)

Replaces the fictional "small team" copy in `ProcessFilm`. The real story:

- A couple based in **Klagenfurt, Austria**.
- **Him** — ex-Infineon **digital engineer**; directs the semi-autonomous AI
  production stack. Anchor visual: the **orchestrator pull-back** (head down at the
  desk → lifts his head → camera pulls back to reveal the ranked "army" of AI behind
  him). See `MEDIA-GUIDE.md` F1.
- **Her** — **graphic designer + social media**; the craft and the channel. See F2/F3.

Layout: a **diptych** — "directed by AI, finished by hand." Left panel = him +
"Direction & the pipeline"; right panel = her + "Design & social". A small
who-does-what ledger (hairline rows) beneath. The **two-shot** (F4) sits as the
smaller human anchor. Bone field continued from the seam; eyebrow `THE STUDIO`;
gold not used here (budget spent on the journey + footer).

## Testimonials slot (client-provided)

Design the section; **do not fabricate quotes** (`CLAUDE.md`). Build it to accept
3–5 real quotes (`content/testimonials.ts`, empty array shipped): quote in Newsreader
at display scale, attribution in Inter micro-label, hairline between. Until the
client supplies quotes, the section renders nothing (no placeholder text on the live
page). Eyebrow `IN THEIR WORDS`.

---

## `/about` — studio page rewrite (R4)

Retire the fictional "strategists, designers and makers" framing; tell the true
two-person story and **showcase her work explicitly**.

- **`AboutHero`** — true intro: an independent two-person studio in Klagenfurt that
  ships agency-grade work through a semi-autonomous pipeline. Ledger rows become real
  facts (based / active since / model = direct, two-person).
- **`StudioModel` → "One system, two hands"** — the diptych expanded:
  - **Him — Direction & the pipeline:** ex-Infineon digital engineer; how the
    directed AI stack works (reuse the `HowItsMade` 01/02/03 sequence). Orchestrator
    shot.
  - **Her — Graphic design & social.** Two distinct showcases:
    1. **Graphic design** — a horizontal **craft strip / mosaic** of her design
       artifacts (posters, editorial spreads, type specimens, identity studies),
       plus a window-side portrait of her reviewing a printed sheet. Reads as
       tactile, human output — the answer to his "machine" half.
    2. **SMM** — a slow, palette-locked **vertical column of content tiles**
       (phone-format story/post frames in noir/bone) beside her statement, framed as
       *"the brand's highest-frequency surface, held to the same system."* Motion
       reads as an always-on channel without clutter. (Ties to `services.ts` SMM
       copy.)
  - A hairline **who-does-what ledger**: Direction · engineering · AI pipeline /
    Graphic design · art direction / Social · content systems.
- **`ProcessSteps`** — reuse the honest 01/02/03 workflow (Direction / Production /
  Finishing) with the scroll-progress hairline draw.
- **`StudioFilm`, `AboutCta`** — keep; retune copy to the true story; keep the
  magnetic CTA and the solid noir copy band (no translucent glass panel).

---

## Locked decisions (do not re-litigate)

- One continuous scroll experience; the only button is "See my works" → `/works`.
- Doors open **straight into the moving POV ride** — no separate framed video card;
  the frame forms only at lock-on.
- The gallery (POV + plate) is graded to the site palette so it *is* the bridge.
- Editorial chrome (eyebrow + hairline + numbering) and one gold thread run through
  the journey; the seam is handed off, not cut.
- Scrub feel: `scrub: 0.3`, **no snap** (frame-by-frame, never bounces back). After
  the pin mounts: `ScrollTrigger.sort()` + `ScrollTrigger.refresh()`.
- Media is placeholder-first: build structure/motion with existing assets; real Flow
  media from `MEDIA-GUIDE.md` swaps in after.
- Door line: **"Are you ready to level up your design?"** (matches "TAKE IT HIGHER").
- Testimonials + real founder photos/clips are **client-provided**; ship empty slots,
  no fabrication.

## Assets & geometry

- **Plate opening (unchanged):** inner frame ≈ **left 24.5%, top 18%, width 21%,
  height 47.5%** (portrait ~4:5). Right wall (≈37%→96% width) = text zone.
- **Placeholder media until Flow lands:** POV ride = existing
  `public/media/gallery_scrub.mp4`; plate = `public/images/works_plate.jpg`; project
  loops = existing `public/images/still-columns-*.jpg`; founder shots = existing
  `still-team-*.jpg` stand-ins.
- New media save paths are defined in `MEDIA-GUIDE.md`.

---

## PHASE 1 — opening: doors → POV ride → lock → showcase (+ cohesion chrome)

Build on `OpeningSequence.tsx` (keep it the single desktop pin; keep the static /
mobile / reduced-motion fallbacks). One master scroll-scrubbed timeline, sequential
labels, `immediateRender: false`, never two `autoAlpha>0` states at once.

- **A — Doors + question.** Always-on on desktop + no-reduced-motion; never gate on
  video `ended` (seek hero to final frame under the shut doors, guarded). Add eyebrow
  `GOING UP` above the question; question fades in on the shut doors and holds.
- **B — POV ride + manifesto.** Doors open to the pinned ride. Scrub the POV clip's
  `currentTime` by scroll; reveal the numbered manifesto beats (left, on the section
  grid) in step. Add the gold **level indicator**. This replaces the framed-video
  split.
- **C — Lock → plate.** Continued scroll settles the camera on the masterpiece; at
  the end, cross-fade the clip's last frame to the still plate (`works_plate.jpg`)
  and add the thin gold baseline under the piece. Frame opening = the geometry above.
- **D — Inline works showcase.** Active project's seamless loop inside the opening;
  its text on the right wall (`content/projects.ts`); scroll swaps projects
  (cross-fade, never two at once); loop + hover per `SELECTED-WORKS-CARD-GUIDE.md`.
  "See my works" → `/works`. Release the pin into the **seam hand-off** (continue the
  bone field + hairline + numbering into `HowItsMade`).
- **Chrome:** eyebrow + hairline + floor numbering mounted through B–D per the
  cohesion system; type from the site system only.
- **Fallbacks (unchanged):** reduced-motion / mobile — no pin/doors/ride; static
  question + manifesto stack, then the static works grid/stack (posters, no loops).

## PHASE 2 — new sections + /about

- Build `HowItsMade` and `Founders` (homepage) and the `Testimonials` slot
  (`content/testimonials.ts`, empty).
- Rewrite `/about` per the section above, with her two showcases.
- Reuse existing treatments (hairline rows, eyebrows, 8/10px radius, InteriorReveal);
  no one-offs. Gold ≤3 per page.

## PHASE 3 — media swap + whitespace pass

- Drop Flow media from `MEDIA-GUIDE.md` into `public/`; swap out placeholders.
- Whitespace/balance (C.R.A.P.): no section >~45% uncomposed empty space; statement
  sections cap ~70vh unless they carry full-bleed media or a filled second column.

---

## Accept (show evidence, every phase)

- Reload + scroll ×5: doors close, `GOING UP` + question show, doors open onto the
  **moving POV ride**, manifesto reveals in step, camera locks and pins on the
  spotlight plate, works showcase runs with right-wall text, projects swap on scroll,
  "See my works" links to `/works`. Never skipped regardless of whether the film
  finished; never snaps backward.
- **Cohesion check:** a screenshot straddling the journey→`HowItsMade` seam shows
  eyebrow + hairline + numbering + gold + shared bone field on both sides; a stranger
  can't tell where the intro ends.
- `HowItsMade` states the 01/02/03 workflow + the economics lockup; `Founders` shows
  the diptych; `/about` shows her graphic-design strip + SMM content column;
  testimonials slot renders nothing when the array is empty.
- `npm run build` clean; console clean after scroll + hover; Playwright full-page +
  500px-interval screenshots at 1440×900 and 390×844; reduced-motion path renders the
  static question + manifesto + static works.
- Grep clean: no `SYMBOL STUDIO`, no `#FE552E`; gold ≤3 rendered uses per page.

## Verification QA-loop prompt (run after each phase, per viewport)

```
You have browser automation (navigate, resize, screenshot, read console). Confirm you
have them before starting; if not, stop and tell me.

GOAL: the homepage + /about render clean at every viewport below. "Clean" = no
horizontal overflow, no uncomposed whitespace >~2x the section's own rhythm, no
misaligned or overlapping/z-conflicting elements, no fixed widths breaking at narrow
viewports, consistent vertical rhythm, AND the journey→sections seam passes the
cohesion check (eyebrow/hairline/numbering/gold/bone field present on both sides).

SETUP
1. Start the dev server; wait until it responds (poll, don't assume). Report the URL.
2. Viewports, in order: 375x812, 768x1024, 1440x900, 1920x1080.

PER VIEWPORT — do NOT move on until clean:
3. Screenshot full page; scroll and screenshot every ~800px so pinned/scrub sections
   are captured mid-animation, not just at rest.
4. Record {viewport, section, file, element/class} for: horizontal overflow
   (document.scrollWidth > innerWidth); whitespace gaps >~2x rhythm (give px);
   misalignment; overlap/z-index; fixed widths that don't reflow; inconsistent
   rhythm; console errors/warnings after scroll AND hover; cohesion-seam regressions.
5. PATCH each in the real file (name file + selector, make the edit).
6. Re-screenshot the SAME viewport; confirm gone before the next issue.
7. Before leaving, re-check other viewports' key sections aren't regressed.

STOP only when all four viewports pass step 4 with zero findings. If an issue needs a
design decision, list it BLOCKED with options and keep going.

OUTPUT: a table {viewport | section | file | fix | before/after}, then one line per
viewport confirming clean.

CONSTRAINTS: obey CLAUDE.md (tokens only, no gradients/glass, gold ≤3/page, fonts via
next/font). Don't ship reference PNGs as page images. Don't invent copy, clients, or
assets.
```

## Order of operations

1. **Phase 1** in Cursor (opening: POV ride + cohesion chrome; placeholder media).
2. **Phase 2** (new sections + /about; empty testimonials slot).
3. **Generate media** in Google Flow per `MEDIA-GUIDE.md`; drop into `public/`.
4. **Phase 3** media swap + whitespace pass.
5. **QA-loop** across all four viewports.
6. Client supplies real testimonials + founder photos/clips → swap in.
