# PROMPT A — Claude Code (Sonnet ultracode / Opus 5 high), run in Plan Mode

Copy everything below the line into Claude Code. Suggested skills to invoke
before implementing: the repo's `.claude/skills/frontend-design`, plus
`gsap-core`, `gsap-scrolltrigger`, `gsap-react` if available.

---

Read, in order, before planning:
1. `docs/superpowers/specs/2026-08-03-guide-corner-assistant-design.md` (the approved spec — your scope is **Track A**)
2. `homepage/design/DESIGN-LOCK.md` (pixel-locked values — never re-decide these)
3. `homepage/design/uploads/homepage/HOME-GUIDE-SPEC.md` §1 (recolor pipeline, eye, lights)
4. Root `CLAUDE.md` (hard rules + verification)

Reference implementations you may clone patterns from:
`homepage/design/guide-scene.js`, `guide-radial.js` (working three.js board code)
and `homepage/design/uploads/homepage/output/components/sections/home/guide/GuideScene.tsx`.
Asset: copy `homepage/design/uploads/repo_robot.glb` to `public/models/repo_robot.glb`.

## Your tasks (Track A only — do NOT build the radial menu, Ask panel, or hints; a second agent owns those)

1. **Contract first.** Create `components/guide/guide-state.ts` exactly as the
   interface in the spec, plus its store implementation. Commit this before
   anything else — the other track codes against it.
2. **GuideScene** (`components/guide/GuideScene.tsx` + module CSS): puck-sized
   transparent WebGL canvas, 104px desktop / 76px ≤520px, framing span
   0.02→1.10, DPR-capped renderer. Recolor pipeline exactly per lock §1: canvas
   pixel-walk red-band remap to cherry with the lifted curve; parts flat noir;
   per-bone emissive eye spheres (paper, 1.35, CTA step 1.9, toneMapped false);
   locked key + ambient lights, no shadow maps.
3. **Idle scheduler**: weighted random micro-behaviors every 6–14s (look
   left/right, cursor glance when pointer within ~160px, blink via emissive dip,
   fidget/stretch from GLB clips if present), scroll-velocity brace, 90s → sleep
   (eye 0.6, slow sway), wake on any input, cooldowns, all disabled under
   `prefers-reduced-motion`.
4. **Drag + docking**: pointer drag along viewport edges per lock §3 ring
   states, scale 0.97 while dragging, walk clip if available, position persisted
   to localStorage, restored on mount. Armed state plumbing: expose current drop
   target hit-testing so sections with `data-guide-drop` get the 1px
   cherry/chili outline at 6px offset and drop = scroll-to.
5. **Speech bubble shell + anchoring** per lock §5: paper bubble DOM, project
   `Head_05` + measured crown offset every frame → `crownScreen` in the store;
   tail slide/clamp 18px, flip below when near top; enter/exit motion per lock.
   Content comes from `speak()` calls — render whatever the store holds.
6. **Mount point**: `components/guide/GuideDock.tsx` in the root layout —
   renders GuideScene + bubble + slots (`children` or explicit props) where the
   other track's menu/panel will attach. Lazy-load the GLB after first paint;
   pause the render loop when `document.hidden` or asleep between ticks.
7. **Verify** per CLAUDE.md: `npm run build` clean, Playwright screenshots
   1440×900 + 390×844, console clean after scroll/hover/drag, list deviations.

Rules: tokens only from `styles/tokens.css`; red roles per CLAUDE.md; no
gradients/shadows/emoji; never ship reference PNGs; do not touch the hero video
scrub. Keep every file focused — one component per file.
