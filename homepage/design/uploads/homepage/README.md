# homepage — self-contained home page build kit ("The Guide")

Attach **only this folder** to a fresh Claude session. Everything the design
LLM needs is inside — no repo access required (repo-mounted runs also work).

## Contents

| Path | Purpose |
|---|---|
| `PROMPT.md` | The prompt. Paste its contents (below the `---` line) into Claude. |
| `HOME-GUIDE-SPEC.md` | Approved design: robot recolor, relay handoff, chapters, callouts, copy, accent budget, license credit. |
| `MEDIA-GUIDE-HOME.md` | Omni Flash film prompt + settings, first-frame capture, all-keyframe re-encode. |
| `assets/` | **`repo_robot.glb` goes here** (move from `design_claude/assets/`). Later also `hero-first-frame.png`. |
| `reference/` | Fresh repo snapshots (2026-08-03, R7 palette): rules, tokens, globals, fonts, gsap/Lenis setup, hooks, HeaderZone, MonolithScene (WebGL conventions), video-scrub-pattern, current home page, site + services copy, package versions. |
| `output/` | Created by the LLM if the repo isn't mounted — code mirroring repo paths + `INTEGRATION.md`. |

## How to run

1. Move `repo_robot.glb` from `design_claude/assets/` into `homepage/assets/`
   (keep the filename).
2. New Claude session, attach this folder. Enable skills: `awwwards-web-design`,
   `frontend-design`, `gsap-core`, `gsap-scrolltrigger`, `gsap-plugins`,
   `gsap-performance`.
3. Paste `PROMPT.md` (everything below its `---` line). The build runs WITHOUT
   the video — that's by design.
4. After the build: Claude captures `assets/hero-first-frame.png` (media guide
   §2) → you generate the 10s film in Omni Flash with that image + the §3
   prompt → re-encode per §4 → drop into `public/videos/` → scrub goes live.
5. Merge per `output/INTEGRATION.md` (if output-mode), then run repo
   verification (`npm run build`, screenshots, console, both-direction scrub).

## License note

The robot is CC Attribution — the footer colophon credit to OscarLomas3D is a
hard requirement baked into the spec and the verification greps.

## Keeping reference/ fresh

Snapshots copied 2026-08-03 (R7 cotton/cherry palette — supersedes the old
design_claude oxblood set). If repo tokens or motion utilities change,
re-copy before the next design run.
