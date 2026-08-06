# PROMPT E — Claude Code desktop (Opus 5), run in Plan Mode

Hero scroll animation. Copy everything below the line into Claude Code.

**Before you paste:**

1. Higgsfield MCP must be connected in Claude Code and authenticated, with ≥ 100 credits.
   Verify with the `balance` tool before starting Phase 1.
2. `ffmpeg` and `ffprobe` must be on PATH.
3. Start in Plan Mode. This work has hard spend gates — do not let it run unattended.

Skills to invoke: `frontend-design`, `gsap-scrolltrigger`, `gsap-react`, `gsap-performance`,
`ai-video-director`, `web-design-pro`, `design:accessibility-review`.

---

Read, in order, before planning:

1. `docs/superpowers/specs/2026-08-07-hero-scroll-animation-design.md` — the approved spec.
   It is authoritative. Where this prompt and the spec disagree, the spec wins.
2. Root `CLAUDE.md` — hard rules and the verification protocol.
3. `DESIGN.md` — tokens and the motion system. The only source of visual values.
4. `components/sections/home/Hero.tsx` and `HeroMedia.tsx` — read the header comments in
   both. They explain why the pin is one viewport with `pinSpacing: false` and why the
   Capabilities section is the wipe. Do not re-derive those decisions.
5. `components/motion/motion.ts` — `MQ.desktopMotion` is `(min-width: 769px) and
   (prefers-reduced-motion: no-preference)`. The scrub only ever runs inside it.

Reference material for the technique (read if you need the reasoning, do not install):
the `scroll-world` skill, <https://github.com/cth9191/scroll-world> — specifically
`references/gotchas.md`, which is where the five seek behaviours in spec §2.1 come from.

## Scope

Fill the empty `SCRUB_SRC` socket in `HeroMedia.tsx` with a generated architectural ascent
driven by the hero's existing scroll progress.

**Do not** change `Hero.tsx`'s timeline, its constants (`HANDOFF_AT` 0.62,
`CHROME_FLIP_AT` 0.92), the pin geometry, or the Capabilities handoff. **Do not** add npm
dependencies. **Do not** touch any other route or section.

## Phases — one session each, gated

Run these in order. Each must pass its exit criteria before the next begins.

### Phase 0 — preview harness (free)

Build `/dev/hero-preview` per spec §4.5. It mounts a candidate image into the real
`HeroMedia` box with the real `<h1>`, real tokens, real `next/font` faces, and the real
`.video` grade from `HeroMedia.module.css`, plus:

- a progress slider 0 → 1 driving the same `setProgress` handle the pin drives,
- a simulated cotton edge descending at the same rate as the Capabilities cover.

Exclude it from `app/sitemap.ts` and give the route its own `robots: { index: false }` —
`app/robots.ts` allows `/` wholesale, so the exclusion has to live on the route. Nothing in
production may import from it.

Exit: slider drives progress end to end, cotton edge tracks it, grade and type match
production exactly.

### Phase 1 — anchor still (6 credits, GATED)

**Stop and ask before generating anything.**

`generate_image`, model `nano_banana_pro`, aspect `3:2`, resolution `2k`, count 3. Prompt is
in spec §4.1 verbatim. Preflight with `get_cost: true` first and report the number.

Load all three into the Phase 0 harness and judge them there — full-bleed, centre-cropped,
graded, with type over them at several progress values. Not as flat thumbnails.

Exit: one approved still. On-brand, focal point horizontally centred with headroom, nothing
essential near the left or right edge, statement type legible over it at every progress value.

### Phase 2 — motion clip (62.5 credits, GATED TWICE)

**Stop and ask before the previz. Stop and ask again before the master.**

Previz first: `generate_video`, model `seedance_2_0`, `medias: [{ role: "start_image",
value: <approved still job_id> }]`, **no** `end_image`, duration 5, resolution `720p`, mode
`fast`, `generate_audio: false`, aspect `16:9`. Prompt in spec §4.2 verbatim. 17.5 credits.

Check in the harness: camera continuous, no cuts, no velocity reversal, brightens toward the
end. Then check the spec §4.4 seam behaviour and fix the grade ramp (`brightness` 0.78 → 1.0,
`contrast` 1.08 → 1.0 across roughly `HANDOFF_AT` → 1.0, on the hero's existing timeline).

Only then the master: same call at `1080p` / `std`. 45 credits.

If Seedance returns `status: "nsfw"` — it does this on innocuous architectural interiors and
it is non-deterministic — follow the ladder in spec §5: re-roll once; then strip trigger words
and add "empty, unoccupied, no people, no figures, architectural"; then regenerate on
`kling3_0` with the same start frame (`sound: "off"`, and do **not** pass `resolution` —
that model rejects the param). Do not exceed the 31.5-credit reserve without asking.

Exit: one approved master.

### Phase 3 — encode (free)

The three ffmpeg commands in spec §4.3, unchanged. Then amend `CLAUDE.md` line 22 to the
exact replacement text in spec §6 — this rule change is approved, do not skip it and do not
improvise different wording.

Exit: `public/media/hero_scrub.mp4` ≤ 8 MB, `hero_scrub-m.mp4` ≤ 3 MB,
`public/images/poster-hero-scrub.jpg` extracted from the **encoded** file, `CLAUDE.md` amended.

### Phase 4 — the seek path (free)

Implement all five behaviours in spec §2.1 inside `HeroMedia.tsx`, behind the existing
`HeroMediaHandle.setProgress` contract. Set `SCRUB_SRC`. Verify each behaviour individually,
not just the composite:

1. Blob-URL loading, with revoke on unmount.
2. Seek coalescing — latest-wins on the `seeked` event.
3. Device tiering by **screen short side** (≤ 600 CSS px → 720p). Never by pointer type or
   user-agent; iPadOS lies about both.
4. Poster held until first paint, muted `play()` prime on first touch.
5. `.catch()` on that prime → stills mode for the session (iOS Low Power Mode).

Exit: all five present and individually demonstrated.

### Phase 5 — polish (free)

Contrast of the statement over the film at every progress value, scroll-cue legibility,
header flip timing at `CHROME_FLIP_AT`. Invoke `web-design-pro` and
`design:accessibility-review`.

### Phase 6 — verification (free)

Everything in spec §9. Run the scrub checks from the Phase 0 harness first, then confirm each
one on the real page under real scroll — a check that only ever passed in the harness has not
been run. Then decide whether `/dev/hero-preview` is deleted or kept behind a
`NODE_ENV !== "production"` guard.

Produce a deviations report. List every deviation; never silently accept one.

## Hard rules

- **Never generate without an explicit go for that specific step.** Always `get_cost: true`
  first and report the number before spending.
- Total ceiling 100 credits. Committed plan is 68.5. The 31.5 reserve needs a fresh go.
- Colours only from `styles/tokens.css`. Red roles exactly as `CLAUDE.md` defines them.
- No gradients, glassmorphism, emoji icons, decorative shadows, blanket scroll-fade.
- No fabricated clients, testimonials, awards, staff, addresses or phone numbers.
- Never ship a reference PNG from `assets/design/` as a page image.
- Never scrub `/media/hero_autoplay.mp4` — it is a normal encode.
- Do not pass `generate_audio` to seedance; it errors. Mute in HTML, `-an` on encode.
- One component per file. Keep files focused.

## Verification loop (every phase, per `CLAUDE.md`)

`npm run build` clean → Playwright full-page screenshots at 1440×900 and 390×844 → compare
against `assets/design/` → console error check including after scroll and hover → then mark
done. Deviations listed, not silently accepted.
