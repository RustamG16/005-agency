# Approved build plan — `/about-v3`

## Scope

- **Selected direction:** Concept 2 — Two Lenses, One Direction.
- **Visitor mode:** Persuade, supported by readable founder evidence.
- **Primary outcome:** a qualified project inquiry.
- **Primary improvement:** replace abstract About spectacle with a useful two-founder narrative showing how complementary interpretation becomes one accountable direction.
- **Route:** add `/about-v3`; preserve `/about`, `/about-v2` and every existing adjacent route.
- **Stack:** existing Next.js 15, React 19, TypeScript, CSS Modules, `next/image`, GSAP 3.15, `@gsap/react`, ScrollTrigger and Lenis. No new visual or motion dependency.
- **WebGL:** excluded.

## Authority and boundaries

- Use `.olympus/about-v3/00-brief.md`, `01-audit.md`, `04-decision.md`, this plan and `05-asset-manifest.md` as the implementation authority.
- Preserve the current header, footer, fonts, tokens, cursor/guide behavior, smooth-scroll wrapper and header-theme system.
- `PRODUCT.md` and `DESIGN.md` still contain stale `/about-v2` elevator material. Do not reuse its fictional cases, elevator sequence, gold direction or generated asset brief for `/about-v3`; do not rewrite those files unless the user separately asks.
- Preserve unrelated dirty work. In particular, do not revert or overwrite modifications under `components/sections/about/monolith/` or the untracked `/about-v2` work.
- Do not copy Symbol Studio's logo, section compositions, typography, orange palette, wording or interaction signatures.

## Page information architecture

### 01 — Dual opening: two perspectives

**Question answered:** Who will I actually work with, and why are there two viewpoints?

- Cotton field with a central live seam.
- Left: Rustam, with the concise responsibility statement “We build the system.”
- Right: Marija, with “We protect how it is understood.”
- Shared h1: “Two perspectives. One accountable direction.”
- Supporting copy: direct founder involvement, small-studio depth, Klagenfurt/international reach.
- Keep “luxury” implicit through precision and service posture; do not say “rich clients,” “overpay,” “faster with AI,” or “team of 15.”
- Opening portraits are separate `next/image` assets so art direction can change responsively.

### 02 — Origins in parallel

**Question answered:** What experience exists behind a newly formed studio?

- Two non-symmetrical timelines that share date/decision intersections.
- Rustam facts: 10+ years in software/digital production, Infineon and other verified career roles, design/engineering/motion capability, portfolio/CV link. Use 20+ shipped projects until the conflicting 50+ statement is reconciled.
- Marija facts: social/community origins, SMM, graphic design, negotiation and multilingual continuity. All dates, scale and named work remain placeholders until verified.
- Explicit provenance labels: `FOUNDER CAREER`, `INDEPENDENT WORK`, `CONVENIUM`.
- Honest transition copy: the founders bring established individual experience together under Convenium. Do not state or imply historic Convenium clients.

### 03 — Conversation showreel

**Question answered:** Can this small studio create the level of digital expression it describes?

- Near-noir full-width theatre appearing approximately 20–25% into the page.
- Diptych poster/preview that occasionally resolves full-width.
- Visible label, duration and unambiguous play control.
- Intentional playback only for the full 45–60 second reel. The 8–12 second preview may autoplay muted only when visible and reduced motion is not requested.
- Use native video semantics/controls or an accessible custom play layer; do not make the entire panel an unlabeled click target.
- Supply transcript/caption link below the player.

### 04 — How we read a brief

**Question answered:** What does “psychology-informed discovery” change in practice?

- Three clearly labelled illustrative statements, never called client quotes:
  1. “Exclusive, but not cold.”
  2. “Modern, but it still has to feel established.”
  3. “Memorable without becoming loud.”
- Each example follows a three-beat model:
  - `RUSTAM READS` — system, interaction, feasibility and how behavior creates the perception.
  - `MARIJA READS` — language, audience response, tone, context and what the client may mean beneath the adjective.
  - `WE DECIDE` — one specific shared design principle.
- Add `DEMONSTRATION — NOT CLIENT WORK` once at section level and in accessible supporting copy.
- Describe the method as structured listening and interpretation; never compare onboarding to therapy or claim professional psychological treatment.

### 05 — Language continuity

**Question answered:** Will meaning survive across languages and from conversation into implementation?

- Code-native line/map visualization; no flags.
- Live text lists who can lead or support each language. Confirm the final split before publishing.
- Proposed draft only:
  - Marija: German, English, Croatian, Italian.
  - Rustam: English, Russian, Turkish, Azerbaijani; verify German level/role against public CV.
- Explain the operating behavior: language-matched call, written summary, confirmed intent, one shared decision record.
- SVG lines are decorative; the complete role list remains semantic HTML.

### 06 — Decision duet

**Question answered:** Who owns what once the project begins?

- Five rows, each using `R / M / WE` without repeating service deliverables:
  1. Discovery — Rustam maps system constraints; Marija surfaces language/context; both confirm the real decision.
  2. Direction — Rustam shapes experience/technical logic; Marija shapes visual/content continuity; both lock the principle.
  3. Making — each founder owns their discipline; both review the shared expression.
  4. Review — Marija maintains communication clarity; Rustam translates feedback into implementable change; both document decisions.
  5. Activation — only when the agreed scope includes ongoing social/marketing; link to Services for deliverables.
- Trusted specialists may advise on bounded questions, but founder accountability and communication stay intact.

### 07 — Credibility without scale theatre

**Question answered:** What can I verify before trusting the studio?

- Three provenance columns, not logos or metric cards:
  - `FOUNDER CAREER`: verified roles, years and documents.
  - `INDEPENDENT WORK`: two selected digital pieces with contribution labels and links.
  - `CONVENIUM STANDARD`: direct access, written decisions, language continuity and honest scope.
- Link to Rustam's portfolio and CV.
- Show two to four Marija artifacts after verification.
- No testimonials, client logos, outcome statistics or employer-as-client presentation.

### 08 — Begin with one sentence

**Question answered:** What should I do next?

- The two columns converge into one noir field.
- Opening question: “What should feel different when this project is finished?”
- Compact shared inquiry form—not a second unrelated form implementation.
- Required compact fields: project sentence/message, name, email, project type and consent. Company and budget may be optional progressive fields.
- Provide inline validation, real pending/error/success states and a visible fallback email.
- The existing Contact page should continue offering the full form variant.

## Draft public copy posture

- **Tone:** calm, direct, editorial and exact.
- **Boutique claim:** “We keep the studio deliberately small so the people in the first conversation remain responsible for the final work.”
- **Discovery claim:** “We use structured conversation to uncover the motives, references and trade-offs behind the first brief.”
- **Capacity claim:** say only that the studio accepts a limited number of overlapping engagements if that operating rule is true. Do not publish a number without a real capacity policy.
- **Speed claim:** never compare the studio to a 15-person agency or promise unusually short timelines before scope.
- **AI claim:** omit from About. Do not contradict existing Services copy in this route; a separate site-wide content decision can address it later.

## Proposed component and file architecture

### New files

```text
app/(interior)/about-v3/page.tsx
content/about-v3.ts
components/sections/about-v3/TwoLensesPage.tsx
components/sections/about-v3/TwoLensesPage.module.css
components/sections/about-v3/TwoLensesMotionShell.tsx
components/sections/about-v3/ConversationReel.tsx
components/sections/about-v3/ConversationReel.module.css
components/sections/about-v3/LanguageContinuity.tsx
components/sections/about-v3/AboutInquiry.tsx
components/sections/about-v3/AboutInquiry.module.css
public/media/about-v3/...              # only approved files from the manifest
```

### Expected shared-file changes

```text
components/sections/contact/ContactForm.tsx
components/sections/contact/ContactForm.module.css
```

Preferred form refactor:

- Extract the form state/validation/submission into a reusable `ProjectInquiryForm` or make `ContactForm` accept `variant="full" | "compact"` and `initialMessage`.
- Preserve Contact's existing appearance and field order for `full`.
- About uses `compact` but sends the same payload to the same real delivery adapter.
- Do not copy/paste form validation or maintain two submission implementations.

### Files explicitly not to change

- `components/sections/about/monolith/*`
- `components/sections/about-v2/*`
- `app/(interior)/about/page.tsx`
- `app/(interior)/about-v2/page.tsx`
- global palette/font tokens unless a measured accessibility defect requires a tiny compatible addition
- Header/Footer visual structure

## Server/client boundary

- Keep `page.tsx`, content data and static editorial sections server-rendered where practical.
- Use one client `TwoLensesMotionShell` that receives server-rendered children, owns the root ref, uses scoped `useGSAP`, and creates section triggers top-to-bottom.
- `ConversationReel` and the form are client components because they own media/form state.
- Do not convert the entire route to a client component merely to animate it.
- Register plugins through the existing `components/motion/gsap.ts`; do not register duplicate GSAP instances.

## Design system decisions

### Grid and rhythm

- Desktop reference: 1440px, 12 columns, current `--space-container` inset and 8px base rhythm.
- Opening split uses 6/6 columns but the content inside each side is intentionally non-symmetrical.
- Central seam is 1px on cotton and a restrained cherry graphic mark at active intersections. It is decorative and `aria-hidden`.
- Reading measure: 32–38 characters for the large founder statements; body copy stays within existing `--measure`/approximately 55–70 characters.
- Section padding generally 96–144px desktop, 64–88px tablet and 56–72px mobile. Do not create full-screen emptiness merely to extend animation duration.
- Thin rules and proximity group information before cards/background boxes.

### Type

- Shared thesis/h1: Archivo Black, `clamp(3rem, 2rem + 4.5vw, 7rem)`, line-height roughly 0.88–0.94 after browser measurement.
- Founder statements: Archivo Black, `clamp(2.25rem, 1.45rem + 3vw, 5rem)`.
- Editorial interpretation/questions: Newsreader, `clamp(1.5rem, 1.1rem + 1.4vw, 2.6rem)`.
- Evidence/body: existing Inter/Newsreader roles and existing label scale.
- No font addition and no imitation of Symbol's Rules font.

### Color/material

- Cotton/paper dominate opening, origins, brief reading and language sections.
- Noir holds the showreel, credibility ledger and final inquiry.
- Cherry is only a seam, active dot, focus/action state or occasional field; respect existing measured token roles.
- Chili at body size on noir uses `--color-accent-on-noir`, not the lower-contrast graphic token.
- Photography may be monochrome or very low saturation, but preserve natural skin and do not crush black detail.

## Responsive contract

### ≥1100px

- Full dual-column composition and central seam.
- Showreel diptych can animate into full width.
- Brief interpretation uses a sticky visual board with adjacent changing text; maximum one bounded sticky/pin chapter.
- Language lines span both halves.

### 768–1099px

- Preserve paired reading but reduce image width and type scale.
- Origins become alternating 5/7 and 7/5 rows rather than a strict 50/50 split.
- Brief examples use normal-flow cards with active-state reveals; no pinned board if height is insufficient.
- Reframe portraits from dedicated tablet crops or `object-position`, not arbitrary center crop.

### <768px

- No hidden R/M/WE tabs. Every chapter reads sequentially: `RUSTAM` → `MARIJA` → `WE DECIDE`.
- Central seam becomes a thin left-side progress line with labelled intersections.
- Opening shows founder portraits as alternating editorial crops; the shared thesis follows both.
- Use the dedicated 9:16 showreel when supplied. Otherwise preserve 16:9 with controls—never auto-crop critical UI.
- Language visualization becomes a semantic role list; decorative paths may be omitted.
- No sticky/pinned sections, horizontal fake scrolling or pointer-dependent content.
- Tap targets minimum 44×44px and focus order follows the DOM reading sequence.

## Motion contract

All essential copy and links exist in the initial DOM. GSAP enhances hierarchy; it does not reveal otherwise inaccessible meaning.

| Interaction | Purpose | Trigger | Timing/easing | Interruptible | Reduced-motion / mobile |
|---|---|---|---|---|---|
| Opening seam arrival | Establish the shared axis | Page enter after fonts/layout stable | `scaleY` 0→1, 650ms, `power4.out` | Yes; resolves immediately on navigation | Static 1px seam; no animated draw |
| Founder portrait/statement arrival | Introduce different perspectives | Page enter | `x` ±24px + `autoAlpha`, 500–650ms, stagger 80ms | Yes, `overwrite: auto` | Immediate/short opacity only |
| Shared thesis convergence | Show two views forming one commitment | Opening exits viewport; ScrollTrigger scrub ~0.5 over a short normal-flow range | Transform child text 2–4vw toward center; `ease: none` | Scroll-controlled | Static shared thesis below portraits; no scrub |
| Origin intersections | Connect parallel career stories without false symmetry | Each verified milestone enters 75% viewport | Discrete active dot + 12px transform, 320ms, once | Yes | Normal-flow reveal; all labels visible |
| Showreel theatre reveal | Shift from story to sensory proof | Section enters 78% viewport | inner media `scale` 0.985→1 + `autoAlpha`, 500ms | Yes | Static poster and visible play control |
| Showreel preview | Demonstrate motion without hijacking | Intersection ≥0.55, page visible, no reduced motion | Native playback; pause/reset on leave | Yes | No autoplay; poster only |
| Diptych merge | Reinforce the concept inside reel poster | Short section progress or preview frames | Transform two child panels toward seam; no animated width | Scroll-controlled | Use mobile edit/full-frame poster |
| Brief interpretation active state | Make the reading sequence understandable | Desktop sticky chapter; one trigger per example in document order | State change 280–360ms; transforms/opacity only | Yes | No pin; three complete sequential examples |
| Language path draw | Show meaning passing through two people | Section enters 65% viewport | SVG dash animation 700ms, once | Yes | Paths hidden; semantic list remains |
| Decision duet rows | Establish responsibility rhythm | Rows enter 80% viewport | Batched 12px y + opacity, 300ms | Yes | Same subtle reveal or static |
| Final column merge | Resolve into one inquiry | Closing section enters | left/right child transforms to zero, 500ms | Yes | Static single-column form |
| Form validation/status | Immediate task feedback | Blur/submit/network response | CSS state ≤180ms; no decorative animation | Yes | Identical; `aria-live` status |

### GSAP implementation rules

- Use `useGSAP()` with a root scope ref and automatic cleanup.
- Wrap later event-created GSAP work with `contextSafe`.
- Create ScrollTriggers in document order and call refresh only after approved images/fonts/dynamic form expansion affect layout.
- Use `gsap.matchMedia()` or the existing responsive/reduced-motion hooks so desktop triggers are never created on mobile/reduced motion.
- Animate transforms and opacity; avoid animated width, height, top, left, margins and padding.
- Do not animate the pinned/sticky container itself—animate its children.
- Never combine `scrub` and `toggleActions` on the same trigger.
- Do not add `will-change` globally; apply it only to the few actively transformed layers.
- Do not create new timelines on every pointer/scroll update.
- Existing Lenis already calls `ScrollTrigger.update`; do not add another scroller proxy or second RAF loop.

## Video/media behavior

- `preload="metadata"` or `none` for the full showreel; load its bytes after play intent where feasible.
- Preview: muted, `playsInline`, loop, no controls, intersection-controlled and paused when the document is hidden.
- Full reel: user-initiated, controls available, sound never starts automatically.
- Reuse `useSingleActiveVideo`/similar behavior so the preview and any evidence loop cannot play simultaneously.
- Provide width/height or aspect-ratio boxes to prevent layout shift.
- `next/image` sizes must reflect the real split/grid. Give priority only to the actual LCP portrait/visual after measurement, not every opening image.
- Do not ship generated concept moodframes.

## Inquiry delivery contract

The current form simulates success with `setTimeout`; that behavior cannot be called complete.

1. Create a shared typed inquiry payload and shared validation.
2. Submit to a server-side Route Handler or Server Action so provider credentials never reach the client.
3. Choose the actual transport before implementation finishes:
   - preferred no-UI-dependency option: server-side `fetch` to a user-approved email/webhook provider;
   - alternative: an approved mail service SDK, only after user authorizes the dependency and supplies environment configuration.
4. Add basic abuse protection: honeypot, server-side length validation, rate-limit/provider protection and no sensitive logging.
5. Return structured success/error codes; do not mark success until the provider confirms delivery.
6. Provide a visible fallback `mailto:hello@convenium.studio` on network/server failure.
7. Keep privacy consent, link and data retention behavior consistent with the Privacy page.
8. Test one real delivery before Gate C.

**Open implementation prerequisite:** the user must select/provision the delivery endpoint and secret. The builder must ask rather than invent credentials, install a dependency or silently preserve simulated success.

## Accessibility contract

- One h1, then logical h2/h3 hierarchy.
- DOM reading order is Rustam → Marija → shared conclusion; CSS may position it visually but must not reorder screen-reader meaning.
- Every `RUSTAM / MARIJA / WE` label accompanies descriptive text; color and side alone never encode ownership.
- Central seam and language lines are `aria-hidden`; semantic text duplicates all meaning.
- Real founder portraits receive useful alt text once approved; atmospheric detail crops use empty alt.
- Showreel play is a button with title/duration; full video is keyboard-operable; captions/transcript are reachable.
- Any expandable compact form exposes `aria-expanded`, moves focus intentionally and announces validation/network results.
- Form errors are tied with `aria-describedby`; summary/focus first invalid field after submit.
- Maintain WCAG AA using the existing measured tokens; test actual text over media rather than assuming overlay contrast.
- Test with `prefers-reduced-motion: reduce`, keyboard only, 200% zoom and forced content wrapping.

## Performance targets and risks

- No new dependency and no Three.js/WebGL execution on this route.
- Above-fold optimized portrait payload target: ≤500KB total desktop and ≤300KB mobile where visual quality permits.
- Showreel preview target: <3MB; full showreel deferred until intent/near-view and target 8–12 Mbps rather than autoplay download at page start.
- CLS target: <0.1 through explicit media aspect ratios and stable font/layout containers.
- Avoid more than one actively playing video.
- Limit major ScrollTrigger chapters to opening convergence, brief interpretation and closing convergence; use CSS/IntersectionObserver for simple states where possible.
- Test scroll performance with the guide/cursor/grain already active; the page does not exist in isolation.

## Component states

### Showreel

- poster/idle
- preview-playing
- play-hover/focus
- loading full reel
- playing/paused
- error with descriptive fallback and transcript
- reduced-motion poster

### Media

- approved asset
- missing asset placeholder in development only
- load failure with stable background and retained copy
- mobile art-directed source

### Inquiry

- initial compact
- expanded/continued if progressive disclosure is used
- field invalid
- pending
- real success
- server/network error with retry and email fallback

No “portrait pending” card may remain in a production-ready Gate C build.

## Implementation slices

### Slice 0 — Protect the workspace

- Read current `git status` and preserve unrelated dirty files.
- Read all `.olympus/about-v3/` artifacts and the Apollo instructions.
- Confirm route remains `/about-v3`, Concept 2 is approved and media may initially use explicit development placeholders.
- Resolve the real form delivery provider before calling the build complete.

### Slice 1 — Static hierarchy and responsive shell

- Add route metadata and semantic section structure.
- Add `content/about-v3.ts` with factual/provisional labels.
- Build desktop/tablet/mobile grids with live text and placeholder aspect boxes.
- Integrate `HeaderZone` boundaries for light/noir sections.
- Verify no Services/Work/Home/Contact section is copied wholesale.

### Slice 2 — Shared inquiry and real states

- Refactor the existing Contact form into shared validation/presentation without changing Contact's design.
- Implement compact About variant and server-side delivery adapter.
- Test validation, pending, real success, provider failure and email fallback.

### Slice 3 — Approved media

- Add only rights-cleared assets from `05-asset-manifest.md`.
- Implement art-directed sources/posters and stable aspect ratios.
- Build showreel player, preview activation, captions/transcript and error state.
- Add provenance captions to founder career/independent/demonstration evidence.

### Slice 4 — Motion

- Add scoped `useGSAP` shell and create triggers top-to-bottom.
- Implement opening, intersections, brief active states, language draw and closing merge.
- Add desktop/tablet/mobile/reduced-motion branches before tuning timings.
- Verify cleanup across route navigation and no duplicate ScrollTriggers.

### Slice 5 — Verification, maximum two QA cycles

**Cycle 1 — batched discovery:**

- Build/lint/type/runtime and console check.
- Screenshots together: 1440×900, 1024×768 and 390×844.
- States together: initial, active brief example, showreel loading/play/error, form invalid/pending/success/error, keyboard focus, menu open and reduced motion.
- Check overflow, line wrapping, portrait crops, semantic order, tab order, contrast, 200% zoom, video pausing and route navigation cleanup.
- Repair every evidenced issue in one batch.

**Cycle 2 — confirmation only:**

- Re-run the same bounded responsive/runtime/accessibility checks.
- Repair only regressions introduced by Cycle 1. Stop after this cycle and report remaining limitations honestly.

- Run the Impeccable detector once after UI editing, never as an open-ended loop.
- Use the Apollo `visual-qa` skill and write `.olympus/about-v3/07-qa.md` during the implementation task.

## Definition of ready for Gate C

- `/about-v3` matches the approved Two Lenses information and interaction model.
- Existing `/about`, `/about-v2`, Contact and global chrome remain healthy.
- All public founder facts and language roles are verified.
- No placeholder portraits, fake proof or unlabelled demonstration remains.
- The showreel and form work on desktop/mobile, have accessible fallbacks and respect reduced motion.
- A real inquiry delivery has been tested.
- Browser console is clean; lint/build pass or unrelated pre-existing failures are precisely documented.
- QA evidence exists for desktop, mobile, interaction states and reduced motion, with no more than two repair/review cycles.
- User reviews the implemented page and explicitly decides Gate C.
