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

### Amendment — 2026-08-04 (PROMPT C)

9. **"Explain this section" is a sixth petal.** It speaks the current stop's
   approved hint line through the bubble. Decision 2 above allotted the home ring
   "5 chapters + Ask"; adding Explain would make seven petals, and seven do not
   fit — at step 16.7° the chord between petal centres is 42.9px against a 44px
   petal, so they overlap. The ring therefore carries **four section jumps
   (Capabilities, Selected work, Inside the process, How we work) + Explain +
   Ask**. The FAQ is off the ring; it sits one screen below "How we work" and is
   still served by hint #05. Widening the arc to 176°→296° would fit a seventh
   petal but pushes past "up" into the page, and was not taken.
10. **The homepage gained a Selected Work section** (the deck) after
   HOME-GUIDE-SPEC §5 was written, so it has **no approved hint line**. It gets a
   jump petal and stays silent; "Explain this section" falls back to the nearest
   preceding stop that has copy. No line was invented or re-pointed to fill the
   gap.
11. **DESIGN-LOCK §3's ring states now live on the pad's milled rim.** The disc
   they were specified on was retired on 2026-08-03; the states themselves were
   not, and they had nowhere to render. Rest / hover+open / dragging map to the
   §3 colours per ground (`RIM_COLOR` in `guide-robot.ts`).

### Amendment — 2026-08-04 (PROMPT D)

12. **The ring loses its section jumps and becomes three petals.** Amendment 9's
   "four section jumps + Explain + Ask" is retired. The nav already carries the
   page's structure, and a second table of contents inside the guide made him a
   menu rather than a guide. The ring is now three things you can ask of him:
   **Explain this section · Do a trick · Ask a question**, spaced evenly across
   the same locked 176°→276° arc — step 50°, chord 2·148·sin 25° = 125px against
   a 44px petal, so the fan is airier than six ever were. Geometry, mark
   treatment and the always-visible label index are unchanged (lock §4).
   `HOME_STOPS` survives as the hint schedule and as what Explain reads from; it
   no longer feeds petals, so `GuideStop.petal` is gone.
   - **"Do a trick"** plays a random unused clip. Read off the GLB, the rig ships
     exactly four — `action_Greet`, `Run`, `Talk`, `Walking` — and three were
     already wired, so **`Run` is the only unused clip and there is no spin, jump
     or flip**. The trick is therefore Run on the spot while the figure turns a
     full 360° in code, eye at the CTA step (lock 1.9) for the duration, 6s
     cooldown. Flagged rather than folded in: a real trick clip would need to be
     authored or sourced for the model.
   - Under `prefers-reduced-motion` the trick petal is **omitted**, not disabled,
     and the remaining two re-space across the same arc.

13. **The wave was never wired.** Spec decision 5 ("small fidget from GLB clips")
   and decision 7 ("one wave on first visit per session") were both unbuilt: the
   idle scheduler was entirely procedural and nothing in the app ever called
   `playClip("greet")`, so the wave the model ships had never played. The
   scheduler now draws clip-driven acts alongside the procedural ones and
   guarantees a wave every 3–5 ticks, and the first arrival of a session waves.

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
