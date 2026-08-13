# Evidence audit

## Scope and evidence

- Routes/states inspected: Local `/contact`; default form; empty-submit validation state; local `/api/inquiry` delivery path; supplied Symbol Studio contact reference at desktop and mobile.
- Breakpoints: 1440 × 1000 desktop and 390 × 844 mobile for the target; representative desktop and mobile states for the reference.
- Evidence locations: `evidence/contact-before-desktop-1440.png`, `evidence/contact-before-mobile-390-settled.png`, `evidence/contact-before-mobile-390-form.png`, `evidence/contact-before-mobile-390-errors.png`, `evidence/reference-symbolstudio-desktop.png`, `evidence/reference-symbolstudio-mobile-settled.png`, target source under `app/(interior)/contact/`, `components/sections/contact/`, `content/contact.ts`, and `app/api/inquiry/route.ts`.
- Analytics available: None supplied or connected. No baseline conversion, abandonment, lead-quality, or device-share data is available.
- Limits of this audit: No production analytics, real lead interviews, form-provider access, confirmed contact owner, response-time SLA, or verified asset-rights record. Browser checks used the local development build. The existing dirty worktree was preserved.

## Current experience in one sentence

A visually confident, on-brand inquiry page with sound form mechanics, but it does not frame a free consultation, cannot currently deliver a submission, and creates material mobile conversion friction.

## Highest-leverage findings

| Priority | Observation | Evidence | User/business effect | Severity | Confidence |
|---|---|---|---|---|---|
| 1 | **Observed:** Online inquiry delivery is not configured. | A valid local POST to `/api/inquiry` returned HTTP 503. `app/api/inquiry/route.ts` deliberately returns `DELIVERY_NOT_CONFIGURED` after validation. | The primary conversion action cannot succeed; qualified leads must notice and use the fallback email instead. | Critical | High |
| 2 | **Observed:** The page does not communicate the requested free consultation offer. | The hero says “All progress starts with a conversation” and “Currently booking projects starting Q4 2026”; neither the hero nor form explains that the first consultation is free, what it includes, or what the visitor receives. | Premium prospects cannot quickly understand the offer’s value or why submitting now is worthwhile. | High | High |
| 3 | **Observed:** The mobile hero clips its most important word and creates horizontal overflow. | At 390 × 844, the 343 px-wide `h1` has 445 px of scrollable content and the document reaches 461 px; “CONVERSATION” is visibly cut off in `contact-before-mobile-390-settled.png`. | The main message becomes incomplete on a representative phone width, weakening comprehension and perceived craft. | High | High |
| 4 | **Observed:** The persistent guide overlaps the mobile submit CTA. | At scroll position 1099, the 170 × 170 guide button intersects the `Send inquiry` button by approximately 1,364 px² and has active pointer events; see `contact-before-mobile-390-form.png`. | Part of the primary action is visually and interactively obstructed at the point of conversion. | High | High |
| 5 | **Observed + inferred:** The form qualifies before it earns commitment. | Before submission, visitors face seven visible inputs/decisions: name, email, company, project type, budget, message, and consent. The page provides no consultation agenda, duration, no-cost reassurance, or proof immediately beside them. | Some qualification is useful for premium leads, but the present sequence likely increases abandonment before value is established. This requires analytics validation. | Medium | Medium |

## What already works

- The existing cotton, noir, cherry, display sans, editorial serif, and UI sans system feels distinctive and should be preserved.
- Desktop establishes a clear headline, direct email fallback, and balanced two-column form composition.
- Form fields have programmatic labels, visible focus treatment, client-side validation, `aria-invalid`/descriptions, error announcement, first-error focus, consent, a privacy link, and a honeypot.
- Empty submission correctly identifies five required items and moves focus to the name field.
- The mobile form collapses into a readable single column, and the page produced no browser console warnings or errors during the audit.
- Existing direct email and privacy routes give the redesign a usable fallback and compliance foundation.

## Reference principles worth transferring

| Principle | Why it works | How to transform it for this brand | Copying risk |
|---|---|---|---|
| Lead with availability and a concrete invitation | A compact status signal reduces uncertainty before the main message. | Pair current availability with “Free consultation” and an honest response-time promise, using Convenium’s cherry/cotton tokens. | Do not reproduce the reference chip, turquoise dot, wording, or placement exactly. |
| Give the invitation one dominant focal point | The large, plain-language hero makes the purpose of the page immediately scannable. | Use Convenium’s display face and brand voice to state the consultation outcome, not the reference headline. | Avoid the exact centered composition and “progress/talk” language. |
| Sequence reassurance before the form | Short explanatory copy answers why to make contact before asking for effort. | Explain the free consultation’s scope, who it is for, and what happens after submission in concise editorial copy. | Do not reuse branding/rebranding-specific claims from Symbol Studio. |
| Pair a human contact path with the form | A named person, role, phone, and email make the interaction feel accountable. | If real details are supplied, identify the consultation owner; otherwise use a truthful studio-level response promise and email fallback. | Do not invent a person, portrait, phone number, or response SLA. |
| Keep input presentation quiet and linear | Underlined fields and generous spacing reduce visual noise and keep attention on completion. | Preserve accessible labels and errors while simplifying the field sequence and using Convenium’s existing form tokens. | Do not duplicate exact field order, line weights, or CTA geometry. |

## Design problem to solve

Create an unmistakably Convenium contact experience that offers a free consultation to premium-brand decision-makers, earns trust before requesting qualification data, remains complete and unobstructed on mobile, and reliably delivers every valid inquiry with an accessible fallback.

## Missing inputs and media before concept or generation decisions

- Confirm the real form transport/destination (email provider, CRM, webhook, or another approved server-side service).
- Provide the exact consultation promise: duration, format, topics covered, deliverable/outcome, eligibility, and genuine response time.
- If a human-led trust direction is desired, provide the real contact person’s name, role, approved portrait, phone/email, and usage rights.
- Provide any approved proof that may sit near the form: premium-sector client logos, a testimonial, quantified result, or a relevant case-study link with rights/permission.
- Existing logo/stripe PNGs are sufficient for concept work. No new media should be generated or purchased before Gate B and an approved asset manifest.
