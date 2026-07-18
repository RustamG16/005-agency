# Cursor Prompt — Extend the Symbol Studio audit to all pages

Paste everything between the lines into Cursor (Agent mode, repo root = this folder).

---

The repo already contains a working Puppeteer audit of https://www.symbolstudio.pl/en/ (homepage only): `scripts/audit-symbolstudio.mjs`, results in `audit-notes.json`, screenshots in `audit-shots/`, human-readable findings in `symbol-studio-design-audit.md`.

Extend the audit to the three remaining pages:

- https://www.symbolstudio.pl/en/services
- https://www.symbolstudio.pl/en/works
- https://www.symbolstudio.pl/en/contact

Requirements:

1. Generalize `scripts/audit-symbolstudio.mjs` to accept a list of URLs and a page slug, writing per-page outputs: `audit-notes-<slug>.json` and screenshots to `audit-shots/<slug>/`.
2. For each page, at desktop 1440×900 and mobile 390×844, capture:
   - FULL-PAGE screenshot (not just viewport) — `fullPage: true` — plus first-viewport screenshot.
   - Section map: for each top-level section, offsetTop, height, background color, layout type (grid/flex, column count).
   - Computed styles for: nav, headings h1–h4, body text, buttons/CTAs, cards/list rows, dividers — font-family, size, weight, line-height, letter-spacing, text-transform, color, background, border-radius, padding, gap.
   - Color frequency table and fonts list (same as the existing script).
   - All link/button labels and their geometry.
3. On the works page additionally capture every project card: size, radius, image aspect ratio, title/tagline/category typography, and grid gaps.
4. On the services page capture the service list structure: row heights, numbering style, column split.
5. On the contact page capture form fields (if any), input styling, and footer structure.
6. Hover states: using CDP `Input.dispatchMouseEvent`, hover nav items, CTAs and one project card; screenshot before/after and diff the computed styles. Note that this site is Framer-built and hover may be JS-driven, so screenshots are the source of truth.
7. Scroll capture: scroll each page in ~10 steps at desktop width, screenshotting each step to `audit-shots/<slug>/scroll-XX.png`, so scroll-linked animations (pinned sections, oversized type reveals) are documented frame by frame.
8. Wait for network idle + 2s before measuring; dismiss the cookie banner first if a reject button is findable.
9. Do not download fonts, videos, or site source beyond what the rendered DOM exposes. Keep the ~15 minute total cap from the existing script.
10. After the run, append a "Subpages" section to `symbol-studio-design-audit.md` summarizing per page: section order, layout grid, distinctive components, and anything reusable as a structural pattern.

If `refs/` contains SingleFile HTML snapshots of these pages, use them as an additional source for exact markup structure and CSS values, but treat live measurements as canonical.

Constraint for later build phases: we replicate layout rhythm, spacing, and component structure only. Do not reuse Symbol Studio's copy, logo, images, project content, the Rules font, or Framer code — our own brand (Convenium Studio), assets, copy, and clean hand-written code.

---
