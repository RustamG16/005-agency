# design_claude — self-contained About page build kit

Attach **only this folder**. Everything the design LLM needs is inside — no repo
access required.

## Contents

| Path | Purpose |
|---|---|
| `PROMPT.md` | The prompt. Paste its contents (below the `---` line) into Claude. |
| `ABOUT-MONOLITH-SPEC.md` | Approved design: chapters, monolith states, copy, budgets. |
| `MEDIA-GUIDE-ABOUT.md` | AI loop prompts (Omni Flash / Veo 3.1 Lite), portraits, mobile pre-render. |
| `reference/` | Copies of the repo files that matter: rules (`CLAUDE.md`), `tokens.css`, `globals.css`, `fonts.ts`, motion utilities (`gsap.ts`, `SmoothScroll.tsx`, `InteriorReveal.*`, hooks), `HeaderZone.tsx`, one example section (`AboutHero.*`), `package.json` (versions). ~600 lines total. |
| `output/` | Created by the LLM if the repo isn't mounted — generated code mirroring repo paths + `INTEGRATION.md` merge steps. |

## How to run

1. New Claude session, attach this folder.
2. Enable skills: `awwwards-web-design`, `gsap-core`, `gsap-scrolltrigger`,
   `gsap-plugins`, `gsap-performance`.
3. Paste `PROMPT.md` (everything below its `---` line).
4. When it finishes: follow `output/INTEGRATION.md` to merge into the repo, then run
   the repo verification (`npm run build`, screenshots, console check).

## Optional media — build won't break without them

- `public/images/team/marija.jpg` / `rustam.jpg` — real portraits (guide §3).
- `public/videos/loops/loop-a.mp4` (+ b, c) — chapter-5 screen loops (guide §2).
- `public/videos/monolith-mobile.mp4` + poster — made AFTER the build from the real
  scene (guide §4).

## Keeping reference/ fresh

These are snapshots (copied 2026-08-01). If you change `tokens.css` or the motion
utilities in the repo, re-copy them here before the next design run.
