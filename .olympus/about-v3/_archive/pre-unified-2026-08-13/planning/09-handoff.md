# Implementation handoff — About V3

## Outcome

- **Selected concept:** Concept 2 — Two Lenses, One Direction.
- **Implemented scope:** semantic and responsive `/about-v3` route, Concept 2 component system, scoped GSAP choreography, code-native development placeholders, shared full/compact inquiry validation/presentation, and an honest unconfigured server submission boundary.
- **Primary design improvement:** a useful, media-rich founder narrative where Rustam and Marija's complementary readings repeatedly converge into one accountable project direction.
- **Target route:** `/about-v3`.
- **Gate status:** Gate A and Gate B approved; Gate C remains pending until implementation and bounded QA are complete.

## User-directed reference fidelity update — 2026-08-10

- Compared the live `/about-v3` implementation directly with `Codex Image 10 Aug 2026, 10_55_14.png`, which matches the selected Concept 2 moodframe.
- Reworked the opening, conversation reel, three-column brief strip, language convergence and closing field to match the reference’s composition, density and visual posture more closely.
- Preserved the approved factual copy, full page information architecture, Convenium header/footer, code-native placeholder boundary and existing motion/form architecture.
- Did not copy the reference’s generated people or unapproved microcopy.
- Current evidence: `.olympus/about-v3/evidence/fidelity-desktop-opening.png`, `fidelity-reel-band.png`, `fidelity-brief-language.png`, `fidelity-closing.png`, and `fidelity-mobile-opening.png`.
- Final production build passes at 2.95 kB route / 162 kB first-load JS. Fresh browser console has no warning/error entries. Mobile scroll width equals client width.
- Gate C remains pending because real inquiry delivery, approved portraits/showreel, verified Marija facts/languages and publishable proof are still missing.

## User-directed reel media update — 2026-08-10

- Replaced the abstract conversation-reel frames with existing workspace images from `public/works/sr-urologie`, `education4students`, `sonnwerk` and `meridian`.
- Preserved the reference's eight-frame rhythm and central mirrored diptych; subtle labels identify the unique work previews without claiming historic Convenium clients.
- Used `next/image` with stable fill boxes, responsive `sizes`, restrained monochrome grading and mobile two-column crops.
- Desktop and mobile evidence: `.olympus/about-v3/evidence/fidelity-reel-images-desktop.png` and `fidelity-reel-images-mobile.png`.
- Mobile confirmation: eight of eight images decoded, zero horizontal overflow and no console warnings/errors.
- Updated `next.config.ts` so production builds use `.next` while development keeps `.next-dev`, preventing `next build` from corrupting the live development cache shown in the supplied runtime-error screenshot. The currently running dev server still needs one restart to clear its already-stale process state.
- A11–A13 remain open for the final motion reel, poster, mobile edit and transcript.

## Implementation update — 2026-08-10

### Actual files

```text
app/(interior)/about-v3/page.tsx
app/api/inquiry/route.ts
content/about-v3.ts
components/sections/about-v3/AboutInquiry.module.css
components/sections/about-v3/AboutInquiry.tsx
components/sections/about-v3/ConversationReel.module.css
components/sections/about-v3/ConversationReel.tsx
components/sections/about-v3/LanguageContinuity.tsx
components/sections/about-v3/TwoLensesMotionShell.tsx
components/sections/about-v3/TwoLensesPage.module.css
components/sections/about-v3/TwoLensesPage.tsx
components/sections/contact/ContactForm.module.css
components/sections/contact/ContactForm.tsx
components/sections/contact/inquiry.ts
.olympus/about-v3/07-qa.md
.olympus/about-v3/evidence/implementation-*.png
.olympus/about-v3/evidence/contact-shared-form-desktop-cycle2.png
```

### Evidence and boundary

- Production `next build` passes; `/about-v3` is statically generated at 3.02 kB route size and 157 kB first-load JS.
- TypeScript, targeted ESLint and the one-time Impeccable detector pass.
- Production screenshots cover 1440×900, 1024×768 and 390×844, desktop chapter states, mobile menu, invalid/provider-error form states and shared Contact form state.
- Fresh production console is clean; full results and the two-cycle record are in `.olympus/about-v3/07-qa.md`.
- The route is implemented but not release-ready: three explicit media placeholders remain, founder facts/language roles are incomplete, and the inquiry route deliberately returns `DELIVERY_NOT_CONFIGURED` until a real endpoint is approved.
- No analytics, external provider, generated media, dependency or WebGL was added. Previous About implementations and monolith files were not changed.

## Source of truth, in reading order

The implementation agent must read each file completely before editing:

1. Apollo system instructions:
   - `D:/Analyst_Designer/Apollo/START-HERE.md`
   - `D:/Analyst_Designer/Apollo/AGENTS.md`
   - `D:/Analyst_Designer/Apollo/ARCHITECTURE.md`
2. Project artifacts:
   - `.olympus/about-v3/run.json`
   - `.olympus/about-v3/00-brief.md`
   - `.olympus/about-v3/01-audit.md`
   - `.olympus/about-v3/02-concepts.md`
   - `.olympus/about-v3/03-critique.md`
   - `.olympus/about-v3/04-decision.md`
   - `.olympus/about-v3/05-asset-manifest.md`
   - `.olympus/about-v3/media_guide.md`
   - `.olympus/about-v3/06-build-plan.md`
   - `.olympus/about-v3/08-metrics.md`
   - this handoff

The selected moodframe is:

- `.olympus/about-v3/concept-visuals/concept-2-two-lenses.png`

It communicates composition and density only. Its anonymous people, microcopy and fine UI details are not factual implementation content.

## Non-negotiables

- Add a separate `/about-v3`; do not replace or reuse `/about` or `/about-v2`.
- Do not edit/revert unrelated dirty work, especially `components/sections/about/monolith/*` and the untracked About V2 work.
- Preserve Convenium's existing header, footer, navigation behavior, Archivo Black / Newsreader / Inter, noir / cotton / cherry tokens and current framework.
- Do not copy Symbol Studio's expression.
- No WebGL, decorative monolith, new UI dependency or public AI-first story.
- Do not duplicate whole Services, Work, Homepage, FAQ or Contact content models.
- Do not invent Convenium clients, testimonials, outcomes, language proficiency, Marija history or project counts.
- Clearly distinguish `FOUNDER CAREER`, `INDEPENDENT WORK`, `CONVENIUM DEMONSTRATION` and `CONVENIUM STANDARD`.
- The full showreel and generated media may use placeholders during initial static build, but Gate C cannot be requested while “portrait pending” or unlabelled fictional proof remains.
- Maximum two QA repair/review cycles.

## Implementation sequence

1. Protect the dirty workspace and inspect the relevant existing chrome/form/motion conventions.
2. Build the semantic static route and responsive hierarchy from `06-build-plan.md` with explicit development placeholders.
3. Refactor the inquiry form into a shared full/compact implementation without visually regressing Contact.
4. Ask the user to select/provision the real inquiry delivery endpoint before implementing external submission. Do not install a provider dependency or invent credentials without approval.
5. Add only approved, rights-cleared assets from `05-asset-manifest.md`; follow `media_guide.md` for missing media.
6. Add scoped GSAP/ScrollTrigger motion with mobile and reduced-motion branches.
7. If an analytics provider is approved, wire only the minimal provider-neutral contract in `08-metrics.md`; otherwise leave a typed no-op adapter and do not install tracking.
8. Run desktop/mobile/state/reduced-motion/runtime/accessibility QA in one batched cycle, repair once, confirm once, then stop.
9. Write `.olympus/about-v3/07-qa.md`, update this handoff with actual changed files/evidence, and request Gate C.

## Inputs still required from the user

- Real high-resolution identity references for both founders and consent to use them in Google tools/publication.
- Two clean scroll-animated website recordings and their publication rights/contribution labels.
- Two to four real Marija graphic/social artifacts, or approval to create clearly labelled Convenium demonstrations.
- Verified Marija biography, dates, role boundaries and professional language coverage.
- Reconciled Rustam project count; use the publicly supported 20+ figure until verified otherwise.
- Approved form delivery provider/endpoint and environment configuration.
- Optional analytics provider/consent decision.

## Assets and rights

- **Asset manifest:** `.olympus/about-v3/05-asset-manifest.md`
- **Generation/shooting/showreel guide:** `.olympus/about-v3/media_guide.md`
- **New generated media in this planning task:** three concept moodframes only. They are planning artifacts and cannot ship.
- **Existing public assets:** project covers/loops may be used after project-specific publication rights are confirmed.
- **Existing team assets:** `public/images/team/*.jpg` are placeholders and not implementation-ready.
- **Existing Rustam set:** `design_claude/me/` is a provisional source only after identity/provenance approval.

## Quality and limitations

- **Accessibility:** implementation contract includes semantic DOM order, keyboard-operable media/form, captions/transcript, live errors/status, visible focus, contrast and reduced-motion behavior.
- **Performance/runtime:** no WebGL/new visual dependency; one active video; deferred full reel; optimized portraits; transforms/opacity only for major motion.
- **Known limitations:** final media and verified Marija content/language roles remain missing; the real form transport and confirmed delivery remain blocked on user input; analytics remains unauthorized; Cycle 2 records 11px mobile heading overflow, a Contact full-form composition regression and visual reduced-motion/200% zoom evidence gaps.
- **Stale context warning:** root `PRODUCT.md`/`DESIGN.md` describe an older `/about-v2` elevator direction. Do not apply that design to `/about-v3`; do not repair those files as a side effect.

## Measurement

- **Metrics plan:** `.olympus/about-v3/08-metrics.md`
- **Instrumentation status:** not implemented; no provider authorized.
- **Primary future measure:** confirmed inquiry submissions from `/about-v3`, interpreted with manual inquiry quality rather than raw conversion alone.

## Gate C

- **Status:** pending external inputs and user review; implementation and two-cycle QA are recorded, but release blockers remain
- **User decision:** requested after the remaining inputs are supplied or explicitly accepted
- **Date:** —

## Copy/paste prompt for the new Codex window

```text
Implement the approved Convenium Studio `/about-v3` design in:

C:\Users\Rustam Gurbanov\Desktop\DigitalAgency_Saas\lab\005-agency

Use `D:\Analyst_Designer\Apollo` as read-only operating context. Read `START-HERE.md`, `AGENTS.md`, and `ARCHITECTURE.md` completely before acting. Then read every file under `.olympus/about-v3/`, especially `04-decision.md`, `05-asset-manifest.md`, `media_guide.md`, `06-build-plan.md`, and `09-handoff.md`.

Gate A and Gate B are already approved. The selected concept is Concept 2 — Two Lenses, One Direction. Implement a separate `/about-v3` page. Do not reuse or modify the previous `/about` or `/about-v2` designs, content, monoliths, or WebGL. Preserve unrelated dirty work and the existing Convenium header, footer, typography, palette, Next.js/React/CSS Modules conventions, GSAP/ScrollTrigger/Lenis motion system, mobile behavior, accessibility and reduced-motion support.

Follow `06-build-plan.md` exactly for information architecture, responsive behavior, component boundaries, form sharing, motion, performance and the two-cycle QA ceiling. Use the selected concept moodframe only for hierarchy and visual posture; its generated people and microcopy are not factual assets.

Start by checking the workspace status and building the semantic static hierarchy with explicit development placeholders. Do not install dependencies, generate/purchase external media, configure analytics, or select an external form provider without asking me first. The current Contact form simulates success; before calling the implementation complete, ask me for the real delivery endpoint and test one confirmed delivery. Do not fabricate clients, outcomes, Marija facts, languages or metrics.

After implementation, use the Apollo visual QA workflow, limit repair/review to two cycles, write `.olympus/about-v3/07-qa.md`, update `09-handoff.md` with actual files/evidence, and stop for Gate C approval.
```
