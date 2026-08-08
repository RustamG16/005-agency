# PROMPT R6 — paste into Claude Code **plan mode**, then Implement Plan (auto)

---

You are running **R6** on the Convenium Studio repo. Build the plan with the **orchestrator pattern**: you are the orchestrator, you delegate investigation and verification to subagents, and you own the final integration.

## 0. Orchestration protocol (do this first, before writing the plan)

1. Read `CLAUDE.md`, `DESIGN.md`, `IMPLEMENTATION-PLAN.md` §0, `MEDIA-GUIDE-R5.md`, `PROJECT-PREVIEW-GUIDE.md`.
2. Dispatch these subagents **in parallel** and wait for all of them before drafting the plan:
   - `Explore` — "Map the hero pipeline end-to-end: `components/sections/home/Hero.tsx`, `HeroMedia.tsx` + both `.module.css`, `content/site.ts`, `app/(home)/page.tsx`, `components/motion/*`. Report every constant, ref and CSS custom property that the scrub path touches."
   - `Explore` — "Map the Guide system: everything in `components/guide/`. Report exactly how `guide-drag.ts`, `guide-idle.ts`, `guide-state.ts`, `guide-robot.ts`, `GuideScene.tsx`, `GuideDock.tsx` interact, which animation clips the GLB actually ships, how position is persisted, and where the dock's CSS home is defined."
   - `Explore` — "Map `/about`: `components/sections/about/monolith/*` (MonolithScene, AboutChapters, monolith.ts, textures.ts). Report the pinning model, the chapter timing contract, the reveal pass, and which parts are reusable as a pattern vs. one-off."
   - `Plan` — "Given `components/sections/home/ProcessFilm.tsx` and the /about Monolith concept, propose 2–3 architectures for rebuilding the homepage 'Inside the process' section in the same boutique-studio language, and name the trade-offs."
3. Then write the plan. Sequence the phases exactly as §1–§7 below. Every phase ends with the §8 verification loop.
4. Non-negotiable: **all hard rules in `CLAUDE.md` still apply.** No Symbol Studio content, tokens-only colors, the fixed red roles, `next/font` only, no gradients / glassmorphism / emoji icons / decorative shadows, no fabricated clients or metrics.

---

## 1. New hero film + new hero statement

**Skills to load: `anthropic-skills:gsap-scrolltrigger`, `anthropic-skills:gsap-core`, `anthropic-skills:gsap-performance`, `anthropic-skills:frontend-design`.**

### 1.1 The asset

`public/media/new_hero.mp4` is already in place. Verified: **1280×720, 24 fps, 15.072 s, 361 frames, h264 + AAC audio**.

It is a **normal encode and is therefore NOT scrubbable as-is** — `HeroMedia.tsx`'s docblock is explicit that only a tight-GOP re-encode may ever be seeked. So:

1. Re-encode to an all-keyframe master and strip audio:
   ```
   ffmpeg -i public/media/new_hero.mp4 -an -c:v libx264 -g 4 -crf 18 \
     -pix_fmt yuv420p -movflags +faststart public/media/hero_scrub.mp4
   ```
2. Produce the 720p→phone encode the same way at a lower bitrate as `public/media/hero_scrub-m.mp4` (the source is already 720p; downscale to 1280×720 max, keep `-g 4`).
3. Extract the **encoded clip's** first frame — not the source's — to `public/images/poster-hero-scrub.jpg` (`-frames:v 1 -q:v 2`). A re-rendered still pops on handover; this must be pixel-identical to frame 0 of the encode.
4. Keep the old files only if they are referenced elsewhere; otherwise remove them and note the deletion. Do not leave dead media in `public/media/`.
5. Sanity-check the file sizes. If `hero_scrub.mp4` blows past ~8 MB, drop `-crf` handling to keep the blob fetch reasonable and say so in the report.

### 1.2 The statement

Replace the current three-part `<h1>` in `Hero.tsx` with:

```
YOUR IDEA,
AT FULL VOLUME.
Designed to be heard, and to be kept.
```

- The `(10)` and `(15)` in the brief are **character counts of the two display lines** — layout metadata from the source doc. **Do not render them.**
- Line 1 + line 2 are Archivo Black display; line 3 stays the Newsreader italic face break, exactly the role the current serif line plays. That one face break is the reason the sentence reads as a promise — keep it.
- Update `content/site.ts` only if the tagline is genuinely the same string; the hero headline may live in the component. Do **not** silently change the `<title>` / meta description unless the plan says so and the report lists it.
- Re-check the `.display` / `.serif` sizing in `Hero.module.css` — two lines instead of three changes the optical balance at 1440 and the wrap at 390.

### 1.3 The scrub

- The clip is now 15 s instead of 5 s across the same one-viewport pin. Re-tune `HANDOFF_AT` (0.62), `CHROME_FLIP_AT` (0.92), `RAMP_FROM` and the `GRADE` endpoints against the **actual** frames of the new film — do not carry the old numbers forward on faith. Screenshot at progress 0 / 0.25 / 0.5 / 0.75 / 1.0 and choose the flip point where the covering section's edge really reaches the header baseline.
- If the new film's motion arc means one viewport of pin makes the scrub feel rushed, propose (in the plan, for approval inside the same run) extending `end` and state the exact cost in dead scroll.
- Everything behind `HeroMediaHandle.setProgress` stays: blob fetch, latest-wins seek coalescing, short-side tiering, poster hold, LPM fallback. **Do not rewrite that contract** — only the constants and the sources change.
- Reduced-motion and mobile paths must still land on the poster with no pin.

---

## 2. Guide avatar — detachable, draggable, self-returning

**Skills to load: `anthropic-skills:three-guide` (repo-specific, mandatory), `anthropic-skills:gsap-core`, `anthropic-skills:gsap-utils`, `anthropic-skills:gsap-plugins` (Draggable / Inertia patterns — adapt, do not necessarily add the plugin).**

Current state: `guide-drag.ts` already moves the whole dock 1:1 and persists the drop position; the 2026-08-03 corner-lock was retired. What is missing is the **return**.

Build:

1. **Free detachment.** He must read as lifted off his platform, not slid along it. On drag start: platform/puck shadow separates or scales down, he gets a small lift, cursor state changes. On drop: he settles. Use the rig's real clips where they exist (`Greet` / `Run` / `Talk` / `Walking`) rather than inventing procedural motion — check `guide-robot.ts` for what actually ships.
2. **Idle return.** After a configurable standby (`RETURN_AFTER_MS`, start at **12 s** of no pointer interaction with him and no drag), he returns to the dock's CSS home. Preferred read: he **walks back** — `Walking` clip playing while the dock tweens home along an eased path, then a settle beat. If the walk cannot be made to read at that scale, fall back to a clean lift-and-glide, but say which you chose and why.
3. **Cancellation.** Any pointer-down on him, any drag, or opening the radial/bubble cancels an in-flight return immediately and restarts the timer. The return must never fight the user.
4. **Persistence.** Once he has returned home, clear the stored offset so a reload does not re-strand him. While he is away from home, the stored offset still survives reload (current behaviour).
5. **Hard constraints.**
   - Keep the deliberate absence of `setPointerCapture()` and the `window`-level listeners — the docblock explains exactly what breaks otherwise. Do not "fix" it.
   - `prefers-reduced-motion`: the return is an instant, unanimated snap. No walk, no glide.
   - Edge clamping (`EDGE_PAD`) still applies during the return path.
   - Interaction with `guide-idle.ts`'s 90 s sleep: returning home must reset or coexist with the sleep scheduler, never double-fire. State the rule you implement.
6. Verify with `scripts/verify-guide.mjs` and extend it with the return case.

---

## 3. Media generation — try Higgsfield MCP first, fall back to a brief

**Skills to load: `anthropic-skills:ai-video-director` (shot planning + model-correct prompts), `anthropic-skills:orpheus-pythia` (four-block Higgsfield/Cinema-Studio prompt grammar), `anthropic-skills:orpheus-iris` (lens / light source / camera motive per shot).**

**Attempt generation directly via the Higgsfield MCP** (`generate_video`, `generate_video_batch` + `jobs_wait`, `generate_image` / `generate_image_batch`). Call `models_explore(action:'recommend')` first if unsure which model to target, and check `balance` / `show_plans_and_credits` before batching. Target **Seedance 2.5**, **≤15 s, 720p** for every video.

- If generation succeeds: download the results, place them under `public/media/` (video) and `public/images/` (stills + posters), re-encode to the repo's contract (see §1.1 for scrub clips; normal encode + extracted poster for play-once clips), and wire them in.
- If generation fails, is unavailable, or the account is out of credits: **do not fake it.** Write the full prompt set to a single new file `MEDIA-BRIEF-R6.md` at the repo root, and leave the existing honest empty-plate / poster fallbacks in place. Never ship stock, never ship a placeholder that reads as content.

Either way, `MEDIA-BRIEF-R6.md` is produced, listing for every asset: filename, destination path, target model + settings (duration, resolution, aspect, fps, seed if used), the frame/image prompt, the motion prompt, the negative prompt, the encode command, and the poster extraction command. Mark each row **GENERATED** or **PENDING**.

House look for every asset — enforce it in every prompt: monochrome / desaturated warm-neutral grade that sits on noir `#1B1717` and cotton `#EDEBDD`; architectural, editorial, unhurried; single named light source per shot; no lens flare, no neon, no colour cast that fights the cherry `#810100` accent; **no text, no logos, no readable signage, no recognisable faces of real public figures**; no gradients or glassmorphism artefacts.

### 3.1 `/works` hero film (replaces the static right plate)

The `/works` hero currently plays `/media/columns.mp4` behind `WorksHero.module.css`. Replace it with a purpose-built clip.

- **≤15 s, 720p, 24 fps, portrait-ish or square-safe crop** — check `WorksHero.module.css` for the actual aspect the plate presents before locking the prompt.
- Subject: an architectural interior threshold — the framed dark aperture already in the reference still, but *moving*: a slow push through a lit gallery-like room toward a deep recess, floor reflecting a single soft source. Reads as "we change the level at which they compete," not as a hotel photo.
- No audio, `-an`, normal encode (this one plays; it is not scrubbed), poster extracted to `public/images/poster-works-hero.jpg`.

### 3.2 "How we work" — the three empty plates

`Principles.tsx` renders three deliberately empty noir `.plate` fields (the docblock says Russ is supplying the images). Fill them.

Produce prompts for **three stills** (not video — the section is a reveal-stagger, not a film), one per principle, each matching the plate aspect measured from `Principles.module.css`:

- `01 Strategy before style.` — a working surface before anything is designed: paper, a single drafting line, raking light from one window. Evidence of thinking, not of output.
- `02 Systems, not one-offs.` — repetition with variation: a grid of the same object under one light, or a modular structure photographed straight on. Order, extendability.
- `03 Direct access.` — two people at one table, close, mid-decision. Small room. No open-plan agency floor, no stock-photo eye contact with camera.

Destinations: `public/images/principles/01.jpg`, `02.jpg`, `03.jpg`. Wire them in by putting a `next/image` inside `.plate` — the docblock says that is the only change needed. Keep the empty-plate fallback if a file is missing.

Also audit for **any other missing or placeholder media across the site** (empty plates, `poster-*.jpg` referencing files that do not exist, `/images/about/*` and `/images/team/*` gaps) and add every one of them to `MEDIA-BRIEF-R6.md`.

### 3.3 "Inside the process" — new film

See §4. Prompt it as a **≤15 s, 720p, 24 fps, 16:9** clip that can also be **tight-GOP re-encoded and scrubbed** if the rebuilt section ends up scrub-driven — decide that in §4 first, then write the prompt to match.

Subject direction, boutique-studio register: not a "creative team" stock scene. Two people, one room, one object being worked on. Hands, materials, a screen showing an abstract form. Slow, single continuous camera motive. It has to be honest that this studio is two people (see `/about`: "Convenium is two people").

---

## 4. "Inside the process" — full rebuild in the /about language

**Skills to load: `anthropic-skills:three-guide`, `anthropic-skills:gsap-scrolltrigger`, `anthropic-skills:gsap-timeline`, `anthropic-skills:frontend-design`, `anthropic-skills:web-design-pro`.**

Target: `components/sections/home/ProcessFilm.tsx` + `.module.css`, mounted at `#process` in `app/(home)/page.tsx`.

The current section is a pinned band that opens from letterbox to full while type arrives on solid noir. It is fine, and it is **generic** — it does not speak the same language as `/about`, where one WebGL object carries six chapters and the page *demonstrates* the service rather than describing it.

Rebuild it so the homepage section is recognisably the same studio voice as `/about`:

- Study `MonolithScene.tsx` / `AboutChapters.tsx` / `monolith.ts` for the pinning model, the chapter timing contract and the reveal pass. **Reuse the pattern; do not import the Monolith itself onto the homepage** — the homepage must not become a second /about, and a second WebGL scene on the same page as the Guide robot is a performance decision, not a free one. If you do introduce WebGL here, gate it behind the same perf gates `three-guide` defines and prove the frame budget.
- The boutique-studio concept must land: **two people, one room, decisions made in person.** Copy should be checkable — no invented headcount, no metrics, no client claims. The existing body copy is already honest; improve it rather than inflating it.
- Keep the legibility rule: **cotton type never sits over the moving image.** That is not negotiable.
- Keep the "no dead pin" discipline from the current docblock — the last real motion must land near the end of the pin range, not at t=0.72.
- Whichever media model you choose (play-once vs. scrubbed), the media contract is the same as everywhere: extracted poster, `-an`, reduced-motion path that shows a still and no pin.

Present the chosen architecture and its trade-offs in the plan **before** implementing, using the `Plan` subagent's output from §0.

---

## 5. Wiring, copy and content pass

- Update `content/` files rather than hardcoding strings in components, matching the repo's existing convention.
- If the hero statement change makes `site.tagline`, the OG description or `app/sitemap.ts` stale, fix them.
- Grep the repo for references to any media file you removed or renamed and fix every one.

---

## 6. Audit, improvements, deployment readiness

**Skills to load: `anthropic-skills:web-design-pro`, `design:accessibility-review`, `design:design-critique`, `anthropic-skills:gsap-performance`.** Run the audit through a `general-purpose` subagent so it reviews the work with fresh eyes, then triage its findings yourself.

Produce `AUDIT-R6.md` at the repo root covering:

1. **Correctness** — `npm run build` clean, `npm run lint` clean, no TS errors, zero console errors on every route including after scroll and hover.
2. **The CLAUDE.md hard rules** — grep for `SYMBOL STUDIO`, `#FE552E`, the Rules font, retired gold `#B18A46`; verify every colour used resolves to a token; verify the red-role rule (cherry vs. maroon vs. chili vs. chili-300) is not violated by anything you added.
3. **Performance** — hero blob fetch size, total media weight, LCP on `/`, the Guide's frame cost, any layout thrashing introduced by the new ScrollTriggers. Apply `gsap-performance` guidance.
4. **Accessibility** — WCAG 2.1 AA on the new hero (cotton on graded film), the new process section, and the Guide (keyboard reachable, focus visible, reduced-motion honoured, `aria-hidden` correct on decorative media).
5. **Responsive** — 1440×900 and 390×844 full-page screenshots of `/`, `/works`, `/services`, `/about`, `/contact`, saved under `screenshots/r6/`, compared against `assets/design/`. List every deviation; accepted ones must be stated explicitly, never silently.
6. **Deployment readiness** — metadata, `robots.ts`, `sitemap.ts`, OG image, favicons, `next.config.ts` image/video handling, no dev-only routes shipping (`app/dev/hero-preview` — decide and state), no unused files in `public/`, `.gitignore` sane, build output size.
7. **Improvements found** — anything else worth fixing, ranked P0 / P1 / P2. Fix P0 in this run; list P1/P2 with a one-line rationale each.

---

## 7. Deliverables at end of run

- All code changes applied and building.
- `MEDIA-BRIEF-R6.md` — every asset, GENERATED or PENDING, with prompts, settings and encode commands.
- `AUDIT-R6.md` — findings, fixes applied, deviations, P1/P2 backlog.
- Screenshots in `screenshots/r6/`.
- A short closing summary: what changed, what is still blocked on media, what needs my decision.

---

## 8. Verification loop — run after EVERY phase, not just at the end

Per `IMPLEMENTATION-PLAN.md` §0.3:

1. `npm run build` passes with no errors or type warnings.
2. Dev server up; Playwright full-page screenshots of every touched route at 1440×900 and 390×844.
3. Compare against `assets/design/`; list deviations, fix the meaningful ones, state the accepted ones.
4. Console-error check on every route, **including after scroll and hover**.
5. Manual scrub check in both directions for anything scroll-scrubbed.
6. Only then mark the phase complete.

Do not proceed past a failing phase. If a phase cannot be completed as specified, stop, say exactly why, and propose the smallest correct alternative.
