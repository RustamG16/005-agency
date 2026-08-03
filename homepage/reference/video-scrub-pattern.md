# Video scrub pattern — extracted from the shipped `OpeningSequence.tsx`

The repo already scrubs a video inside a pinned timeline. Reuse these exact
patterns for the hero film scrub; do not invent new ones.

## 1. Scrub via proxy object (never tween `currentTime` directly)

```tsx
const durationRef = useRef(8);
// on loadedmetadata: durationRef.current = video.duration || 8;

const proxy = { t: 0 };
tl.to(proxy, {
  t: 1,
  duration: SCRUB_UNITS,
  ease: "none",
  onUpdate: () => {
    try {
      video.currentTime = proxy.t * durationRef.current;
    } catch {
      // seek not ready
    }
  },
}, scrubStart);
```

## 2. Pinned master timeline shape

```tsx
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: stage,
    id: "home-guide",
    start: "top top-=1",
    end: `+=${TOTAL_UNITS * 100}%`,
    scrub: 0.3,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    refreshPriority: 30,
  },
});
```

## 3. Stall / fallback discipline (from the autoplay hero)

- `poster` attribute always set; a static `<img>` fallback layer appears when
  the video stalls (`waiting` → 1s indicator → 2s terminal poster fallback).
- `muted playsInline preload="auto"` on the scrubbed `<video>`; no `autoplay`
  for scrub videos — the timeline owns `currentTime`.
- The scrubbed file MUST be the all-keyframe re-encode (`-g 1`), never the
  original. Scrubbing must work in both directions.

## 4. Assistive jump helper

Timeline-independent navigation uses `window.__lenis.scrollTo(y)` against
`ScrollTrigger.getById(...)` start/end — see `jumpToCase` in the shipped
`components/sections/home/OpeningSequence.tsx` (repo) for the full version.
