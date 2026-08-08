# AUDIT-R6

Run against a clean `npm run build` + `npm run start` production server (not
dev), plus a separate dev-server pass for the Guide's dev-only test hooks.
Findings are stated even where they turned out to be non-issues, per
`CLAUDE.md`'s "deviations must be listed, not silently accepted."

## 1. Correctness

| Check | Result |
|---|---|
| `npm run build` | Clean. All 12 routes generate, no warnings. |
| `npx tsc --noEmit` | Clean. |
| `npx eslint` on every file R6 touched (14 files) | 0 errors, 0 warnings. |
| `npx eslint .` (whole repo) | 1046 errors / 12540 warnings — **all pre-existing**, entirely inside `.next-live` generated type stubs and `__shot.mjs` at repo root. Zero inside anything R6 touched. Confirmed by scoping eslint to the exact R6 file list above. |
| Console errors, all 5 routes × 2 breakpoints, production server, **real incremental scroll + hover** (not `fullPage:true`'s resize-capture — see §5) | None. |
| Bad HTTP responses (4xx/5xx), same pass | None. |

**One correctness bug found and fixed this phase**, via a `general-purpose`
fresh-eyes review (dispatched per §6 of the plan) that I then triaged and
verified myself:

- **Guide return-home fired mid-interaction.** `GuideScene.tsx`'s 12s standby
  timer was armed once, at the moment the radial menu (or Ask, or a bubble)
  opened — but nothing re-armed it while that surface stayed open. A visitor
  who opened the menu and took >12s to choose an option, without touching the
  puck again, would have the return fire *underneath them*, dragging the dock
  — and the radial menu anchored to it — across the screen mid-decision.
  `guide-drag.ts`'s `returnHome()` had no mode awareness at all.
  **Fixed**: the timer's callback now checks `guideStore.mode` before firing;
  if it's `"menu"`, `"ask"`, or `"talking"`, it re-arms instead of walking —
  deferring for as long as the surface stays open, never firing while occupied.
  Verified against the **real 12s timer**, not the dev bypass hook: offset
  unchanged at 13s with the menu open; walks home correctly once closed
  (`{"x":0,"y":0}` after a full subsequent standby). Full `verify:guide` suite
  re-run after the fix — still 40/40.

## 2. `CLAUDE.md` hard rules

| Check | Result |
|---|---|
| `SYMBOL STUDIO`, `#FE552E` | Zero hits in live source. |
| Retired gold `#B18A46` | Zero hits in live source. |
| Ad-hoc hex colors in any file R6 touched | Zero — every color resolves to a token. |
| Red-role rule (cherry / maroon / chili / chili-300) | **One violation found and fixed**: `ProcessFilm.module.css`'s `.eyebrowIndex` (the "02 / 04" beat counter) used `--color-accent-graphic` (pure chili) as body-size text on noir. DESIGN.md's rule is explicit — chili is graphic-only (rules, marks, ≥24px display) and fails AA below that size; body-size accent text on noir must use chili-300. Swapped to `--color-accent-on-noir` (chili-300), which is exactly the token already defined for this. No maroon-as-text anywhere new. |
| Fabricated clients/staff/metrics in new copy | None. The process-section rewrite's "two people, one room" claim was cross-checked live against `/about`, which independently states "Convenium is two people." — the two pages now agree rather than one contradicting the other, which is what R6 set out to fix. |

**One non-`.module.css` color note, not a violation:** `ProcessPlate.module.css`'s
plate border uses `rgba(202, 200, 192, 0.22)` rather than a token — but this is
the exact value `AboutChapters.module.css` already uses for a border-on-noir
(hairline is documented "rules and borders on cotton"; noir needs the dimmed
variant, and the repo has no token for it yet). Reused verbatim from an
existing pattern, not a new deviation — flagged in P2 below as a candidate for
promotion to a real token, since it now has two call sites.

## 3. Performance

| Metric | Value |
|---|---|
| Hero blob fetch (desktop) | 4.58 MB (`hero_scrub.mp4`, CRF 18, `-g 4`, 90 keyframes/361 frames confirmed) |
| Hero blob fetch (mobile encode, used ≥769px only) | 2.08 MB |
| Process plate blob fetch (desktop, deferred to scroll-near) | 4.84 MB (`process-scrub.mp4`, CRF 19, `-g 4`, 60 keyframes/241 frames confirmed) |
| `/works` hero film | 2.53 MB, normal encode (not scrubbed) |
| Total `public/media/` | 14 MB (was 42.7 MB pre-R6 — five dead files removed in Phase 1/4) |
| Total `public/images/` | 2.1 MB (four more dead files removed in Phase 6, see §6) |
| Guide GLB | 7 MB, unchanged, deferred via `requestIdleCallback` + dynamic import (pre-existing, not R6 scope) |

Two scrubbed videos now exist on the homepage (hero + process). They cannot
compete for bandwidth: the hero's blob is fetched at first paint and finished
scrubbing long before the page reaches Process; the process plate's own fetch
only starts once its section is desktop-motion-eligible and mounted, which is
well after the hero's fetch has resolved. Not measured with a network
throttle profile this pass — recommend a Slow-4G trace in a follow-up if this
becomes a real concern (P2, below).

## 4. Accessibility

- **New hero**: statement is ink-on-cotton at rest and during the wipe (13.5:1,
  same pairing as every other cotton section) — the earlier cotton-on-noir/film
  pairing no longer exists, so the contrast question the old grade existed to
  manage is moot. `HeroMedia` and the plate are `aria-hidden`. No new
  keyboard-reachable controls were added by R6 (the skip-the-intro control
  built in an earlier iteration of this session was removed at the user's
  request before this audit).
- **Process section**: copy reveals honor `prefers-reduced-motion` (opacity-only
  fallback, mirroring `MonolithScene.tsx`'s own pattern exactly). The plate is
  `aria-hidden`; it carries no information not already stated in the adjacent
  copy. Verified reduced-motion renders with zero console errors and no pin.
- **Guide**: return-home is an instant, unanimated snap under reduced motion —
  verified directly (offset reached `{0,0}` within 60ms of the call, well
  under the animated path's 0.9s floor). `setPointerCapture()` remains absent,
  `window`-level listeners remain in place, per the docblock's explicit
  warning against "fixing" either.
- Focus states, keyboard nav for existing chrome (header, footer, forms):
  unchanged by R6, not re-audited here — out of this run's touched-file scope.

## 5. A capture-method finding, not a site bug

`page.screenshot({ fullPage: true })` — used by this repo's own
`scripts/screenshot.mjs` as well as my own ad-hoc verification scripts —
resizes the viewport to the full document height and captures once, rather
than performing real incremental scroll. Two symptoms, both traced to this,
neither an R6 regression:

1. **Sticky/pinned sections render collapsed or garbled** in a `fullPage`
   capture (the Hero's pin, `ProcessFilm`'s sticky bed, `/about`'s
   `MonolithScene` chapters, and pre-existing `WorkDeck` cards all show this).
   ScrollTrigger's pin math is computed against a real scroll timeline that
   never actually runs during a resize-based capture.
2. **Lazy-loaded images below the fold render as empty/placeholder** in the
   same capture mode — confirmed on `/services`, where `next/image`'s five
   service photos (pre-existing, not touched by R6) rendered as gray boxes
   under `fullPage:true` but loaded correctly (`naturalWidth` populated) under
   a real `mouse.wheel` scroll pass.

Both were verified as capture artifacts, not real bugs, by re-running the
identical check with genuine incremental scrolling — everything renders
correctly. `screenshots/r6/*.png` were captured using the real-scroll method
for this reason; a naive `fullPage:true` pass would under-represent this site
systematically, for reasons that predate R6. Worth fixing in
`scripts/screenshot.mjs` itself at some point (P2, below) so future QA passes
don't have to rediscover this.

## 6. Deployment readiness

| Item | Status |
|---|---|
| `robots.ts` | Sane — allows `/`, points at the sitemap. |
| `sitemap.ts` | Lists all 6 real routes with sensible priorities. Unchanged by R6; checked against the new hero statement and found not stale (see below). |
| OG image | `/images/og-cover.jpg`, referenced correctly, unchanged. |
| Favicons | `app/icon.tsx`, `app/apple-icon.tsx` present. |
| `next.config.ts` | No `images.domains`/remote patterns configured — correct, since every image reference in the app is local to `/public`. No video-specific config needed; static video is served as a static asset, not through `next/image`. |
| `.gitignore` | Sane — `.next`, `.next-dev`, `.next-verify`, `node_modules`, build artifacts all excluded. |
| `app/dev/hero-preview` | **Decision: kept, gated.** Confirmed `notFound()` fires under `NODE_ENV=production` and the route carries `robots:{index:false}` independently — it 404s in the deployed build and is excluded from indexing even if that gate ever failed. Content-wise it is now substantially stale against the R6 hero (see the notice added to its own file) — full rewrite is P1 backlog, not a shipping risk. |
| Dead files in `public/` | **Fixed this phase.** Four files flagged as unused-with-zero-references in `MEDIA-BRIEF-R6.md` (`poster-hero-start.jpg`, `poster-hero-end.jpg`, `gallery_final.jpg`, `works_plate.jpg` — 2.9 MB) are deleted. `team.mp4`/`poster-team.jpg` were already removed in Phase 4 once `ProcessFilm`'s cutover was verified. |
| Build output size | First Load JS unchanged at 103 kB shared; `/` grew from 10.1 kB → 10.3 kB route-specific JS (new hero/process logic), well within normal range. |

**`site.tagline` and OG description — checked, left alone, stated explicitly.**
`content/site.ts`'s `tagline` ("We take businesses to the level their ambition
deserves.") is no longer rendered anywhere on the page — the new hero
statement replaced it in `Hero.tsx`. It is still used in the `<title>` tag and
nowhere else. Judgment: it does not read as stale — it is a legitimate,
checkable, standalone positioning line for meta/SEO purposes, distinct from
the on-page headline, and there is no on-page conflict since a `<title>` isn't
visible while browsing. Left unchanged, per the plan's own instruction to
state this decision rather than silently change or silently leave it.

## 7. Improvements found, ranked

### P0 — fixed in this run
1. Guide return-home firing mid-interaction while the radial menu was open (§1).
2. Red-role violation: chili used as body-size text on noir in the process
   beat counter (§2).
3. Four dead media files removed (§6).
4. *(Carried from earlier in this session, not newly found in audit but
   worth restating for the record):* a chicken-and-egg bug in
   `ProcessPlate.tsx` where the scrub `<video>` only rendered once its own
   tier resolved, so the tier could never resolve — fixed by mounting all
   media layers unconditionally and gating visibility, not existence,
   matching `HeroMedia.tsx`'s actual pattern.

### P1 — real, not fixed this run, with rationale
1. **`guide-content.ts`'s "work" anchor entry names fictional projects**
   (VANTA, AUREL, NULL/ONE, FERRO) that do not exist anywhere else on the
   site — the real Selected Works are Sonn'werk, The Meridian, SR Urologie,
   and Education4Students (`content/projects.ts`, `/works`). If a visitor
   asks the Guide to explain the work section, it currently narrates
   completely fabricated case studies, which is a direct `CLAUDE.md`
   violation ("don't fabricate clients"). **Not fixed here**: this predates
   R6 (I only touched the adjacent `"process"` entry, per this run's stated
   scope), and fixing it properly means writing four new honest explain-lines
   against real project facts — a content task in its own right, not a
   drive-by edit.
2. **`app/dev/hero-preview/HeroPreview.tsx` needs a full rewrite**, not a
   patch — it re-implements the pre-R6 grade ramp (now retired), the pre-R6
   height-based cover (now a clip-path panel), and the pre-R6 headline text.
   Flagged clearly in its own docblock this phase rather than left silently
   wrong; confirmed it cannot reach production (§6). `scripts/verify-hero.mjs`
   is the actual, currently-trustworthy verification tool.
3. **`scripts/screenshot.mjs` should scroll incrementally before its
   `fullPage` capture**, or capture in viewport-sized segments while
   scrolling, so future QA passes don't have to rediscover §5's finding.

### P2 — minor, one-line rationale each
1. `rgba(202, 200, 192, 0.22)` (the noir-hairline border) now has two call
   sites (`AboutChapters.module.css`, `ProcessPlate.module.css`) and no token
   — worth promoting to `--color-hairline-on-noir` at some point.
2. Bandwidth trace (Slow-4G) for the two-scrubbed-video homepage hasn't been
   measured with a real throttle profile — sequencing argument in §3 is sound
   but untested under a slow link.
3. `ProcessFilm.tsx`'s beat-index label reads "MAKE 02 / 04" etc. — a small
   numeral/word pairing that works but wasn't checked against any typographic
   precedent elsewhere on the site; a fresh pass could tighten it.

## 8. Deliverables

- All code changes applied, building clean, 40/40 Guide checks passing,
  zero console errors across every route at both breakpoints on a real
  production server with real scroll.
- `MEDIA-BRIEF-R6.md` — all 5 generated assets, prompts, settings, encode
  commands, and the site-wide media gap audit.
- `AUDIT-R6.md` — this file.
- `screenshots/r6/` — 10 full-page captures (5 routes × 2 breakpoints),
  captured with real incremental scroll per §5's finding.
- Credits spent: 56 of an 80 cap (Higgsfield media generation, §Phase 3).

## What's still blocked or needs a decision

- **`guide-content.ts`'s fabricated work-section copy (P1 #1 above)** needs a
  decision: fix now as a follow-up, or leave for a dedicated content pass.
  This is the one finding in this audit that touches the "don't fabricate"
  hard rule and isn't yet resolved.
- **`app/dev/hero-preview` rewrite** — confirmed safe (404s in production),
  but stale enough that anyone using it for manual QA today would be misled.
- Nothing else in this run is blocked. Every phase's verification loop passed
  before the next phase began, and this audit's own findings were triaged and
  fixed inline rather than deferred, except the two items above.
