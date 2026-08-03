# The Guide — corner assistant (approved design, 2026-08-03)

Decisions resolved in brainstorming with Russ. This spec sits ON TOP of two
authoritative documents — read both before writing any code:

- `homepage/design/DESIGN-LOCK.md` — pixel-locked visual/interaction spec for the
  puck, radial menu, speech bubble, Ask panel, drag states. **Every visual value
  comes from there. Do not re-decide anything it locks.**
- `homepage/design/uploads/homepage/HOME-GUIDE-SPEC.md` — robot asset + recolor
  spec (§1), hero film (§2 Stage A), chapter hint lines (§3 table).

Also binding: root `CLAUDE.md` (tokens, red roles, fonts, no-gradient rules,
verification protocol) and the CC-BY colophon requirement.

## Approved decisions (this spec's delta)

1. **Puck replaces the Stage B scroll-guide.** The robot lives permanently in the
   locked corner puck (104px desktop / 76px ≤520px). The Stage B travelling-robot
   choreography from HOME-GUIDE-SPEC §2–3 is RETIRED. Stage A (hero film) stays;
   the film's walk-out ending resolves with the robot appearing in the puck after
   one scroll beat of absence (the relay cut, now film → puck).
2. **Site-wide.** `<GuideDock>` mounts in the root layout and persists across
   navigation. Per-route content config (`guide-content.ts`): each page declares
   its hint lines and petal targets. Home = 5 chapter petals + Ask (locked §4);
   other pages = page-link petals, same geometry.
3. **Ask = scripted first, LLM behind a flag.** Panel ships with curated chips +
   pre-written answers sourced from existing site copy (`site.ts`, `services.ts`,
   FAQ). Env flag `GUIDE_LLM=1` enables free-text via `/api/guide` → Claude API
   with a site-knowledge system prompt + simple per-IP rate limit. UI identical
   in both modes (locked §6).
4. **Drag** as locked §3: puck drags along viewport edges, position persisted in
   `localStorage`. One drop interaction only: drop onto a section to jump to it
   (armed state, locked §7). Nothing fancier.
5. **Idle life** ("always doing something"): micro-behavior scheduler, every
   6–14s one weighted random act — look left/right, glance toward nearby cursor,
   blink (eye emissive dip), small fidget from GLB clips, occasional stretch.
   Scroll velocity spike → brace/look down. 90s no interaction → sleep (eye 0.6,
   slow sway); any input wakes. Cooldown-gated. Reduced-motion kills all of it.
6. **Section hints**: locked bubble carries lines #01–#06 (HOME-GUIDE-SPEC §3
   table) fired by once-per-direction ScrollTriggers; bubble auto-retires after
   6s or on any interaction; per-session frequency cap (sessionStorage). Same
   system serves other pages' hint lines.
7. **Extras (in scope, nothing more):** eye brightens one step (locked 1.9) on
   contact-CTA hover; one wave on first visit per session; look at footer
   wordmark on reveal.
8. **Perf/a11y:** GLB lazy-loaded after first paint; rendering pauses when tab
   hidden and between behavior ticks in sleep; keyboard + focus rules exactly as
   locked §7.

## Architecture & interface contract (Track A ↔ Track B)

Two work tracks build this in parallel. The contract between them is
`components/guide/guide-state.ts`, created FIRST by Track A:

```ts
// guide-state.ts — the only coupling surface between tracks
export type GuideMode = 'idle' | 'hover' | 'menu' | 'dragging' | 'armed'
  | 'talking' | 'ask' | 'sleep';
export interface GuideState {
  mode: GuideMode;
  puckPos: { edge: 'left'|'right'|'bottom'; offset: number }; // persisted
  crownScreen: { x: number; y: number } | null; // Head_05 + crown offset, per frame
  chapter: number; // 0..n on home, -1 elsewhere
  openMenu(): void; closeMenu(): void;
  openAsk(): void; closeAsk(): void;
  speak(line: { eyebrow: string; text: string }): void; dismissBubble(): void;
  setEyeStep(on: boolean): void; // 1.35 ↔ 1.9
}
```

Store: React context + `useSyncExternalStore` or zustand — Track A picks,
Track B only consumes the interface above.

- **Track A (hard — Claude Code):** GuideScene (canvas, framing span 0.02→1.10,
  recolor pipeline, eye spheres, lights per lock §1–2), idle scheduler, drag +
  edge docking + persistence, bubble DOM shell + anchoring (crown projection,
  tail clamp/flip per lock §5), state machine, reduced-motion, perf gates.
- **Track B (Cursor Composer):** radial menu + label index (lock §4), Ask panel
  UI + scripted answers + `/api/guide` route (lock §6), `guide-content.ts`
  per-route config, section-hint ScrollTriggers, extras (§7 above), footer
  colophon, Playwright verification.

File layout: everything under `components/guide/` (+ `app/api/guide/route.ts`),
one CSS module per component, tokens only from `styles/tokens.css`.

## Verification (from CLAUDE.md, both tracks)

`npm run build` clean → Playwright full-page screenshots 1440×900 and 390×844 →
compare vs locked values → console clean incl. after scroll/hover/drag →
grep `OscarLomas3D` (colophon must render) → grep for banned Symbol Studio
strings/colors. Deviations listed, never silently accepted.
