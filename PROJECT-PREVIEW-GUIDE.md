# Project Preview Guide — capturing live sites as case-study media

How to turn a real, scroll-animated website into the preview media the Selected Works
showcase needs. Pairs with `SELECTED-WORKS-CARD-GUIDE.md` (which describes the *slots*:
`poster`, `loop[]`, `nav`) and `MEDIA-GUIDE-R5.md` (grade + accent rules).

Scope of this revision: **sonnwerk** (`https://rustamg16.github.io/002-sonnwerk/`).
`sr-urologie` and `russolutions` follow the same pipeline — see §8.

> **Open decision (flag for Mikkel):** `CLAUDE.md` defines Selected Works as four
> fictional cases (VANTA / AUREL / NULL·ONE / FERRO). Real projects replacing them is a
> content change, not a media change. Decide before wiring `content/projects.ts`.

---

## 1. What the 2026 standard actually is

Filtering out listicle noise, three things are consistently true of the agencies whose
portfolios win right now:

**A three-tier media ladder, not one video per project.**

| Tier | Where it lives | Length | Character |
|---|---|---|---|
| **Card loop** | grid / showcase thumbnail | 4–8 s, seamless, muted, no controls | one idea, one move — recognisable in 1.5 s |
| **Case hero reel** | top of the case-study page | 20–40 s | the site's signature moments, cut |
| **Walkthrough** | inside the case study, optional | 60–90 s | actual navigation, proof it works |

Short-form video case studies in the 30–90 s band are the growth area, and
autoplay-on-hover thumbnails are now the default pattern rather than a flourish
([WPZOOM](https://www.wpzoom.com/blog/portfolio-website-examples/),
[336 Productions](https://www.336productions.com/the-rise-of-video-case-studies-in-2026/),
[Envato Elements](https://elements.envato.com/learn/portfolio-trends)).

**No chrome, no cursor, no fake device.** Browser bars, address fields, mouse pointers
and 2015-era MacBook mockups all read as dated. The capture is full-bleed; the frame
around it is your own design system (for us: the gallery frame in the pinned showcase).

**Rendered, not recorded.** This is the real 2026 shift. Screen recording a
smooth-scrolled site produces variable frame timing, dropped frames during lazy-load,
and lerp stutter — it looks cheap at exactly the moment you're claiming craft. The
current approach drives the page frame-by-frame in headless Chrome and pipes stills to
ffmpeg, so the same input yields an identical, frame-perfect MP4 every run
([Hyperframes](https://openflows.org/currency/currents/hyperframes-html-video-rendering/),
[Puppeteer + ffmpeg walkthrough](https://medium.com/@BBSRGUY/from-html-to-8k-video-turning-websites-web-animations-into-cinematic-movies-with-puppeteer-34c3b6d1349f)).
Easing belongs in the capture script, not in the recording hand
([easing rationale](https://www.screenshotengine.com/blog/scrolling-website-video)).

Delivery specs that hold across placements: **H.264 MP4, yuv420p, CRF 18–22, no audio
track, `+faststart`**, plus a matching poster still. Silent-first is mandatory — the loop
has to work with sound off because it will never have sound
([loop practice](https://project-aeon.com/blogs/make-a-video-loop)).

---

## 2. Sonnwerk — measured, today

Measured live at 1920×945. **Re-measure at your capture viewport** — the pinned section's
length is viewport-relative, so hardcoded pixel offsets from this table will drift. The
capture script resolves beats from selectors at runtime for this reason.

| Region | Selector | Offset @945vh | Height | Notes |
|---|---|---|---|---|
| Journey (pinned scrub) | `section.journey` | 0 | **4914** | sticky `.stage`, `<canvas>` 1920×945 |
| Why Sonnwerk | `.paper-section.warum` | 4914 | 715 | type-led, three columns |
| Categories | `section.cats` | 5629 | 2385 | 6 cards, **hover `<video>`** |
| Dog band | `section.dogband` | 8014 | 662 | full-bleed image + CTA |
| Gallery + voices | `.paper-act.paper-section` | 8676 | 1884 | gallery teaser, testimonial marquee |
| Trust | `section.trust` | 10560 | 234 | certification row |
| — | doc total | | **11138** | |

**The journey scrub is a canvas image sequence, and the frames are public.**

```
/002-sonnwerk/media/journey/frame_0001.webp … frame_0384.webp
384 frames · 1280×720 · webp · poster.webp as fallback
→ 4914 px of scroll / 384 frames ≈ 12.8 px per frame
→ 384 frames = 16.0 s @24fps, 12.8 s @30fps
```

Two consequences that shape everything below:

1. **You can rebuild the journey losslessly with ffmpeg alone** — no browser, no capture,
   no recompression artefacts (§4). Only use browser capture for this section when you
   need the DOM overlay text (`ERNTE` / `EXTRAKTION` / `FLASCHE`, the right-edge progress
   rail, the eyebrow labels) burnt in.
2. **1280×720 is the ceiling for that footage.** Do not render the journey beat at 1080p
   and upscale — it will look soft next to the crisp DOM sections. Either master the whole
   reel at 720p, or keep the journey beat as a 1280-wide plate inside a 1920 frame.

**Verified behaviours relevant to capture:**

- Lenis is loaded, but `window.scrollTo(0, y)` sets position correctly and the canvas
  repaints — confirmed by screenshot at `y=2400` landing exactly on the *Extraktion*
  stage. No `lenis.scrollTo()` shim needed here. (Do re-verify per site; §8.)
- Frames stream in progressively — every 8th first, then the gaps fill. **A cold capture
  will record stale or blank canvas frames.** Warm all 384 before the first screenshot.
- Category hover videos are `preload="none"`, `loop`, no `autoplay`. They will not exist
  in the frame buffer until hovered *and* explicitly loaded.
- Theme colour is `#0D1408` — use it for any letterbox padding so bars read as
  design, not as absence.

---

## 3. The capture method

`scripts/capture-preview.mjs` (written alongside this guide). Model:

```
beats[]  →  scroll/hover timeline  →  per-frame: set state, settle, screenshot
         →  ffmpeg assembles at 60 fps
```

Run:

```bash
node scripts/capture-preview.mjs --site sonnwerk --out qa/preview/sonnwerk
```

### The five things that break naive capture

**1. Nondeterministic time.** Anything on a rAF or CSS clock advances by wall-clock, so
two runs differ and slow frames stretch the animation. Fix: pause every animation, then
set its `currentTime` from the capture clock, so CSS/WAAPI motion advances in lockstep
with the scroll timeline.

```js
await page.evaluate((tMs) => {
  for (const a of document.getAnimations()) { a.pause(); a.currentTime = tMs; }
}, frameIndex * (1000 / FPS));
```

**2. Paint lag.** A screenshot taken immediately after `scrollTo` captures the *previous*
frame — the site's scroll handler runs on the next rAF, and paint lands after that. Fix:
always wait two rAFs before shooting. (This is exactly the artefact behind the
"before/after are identical" reading I got when probing the canvas synchronously.)

**3. Lazy assets.** Warm everything before frame 0: fonts (`document.fonts.ready`), all
images including the full journey sequence, and any hover video you plan to use. Assert
the count, don't assume.

**4. Smooth-scroll hijack.** Lenis / ScrollSmoother maintain a virtual scroll position;
on some builds `window.scrollTo` is overridden or immediately clobbered by the library's
rAF. Sonnwerk is fine. If a site isn't, in order of preference: call the exposed instance
(`window.lenis.scrollTo(y, {immediate: true})`), destroy it and let native scroll take
over, or — for a canvas sequence — drive the sequence directly and capture only the
`.stage` element.

**5. Hover video.** Don't hover and hope. Dispatch the pointer event, `load()` the
element, then per capture frame set `video.currentTime` explicitly and keep it paused.
Deterministic hover playback, frame-exact:

```js
el.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
v.preload = 'auto'; v.load();
await new Promise(r => v.addEventListener('loadeddata', r, { once: true }));
v.pause(); v.currentTime = tLocal;   // set per frame
```

### Seamless loops are free — use construction, not crossfade

Because you control scroll position exactly, **end the beat at the scroll position it
started from**. Frame N-1 then matches frame 0 and the loop wraps invisibly with no
crossfade, no ghosting, no lost frames. Reserve `xfade` for beats where returning is
impossible.

### Easing

Linear scroll is the single clearest tell of an automated capture. Interpolate between
waypoints with `easeInOutCubic` and hold on the readable moments — text landing, a card
settling. Rough rhythm: **glide 0.8–1.2 s, hold 0.4–0.6 s.**

---

## 4. Sonnwerk shot list

### 4a. Card loop — 6 s, seamless, silent

Purpose: recognisable in under two seconds. One idea only: *sunrise field → oil drop → bottle.*
The journey scrub already is that idea, so build the card loop **from the source frames**,
not from a capture:

```bash
# 1. pull the sequence (384 frames, ~1.5 MB each worst case — this is the only download)
for i in $(seq -f "%04g" 1 384); do
  curl -sO "https://rustamg16.github.io/002-sonnwerk/media/journey/frame_$i.webp"
done

# 2. 384 frames @24fps = 16 s. Compress to 6 s by taking every ~2.7th frame,
#    or better: keep 24fps and use frames 0060–0204 (the field→drop→bottle arc).
ffmpeg -framerate 24 -start_number 60 -i frame_%04d.webp -frames:v 144 \
  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p -an \
  -movflags +faststart journey_6s.mp4
```

Pick the in/out points by eye — step the sequence and choose a pair whose first and last
frames are compositionally close, so the wrap reads as a breath rather than a cut.

**The portrait problem.** The showcase card opening is ~448×580 (0.772, near-4:5). A
website capture is 16:9. Cropping 1920×1080 to 0.772 discards ~60% of the layout and
destroys the composition. Two legitimate answers:

- **(A) Letterbox on brand** — capture stays whole, padding is the site's own
  `#0D1408`. Reads as an intentional plate. Recommended for wide-composition beats.

  ```bash
  ffmpeg -i journey_6s.mp4 -vf \
    "scale=896:504:flags=lanczos,pad=896:1160:0:328:0x0D1408,format=yuv420p" \
    -c:v libx264 -crf 20 -an -movflags +faststart card-loop.mp4
  ```

- **(B) Mobile pass, full-bleed** — capture a second time at 390×844 and crop to 0.772.
  Portrait-native, no bars, and it doubles as proof the build is responsive. Best for the
  DOM-heavy sections (categories, gallery) where the mobile layout is genuinely good.

Do not crop a desktop capture to portrait. Ever.

### 4b. Nav walkthrough — 28 s, deterministic capture

Beats, expressed as selector + progress so they survive a viewport change:

| # | Beat | Target | Move | Dur |
|---|---|---|---|---|
| 1 | Hero hold | `section.journey` @ 0.00 | hold | 1.2 s |
| 2 | The ride | `section.journey` 0.00 → 1.00 | ease, one continuous scrub | 8.0 s |
| 3 | Principles | `.paper-section.warum` 0 → 1 | glide | 3.0 s |
| 4 | Category grid lands | `section.cats` @ 0.15 | glide + hold | 2.4 s |
| 5 | **Hover: Öl** | `.cats a:nth-child(1)` | pointerenter, scrub `oel.mp4` 0 → 2.5 s | 2.5 s |
| 6 | **Hover: Balsam** | `.cats a:nth-child(4)` | pointerenter, scrub `balsam.mp4` | 2.0 s |
| 7 | Dog band | `section.dogband` 0 → 1 | glide | 2.2 s |
| 8 | Gallery teaser | `.paper-act` @ 0.25 | glide + hold | 2.4 s |
| 9 | Voices marquee | `.paper-act` @ 0.65 | hold (marquee advances on capture clock) | 2.0 s |
| 10 | Trust row + footer | `section.trust` → doc end | glide, settle | 2.3 s |

Notes on that list:

- Beat 2 is the whole point of the site — give it a third of the runtime and do not cut
  inside it. One continuous scrub, constant-ish speed, eased at both ends only.
- Beats 5–6 are the *reason* to capture in a browser rather than assemble stills. Two
  hovers is the right number; four is a feature tour, and nobody watches it.
- Beat 9 relies on the animation-clock trick from §3.1 — the testimonial marquee is a CSS
  animation and will sit frozen without it.
- Skip the cart drawer, the mobile menu, and every legal page. The reel argues quality,
  not completeness.

### 4c. Poster still

```bash
ffmpeg -i nav.mp4 -ss 0.6 -frames:v 1 -q:v 2 poster.jpg
```

Pick a frame with the wordmark legible and no mid-transition blur — usually inside a hold,
never inside a glide.

---

## 5. Encode + placement

```bash
# assemble the capture (jpeg q95 stills → 60 fps master)
ffmpeg -framerate 60 -i cap/%06d.jpg -vf "scale=1920:1080:flags=lanczos,format=yuv420p" \
  -c:v libx264 -crf 18 -preset slow -an -movflags +faststart nav-master.mp4

# delivery pass (what actually ships)
ffmpeg -i nav-master.mp4 -vf "scale=1440:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -crf 21 -preset slow -an -movflags +faststart nav.mp4

# optional AV1 sibling for bandwidth (serve via <source> before the mp4)
ffmpeg -i nav-master.mp4 -c:v libsvtav1 -crf 34 -preset 6 -an nav.webm
```

Placement, matching `SELECTED-WORKS-CARD-GUIDE.md`:

```
public/works/sonnwerk/card-loop.mp4    6 s  · 896×1160 · target < 1.5 MB
public/works/sonnwerk/nav.mp4         28 s  · 1440×810 · target < 6 MB
public/works/sonnwerk/poster.jpg             896×1160 · target < 180 KB
```

Then in `content/projects.ts`, `loop` becomes a single video path rather than a stills
array, or keep the array contract and add `cardLoop`. Whichever — change the `Project`
type once, not per project.

**Reduced motion:** `prefers-reduced-motion` gets `poster.jpg` and nothing else, per
`CLAUDE.md`. No autoplay, no cycling.

---

## 6. Grade

Sonnwerk's palette is warm gold-green; Convenium's is noir/bone with oxblood `#9E2B2B`.
The captures will fight the surrounding page if shipped raw. Pull them ~15% toward the
house grade — desaturate slightly, lift the blacks to `#050505` rather than pure zero:

```bash
-vf "eq=saturation=0.88:contrast=1.04,colorbalance=rs=-0.02:bs=0.01"
```

Judge it in situ inside the gallery frame, not full-screen. And do not tint client work so
far that it stops looking like the real site — the credibility of the preview is the point.

---

## 7. QA before marking done

- [ ] Frame count matches `duration × fps` exactly — a short count means dropped frames
- [ ] Journey beat: no blank/duplicate canvas frames (the lazy-load failure mode)
- [ ] Loop wrap: step frame 0 against frame N-1 — must be near-identical
- [ ] No cursor, no scrollbar, no browser chrome, no focus ring anywhere
- [ ] No audio track: `ffprobe -show_streams nav.mp4 | grep -c audio` → `0`
- [ ] Plays inline on iOS Safari (`muted playsinline` set on the element)
- [ ] Two consecutive capture runs are byte-comparable — if not, something is still on a
      wall clock
- [ ] File sizes within §5 budgets
- [ ] `npm run build` clean; console clear after scroll and hover

---

## 8. Applying this to the other two

`sr-urologie.netlify.app` and `russolutions.netlify.app` reuse the pipeline. Before
writing a beat list for either, run the same three probes I ran on sonnwerk:

1. **What drives the motion?** In the console: `!!window.gsap`, `!!window.ScrollTrigger`,
   `!!window.lenis`, `document.querySelectorAll('canvas').length`,
   `[...document.querySelectorAll('video')].map(v => v.currentSrc)`. This tells you
   whether you're scrubbing a sequence, a video, or plain DOM reveals.
2. **Does programmatic scroll work?** `window.scrollTo(0, 2400)`, wait a beat, screenshot.
   If the page didn't move or the animation didn't follow, apply §3.4.
3. **Where are the sections?** Dump `{selector, offsetTop, height}` for every top-level
   section and pick beats from that, not from scrolling by hand.

Then: pick the one idea the site is *for*, give it a third of the runtime, add two
interaction beats, end where you started. Same three files out.

---

**Sources:** [WPZOOM — portfolio examples 2026](https://www.wpzoom.com/blog/portfolio-website-examples/) ·
[336 Productions — rise of video case studies](https://www.336productions.com/the-rise-of-video-case-studies-in-2026/) ·
[Envato Elements — portfolio trends](https://elements.envato.com/learn/portfolio-trends) ·
[Openflows — Hyperframes deterministic HTML→video](https://openflows.org/currency/currents/hyperframes-html-video-rendering/) ·
[Puppeteer + ffmpeg cinematic capture](https://medium.com/@BBSRGUY/from-html-to-8k-video-turning-websites-web-animations-into-cinematic-movies-with-puppeteer-34c3b6d1349f) ·
[ScreenshotEngine — scrolling capture easing](https://www.screenshotengine.com/blog/scrolling-website-video) ·
[James Battye — scroll-driven image sequences](https://www.jamesbattye.dev/articles/building-a-scroll-based-image-sequencer-with-gsap) ·
[Project Aeon — seamless loop practice](https://project-aeon.com/blogs/make-a-video-loop)
