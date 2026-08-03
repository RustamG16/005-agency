# PROMPT C — Claude Code (Opus 5 high / Sonnet max effort), run in Plan Mode

Run BEFORE Cursor's PROMPT-B (the guide hints wire to section anchors this
prompt creates). First move the folder `docs/superpowers/specs/three-guide-skill/`
to `.claude/skills/three-guide/` so the 3D skill is discoverable.

---

Read before planning: root `CLAUDE.md`, `DESIGN.md`, `styles/tokens.css`,
`homepage/design/DESIGN-LOCK.md`,
`docs/superpowers/specs/2026-08-03-guide-corner-assistant-design.md`.

Invoke `frontend-design` (repo skill) once up front — it governs all visual
work below. Follow the awwwards working method: visual brief → section plan →
build → validate. Borrow principles, never clone. All colors from tokens, red
roles per CLAUDE.md, fonts via existing `next/font`, no gradients / shadows /
emoji / blanket scroll-fades. Capabilities (services) and FAQ sections are
FROZEN — do not touch their internals, only their entrance transitions.

## Tasks

### 1 · Hero — rebuild from zero  (skills: frontend-design, gsap-core, gsap-scrolltrigger)
Delete the current hero video, the scrub debug overlay ("SCRUB … FILM NOT
PRESENT"), and the ENTIRE existing hero→next-section transition sequence
(OpeningSequence / Stage A remnants). Build a new hero banner from scratch:
oversized editorial headline (existing H1 copy "We take businesses to the level
their ambition deserves."), fluid `clamp()` type, restrained noir treatment per
DESIGN.md. Include a full-bleed media slot component (`HeroMedia`) that today
renders a noir poster/still and is built to accept the upcoming all-keyframe
scroll-scrub video: give it a pinned ScrollTrigger shell with progress plumbing
already in place but driving only a subtle placeholder (e.g. headline
parallax), so dropping the video file in later is a one-line change. NEVER
scrub any video that is not the all-keyframe re-encode (CLAUDE.md hard rule).

### 2 · Hero → Capabilities transition  (skills: gsap-scrolltrigger, gsap-timeline)
New from zero. One pinned or clip-path-driven handoff — noir hero resolves into
the cotton capabilities ground with an intentional beat (clip/mask or
transform-based, no opacity-only fade). Both scroll directions must be clean.

### 3 · "Inside the process" — redesign internals completely  (skills: frontend-design, gsap-scrolltrigger, gsap-timeline)
Keep the section's copy and the film asset; rebuild the layout and motion from
zero (current version: static headline block over the film). Aim: editorial,
scroll-choreographed — e.g. pinned film band with staggered type reveals and a
progress rule. No invented copy.

### 4 · "How we work" — redesign completely  (skills: frontend-design, gsap-scrolltrigger)
Replace the current flat 3-column row (01/02/03) with a stronger archetype —
asymmetric editorial stack or full-width numbered rows with hairline rules,
staggered transform reveals per row. Keep the three items' existing copy
exactly. Respect the hairline token for rules.

### 5 · Section transition rhythm, whole page  (skills: gsap-scrolltrigger, gsap-performance)
Give every section boundary an intentional entrance (stagger/transform, custom
easing — never linear, never bare fades) with a consistent motion language:
one duration/ease vocabulary defined once and reused. Transform/opacity only,
`gsap.matchMedia()` for responsive + `prefers-reduced-motion` variants,
ScrollTriggers created inside `useGSAP` scope with proper cleanup. FROZEN
sections get entrances only.

### 6 · Footer fix  (skills: frontend-design)
The giant CONVENIUM wordmark is clipped at the right edge (see screenshot
evidence — last letters cut). Make it fit intentionally: fluid `clamp()`
font-size derived from container width (or `svh/cqw` units), overflow hidden
only as a guard, never as the fit mechanism. Verify at 1440 and 390 widths.

### 7 · Guide assistant upgrades  (skills: three-guide, gsap-core; spec + DESIGN-LOCK are law)
The robot renders but is inert. Add, per the locked design:
a. **Drag** — puck draggable along viewport edges, ring states per lock §3,
   scale 0.97 + walk clip while dragging, position persisted to localStorage.
b. **Section hint pop-ups** — locked speech bubble (§5) anchored to the head
   bone via projection (see three-guide skill); fires once per direction at
   section thresholds with useful lines per section (existing copy only),
   auto-dismiss 6s, sessionStorage frequency cap.
c. **Radial menu** — visible affordance on the puck (hover ring per lock §3 +
   focusable button). Opens the locked radial (§4 geometry). Petal contents:
   **Ask a question** (paper petal, opens Ask panel UI — scripted chips only
   for now), **Explain this section** (speaks the current section's hint line
   via the bubble), plus section-jump petals. Bubble and panel never co-exist
   (§6 rule).
Note: "Explain this section" is a NEW petal — record it as an amendment in the
spec file's decision list.

### 8 · Verify  (per CLAUDE.md — non-negotiable)
`npm run build` clean → Playwright full-page screenshots 1440×900 + 390×844 →
footer wordmark uncut at both sizes → console clean after scroll/hover/drag →
grep: no `SYMBOL STUDIO`, no `#FE552E`, `OscarLomas3D` colophon present →
reduced-motion pass (all content readable, no motion). List every deviation.

## Out of scope
Capabilities/FAQ internals, the Ask LLM route, per-page guide config beyond the
homepage (Cursor's PROMPT-B covers those after this lands).
