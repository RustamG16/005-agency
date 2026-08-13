# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are owners, marketing leaders, and senior decision-makers at luxury hotels, real-estate businesses, and comparable premium brands evaluating whether a small digital studio can deliver distinctive, high-value interactive work.

## Product Purpose

Convenium Studio presents and sells the work of a two-person digital agency. The website should help qualified prospects understand the studio’s point of view, trust the people delivering the work, see evidence of design and engineering capability, and start a serious project conversation.

## Positioning

Convenium combines direct founder access with an unusually broad in-house capability: Marija owns SMM, graphic design, and client negotiations; Rustam owns design, software engineering, WebGL/3D, motion, and content generation. The people who discuss the project are the people who make it.

## Operating Context

Visitors typically compare premium studios based on taste, clarity, proof, technical confidence, and the perceived quality of collaboration. The site already separates Homepage, Services, Work, About/Studio, and Contact responsibilities; individual pages should not repeat one another’s content models.

## Capabilities and Constraints

- Existing stack: Next.js, React, TypeScript, CSS Modules, GSAP/ScrollTrigger, Lenis, and Three.js.
- Preserve the established route structure and the existing `/about` page.
- The current gated About redesign lives at `/about-v3`; `/about` and `/about-v2` remain intact as earlier routes.
- Existing colors, fonts, navigation, footer, and interaction language remain authoritative.
- New media may be generated, but it must have recorded provenance and cannot imply unverified client work.
- WebGL must remain an enhancement with mobile, reduced-motion, loading, and unsupported-device fallbacks.

## Brand Commitments

- Brand name: Convenium Studio.
- Voice: direct, editorial, confident, and specific; no generic agency hype.
- The established Archivo Black, Newsreader, and Inter typography and noir/cotton/cherry palette must remain.
- The visual world uses disciplined grids, thin rules, thresholds, vertical pacing, and the wider “going up” narrative without literal novelty elevator UI.

## Evidence on Hand

- Existing live Homepage, Services, Work, About, and Contact pages.
- Existing public project imagery and video assets.
- Locked companion, laboratory, program, Apollo, orchestration and recovery media recorded under `.olympus/about-v3/`.
- Original Rustam identity references and two generated handoff keyframes are available; the joint founder film, paired portraits and Marija evidence remain explicit production placeholders.
- No analytics baseline, testimonials, verified luxury client list, or project outcome data was supplied; future work must not fabricate them.

## Product Principles

1. Demonstrate capability rather than repeating claims.
2. Keep responsibility close and visible: founder access is part of the product.
3. Let each route do one job; do not duplicate whole sections from neighboring pages.
4. Use advanced motion and 3D only when they clarify how Convenium thinks and builds.
5. Premium quality includes mobile clarity, accessibility, and performance—not only spectacle.

## Accessibility & Inclusion

Maintain semantic content, keyboard-accessible navigation and actions, WCAG AA text contrast, readable mobile layouts, and coherent `prefers-reduced-motion` behavior with essential content outside canvas media.
