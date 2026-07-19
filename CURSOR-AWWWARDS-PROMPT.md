# Cursor Plan-Mode Prompt — Convenium Studio → Awwwards-ready

> Paste everything below the line into Cursor **Plan mode**. It is written as a direct instruction to the agent. Do not skip the "Do not touch" section.

---

You are a senior award-winning front-end designer/engineer (think Awwwards Site of the Day level). You are working inside this repository — a Next.js 15 / React 19 / GSAP portfolio site for **Convenium Studio**. Your mission this session:

1. **Audit** the current site and find everything that is holding it back.
2. **Produce a concrete, prioritized improvement plan.**
3. **Propose bold design changes** that push it further.
4. **Implement** those improvements on every page **except the homepage**, so that by the end of the session the site is genuinely ready to compete on awwwards.com.

Work in Plan mode first: explore the codebase, then output the full plan and wait for my approval **before** editing files. Do not start editing until I approve the plan.

---

## 0. North star

Make this site look and feel **as good as absolutely possible** — the standard is Awwwards **Site of the Day** (an 8.0+ average across an 18-person jury). Beauty is the priority, but it must not drop frames or break on mobile. Every decision should be defensible to a design jury.

You have **full creative freedom**. `CLAUDE.md` in this repo contains strict brand rules (fixed palette, no gradients/glassmorphism, three fonts, gold used ≤3×/page, etc.). **For this session you may override any of those rules** where you judge it makes the site meaningfully better — but for every rule you break, note it explicitly in the plan with a one-line justification, so the tradeoff is visible. Do not break rules carelessly; break them on purpose.

You may **add any dependency** (Lenis, a custom-cursor lib, view-transition helpers, Three.js/WebGL/shaders, etc.) **if** you justify the performance/craft tradeoff in the plan. Prefer lightweight, proven tools. Anything that ships to the browser must hold ~60fps on a mid-range phone.

---

## 1. Hard constraints — DO NOT TOUCH

**The homepage is frozen this session. Do not edit it. Only *propose* changes for it (see §5).**

Treat these files/dirs as read-only:

- `app/page.tsx`
- `components/sections/home/**` — includes `OpeningSequence`, `Hero`, `WorksFrame`, `Intro`, `Manifesto`, `Principles`, `ProcessFilm`, `ServicesPreview`
- `components/motion/HomepageReveals.tsx`, `components/motion/HomeReveal.tsx`, `components/motion/HomeReveal.module.css`
- `components/sections/Faq.tsx` + `Faq.module.css` (rendered only on the homepage)

The **"elevator journey"** (the pinned scroll sequence in `OpeningSequence.tsx`: doors → question → split manifesto → zoom → case showcase) is the centerpiece and must remain exactly as-is, including on any future homepage revision.

**Shared/global files** (`app/layout.tsx`, `app/fonts.ts`, `styles/tokens.css`, `styles/globals.css`, `components/chrome/**` — Header, Footer, MobileMenu, HeaderZone, HeaderThemeContext — `components/motion/gsap.ts`, `components/ui/Icons.tsx`, `content/**`) render on the homepage too. You **may** edit them, but only if the homepage's rendered output and the elevator journey remain **visually unchanged**. Verify this with a before/after screenshot of `/` at 1440×900 and 390×844. If a global change would alter the homepage, **do not apply it — move it to the homepage proposal doc (§5) instead.** Prefer *adding* new tokens/utilities over changing existing ones.

**Brand safety (still enforced):** This project was built from a reference called "Symbol Studio." No Symbol Studio content may ship — no "SYMBOL STUDIO" strings, their logo/project names/images/copy, their font, or their orange `#FE552E`. Do not fabricate clients, testimonials, awards, staff, addresses, or phone numbers. Keep all real Convenium content and copy meaning intact unless improving the writing.

---

## 2. Reference material to read first

- `assets/design/` — reference PNGs per page (`homepage/`, `works/`, `services/`, `about/`, `contact/`). These define the intended layout language. Treat them as *specs to exceed*, never as images to ship.
- `CLAUDE.md`, `DESIGN.md`, `STITCH-DESIGN.md`, `IMPLEMENTATION-PLAN.md`, `symbol-studio-design-audit.md`, `audit-notes.json` — current design system, tokens, and measured geometry.
- `styles/tokens.css` — the live design tokens (palette, fluid type scale, spacing, radii, motion timings).
- Existing screenshots in `screenshots/` for the current state.

Editable surfaces this session:

- **Pages:** `app/works`, `app/services`, `app/about`, `app/contact`, `app/privacy`
- **Sections:** `components/sections/works/**`, `components/sections/services/**`, `components/sections/about/**`, `components/sections/contact/**`, `components/sections/ProjectCard.tsx`
- **Global system** (per the §1 constraint): design tokens, motion utilities, shared chrome, page transitions.

---

## 3. What "Awwwards-ready" means (use as your grading rubric)

Awwwards juries score four weighted axes. Grade the **current** site on each (0–10), then target 8.0+ after your changes:

- **Design — 40%.** Visual craft: typography, color, imagery, layout, spacing, hierarchy, consistency. This is where most points live — spend accordingly.
- **Usability — 30%.** Speed, responsiveness, mobile, intuitive nav, no broken states. A beautiful site that janks or breaks on mobile will not place.
- **Creativity — 20%.** A specific point of view, inventive interaction, something the jury hasn't seen done this well.
- **Content — 10%.** Copy quality, relevance, and how well it fuses with the design.

Technical bar that winners clear: LCP < 2.5s, CLS < 0.1, INP low (smooth scroll + debounced/`transform`-based motion helps), ~60fps on mid-range mobile, WCAG-considered (contrast, keyboard nav, focus states, reduced-motion, screen-reader labels).

### 2026 direction to draw from (current, as of July 2026)

Pull selectively — only what fits Convenium's editorial, dark/bone, restrained identity:

- **Expressive typography as the primary design element** — oversized, confident headlines; animated/kinetic type; a strong type-scale contrast between display and body.
- **Directed, meaningful motion** — weighted **smooth scroll** (Lenis), scroll-triggered reveals/pins, staggered entrances, and **seamless page transitions** so the whole site feels like one continuous surface. Motion must serve the content, never decorate for its own sake.
- **Tactile texture** — subtle film grain / paper grain / noise done in CSS or lightweight canvas, signalling a human hand. Keep it restrained on a bone/noir palette.
- **Custom cursor & micro-interactions** — magnetic buttons, hover states, link underlines, cursor context changes — as functional feedback, not gimmicks.
- **Flexible / editorial grids** — asymmetry, generous negative space, modular blocks, intentional overlap. Break the boxy admin-panel feel.
- **Optional depth/3D or WebGL** — only if it earns its weight in craft and stays performant; not required.

---

## 4. Deliverables & phases (Plan mode → then execute)

### Phase A — Audit (write to `docs/awwwards/AUDIT.md`)
- Per-page (`/works`, `/services`, `/about`, `/contact`, `/privacy`) plus global chrome: score each on the 40/30/20/10 rubric with a one-line reason per axis.
- List concrete defects with file references: weak hierarchy, timid type, dead space, inconsistent spacing/tokens, flat/undesigned sections, missing motion, mobile breakage, a11y gaps, console errors, layout shift, slow assets.
- Note anything that makes the site read as "template" rather than "art-directed."

### Phase B — Improvement plan (write to `docs/awwwards/PLAN.md`)
- A prioritized, per-page task list mapped to the rubric, highest-impact first.
- A **global design-system pass**: refine/extend type scale, spacing rhythm, motion language, cursor, transitions, grain — as additive tokens/utilities where possible.
- For each new dependency: name it, why, size, and the perf tradeoff.
- For each `CLAUDE.md` rule you intend to override: the rule, the change, the one-line justification.

### Phase C — Homepage proposal, NO EDITS (write to `docs/awwwards/HOMEPAGE-PROPOSAL.md`)
- Propose how the homepage should evolve to match the new award-level system (type, sections around the elevator journey, transitions, cursor, grain, mobile).
- Keep the elevator journey intact in every proposal. **Do not implement any of this** — it is a spec for a later session.

### Phase D — Implementation (after I approve the plan)
- Execute Phase B across all editable pages and the global system.
- Keep components small and focused; follow existing patterns (CSS Modules, `next/font`, the `gsap.ts` wrapper, `content/**` for copy).
- Respect the frozen homepage and the shared-file rule in §1 at every step.

---

## 5. Definition of done (verify before declaring complete)

- `npm run build` passes clean (no type/lint/build errors).
- Every edited page reviewed at **1440×900** and **390×844**; compare against `assets/design/` and your new direction. List any deviations — don't silently accept them.
- **Homepage unchanged:** screenshot `/` before and after your work at both sizes and confirm the elevator journey and layout are pixel-stable. If not, revert the offending shared change.
- No console errors on load, after scroll, and after hover, on every edited page.
- Motion holds ~60fps; reduced-motion path still works; keyboard focus visible; contrast passes.
- No forbidden Symbol Studio content anywhere (grep for `SYMBOL STUDIO`, `#FE552E`).
- `docs/awwwards/AUDIT.md`, `PLAN.md`, and `HOMEPAGE-PROPOSAL.md` all present and current.

---

## 6. How to work

Start in Plan mode. Explore the repo, read the reference material in §2, then present **Phase A + B + C** as your plan and **stop for my approval**. Ask me any blocking questions before, not after. Only begin Phase D once I approve. Show your rubric scores (before → target) so we can both see the site climbing toward Site of the Day.

---

### Research sources baked into this brief (July 2026)

- Awwwards evaluation system — Design 40 / Usability 30 / Creativity 20 / Content 10; 18-juror scoring, 8.0+ for SOTD: https://www.awwwards.com/about-evaluation/
- Awwwards Sites of the Day (current inspiration feed): https://www.awwwards.com/websites/sites_of_the_day/
- 2026 trends — expressive typography, motion identity, interactive 3D, flexible grids: https://reallygooddesigns.com/web-design-trends-2026/ and https://www.figma.com/resource-library/web-design-trends/
- Smooth scroll (Lenis) reduces INP / Core Web Vitals; ~60fps craft bar: https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap and https://www.hontran.dev/blog/best-award-winning-websites-2026
- Texture/grain, custom cursors, page transitions, dark-mode-first: https://uxpilot.ai/blogs/web-design-trends-2026
