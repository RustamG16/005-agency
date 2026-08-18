# Skills

Plain markdown instruction sets. If your LLM supports skills, load them. If not, paste the
relevant file into context before working.

This folder now serves **two** jobs: the video production that produced the takes, and the
`/about-v3` implementation run that consumes them (`../IMPLEMENTATION-PLAN.md`).

## For the implementation run

Load each at the point it is needed, not upfront. Phase numbers refer to `IMPLEMENTATION-PLAN.md`.

| File | Use it for | Phase | Origin |
|---|---|---|---|
| `gsap-core.md` | Tweens, easing, duration, stagger, `gsap.matchMedia()` for responsive and reduced-motion contexts | B, C | Official GSAP skill |
| `gsap-scrolltrigger.md` | Scroll-linked animation, `scrub`, sticky/pin behaviour, `invalidateOnRefresh`, `refresh()` ordering | B, C | Official GSAP skill |
| `gsap-timeline.md` | The hero's four overlapping beats are **one** timeline with position parameters, not four triggers | B | Official GSAP skill |
| `gsap-react.md` | `useGSAP` scoping and cleanup under React 19 / Next 15. **This is the one that prevents leaked ScrollTriggers on route change** | B, C | Official GSAP skill |
| `impeccable.md` | Art direction and **the stop rule**. **Read its ADAPTER NOTE header first** — `scripts/context.mjs` and `reference/*.md` are not bundled in this copy; substitutes are listed there | D | Anthropic skill, adapted |
| `emil-design-eng.md` | Motion feel only — crossfade blur, easing discipline, stagger, reveal technique. **Read its SCOPE NOTE header first**; roughly half the file is component-level and does not transfer to a scrub | D.2 | Emil Kowalski's design-engineering philosophy, adapted |
| `gsap-performance.md` | Transform discipline, jank, and the four-`<video>`-on-one-route memory question | E | Official GSAP skill |

Also installed at `005-agency/.claude/skills/impeccable/SKILL.md` so Claude Code discovers it as a
real skill in the repo, alongside the `frontend-design` and `three-guide` that were already there.

## For video production

| File | Use it for | Origin |
|---|---|---|
| `ai-video-director.md` | Splitting an idea into a shot list and writing paired FRAME + MOTION prompts. The spine of the video planning | Custom skill; encodes the standard AI-film method (verify model specs → split shots → lock references → two prompt types per shot) |
| `higgsfield-character-sheet.md` | Building reference views for a character, only if an existing reference Element drifts | Higgsfield bundled workflow v1.0, vendor-published |

Neither is used by the implementation run — the media is already produced and encoded.

---

## Skills deliberately not included

**Character bible / continuity-lock skills.** Not needed. The consistency system for this project
is Higgsfield's own reference Elements, which are already registered — IDs in
`01-PRODUCTION-CONTEXT.md §3`. A hand-written character bible exists as a workaround for tools
that lack this. Higgsfield has it.

**Generic AI storyboard skills.** The credible open-source option is
`github.com/aicontentskills/ai-video-storyboard-skill`, which enforces a shared "Visual Theme"
layer across shots. It is built for 6–18 shot TikTok/Reels output. This section is three slow
cinematic shots, so it fights the brief rather than helping.

**Remotion.** The most-installed video skill for coding agents (126K+), but it generates motion
graphics from React code, not AI video. Wrong tool for a room with people in it.

**`web-design-pro` and `awwwards-web-design`.** Considered for the design pass and rejected.
`web-design-pro` is 2.1 KB — an audit checklist rather than a playbook. `awwwards-web-design` is
the better topical match (it names GSAP, ScrollTrigger and Lenis directly) but is disabled in the
account and not synced.

**Why `impeccable` and `emil-design-eng` are both included, and split.** They are not
competitors — they work on different axes. `impeccable` is a design *director*: visual world,
hierarchy, refinement-vs-redesign discipline, and an explicit stop rule ("build fully, inspect
once, fix in one batch, at most one more round, stop"). `emil-design-eng` is a design *engineer*:
easing, timing, crossfade craft, the invisible 10%. For a page whose entire deliverable is how
motion feels, Emil's axis is the more relevant one — his blur-to-mask-a-crossfade rule is the
named fix for this project's hardest transition. But he carries **no termination condition**, and
this is an unattended run, so `impeccable` keeps Phase D and the authority to stop. Emil gets
Phase D.2, scoped to motion only.

**`three-guide`.** Already in the repo at `.claude/skills/`, but nothing in this plan uses WebGL.
The camera lives inside the video clip, not in a scene graph — that is `JourneySequence`'s own
rule 1.

---

## Three rules that matter more than any skill

**1. Keep the identity text byte-identical across every prompt.** Changing "dark hair" to "black
hair" between shots makes the model reinterpret the face. Only the scene portion of a prompt
changes between shots. When a character drifts, add images to the reference Element — do not
rewrite the description.

**2. Frame prompts and motion prompts are different objects.** A FRAME prompt describes what it
looks like and contains no motion words. A MOTION prompt describes what happens, what moves
versus what stays still, and exactly one dominant camera move. Mixing them is the main cause of
warping and morphing.

**3. Never name something the camera cannot already see.** Every time a prompt named an off-screen
target — "the reclining chair", "the open doorway" — the model built one in front of the lens or
morphed through a wall it invented. Describe the result (seated eye height, facing her), not the
furniture. This cost three generations to learn and it applies to the page too: the hero cards
start at their measured in-frame position rather than being told to "move to" a target.
