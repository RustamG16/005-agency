# Hero scroll animation — design

**Date:** 2026-08-07
**Status:** approved, ready for implementation planning
**Scope:** homepage hero only (`components/sections/home/Hero.tsx`, `HeroMedia.tsx`)

---

## 1. What this is

The homepage hero currently carries its viewport on type alone. `HeroMedia.tsx` was built
with a socket for a film — `SCRUB_SRC` — that has stayed empty since 2026-08-04. This
design fills it with a generated architectural ascent whose playhead is driven by scroll
position, so the camera rises as the visitor scrolls and arrives at light exactly as the
Capabilities section covers the frame.

The technique is the one behind the scroll-scrubbed landing pages currently circulating:
generate one anchor still, turn it into a camera move with an image-to-video model, encode
for seeking, and map scroll progress onto `video.currentTime`. It is documented publicly
as the `scroll-world` Claude Code skill ([oso95/scroll-world](https://github.com/oso95/scroll-world),
hardened fork [cth9191/scroll-world](https://github.com/cth9191/scroll-world)). We port its
engine techniques rather than installing it, because it emits a standalone vanilla-JS page
that knows nothing about this app's route groups, `HeaderZone`, Lenis, or token system.

### Non-goals

- No multi-scene flight down the homepage. That is 250–800 Higgsfield credits; the budget
  for this work is 100.
- No change to `Hero.tsx`'s timeline constants, pin geometry, or the Capabilities handoff.
- No new npm dependencies.

---

## 2. Architecture

`Hero.tsx` already is the scroll engine. One pinned `ScrollTrigger`, one viewport,
`pinSpacing: false`, `scrub: 0.3`, `invalidateOnRefresh: true`. Its `onUpdate` already calls
`mediaRef.current?.setProgress(self.progress)`. Nothing in that file changes.

| Piece | Today | After |
| --- | --- | --- |
| `Hero.tsx` pinned ScrollTrigger | one viewport, `pinSpacing:false`, `scrub:0.3` | unchanged |
| `HANDOFF_AT` = 0.62, `CHROME_FLIP_AT` = 0.92 | type lift, header flip | unchanged |
| Capabilities rising as the wipe | works | unchanged |
| `HeroMedia.SCRUB_SRC` | `""` | `/media/hero_scrub.mp4` |
| `HeroMedia.setProgress()` | naive `video.currentTime = p * duration` | hardened seek path (§2.1) |

### 2.1 The seek path

`setProgress` gains five behaviours, each fixing a failure mode documented in
`scroll-world/references/gotchas.md`. Each is independently testable.

1. **Blob-URL loading.** A host that does not serve HTTP byte-range requests leaves the
   video with `seekable = [0, 0]`; it freezes at frame 0 and never scrubs. Fetch the master
   to a `Blob`, `URL.createObjectURL`, assign that as `src`, revoke on unmount.

2. **Seek coalescing.** Issuing a new seek while one is in flight queues them and the
   playhead lurches. Track an in-flight flag; while set, store only the latest requested
   time and apply it on the `seeked` event. This is what removes flick-stutter.

3. **Device-class tiering by screen short side.** `≤ 600` CSS px is a phone and gets the
   720p encode; everything else gets the 1080p master. Tier by short side, never by pointer
   type or user-agent — iPadOS reports a coarse pointer *and* a desktop Mac UA, so both
   signals land iPads on the blurry mobile encode.

4. **Poster held until first paint.** iOS Safari will not paint a seeked frame on a muted
   video that has never played. Keep the poster visible until the first successful paint,
   and prime the element with a muted `play()` on first touch. The poster must be the
   *encoded clip's extracted first frame*, not the source still — a re-rendered still
   differs slightly and pops on handover.

5. **iOS Low Power Mode fallback.** LPM rejects even a muted `playsinline` `play()`, and
   `currentTime` scrubbing does not work either. No video technique survives it. `.catch()`
   the priming `play()`; on rejection, swap to the poster still and leave it there for the
   session.

### 2.2 Boundaries

`Hero.tsx` owns scroll progress and knows nothing about media. `HeroMedia.tsx` owns media
and knows nothing about scroll. The contract between them is the existing
`HeroMediaHandle.setProgress(p: number)` and does not change. Everything in §2.1 lives
behind that handle, which keeps the seek path independently replaceable — including by the
canvas frame-sequence upgrade in §8.

---

## 3. Motion timeline

```
progress 0.00   camera low in a dark shaft, one raking light from a high opening
         0.62   HANDOFF_AT   — statement type lifts out ahead of the covering edge
         0.92   CHROME_FLIP_AT — header flips dark → light
         1.00   camera arrives at the opening; frame near-blown cotton
                Capabilities (already cotton) now covers the frame
```

The clip ends on the wipe colour, so the handoff is a colour match rather than a cut.

One continuous forward move at constant velocity. No cuts, no reversal: a velocity reversal
mid-clip reads as a rewind under scrub even though the render is continuous.

---

## 4. Asset spec

### 4.1 Anchor still

`nano_banana_pro`, aspect `3:2`, resolution `2k`. Three candidates, pick one.

> Ultra-photorealistic architectural photography of a single cohesive vertical concrete
> shaft, cinematic wide-angle looking upward, one raking light source from a high opening,
> board-formed concrete and glass, restrained, editorial magazine quality, shallow depth of
> field, no people, no text, no letters, no logos. Monochrome, blacks toward #1B1717, whites
> toward #EDEBDD, no colour cast.

This is `scroll-world`'s "photoreal architectural" preamble — the direction its prompt
library reserves for premium and luxury subjects — bent to this project's tokens. The
anchor decides the art direction of everything downstream; do not approve one that is
merely acceptable.

**Composition rule.** The player centre-crops (`object-fit: cover`) and a portrait phone
keeps roughly the middle half of a 16:9 frame. Keep the focal point horizontally centred
with headroom above it, and put nothing essential near the left or right edge.

### 4.2 Motion clip

`seedance_2_0`, `--start-image` = the approved still, **no** `--end-image`, duration 5,
resolution 1080p, mode std, silent, aspect 16:9.

> Single continuous cinematic camera move, no cuts. A slow, steady upward glide through the
> shaft toward the high opening, foreground concrete edges sliding past in parallax. In the
> final second, the opening fills the frame with soft light. Monochrome, matte, no colour.
> Smooth, graceful, slow motion. No text, no captions.

Do not pass `generate_audio` to seedance; it errors. Mute in HTML and strip with `-an` on
encode.

### 4.3 Encode

Desktop master:

```bash
ffmpeg -i seedance-out.mp4 -an \
  -vf "format=gray,eq=contrast=1.05,unsharp=5:5:0.6" \
  -c:v libx264 -crf 20 -g 4 -pix_fmt yuv420p \
  -movflags +faststart public/media/hero_scrub.mp4
```

Mobile encode:

```bash
ffmpeg -i seedance-out.mp4 -an \
  -vf "scale=1280:720,format=gray,eq=contrast=1.05,unsharp=5:5:0.6" \
  -c:v libx264 -crf 21 -g 4 -pix_fmt yuv420p \
  -movflags +faststart public/media/hero_scrub-m.mp4
```

Poster: `ffmpeg -i public/media/hero_scrub.mp4 -vframes 1 public/images/poster-hero-scrub.jpg`
— extracted from the *encoded* file, per §2.1 item 4.

---

## 5. Credit ledger

Budget ceiling: **100 credits.** Account balance at time of writing: 1000.5, plan Plus.
All figures below were preflighted with `get_cost` against the live account on 2026-08-07,
not estimated.

| Step | Model / settings | Credits |
| --- | --- | --- |
| Anchor candidates × 3 | `nano_banana_pro`, 3:2, 2k | 6 |
| Previz motion test | `seedance_2_0`, 5s, 720p, fast, silent | 17.5 |
| Final master | `seedance_2_0`, 5s, 1080p, std, silent | 45 |
| **Committed** | | **68.5** |
| Reserve | one re-roll | 31.5 |

Observed rates: 1080p std costs 9 credits per second of output; 720p fast costs 3.5. The
previz pass exists so that a camera that drifts sideways is discovered at 17.5 credits
rather than 45.

**Spend gate.** Nothing generates without an explicit go for that step. The anchor is
approved before any video runs; the previz is approved before the master runs.

**Re-roll policy.** Seedance's content filter returns `status: "nsfw"` on innocuous
architectural interiors with some regularity, and it is non-deterministic. On a rejection:
re-roll once; if it fails again, strip trigger words and add "empty, unoccupied, no people,
no figures, architectural"; if it still fails, regenerate on `kling3_0` with the same start
frame (`--sound off`, no `--resolution` param — that model rejects it). Do not exceed the
31.5-credit reserve without asking.

---

## 6. Deviation from CLAUDE.md — approved

`CLAUDE.md` line 22 currently reads:

> The hero video scrub requires the all-keyframe re-encode (`IMPLEMENTATION-PLAN.md` §17.1)
> — do not scrub the original file.

That rule was written to prevent scrubbing `/media/hero_autoplay.mp4`, a normal encode whose
keyframes sit roughly two seconds apart; seeking it lands on the nearest keyframe and the
scrub visibly sticks. The rule is correct in intent and over-corrected in remedy: an
all-intra 5-second 1080p master is approximately 20 MB, which is not shippable as a
homepage hero.

`-g 4` places a keyframe every four frames — roughly every 0.17 s at 24 fps. A seek lands at
most three frames from its target and the decoder closes that gap within a frame, which is
imperceptible under a `scrub: 0.3` timeline. File size lands near 6–8 MB desktop and 2–3 MB
mobile.

**Action:** amend `CLAUDE.md` line 22 to read:

> The hero video scrub requires the tight-GOP (`-g 4`) re-encode — never scrub the original
> file. All-keyframe was the original rule; it produces ~20 MB masters. See
> `docs/superpowers/specs/2026-08-07-hero-scroll-animation-design.md` §6.

This is the only rule change in this design. Every other `CLAUDE.md` hard rule holds: colours
from tokens only, no Symbol Studio content, fonts via `next/font`, no gradients, no
glassmorphism, no decorative shadows, reference PNGs never shipped as page images, no
fabricated clients or testimonials.

---

## 7. Fallbacks and accessibility

The scrub only ever runs inside `MQ.desktopMotion` — `(min-width: 769px) and
(prefers-reduced-motion: no-preference)`. Below 769 px wide there is no pin and no scrub
today, and this design does not change that. The two width rules therefore do not overlap:

- **Viewport width < 769 px** (portrait phones): no scrub at all, poster still.
- **Width ≥ 769 px, screen short side ≤ 600 px** (landscape phones): scrub, 720p encode.
- **Width ≥ 769 px, short side > 600 px** (tablets and desktops, including iPad portrait at
  820 px): scrub, 1080p master.

| Condition | Behaviour |
| --- | --- |
| Width < 769 px (`MQ.desktopMotion` fails) | no pin, no scrub, poster still — unchanged |
| `prefers-reduced-motion` | no pin, no scrub, poster still — unchanged |
| Width ≥ 769 px, screen short side ≤ 600 px | scrub, 720p encode |
| Width ≥ 769 px, short side > 600 px | scrub, 1080p master |
| `navigator.connection.saveData` | poster still, no blob fetch |
| `effectiveType` 2g / 3g | poster still, no blob fetch |
| iOS Low Power Mode | poster still for the session (§2.1 item 5) |
| JS disabled | poster still via the `<video poster>` attribute |

The film is decorative. `HeroMedia`'s wrapper already carries `aria-hidden="true"` and the
`<h1>` statement is the accessible content of the section; that does not change. Text
contrast over the film must hold WCAG AA at every progress value, not only at 0 and 1 —
see §9.

---

## 8. Upgrade path (not in scope now)

If the video scrub does not measure as smooth on a low-end device, or if the blob payload
proves unacceptable, the replacement is a canvas frame sequence: extract ~90 frames at
1440 px wide to AVIF (≈ 3 MB total) and `drawImage` the frame matching progress. Frame paint
is deterministic, there is no decoder seek, and iOS Low Power Mode stops mattering because
no video is involved. Because everything in §2.1 sits behind `setProgress`, only the
"paint at t" primitive changes; `Hero.tsx`, the timeline constants, and the handoff are
untouched. Cost: roughly double the Phase 4 effort. Same Higgsfield spend — the frames come
out of the same generated clip.

---

## 9. Verification

Per `CLAUDE.md`, every phase ends with: `npm run build` clean → Playwright full-page
screenshots at 1440×900 and 390×844 → compare against `assets/design/` → console error check
including after scroll and hover → then mark done. Deviations are listed, never silently
accepted.

Additional checks specific to this work:

The scrub checks below run at 1440×900 only; at 390×844 the pin does not exist and the
correct result is a static poster.

- **Scrub linearity.** Drive the pin to progress 0, 0.25, 0.5, 0.75, 1.0 and screenshot each.
  Frames must differ monotonically; a repeated frame between two steps means the seek is
  landing short.
- **Reverse scrub.** Scroll down through the pin, then back up. The film must run backward
  cleanly with no stick and no jump to frame 0.
- **Landscape-phone tier.** At 844×390, confirm the pin runs and the 720p encode is the one
  fetched.
- **Text contrast over film.** Sample the statement type against the film at the same five
  progress values. WCAG AA at all five, not only at the endpoints.
- **File weight.** Desktop master ≤ 8 MB, mobile ≤ 3 MB. Fail the phase above that.
- **Console.** Zero errors after a full scroll pass, including the blob revoke on unmount.
- **Brand grep.** No `SYMBOL STUDIO`, no `#FE552E`, no Rules font, no colour cast in the
  encoded film.

---

## 10. Phases and skills

| Phase | Work | Exit criteria | Skill |
| --- | --- | --- | --- |
| 1 | Generate 3 anchor stills, pick one | One approved still, on-brand, correctly composed for centre-crop | `ai-video-director` for the frame prompt; Higgsfield `generate_image`; `frontend-design` to judge |
| 2 | Previz at 720p fast → approve motion → final 1080p master | One approved master; camera continuous, no reversal, ends on cotton | `ai-video-director` for the motion prompt; Higgsfield `generate_video` |
| 3 | ffmpeg: `-g 4` master, 720p mobile, extracted poster; amend `CLAUDE.md` §6 | Three files in `public/`, weights inside §9 limits, rule amended | none — bash |
| 4 | Port the seek path (§2.1) into `HeroMedia`; set `SCRUB_SRC` | All five behaviours present and individually verified | `gsap-scrolltrigger`, `gsap-react`, `gsap-performance` |
| 5 | Polish: contrast over film, cue legibility, header flip timing | §9 contrast and console checks pass | `web-design-pro`, `design:accessibility-review` |
| 6 | Full verification pass | Every §9 check green | project verification protocol in `CLAUDE.md` |

Phases 1 and 2 are the only ones that spend credits, and each is gated on an explicit go.
Phases 3–6 are free and reversible.
