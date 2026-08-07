# Project Preview Guide — capturing live sites as case-study media

How to turn a real, scroll-animated website into the preview media the Selected Works
showcase needs. Pairs with `MEDIA-GUIDE-R5.md` (grade rules).

> The slot vocabulary this guide used to borrow from `SELECTED-WORKS-CARD-GUIDE.md`
> (`poster`, `loop[]`, `nav`) is obsolete — the live contract is in `content/projects.ts`
> and §5 below. That guide is quarantined in `_unused/docs/`; its beat-composition advice
> still reads well, its slot names no longer match anything.

Scope: **sonnwerk**, **meridian** and **sr-urologie** are captured and shipping.
**education4students** is wired but not captured — see §9. `russolutions` follows the same
pipeline (§8) if it is ever added.

> **Decision made.** Selected Works is the four real projects; the fictional cases
> (VANTA / AUREL / NULL·ONE / FERRO) are gone. `content/projects.ts` is wired, each row
> links out to its live site, and `CLAUDE.md` records the honesty constraints that come
> with showing real client work.

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

### What actually ships

Run `scripts/encode-preview.mjs` rather than the raw ffmpeg above — it applies the §6
grade, extracts the cover and checks the budgets:

```bash
node scripts/capture-preview.mjs --site <slug>              # landscape, 1920×1080
node scripts/capture-preview.mjs --site <slug> --portrait   # 480×600 @ dSF 2 → 960×1200
node scripts/encode-preview.mjs  --site <slug> [--portrait]
```

```
public/works/<slug>/loop.mp4            1440×810   6 s · < 4 MB
public/works/<slug>/cover.jpg           1440×810        < 260 KB
public/works/<slug>/loop-portrait.mp4    960×1200  6 s · < 1.8 MB
public/works/<slug>/cover-portrait.jpg   960×1200       < 200 KB
```

**Two orientations, not one.** The homepage deck plate is full-bleed landscape; the
`/works` hover panel is 4:5. §4a forbids cropping a desktop capture to portrait, so the
portrait pair is a second capture at a viewport narrow enough that the site serves its own
phone layout — no bars, no crop, and it doubles as proof the build is responsive.

**No crossfade wrap.** A crossfaded loop is seamless at the wrap but has no true frame 0,
so the poster can never match it and every hover opens with a pop. The handover happens on
every hover; the wrap only if someone lingers past six seconds. So the loops run
forward-only and `cover.jpg` is extracted from the encoded clip's own frame 0 — the
handover is exact. Beat lists hold ~1 s on a still frame at both ends, so the wrap is a cut
between two static images rather than a motion stutter.

**Budgets are looser than the 1.5 MB above**, which was written for a 896×1160 thumbnail.
These are full-bleed surfaces carrying real client footage. It is affordable because
playback is `preload="none"`, one video at a time, and the landscape loops replaced a
shared 7.3 MB `columns.mp4`. Per-site CRF lives in `encode-preview.mjs`: sonnwerk is drone
footage of a hemp field and encodes ~3× heavier than meridian at the same setting.

**Reduced motion:** `prefers-reduced-motion` gets the cover and nothing else, per
`CLAUDE.md`. No autoplay, no cycling.

---

## 6. Grade

Sonnwerk's palette is warm gold-green; Convenium's is noir `#1B1717` / cotton `#EDEBDD`
with cherry `#810100` (the oxblood `#9E2B2B` and noir `#050505` this section used to quote
are from a retired generation — `DESIGN.md` and `styles/tokens.css` are the only source).
The captures will fight the surrounding page if shipped raw. Pull them ~15% toward the
house grade — desaturate slightly, cool the highlights:

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

## 9. The other three, as captured

Beat lists live in `scripts/capture-preview.mjs`. What the probes turned up:

**meridian** — `rustamg16.github.io/003-meridian-mvp/`. Lenis, three canvases, GSAP
pin-spacer. Three frame sequences under `/frames/`: `hero` (181), `dining` (120+), `spa`
(84+). Only `hero` is on the card-loop path and only it is warmed; add the others to
`sequences[]` before pointing a beat at a `.scrub-teaser`, or the canvas records blank. The
one idea is the ARRIVAL — descending through the cloud sea onto the resort, `#top` 0 → 0.55.
Captured in a browser rather than rebuilt from the frames because the wordmark is a DOM
overlay and the cover needs it legible.

**sr-urologie** — `sr-urologie.netlify.app`. Plain DOM, no sequence, doc only 4838px. One
autoplay 8 s `hero.mp4`, declared in `videos[]` so it is paused at load and driven off the
capture clock — otherwise it advances on the wall clock and two runs differ. The hero has
no scroll travel at a 1080-tall viewport, so it is a hold and the film supplies the motion.

**education4students** — `rustamg16.github.io/education-hub-connect/`. **Not captured: the
deploy is broken.** GitHub Pages is serving the unbuilt Vite `index.html`, which requests
`/src/main.tsx` (an absolute path, also wrong for a project-page base), so `#root` stays
empty and the page renders blank. Its two covers are derived from the existing screenshot
instead — the crops in the commit message clear an "Activate Windows" watermark from y=942,
a scrollbar, and two floating bubbles from x=1832:

```bash
S='public/media/works/screenshots/edu4students/Screenshot (2145).png'
G="eq=saturation=0.88:contrast=1.04,colorbalance=rs=-0.02:bs=0.01"
ffmpeg -i "$S" -vf "crop=1662:935:0:0,scale=1440:810:flags=lanczos,$G" -q:v 4 cover.jpg
ffmpeg -i "$S" -vf "crop=748:935:25:0,scale=960:1200:flags=lanczos,$G" -q:v 4 cover-portrait.jpg
```

Once the deploy is fixed: write beats, run the two captures and the two encodes, then add
`loop` and `loopPortrait` to its entry in `content/projects.ts`. Everything else is wired —
the type makes both optional and the surfaces fall back to the cover.

---

**Sources:** [WPZOOM — portfolio examples 2026](https://www.wpzoom.com/blog/portfolio-website-examples/) ·
[336 Productions — rise of video case studies](https://www.336productions.com/the-rise-of-video-case-studies-in-2026/) ·
[Envato Elements — portfolio trends](https://elements.envato.com/learn/portfolio-trends) ·
[Openflows — Hyperframes deterministic HTML→video](https://openflows.org/currency/currents/hyperframes-html-video-rendering/) ·
[Puppeteer + ffmpeg cinematic capture](https://medium.com/@BBSRGUY/from-html-to-8k-video-turning-websites-web-animations-into-cinematic-movies-with-puppeteer-34c3b6d1349f) ·
[ScreenshotEngine — scrolling capture easing](https://www.screenshotengine.com/blog/scrolling-website-video) ·
[James Battye — scroll-driven image sequences](https://www.jamesbattye.dev/articles/building-a-scroll-based-image-sequencer-with-gsap) ·
[Project Aeon — seamless loop practice](https://project-aeon.com/blogs/make-a-video-loop)
