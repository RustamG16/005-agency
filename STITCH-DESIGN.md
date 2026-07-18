# Convenium Studio Design System

Convenium Studio is a premium European branding studio. The website is a dark, cinematic, editorial long-scroll portfolio: oversized brutalist typography, generous negative space, thin hairline rules, photographic media, and one restrained gold accent. Controlled and precise, never decorative or playful.

## Colors

- Noir `#050505` — primary background for dark sections, navigation track, footer
- Bone `#EEEDE8` — light page field, primary text on dark backgrounds
- Paper `#F8F7F2` — project card surfaces
- Ink `#171717` — secondary dark surface
- Gray `#777771` — metadata, secondary copy, category labels
- Hairline `#CAC8C0` — 1px dividers and grid rules
- Old Gold `#B18A46` — accent, used sparingly: primary CTA button, small numbered labels, one footer punctuation mark

No other accent colors. No gradients. Sections alternate between Noir and Bone backgrounds.

## Typography

- Display: Archivo Black, uppercase, line-height 0.9, tight letter-spacing. Hero headline 88px, section statements 64px, manifesto words 160px and allowed to bleed past the viewport edge, footer headline 96px
- Editorial body: Newsreader (serif), 20–24px, line-height 1.3, sentence case
- UI and labels: Inter, 12px, uppercase, letter-spacing 0.08em, used for navigation items, category labels, micro-captions like "01 / ATTENTION"
- Text on Noir is Bone; text on Bone is near-black `#050505`; secondary text is Gray

## Spacing

- Base unit: 8px; scale 8, 16, 24, 40, 48, 80, 120
- Desktop content inset: 40px; page-edge inset 16px
- Grid: 12 columns, 8px gutters
- Card grid gaps: 8px
- Reading columns max 600px
- Full-screen narrative sections are minimum 100vh
- Mobile side gutter: 16px, single column

## Components

- Primary button: bg `#B18A46`, black text, Inter 12px uppercase, height 40px, padding 0 16px, radius 8px, no shadow
- Navigation: fixed top bar; small bone wordmark left; centered black pill 480×40px radius 8px containing five segments (INDEX, WORK, SERVICES, STUDIO, CONTACT), active segment bone bg with black text, inactive transparent with bone text; right side a small circular outline button with up arrow plus the primary gold button
- Project card: bg `#F8F7F2`, radius 10px, no shadow, padding 16px; bold uppercase project name top, serif tagline below, Gray uppercase 12px category label, then large photo area with radius 8px
- Service row: thin hairline top border, small gold number, bold uppercase service name, short serif description
- Divider: 1px solid `#CAC8C0`
- Media: photographic, cinematic, 8px radius inside cards; hero and team images full-bleed with no radius and no frame
- Footer: full-viewport Noir section, huge Bone uppercase display headline, small contact links separated by hairlines

## Do

- Use large negative space and typographic scale for hierarchy
- Use thin hairlines instead of boxes or borders to group content
- Keep gold limited to three small moments per page
- Use full-bleed photography for hero and team sections
- Keep copy short and declarative

## Don't

- No gradients, glassmorphism, drop shadows, or decorative 3D icons
- No testimonial sliders, client-logo clouds, pricing cards, or dashboard widgets
- No rounded frame or card around the hero image
- No literal elevator icons or floor-button graphics
- No more than one accent color
