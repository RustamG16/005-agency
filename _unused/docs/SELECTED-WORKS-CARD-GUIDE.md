# Selected Works — Card Content Guide

How to produce and wire the content that plays **inside the gallery frame** for each
project in the homepage works showcase. Pairs with `MEDIA-GUIDE.md` (world, palette,
Google Flow) and `HOMEPAGE-FIX-GUIDE.md` (the showcase build).

## The model

The gallery frame is a **window**. As the user scrolls the pinned showcase, each
project takes the frame in turn:

- **Inside the frame:** a short **seamless loop** of that project's imagery — a
  preview of the work plus a few of its elements (screens, marks, spreads, UI).
- **On the right bone wall:** that project's text — index, name, sector/scope, year,
  outcome (already in `content/projects.ts`).
- **On hover** (desktop, when the project is active): the loop reacts — see Hover.

Four projects, already defined: **VANTA** (cultural platform), **AUREL**
(hospitality), **NULL/ONE** (AI), **FERRO** (architecture).

## What each project needs

Per project, generate **one seamless loop** made of 4–6 frames/beats, portrait to fit
the frame opening (**4:5**, ~1080×1350). The loop should read as "a glimpse of the
project," not a slideshow of unrelated images:

1. **Hero preview** — the signature artifact (a poster, a home screen, a brand lockup
   in context).
2. **2–3 element beats** — close-ups that show the *system*: type specimen, a UI
   component, a color/material chip, a spread, a motion still.
3. **A context beat** — the work in the world (in-situ signage, a device, a page).

Plus **one navigation GIF/clip** per project: a short screen-style walkthrough
implying you're moving through the product/brand (scroll of a page, a menu opening, a
prototype tap-through). Portrait 4:5 or the product's native ratio, 3–5s, seamless.

Everything obeys `MEDIA-GUIDE.md`: muted grade, palette only, one gold accent max,
**no Convenium/real-client logos, no fabricated awards or names** — these are the
four fictional cases; keep them abstract and system-y, not impersonating a real brand
(see `CLAUDE.md` hard rules).

## Google Flow / image prompts (adapt per project)

Use image generation for the still loop frames and a short Flow clip for the nav GIF.
Seed with `public/images/still-columns-*.jpg` for mood. Base template:

> *"[PROJECT SUBJECT], presented as a minimalist design-studio case: [artifact], muted
> desaturated palette of noir, bone and warm gray with a single thin gold accent,
> soft studio lighting, shallow depth of field, editorial, no text, no logos."*

- **VANTA — cultural platform / brand system:** posters and an identity system for a
  cultural venue; wordmark grid, event poster, signage mock, app tile. *Subject:*
  "a bold cultural-venue identity system — poster wall, monolithic wordmark, ticket/app tile."
- **AUREL — hospitality identity + campaign:** a refined hotel/resort brand; menu, key
  card, wayfinding, a campaign still. *Subject:* "a quiet luxury hospitality brand —
  embossed key card, wayfinding, campaign photograph in bone and bronze."
- **NULL/ONE — AI, strategy + digital:** a restrained AI product; dashboard, data
  motif, a product screen made human. *Subject:* "a calm AI product interface — muted
  dashboard, abstract data lines, a single gold node, on near-black."
- **FERRO — architecture, naming + identity:** an architecture studio; monogram cast in
  metal, a spread, a building plaque. *Subject:* "an architecture-studio identity —
  cast bronze monogram, technical drawing spread, engraved plaque, concrete texture."

**Nav GIF prompt template:** *"Screen-capture-style walkthrough of the [PROJECT] —
slow scroll/tap through [a page / a prototype], muted palette, one gold accent,
seamless loop, no cursor jitter, no text overlays."*

## File naming & placement

Save under `public/works/<slug>/`:

```
public/works/vanta/loop-1.jpg … loop-5.jpg      (4:5 stills, in loop order)
public/works/vanta/nav.mp4                       (nav walkthrough, seamless)
public/works/vanta/poster.jpg                    (single fallback still — static/RM/mobile)
```

…and the same for `aurel/`, `null-one/`, `ferro/`.

## Wire it into `content/projects.ts`

Extend the `Project` type so the showcase can read the loop + nav per project (Cursor
does this in the Phase-1 build):

```ts
export type Project = {
  // …existing fields…
  loop: string[];     // e.g. ["/works/vanta/loop-1.jpg", …] — frame order
  nav?: string;       // e.g. "/works/vanta/nav.mp4"
  poster: string;     // static fallback (reuse existing field)
};
```

## Loop + hover behavior (for the Phase-1 build)

- **Idle loop:** while a project is active in the frame, cross-fade through its `loop`
  frames at ~1.2–1.6s each, seamless (last→first). Respect `prefers-reduced-motion`:
  show `poster` only, no cycling.
- **Hover (desktop, active project):** on frame hover, either (a) speed the loop up
  (~0.6s/frame) and swap in the `nav` clip, or (b) slide a one-line element label over
  the frame. Pick one and keep it consistent across all four. Pointer leaves → return
  to idle loop. Touch/mobile: no hover; the static `poster` (or a single autoplay
  `nav`) is fine.
- **Scroll swap:** moving to the next project cross-fades the frame contents and
  updates the right-wall text; never two projects' loops visible at once.

## Acceptance

- Each project shows a seamless in-frame loop + right-wall text; no logos/awards/fake
  names; palette + gold rules hold.
- Hover reacts consistently on all four; reduced-motion shows static posters.
- Loops are truly seamless (no black flash at wrap). `npm run build` clean.
