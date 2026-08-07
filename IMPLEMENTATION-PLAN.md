# Convenium Studio — Website Implementation Plan

## 0. Execution protocol — Claude Code (Sonnet)

This plan is executed by Claude Code. Follow this protocol before touching any phase.

### 0.1 Setup

1. Install Anthropic's `frontend-design` skill into the repo so it loads automatically: copy the skill folder from https://github.com/anthropics/skills into `.claude/skills/frontend-design/`. Its guidance governs all visual decisions in this build.
2. Read `CLAUDE.md` at the repo root (project rules), `STITCH-DESIGN.md` (design tokens), and `symbol-studio-design-audit.md` + `audit-notes.json` (measured reference values) before writing code.
3. Reference PNGs live in `assets/design/<route>/`. They are the layout spec; measured values in the audit override pixel-guessing from PNGs.

### 0.2 Session and phase discipline

- Run each build phase (§18) as its own session or clearly separated task. Start each phase in plan mode, confirm the file list to be touched, then implement.
- One phase must fully pass its verification before the next begins.
- Never rewrite a completed phase's files wholesale during a later phase; make targeted edits.

### 0.3 Verification loop (every phase)

1. `npm run build` must pass with no errors or type warnings.
2. Start the dev server; screenshot every touched route with Playwright at 1440×900 and 390×844 (full-page).
3. Compare screenshots side by side against `assets/design` references; list deviations, fix meaningful ones, and note accepted differences explicitly.
4. Check the browser console for errors on every route, including after scroll and hover interactions.
5. Only then mark the phase complete.

### 0.4 Paste-ready phase prompts

- Phase 1: "Read CLAUDE.md, IMPLEMENTATION-PLAN.md §5–6 and STITCH-DESIGN.md. Execute Phase 1 (Foundation): Next.js + TypeScript scaffold, tokens.css from STITCH-DESIGN.md, routes, shared header/mobile menu/footer, typed content files. Then run the §0.3 verification loop."
- Phase 2: "Execute Phase 2 (Static page fidelity) from IMPLEMENTATION-PLAN.md §7–11 using assets/design PNGs as layout spec and audit-notes.json for measured values. No motion yet. Verify per §0.3."
- Phase 3: "Execute Phase 3 (Video integration) from §7.1, §7.6, §8 and §17. Re-encode media per §17.1 first. Verify per §0.3 plus manual scrub check in both directions."
- Phase 4: "Execute Phase 4 (Interaction and forms) from §7.3, §11 and §13. Verify per §0.3 plus keyboard-only pass."
- Phase 5: "Execute Phase 5 (Verification) from §18 and §19 as a full audit. Produce a deviations report."

## 1. Objective

Build a production-quality, responsive Convenium Studio website from the exported Stitch screens in `assets/design`, using the three approved videos in `assets/videos` as functional media rather than decorative additions.

The Stitch PNGs are visual specifications only. They must not be sliced into webpage sections or shipped as full-page images. Layout, typography, components and responsive behavior will be recreated in code.

The finished site will include:

- `/` — Homepage
- `/works` — Selected work
- `/services` — Services
- `/about` — Simplified studio/approach page
- `/contact` — Contact

## 2. Source assets

### Design references

| Route | Desktop reference | Mobile reference |
| --- | --- | --- |
| `/` | `assets/design/homepage/End of bodyStart.png` | `assets/design/homepage/End of bodyStart-1.png` |
| `/works` | `assets/design/works/1440w default.png` | `assets/design/works/390w default.png` |
| `/services` | `assets/design/services/1440w default.png` | `assets/design/services/390w default.png` |
| `/about` | `assets/design/about/1440w default.png` | `assets/design/about/End of bodyStart.png` |
| `/contact` | `assets/design/contact/1440w default.png` | `assets/design/contact/390w default.png` |

### Video assets

| File | Primary use |
| --- | --- |
| `assets/videos/hero_video.mp4` | Homepage scroll-scrub hero |
| `assets/videos/Camera_push-in_through_columns_1080p_202607172150.mp4` | Work-card hover reveals and Works-page motion |
| `assets/videos/Creative_team_working_in_studio_202607172253.mp4` | Process/collaboration atmosphere on Homepage and simplified About page |

## 3. Required content cleanup

The exported designs reproduce Symbol Studio-specific content. The implementation must preserve the layout language but replace the identity and claims.

Remove or replace all of the following:

- `SYMBOL STUDIO` wordmarks and logos
- Symbol Studio email addresses, phone numbers and physical address
- Poland/Gliwice map, office photograph and local-time module
- Named Symbol Studio employees and portraits
- Team roster and “meet us” section
- Symbol Studio client names, testimonials and logos
- Symbol Studio project names and proprietary project imagery
- Symbol Studio service copy
- Orange accent color and Symbol-specific footer data

Do not present generated people in the studio video as Convenium employees. The video represents creative collaboration and process atmosphere only.

## 4. Brand and content system

### Brand

- Name: **Convenium Studio**
- Primary statement: **We take businesses to the level their ambition deserves.**
- Supporting idea: Convenium turns strategic clarity into identities, digital experiences and campaigns built to compete at a higher level.
- Contact email: `hello@convenium.studio` unless replaced with a confirmed address before launch.

### Core palette — SUPERSEDED

> **Do not build from this table.** It is the first-generation palette and every value in
> it has since changed. `CLAUDE.md` names `DESIGN.md` as the only source of visual values,
> with `styles/tokens.css` as its executable form. Current: noir `#1B1717`, cotton
> `#EDEBDD`, paper `#F5F3E8`, ink `#241F1F`, gray `#6E6963` (`#A8A29A` on noir), hairline
> `#D6D2C2`, cherry `#810100`, maroon `#630000`, chili `#D73B3E`, chili-300 `#E5595C`.
> Gold `#B18A46` is retired, and the three gold UI systems below went with it — see
> `DESIGN.md` → Red rule for what replaced them.

| Token | Value (retired) |
| --- | --- |
| Black | `#050505` |
| Bone | `#EEEDE8` |
| Paper | `#F8F7F2` |
| Ink | `#171717` |
| Muted gray | `#777771` |
| Hairline | `#CAC8C0` |
| Old gold | `#B18A46` |

### Typography

Use licensed files if supplied later. Initial implementation may use:

- Display: Archivo Black or another approved wide grotesk
- Editorial copy: Newsreader
- Navigation and metadata: Inter

Define the complete type scale with CSS custom properties and `clamp()` so the design transitions between the supplied 1440px and 390px references without device-specific hardcoding.

## 5. Recommended technical architecture

### Framework

- Next.js App Router
- TypeScript
- CSS Modules or scoped global component styles
- Shared design tokens in CSS custom properties
- GSAP ScrollTrigger for pinned sections and scrub coordination
- Native browser scroll as the default; avoid a smooth-scroll dependency unless testing proves it adds value without breaking accessibility

### Project structure

```text
app/
  page.tsx
  works/page.tsx
  services/page.tsx
  about/page.tsx
  contact/page.tsx
  layout.tsx
components/
  chrome/
  sections/
  media/
  motion/
  ui/
content/
  navigation.ts
  projects.ts
  services.ts
  site.ts
public/
  media/
  images/
styles/
  tokens.css
  globals.css
```

Keep navigation, project data, services and contact details in typed content files rather than duplicating them across routes.

## 6. Shared shell

### Desktop header

- Convenium text mark or simple `CS` mark at upper-left
- Fixed centered segmented navigation
- `INDEX / WORK / SERVICES / STUDIO / CONTACT`
- Active segment slides inside the black track
- Gold `START A PROJECT` action at upper-right
- Header changes contrast over dark and light sections without changing its geometry

### Mobile header

- Convenium mark left
- CTA and `MENU` right
- Full-screen menu takeover with ruled navigation rows
- Visible close action
- Body scroll locked while open
- Escape key closes the menu
- Focus is trapped inside the menu while open

### Footer

Rebuild the exported footer geometry but replace all Symbol Studio information.

Footer content:

- `TAKE IT HIGHER.`
- `hello@convenium.studio`
- Instagram, LinkedIn and Are.na placeholders only if confirmed
- Route links
- Privacy link
- Convenium Studio copyright

Do not include a physical address, telephone number or fake office details.

## 7. Homepage plan

The exported homepage supplies the editorial rhythm, but its Symbol-specific team, testimonials and client sections will be removed or rewritten.

### 7.1 Cinematic hero

Replace the exported small showreel treatment with `hero_video.mp4` as a full-viewport sticky section.

Behavior:

- `100svh` sticky viewport inside an approximately `350–450vh` scroll range
- Video is muted, inline and controlled by scroll progress
- Map scroll progress to `video.currentTime`
- Use `requestAnimationFrame` interpolation to avoid choppy direct updates
- Scrolling backward reverses the film naturally
- Do not autoplay during scrub
- Preload hero metadata immediately and begin the scrub only after duration is known
- Show a static poster until the video is ready

Copy choreography:

1. Opening: small `INDEPENDENT BRAND STUDIO`
2. Elevator establishes: restrained thesis copy
3. Character commits: large `CONVENIUM`
4. Final frame: copy clears

After the final sharp frame, two code-generated black panels close over the film like elevator doors. Do not add a dissolve to the video.

Reduced-motion mode:

- Display the approved hero poster
- Skip frame scrubbing
- Fade directly to the next content section

### 7.2 Editorial introduction

Recreate the light, split-column introduction from the design with Convenium copy. Retain the thin rules, wide whitespace and small media placement.

### 7.3 Going Up / manifesto

Create one pinned manifesto region with three scroll states:

- `01 — LOUD.`
- `02 — PRECISE.`
- `03 — UNFORGETTABLE.`

Each word arrives vertically and stops firmly. The small level indicator uses the gold accent. In reduced-motion mode, show the three words as static editorial rows.

### 7.4 Services preview

Use the exported homepage service-summary layout, reduced to five truthful capabilities:

1. Strategy
2. Brand identity
3. Digital experiences
4. Campaigns
5. Motion

Link the section to `/services`.

### 7.5 Selected work preview

Use four original fictional Convenium cases:

- VANTA — Cultural platform
- AUREL — Hospitality
- NULL/ONE — Artificial intelligence
- FERRO — Architecture

Do not use the Symbol Studio case images visible in the Stitch references.

Each card has:

- Original poster image or approved generated still
- Title, sector, scope and year
- A hover/focus media reveal using the columns video
- A visible non-hover label for mobile and keyboard users

### 7.6 Process/collaboration film

Repurpose `Creative_team_working_in_studio_202607172253.mp4` as **Inside the Process**, not Meet the Team.

Copy direction:

- Heading: `THE WORK STAYS CLOSE TO THE IDEA.`
- Body: describe Convenium's direct, collaborative studio model
- Never claim the people shown are employees
- No names, titles, roster or headcount

Playback:

- Muted and inline
- Start once when approximately 35% visible
- Play one time and hold the final frame
- Do not permanently loop
- Use an IntersectionObserver instead of tying this video to scroll progress

### 7.7 Proof without fake clients

Remove the exported client-logo and testimonial sections unless real content is supplied.

Replace them with one of these truthful modules:

- Working principles
- Process steps
- Deliverable examples
- Short capability statements

Do not fabricate awards, clients, statistics or testimonials.

### 7.8 FAQ and footer

Retain the editorial accordion structure with Convenium-specific questions, followed by the shared footer.

## 8. Works page plan

Recreate the desktop mosaic and mobile stacked layout from the supplied references, but populate it only with original Convenium case-study assets.

### Layout

- Large statement and filter row at top
- Desktop asymmetric three-column mosaic
- Mobile single-column project stream
- Project metadata aligned consistently at card edges
- Preserve large areas of light-gray canvas

### Video use

Use `Camera_push-in_through_columns_1080p_202607172150.mp4` in two places:

1. A featured motion panel near the Works-page introduction
2. Hover/focus reveal for selected project cards

Implementation:

- Desktop cards begin with a project poster
- On hover or keyboard focus, a vertical `clip-path` mask reveals video
- Reveal duration: approximately `320ms`
- Only the active card's video plays
- Pause and reset or preserve its assigned offset on exit
- Use different `object-position` and time offsets to make the shared film feel varied
- Browser caching prevents four separate downloads of the same file

Mobile behavior:

- No hover dependency
- Use IntersectionObserver so only the most visible eligible card plays
- Pause the previous card immediately
- Respect reduced-motion and data-saving preferences by keeping poster images static

## 9. Services page plan

Recreate the long editorial services layout but reduce the current nine Symbol-derived offerings to five Convenium services.

For every service:

- Large index and title
- Scope-of-work list
- Concise outcome-focused explanation
- One original image strip or process still
- Anchor navigation on desktop
- Natural stacked reading order on mobile

Services:

1. Strategy
2. Brand Identity
3. Digital Experiences
4. Campaigns
5. Motion

Do not include Webflow/Framer, 3D rendering, packaging or naming as standalone services unless the user later confirms them. They may be listed as supporting capabilities inside the five main categories.

No video is required on this route. Strong still imagery and typography will keep the page lighter and prevent the motion system from becoming repetitive.

## 10. Simplified About page

Keep the `/about` route in navigation, but do not build the long team-focused page shown in the export.

### Include

1. Short Convenium manifesto
2. Studio model: direct, independent and specialist-led
3. Three working principles
4. Five-step process
5. Short capabilities list
6. Process/collaboration video
7. Contact CTA

### Remove

- Team roster
- Employee portraits and names
- Office address and location claims
- Staff count
- Client testimonials
- “They trust us” logos
- Detailed company-history claims

The collaboration video may appear here as atmosphere, but should not be presented as documentary proof of a permanent Convenium team.

Recommended heading:

> Built close to the work.

Recommended studio-model copy:

> Convenium is an independent creative studio built around direct collaboration. Strategy, identity and digital expression stay connected from the first question to the final frame. Specialist partners are brought in when the work requires them.

This wording supports a flexible studio model without inventing a team.

## 11. Contact page plan

Preserve the exported page's generous light layout and form hierarchy, but remove every Symbol-specific person, address and map element.

### Desktop

- Availability label
- Large `ALL PROGRESS STARTS WITH A CONVERSATION` heading
- Left column: short contact statement and email
- Right column: inquiry form
- Lower section: working-hours/response-time statement or project-fit guidance
- Shared footer

### Mobile

- Heading
- Contact summary
- Form
- Project-fit guidance
- Footer

### Form fields

- Name
- Email
- Company
- Project type
- Budget range, optional
- Message
- Consent checkbox if required by the deployment jurisdiction

Initially submit to a local success state or a confirmed form service. Do not wire an email provider until the destination account is confirmed.

Remove:

- Named sales employee
- Portrait
- Phone number
- Polish address
- Google map
- Local time in Poland
- “We design in Poland” copy

## 12. Image strategy

The Stitch PNGs include Symbol Studio project and staff imagery. Those images must not ship.

Required production assets:

- Four original work covers
- Service/process stills
- Hero poster
- Columns-video poster
- Collaboration-video poster
- Optional abstract contact image

Use existing generated Convenium images where available. If any are missing, create them from the approved image prompts before implementation reaches final visual QA.

All media should have meaningful alt text. Decorative media uses an empty alt attribute.

## 13. Motion specification

| Element | Trigger | Behavior |
| --- | --- | --- |
| Header active item | Route/section | Sliding bone segment, `260ms` |
| Hero film | Scroll | Frame-accurate scrub across sticky range |
| Elevator-door transition | End of hero | Two sharp black panels close in code |
| Manifesto | Scroll | One word enters and locks per step |
| Work cards | Hover/focus | Mask reveals columns video, `320ms` |
| Collaboration film | Viewport entry | Plays once, holds final frame |
| FAQ | Click/keyboard | Height and opacity transition |
| Footer arrow | Hover/focus | Moves upward approximately `6px` |

Motion must communicate state or story. Avoid generic scroll fades on every element.

## 14. Responsive implementation

Use the supplied 1440px and 390px designs as endpoints, then verify intermediate widths.

Test at minimum:

- 390px
- 768px
- 1024px
- 1440px
- 1920px

Responsive rules:

- Switch to mobile navigation before the segmented control becomes crowded
- Convert work mosaics to a single column
- Preserve subject-safe video crops
- Replace hover-only interactions with tap or viewport behavior
- Use `svh` units for mobile full-screen sections
- Prevent oversized display typography from causing horizontal overflow

## 15. Accessibility

- Semantic headings in logical order
- Landmark elements for header, navigation, main and footer
- Visible keyboard focus
- Keyboard-operable menus, accordions and cards
- Escape-to-close mobile menu
- Focus management for route changes and overlays
- `prefers-reduced-motion` path for every animated system
- Sufficient contrast on video and image overlays
- Form labels always visible; placeholders are not labels
- Error and success messages announced to assistive technology

## 16. SEO

Create unique metadata for every route:

- Title
- Description
- Canonical URL placeholder
- Open Graph title, description and image
- Twitter card metadata

Add:

- `Organization` or `ProfessionalService` structured data using only confirmed information
- Descriptive page headings
- Crawlable service and work copy
- Sitemap and robots configuration before deployment

Do not include fabricated address, awards, reviews or staff information in structured data.

## 17. Performance and media preparation

### 17.1 Scrub-critical encoding (required, not optional)

Scroll-scrubbed video only seeks smoothly when every frame is a keyframe. A normally encoded MP4 has keyframes every 2–10 seconds, which makes `currentTime` scrubbing jump and stutter. Re-encode the hero before Phase 3:

```bash
ffmpeg -i assets/videos/hero_video.mp4 -c:v libx264 -profile:v high -crf 20 \
  -g 1 -keyint_min 1 -pix_fmt yuv420p -movflags +faststart -an \
  public/media/hero_scrub.mp4
```

- `-g 1` = all-keyframe; the file grows several times larger, so cap resolution at 1080p and consider a 720p mobile variant.
- The non-scrubbed videos (columns, team) keep normal encoding — they play, not scrub.
- Extract posters: `ffmpeg -ss <t> -i <in> -frames:v 1 -q:v 2 <poster>.jpg` for hero (first and final frame), columns and team videos.
- iOS: all videos need `muted`, `playsinline`, and no `autoplay` on the scrub hero; test scrubbing on a real mobile Safari, which throttles seeks.

### 17.2 General media preparation

Before integration:

1. Inspect video codec, dimensions, frame rate and duration.
2. Produce web-ready H.264 MP4 versions if current files are not optimized.
3. Consider WebM alternatives only if they materially reduce size without complicating delivery.
4. Extract poster images from meaningful frames.
5. Keep hero preload high; lazy-load other video.
6. Never autoplay more than one non-hero video simultaneously.
7. Pause off-screen media.
8. Avoid loading all Works-page videos before interaction.

Target outcomes:

- Stable page layout before media loads
- Responsive images with explicit dimensions
- No cumulative layout shift from cards or videos
- Reasonable mobile transfer size
- Smooth hero scrub on current desktop and mobile browsers

## 18. Build phases

### Phase 1 — Foundation

- Initialize Next.js and TypeScript
- Add font loading and design tokens
- Build route structure
- Build shared header, mobile menu and footer
- Create typed content files

### Phase 2 — Static page fidelity

- Recreate all desktop page layouts
- Add responsive rules from the mobile exports
- Replace every Symbol-specific string and asset
- Implement simplified About route
- Add original project and services media

### Phase 3 — Video integration

- Prepare posters and optimized video files
- Implement hero scrub
- Implement elevator-door transition
- Implement work-card reveals
- Implement collaboration film playback
- Add reduced-motion fallbacks

### Phase 4 — Interaction and forms

- Manifesto scroll states
- Navigation active state
- FAQ accordions
- Contact-form validation and success state
- Mobile viewport behavior for work media

### Phase 5 — Verification

- Compare all routes against 1440px references
- Compare all routes against 390px references
- Verify intermediate breakpoints
- Test keyboard navigation
- Test reduced motion
- Test video loading, scrub, hover and viewport playback
- Check browser console for errors
- Verify no Symbol Studio names, assets or contact details remain
- Run performance and accessibility audits

## 19. Acceptance criteria

The build is ready for review when:

- All five routes exist and are linked correctly
- Convenium branding is consistent throughout
- No Symbol Studio proprietary content remains
- Homepage hero scrubs smoothly in both directions
- The hero-to-manifesto transition has no video dissolve or blurred frame
- Work hover reveals play the columns film correctly
- Mobile work cards do not depend on hover
- Collaboration media is framed as process, not a fictional team
- About page contains no roster or false staffing claims
- Contact page contains no false address, person, phone or map
- Desktop and mobile layouts closely match the approved Stitch geometry
- Reduced-motion mode remains complete and understandable
- No required interaction produces console errors
- The site runs successfully on localhost

## 20. Design-quality guardrails (frontend-design skill)

These rules apply to every visual decision. They exist to prevent the generic AI-built look.

- Commit fully to the one aesthetic this site has: noir editorial, typography-led, photographic. No second aesthetic may leak in.
- Typography carries the design. Oversized Archivo Black display set tight (line-height 0.84–0.92), Newsreader for editorial voice, Inter only for small functional labels. If a section looks weak, fix the type scale and spacing before adding any decoration.
- Use only the tokens in `STITCH-DESIGN.md` / `styles/tokens.css`. Never introduce ad-hoc hexes, shadows or radii.
- Forbidden patterns: gradients, glassmorphism, colored glows, emoji as icons, decorative 3D blobs, uniform card grids with identical shadows, generic "fade-up on scroll" applied to everything, placeholder lorem ipsum.
- Negative space is a feature. When in doubt, remove elements rather than shrink them.
- Detail language: 1px hairlines, uppercase 11–13px micro-labels, numbered indices (01–05), gold used at most three times per page.
- Every motion communicates state or story (§13). If an animation could be removed without losing meaning, remove it.
- Asymmetry and scale contrast make the editorial feel: pair one oversized element with small dense metadata rather than balancing everything evenly.

### Technical guardrails

- GSAP + Next.js: register plugins once in a client component; create ScrollTriggers inside `useGSAP`/`useLayoutEffect` with proper cleanup (`ScrollTrigger.kill()`) to survive route changes and strict-mode double mounts.
- No hydration mismatches: anything reading `window`, scroll position or media state renders client-side only.
- Use `next/font` for all three families; no CDN font links.
- Videos never cause layout shift: explicit aspect-ratio containers and poster images from first paint.

## 21. Decisions required before final launch

These items do not block initial implementation but must be confirmed before publishing:

- Final email address
- Social profile URLs
- Domain and canonical URL
- Whether the four fictional projects remain fictional portfolio concepts or receive another label
- Final font licenses
- Form-delivery service
- Privacy-policy content and legal business details

