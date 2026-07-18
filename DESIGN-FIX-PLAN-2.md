# Convenium Studio — Design Fix Plan, Pass 2

Executed by Claude Code (Sonnet, Ultracode). Follow the §0 protocol in `IMPLEMENTATION-PLAN.md` and `CLAUDE.md`. Apply the `.claude/skills/frontend-design` skill to every visual decision.

Design intent for this pass: the site's one signature moment becomes the **Works frame system** (FIX 3). Everything else gets quieter, denser and more purposeful. Spend the boldness there; spend discipline everywhere else.

---

## FIX 1 — Hero: from scroll-scrub to autoplay + narrative annotations

The hero no longer scrubs. New behavior:

1. On load, `hero_video.mp4` autoplays (muted, playsinline) from 0 to the moment the character steps into the elevator. Determine this timestamp by watching the file (call it `T_ENTER`, hardcode it in a constant), then `pause()` there and hold the frame.
2. While the desert plays, annotation labels fade in sequentially over the noisy landscape — they explain that this is the current state of most design. Small uppercase Inter labels (12px, bone, 0.08em tracking), each with a 1px hairline leader, staggered ~1.2s apart, positioned in safe negative space away from the character:
   - `THE CURRENT LEVEL`
   - `EVERYONE LOUD IN THE SAME WAY.`
   - `SAFE. GENERIC. INVISIBLE.`
3. After the video pauses at `T_ENTER`, show a scroll indicator, bottom-center: `SCROLL TO GO UP` with a thin downward line that pulses subtly (opacity 0.4→1, 2s loop). Use this exact copy — it ties the instruction to the elevator story; plain "scroll down" is the template answer.
4. First scroll: the hero pins and the elevator-door transition runs (two black panels close over the held frame, sharp, ~600ms, power4.in), then releases into `GOING UP.` / the manifesto. The doors close over a *paused* frame — never mid-playback.
5. Reduced motion: static poster of the elevator frame, annotations visible immediately, no autoplay, no pinning.
6. Encoding: autoplay does NOT need the all-keyframe re-encode. Use a normally encoded, web-optimized hero file. The `-g 1` re-encode from §17.1 now applies to the **columns video** instead (FIX 3).

Delete the old scrub code path entirely; do not leave it behind a flag.

## FIX 2 — Manifesto beats (keep, retime)

The three beats (LOUD. / PRECISE. / UNFORGETTABLE.) stay as pinned scroll states. Entry now flows from the door transition: black screen from FIX 1 is the same black as the manifesto background, so the sequence reads as one continuous shaft. Word arrival: yPercent 120 → 0, 420ms, power4.in ending in a hard stop (no overshoot, no elastic). Gold level indicator ticks 01→02→03. Snap each beat (`snap: 1/3`).

## FIX 3 — Selected Work: the frame system (signature moment)

Replaces the current card grid on the homepage. One pinned section, three acts, driven by one ScrollTrigger timeline with `scrub: 0.75`.

### Act 1 — Approach
The columns/gallery video (`Camera_push-in_through_columns_*.mp4`) scrubs with scroll: the camera pushes through the gallery toward the wall with the large black frame. Requires the all-keyframe re-encode first:

```bash
ffmpeg -i assets/videos/Camera_push-in_through_columns_1080p_202607172150.mp4 \
  -c:v libx264 -profile:v high -crf 20 -g 1 -keyint_min 1 -pix_fmt yuv420p \
  -movflags +faststart -an public/media/gallery_scrub.mp4
```

The scrub ends on the video's final frame — the bone wall with the black frame on the left and the large empty wall on the right. That frame holds and becomes the section background for Acts 2–3. Export it as a poster image too (`gallery_final.jpg`) and swap the paused video for the poster once the scrub completes, so Acts 2–3 animate over a static image, not a paused video element.

### Act 2 + 3 — Cases arrive in the frame
Continued scroll brings the four case studies one at a time:

- The project poster (or muted video loop) animates into the black frame's inner opening — scale from 1.06 + slight y drift, settling flush inside the frame, like a work being hung.
- Simultaneously the project text typesets on the empty right wall: project name (Archivo Black, large), sector + scope (Inter micro-labels), one-line outcome (Newsreader). Text enters with a short y-rise + fade (240ms stagger), exits upward as the next case arrives.
- Frame inner-opening position: measure it from `gallery_final.jpg` and store as percentage coordinates of the 16:9 media box (approximately x 25–46%, y 18–67% — verify against the real frame, don't trust these numbers). Position the card with a percent-based absolute container so it stays glued to the frame at any viewport size where the background uses `object-fit: cover` with a fixed `object-position`.
- Four segments within the pinned range, snapped per case. A small gold index (01–04) ticks on the wall beneath the text.

### Fallbacks
- Mobile: no pinning. Static final-frame image as a section header, then the four cases as a swipeable/stacked column with poster + text. 
- Keyboard: cases are reachable as focusable list items; focus advances the same visual state.
- Reduced motion: static grid of four posters with text, no scrub.
- The `/works` route keeps its own layout; this system is the homepage preview only.

## FIX 4 — Services content

Replace the five services everywhere (`content/services.ts`, homepage preview, `/services` page, footer links if named):

| # | Service | One-line role |
| --- | --- | --- |
| 01 | Branding | Identity systems built to be recognized and remembered. |
| 02 | Graphic Design | Editorial, print and visual communication with a point of view. |
| 03 | Web + App Development | Digital products designed and engineered as one system. |
| 04 | Media Creation (AI) | Cinematic stills and film made with directed AI pipelines. |
| 05 | SMM | Social presence with the same standards as the brand itself. |

Keep numbering, hairline rows and gold indices. Rewrite the `/services` page section copy to match (scope lists and explanations must describe these five — no leftover Strategy/Campaigns copy). Headline "FIVE DISCIPLINES. ONE CONNECTED SYSTEM." may stay.

## FIX 5 — Density: kill the dead right half

Screenshots show three statement sections where the right ~55% of the viewport is empty. Negative space must be composed, not left over. Rules:

- Statement-only sections cap at ~70vh, not 100vh.
- Any section at 100vh needs either full-bleed media or real content in the second column.

Apply per section:

1. **Services hero ("FIVE DISCIPLINES.")** — right column becomes a vertical anchor index of the five services (large gray numerals + names, hairline-separated, each links to its section below). The headline column keeps its width; the index fills the void with functional navigation, not decoration.
2. **Studio hero ("BUILT CLOSE TO THE WORK.")** — right column gets a tall 3:4 process still (from approved generated imagery) with a small uppercase caption. If no approved image exists, use a vertical stack of three working principles as hairline rows instead. No fabricated facts, no invented metadata.
3. **Team section ("SMALL TEAM. SERIOUS LIFT.")** — the copy already overlays the team film; the problem is the section runs taller than the video's composed area. Reduce to the video's natural height (~100vh max), keep copy in the upper-left dark zone.
4. **Footer ("LET'S FIND YOUR NEXT FLOOR.")** — right column becomes the contact block: email, socials and route links as a hairline-ruled column, bottom-aligned with the headline's baseline. The gold CTA stays under the headline. The footer then earns its height.

## FIX 6 — GSAP motion pass (site-wide)

Act as motion editor: one orchestrated system, not scattered effects. All motion communicates state or story; anything that could be removed without losing meaning gets removed.

### Global system
- Register once: `gsap.registerPlugin(ScrollTrigger)` in a single client module; all triggers created in `useGSAP` with cleanup.
- Defaults: `gsap.defaults({ ease: "power4.out", duration: 0.6 })`. Arrivals that must feel mechanical (manifesto, doors) use `power4.in` — impact, hard stop.
- `ScrollTrigger.matchMedia`: desktop gets pins and scrubs; `(max-width: 768px)` and `prefers-reduced-motion` get the static fallbacks defined per section. No pinned sections on mobile.
- Only one pinned system may be active per viewport; hero, manifesto and works are sequential, never nested.

### Per-section timelines
| System | Trigger | Motion |
| --- | --- | --- |
| Hero annotations | Load | Staggered fade+rise, 1.2s apart, hairline leaders draw in (scaleX 0→1) |
| Doors | First scroll past hero | Two panels close, 600ms, power4.in; releases pin at full black |
| Manifesto | Pinned scrub, snap 1/3 | Word slam yPercent 120→0; index ticks; previous word exits -20 yPercent with dimmed opacity |
| Works | Pinned scrub 0.75 | Video scrub → poster hold → per-case frame hang + wall text swap, snapped per case |
| Reveal system | Viewport entry | Keep existing `reveal.js` but restrict to section headers and media blocks only — remove blanket application to every element |
| Header | Route/section change | Bone segment slides 260ms; contrast flips over light/dark sections via ScrollTrigger `onToggle` |
| Cards/buttons | Hover/focus | Media scale 1.0→1.035 320ms; gold CTA arrow shifts 6px; underline draws on text links |
| FAQ | Toggle | Height auto tween + chevron rotate, 300ms |

### Quality bar
- 60fps: animate only `transform` and `opacity`; `will-change` applied during animation, removed after.
- No layout shift from pin-spacers: verify CLS after adding pins.
- Every timeline reversible — scrolling up plays everything backward cleanly.

---

## Execution order for Sonnet

1. **Phase A:** FIX 4 (content swap) + FIX 5 (density) — static changes first, verify per §0.3.
2. **Phase B:** FIX 1 + FIX 2 (hero rework + manifesto retime) — includes deleting the scrub path and re-timing the door transition.
3. **Phase C:** FIX 3 (works frame system) — re-encode first, build the pinned timeline, then fallbacks.
4. **Phase D:** FIX 6 (motion audit) — tune the whole page as one pass, then full §0.3 verification: build clean, Playwright screenshots at 1440/390, console check after scroll+hover on every route, deviations report in `qa/`.

Paste-ready prompt per phase: "Read CLAUDE.md and DESIGN-FIX-PLAN-2.md. Execute Phase <X> exactly as specified. Verify per IMPLEMENTATION-PLAN.md §0.3 before reporting done. List every deviation."
