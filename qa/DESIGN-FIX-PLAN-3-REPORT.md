# Design Fix Plan 3 — Execution Report

All four phases executed and verified against a clean production build (`NEXT_BUILD_DIR=.next-verify npm run build && next start`), independent of the live `next dev` watchdog. `npm run build` passes with no type/lint errors; `npm run audit:site` (scroll + hover on all 6 routes) reports zero console/page/HTTP errors.

## Phase A — FIX 4 (animation system rebuild)

**Confirmed bug, fixed:** `GOING UP.` and `LOUD.` rendered simultaneously mid-scroll (`components/sections/home/Manifesto.tsx`). Root cause: the crossfade tween dimmed the exiting word to `opacity: 0.25` instead of `0`, and the entering word's fade-in overlapped the same time window — so both had non-zero opacity together at any scroll position inside that window (verified: not just at a snap point, every sampled position 85 samples across the range showed 0 overlaps after the fix, vs. the reproducible overlap before it).

**Fix:** rebuilt as sequential, non-overlapping tweens — the exiting word finishes at `autoAlpha:0`, guarded by an explicit `.set()`, before the entering word starts from `autoAlpha:0`. Added labels at each beat boundary.

**Second bug found and fixed (same root cause family):** Hero's door-transition `ScrollTrigger` is created lazily (once the video ends) — a `ScrollTrigger.refresh()` is now called immediately after, because downstream triggers (Manifesto, Works) had already measured their position before this pin's spacer existed, which is exactly the "pin spacers shift trigger positions" failure mode FIX 4 called out.

**Deviation noted, not applicable:** FIX 4 also describes a "reveal mask" system clipping captions and restricts it to headings/media. No such reveal/scroll-mask system exists anywhere in this codebase (grepped — zero matches for reveal/mask/IntersectionObserver-driven text reveal outside video-autoplay triggers). The Intro section's caption was checked directly and does not clip. Nothing to fix here; noting the deviation rather than inventing a system to constrain.

## Phase B — FIX 1 + FIX 2 (hero hold + doors)

**FIX 1 (hold + stall guard):** Verified the hero video already played to its true natural end (11.54s/11.54s) and held there — no hardcoded pause existed. Added the stall guard the spec required: on `waiting`, the scroll indicator now appears after 1s (`entered` state) and the video is swapped for the `poster-hero-end.jpg` fallback after 2s, so a stalled buffer never leaves a frozen frame on screen. Verified via a synthetic `waiting` dispatch: video element unmounts, poster mounts, indicator fades in, exactly on schedule.

**FIX 2 (doors), two real bugs found and fixed:**
1. The door `ScrollTrigger`'s `start: "top top+=1"` was already satisfied at `scrollY: 0` (Hero is the first section), so the doors closed **immediately** on video-end with zero user scroll. Fixed by arming the trigger lazily on the first `wheel`/`touchmove`/keyboard-scroll event after the video ends.
2. Once armed correctly, reversal (`onLeaveBack`) never fired scrolling back up. Root cause: `"top top+=1"` resolves to an absolute start of **scrollY ≈ -1** for a section at document position 0 — a position `scrollY` can never go below (it clamps at 0), so "before start" was mathematically unreachable. Changed to `"top top-=1"` (start ≈ +1), confirmed the full close→reopen→close→reopen cycle works symmetrically and repeatably.

A third, unrelated bug surfaced while fixing the doors: `gsap.set(el, {xPercent:-100})` on an element whose CSS class already carries `transform: translateX(-100%)` (the no-JS fallback position) stacked the two instead of replacing — doors ended up at ±200%. Fixed by explicitly zeroing `x` alongside `xPercent`.

## Phase C — FIX 5 (works gallery scrub)

- Confirmed `public/media/gallery_scrub.mp4` is already the all-keyframe re-encode (ffprobe: 192/192 frames report as I-frames).
- Approach video scrub distance increased from 1 unit (~100vh — the reported "too fast/choppy" cause) to 2.5 units (250vh, meeting the spec floor exactly). `scrub` raised from 0.75 to 1.2.
- Case 01's poster + wall text now animate in during the last 12% of the approach's own scroll range, finishing exactly at the video-end boundary (both hand-verified via direct-time sampling and via continuous-scroll + settle testing). Snap points rebuilt around actual dwell boundaries (`0, 2.5, 3.5, 4.5, 5.5, 6.5` in scroll-units) instead of naive 1-unit intervals, which no longer aligned once the approach phase became non-integer-length.
- Reverse-scroll confirmed clean (case 01 exits, video scrubs backward) across two full forward/back cycles.

## Phase D — FIX 3 (grade/echo) + FIX 6 (balance audit)

**FIX 3:**
- Hero grade updated to the exact approved values (`brightness(0.78) saturate(0.78) contrast(1.08)`, scrim to 19% black, inside the 16–22% band).
- Hero's scroll-indicator line is now the section's one gold accent (previously bone, no gold at all in the hero).
- Footer now echoes the hero's held final frame at low opacity behind the black (`linear-gradient(rgba(5,5,5,.92)…) , url(poster-hero-end.jpg)`) — visually confirmed in screenshots.

**FIX 6 — three dead-zone violations found and fixed** (same "left block, huge empty right/below" pattern named in the original report):
1. **ServicesPreview (homepage)** — headline had a ~60%-of-viewport empty zone to its right. Fixed by pulling the existing "View all services" link up into that space, baseline-aligned with the headline, instead of stranding it below the list.
2. **ProcessFilm (homepage, "THE WORK STAYS CLOSE TO THE IDEA.")** — copy stacked below the video, leaving the section short but the copy block itself was flanked by dead space and the whole treatment didn't match its sibling section. Converted to the same dark-overlay pattern already used successfully by `StudioFilm` on `/about` (copy over the film's dark zone, section height capped to the video, no trailing empty block).
3. **ProjectFit (/contact)** — the still image sat alone below the two text columns with a large void beside and under it. Restructured as a third grid column so the image joins the two text blocks instead of floating.

**One severe, unrelated bug found during the mobile audit:** `UNFORGETTABLE.` ran completely off **both edges** of the viewport at every desktop width tested (769/1024/1440/1920) — `white-space: nowrap` plus the shared manifesto font-size, sized for words a third as long. Also clipped on mobile in the static fallback list (flex-column children default to `min-width:auto`, so the word overflowed instead of wrapping). Fixed with a length-triggered smaller size for the pinned version and `min-width:0; overflow-wrap:break-word` for the static list; re-verified the word now stays fully on-screen at all four desktop widths and wraps cleanly to two lines on mobile.

**Routes reviewed:** `/`, `/works`, `/services`, `/about`, `/contact` at 1440 and 390 (the 5 routes named in the plan's accept criterion). `/privacy` was screenshotted for completeness and has the same dead-zone pattern, but it's explicitly a placeholder page outside the plan's named route list — left as-is rather than redesigning a placeholder.

**Gold count:** spot-checked per visible section (hero, manifesto index, services index, footer arrow) — nowhere did more than the intended single accent appear in the same viewport.

## Verification evidence

- `npm run build` (isolated `NEXT_BUILD_DIR=.next-verify`, independent of the live dev watchdog): clean, no type/lint errors.
- `npm run audit:site` against the production build: 0 console/page/HTTP errors across `/`, `/works`, `/services`, `/about`, `/contact`, `/privacy`, including after scroll-through and card hover.
- Full-page screenshots captured at 1440×900 and 390×844 for all 6 routes (`screenshots/*-desktop.png`, `screenshots/*-mobile.png`).
- Targeted before/after screenshots and direct DOM/computed-style assertions for every fix above (Manifesto overlap, door open/close/reopen cycle ×2, stall-guard timing, works-gallery handoff, ServicesPreview/ProcessFilm/ProjectFit dead-zones, UNFORGETTABLE overflow at 4 breakpoints + mobile).

## Notable environment note (not a product bug)

This machine's OneDrive sync intermittently locks `.next*/trace` mid-write, which was already flagged in `next.config.ts` (dev uses `.next-dev`). Running a one-off production build/start concurrently with the live dev watchdog compounds this, since both point at the same directory. `next.config.ts` now reads `NEXT_BUILD_DIR` so a verification build can target its own directory (`.next-verify`, gitignored) without racing the dev server — used throughout this pass instead of touching the live `.next-dev`.

Tried relocating `.next-dev` itself outside the synced folder via a directory junction (`mklink /J`) pointing into `%LOCALAPPDATA%`, which would have fixed the crash at its root — but Node's module resolution walks the junction's real path when loading `node_modules`, breaking `require('react/jsx-runtime')` and worse. Reverted immediately; the site was briefly down (HTTP 500) during this attempt before the revert restored it. The watchdog's existing 2s auto-restart remains the working mitigation. A durable fix would be excluding this project folder from OneDrive sync via OneDrive's own settings — outside what I can safely change from here.

## Live-feedback round (post Phase D)

Four issues reported directly from a live browser session (port 3000, the watchdog's dev server) and fixed:

1. **Hero video appeared stuck** — traced to the dev server actually crashing (see OneDrive note above) mid-session, not a playback bug; confirmed via `.dev-server.err.log`. Restarted the server; the junction attempt above was the (reverted) fix attempt.
2. **WorksFrame section heading ("WE DO NOT DECORATE BUSINESSES...") had a large empty zone to its right** — same dead-space pattern as the earlier ServicesPreview fix, missed in the Phase D audit because that pass focused on the pinned scrub, not this section's own heading. Fixed by removing the `max-width: 760px` cap so the large display type fills the row instead of wrapping narrow with empty space beside it.
3. **Footer had a visible hero-image background** — this was FIX 3's spec-mandated "footer echo," but the user found it read as a repeated hero banner rather than a subtle close. Removed per explicit direction; footer is solid black again.
4. **Selected Work section "jumped into frame" while still scrolling the previous section** — root cause: the Hero door `ScrollTrigger` was created lazily on the user's first scroll gesture *after* the video ended, which could be arbitrarily late if they kept scrolling past Hero before it finished. Whenever it finally did fire, inserting its pin-spacer retroactively shifted every section below by ~630px in one frame — visible as WorksFrame's content suddenly jumping. Fixed by creating the trigger immediately once the video ends (relying on the already-corrected `start` offset to still avoid firing with zero scroll in the common case), plus a global `window.load` → `ScrollTrigger.refresh()` safety net for any other late-loading-content drift. Verified via a realistic replay (wait for video end without scrolling, then scroll continuously through the whole page) — scrollY samples were perfectly monotonic with zero anomalies.
