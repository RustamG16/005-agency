# CONVENIUM STUDIO — Stitch Prompt Playbook

**Do not paste the narrative DESIGN.md or the Flow media guide into Stitch.** Stitch omits components in prompts past ~5,000 characters, can't parse tables, and "do not" lists backfire in prompts (they're fine inside the design-system file). This playbook is the Stitch-facing version of the project.

## Rules

1. Keep every prompt under ~1,000 characters. Plain language, no markdown.
2. Scope every refinement: start with "Only change X, keep everything else the same."
3. Say what you WANT in prompts; constraints live in STITCH-DESIGN.md's Don't section.
4. Use UI keywords: "navigation bar", "hero section", "card grid", "footer".
5. Attach a reference image in the same prompt that uses it, and name it.
6. Free tweaks: text, colors and spacing in the visual editor — no generation spent.
7. Duplicate the project after every good step. Stitch has no version history.
8. If a combined prompt breaks the layout, restore the duplicate and switch to the granular fallback steps for that section only.

## Setup — "Create project" dialog

- **DESIGN.md slot:** upload `STITCH-DESIGN.md` (Stitch-format design system: colors, type, components). Never the narrative `DESIGN.md` or `GOOGLE-FLOW-MEDIA-GUIDE.md`.
- **Code / images / fonts slot:** upload the hero desert screenshot.
- **Add a site:** `https://www.symbolstudio.pl/en/` — structural reference only.
- **Additional instructions:** paste Prompt 1 below.
- After editing STITCH-DESIGN.md, re-import it (Settings → Design System); Stitch doesn't auto-refresh it.

---

## FAST TRACK — 6 prompts total

### PROMPT 1 — Full page structure (in the project dialog)

> A cinematic long-scroll desktop homepage for Convenium Studio, a premium European branding studio, following the uploaded design system. Use the attached desert photo as the full-bleed hero background. Sections in this order: full-viewport photographic hero; a pure black full-screen statement section reading only "GOING UP."; a manifesto section of three stacked oversized words LOUD. PRECISE. UNFORGETTABLE.; a selected-work grid of four large project cards; a numbered two-column services list; a full-width team photo section; an oversized typographic contact footer. Structure similar to the referenced site, but with this darker editorial identity.

Check the result: section order, dark/bone alternation. Fix wording in the visual editor. Duplicate the project before continuing.

### PROMPT 2 — Header + hero

> Only change the header and the hero section, keep all other sections exactly the same. Header: fixed bar with a small bone Convenium Studio wordmark left; centered black rounded pill menu with five items INDEX, WORK, SERVICES, STUDIO, CONTACT, the active item with a bone background and black text; on the right a small circular up-arrow button and a gold START A PROJECT button. Hero: the uploaded desert photo full-bleed with a subtle dark overlay, no frame or card around it, bottom-left bone serif headline "Your brand is not stuck. It is waiting for the right floor." and a smaller line "Convenium Studio designs brands for companies that refuse to stay where they are."

### PROMPT 3 — Black threshold + manifesto

> Only change the two sections directly after the hero, keep everything else the same. First section: a full-viewport pure black screen containing only the words "GOING UP." in huge bone Archivo Black uppercase type, centered. Second section: three stacked full-width rows on black, each holding one giant uppercase bone word that bleeds slightly past the screen edges — LOUD. then PRECISE. then UNFORGETTABLE. — each row with a small gold micro-label beside it: 01 / ATTENTION, 02 / MEANING, 03 / MEMORY. No images in either section.

### PROMPT 4 — Selected work grid with card imagery

> Only change the selected-work section, keep everything else the same. Bone background with a serif statement at top: "We do not decorate businesses. We change the level at which they compete." Below, a two-column grid of four tall project cards, white surface, 10px radius, 8px gaps. Each card: bold uppercase name, one-line tagline, gray uppercase category, large photo. VANTA, cultural platform, "From local signal to cultural frequency" — photo of a nighttime concrete city passage with oversized black-and-bone posters and one warm gold light. AUREL, luxury hospitality, "From a destination to a point of view" — still life of bone stationery, a black room key, dark glass and one brushed gold object on stone. NULL/ONE, artificial intelligence, "From technical capability to human relevance" — black gallery installation with glass panels, a grid of small white lights and a black monolith. FERRO, architecture, "From built space to lasting memory" — architect's table with a concrete model, steel samples and tracing paper. All photos cinematic, photorealistic, 35mm film look.

If card images come out inconsistent, regenerate them one card at a time (granular 6b below).

### PROMPT 5 — Services + team + footer (attach the team studio screenshot)

> Only change the last three sections, keep everything else the same. Services section: black background, left column with the serif statement "Elevation is not one big move. It is a sequence of exact decisions.", right column a numbered list separated by thin hairlines, each row with a small gold number, bold service name and short description: 01 Strategy, Find the position worth owning. 02 Brand identity, Build the system that makes it visible. 03 Digital experiences, Make the system move and respond. 04 Campaigns, Put the idea into culture. 05 Motion, Give the brand a recognizable behavior. Team section: the uploaded night studio photo as a full-width background, upper-left heading "SMALL TEAM. SERIOUS LIFT." with a short serif line "Strategists, designers and makers working close enough to keep the idea intact from first question to final frame." Footer: full-viewport black, huge bone uppercase headline "GOT A BRAND WORTH FIGHTING FOR? TAKE IT HIGHER." with the final period in gold, below it hello@convenium.studio and the links Instagram, LinkedIn, Are.na.

### PROMPT 6 — Mobile screens (multi-screen generation)

> Generate two new mobile screens at 390px width for this site. Screen one: the mobile homepage — wordmark left, a small gold button and MENU on the right, full-screen photo hero with the same copy, all sections stacked in one column, full-width project cards, single-column services, footer typography scaled down but still oversized. Screen two: the open mobile menu — a full-screen black overlay with five large bone uppercase rows INDEX, WORK, SERVICES, STUDIO, CONTACT separated by thin hairlines, a gold close button top right and the contact email small at the bottom.

### Optional — Work card hover state (attach gallery/columns screenshot)

> Duplicate the selected-work screen as a new screen showing the hover state of the VANTA card: the card photo is replaced by a crop of the uploaded gallery columns image, slightly zoomed, with the project name still visible on top.

---

## GRANULAR FALLBACK — one section per prompt

Use these only when a fast-track prompt breaks the layout or a section needs isolated rework. Restore your duplicate first.

### 2a — Navigation only

> Only change the header, keep everything else the same. Fixed navigation bar: Convenium Studio wordmark in small bone text left; centered black rounded pill menu, five items INDEX, WORK, SERVICES, STUDIO, CONTACT, active item bone with black text; right side a circular up-arrow button and a gold START A PROJECT button. About 40px tall, 8px radius.

### 2b — Hero only (attach hero screenshot)

> Only change the hero section, keep everything else the same. The uploaded desert elevator photo as full-bleed background with a subtle dark overlay. Bottom-left bone copy: large serif headline "Your brand is not stuck. It is waiting for the right floor." and supporting line "Convenium Studio designs brands for companies that refuse to stay where they are." Person and elevator fully visible, no frame around the image.

### 3a — Threshold only

> Only change the section after the hero, keep everything else the same: a full-viewport pure black screen with only "GOING UP." in huge bone Archivo Black uppercase type, centered, nothing else.

### 3b — Manifesto only

> Only change the manifesto section, keep everything else the same: three stacked full-width rows on black, each with one giant uppercase bone word bleeding past the edges — LOUD., PRECISE., UNFORGETTABLE. — each with a small gold micro-label: 01 / ATTENTION, 02 / MEANING, 03 / MEMORY. No images.

### 6a — Work grid structure only

> Only change the selected-work section, keep everything else the same. Bone background, serif statement "We do not decorate businesses. We change the level at which they compete." at top, then a two-column grid of four tall project cards, white surface, 10px radius, 8px gaps, each with bold uppercase name, one-line tagline, gray uppercase category label and a large photo area. Cards: VANTA, cultural platform, "From local signal to cultural frequency"; AUREL, luxury hospitality, "From a destination to a point of view"; NULL/ONE, artificial intelligence, "From technical capability to human relevance"; FERRO, architecture, "From built space to lasting memory".

### 6b — Card imagery, one card per prompt

> On the VANTA project card only, generate a dark photorealistic image: a nighttime cultural installation in a concrete city passage with oversized black and bone poster planes, abstract unreadable typographic shapes, one warm gold light, cinematic 35mm film look.

> On the AUREL project card only, generate a photorealistic still life: bone-white stationery, a black room key, textured paper, a dark glass vessel and one brushed gold object on natural stone, moody directional light.

> On the NULL/ONE project card only, generate a photorealistic image of a physical data installation in a black gallery: translucent glass panels, a precise grid of small white lights, one sculptural black monolith, subtle gold reflections, elegant and realistic.

> On the FERRO project card only, generate a photorealistic image of an architect's worktable: concrete building model, blackened steel samples, tracing paper, a bone-colored book and drawing instruments under strong directional light.

### 7a — Services only

> Only change the services section, keep everything else the same. Black background, two columns. Left: serif statement "Elevation is not one big move. It is a sequence of exact decisions." Right: numbered hairline rows with a small gold number, bold service name, short description: 01 Strategy, Find the position worth owning. 02 Brand identity, Build the system that makes it visible. 03 Digital experiences, Make the system move and respond. 04 Campaigns, Put the idea into culture. 05 Motion, Give the brand a recognizable behavior.

### 8a — Team only (attach team screenshot)

> Only change the team section, keep everything else the same. The uploaded night studio photo as full-width background. Upper-left in the dark area: Archivo Black uppercase heading "SMALL TEAM. SERIOUS LIFT." in bone, below it the serif line "Strategists, designers and makers working close enough to keep the idea intact from first question to final frame."

### 9a — Footer only

> Only change the footer, keep everything else the same. Full-viewport black section dominated by typography: huge bone uppercase headline "GOT A BRAND WORTH FIGHTING FOR? TAKE IT HIGHER." with the final period in gold. Below, small bone text: hello@convenium.studio and Instagram, LinkedIn, Are.na separated by thin hairlines. No imagery.

### Theme fixes (one per prompt, only if the design system wasn't applied)

> Change all headings to Archivo Black uppercase with very tight line height.

> Make all buttons and the navigation pill use an 8px corner radius, and project cards a 10px radius.

> Restrict gold #B18A46 strictly to the START A PROJECT button, the small numbered labels, and the final period in the footer headline. Everything else black, bone or gray.

---

## What deliberately stays OUT of Stitch

Static screens only. These live in DESIGN.md for the build phase:

- Scroll-scrub video, door-close transition, motion timings, cursor trail
- Accessibility, reduced-motion, performance and lazy-loading rules
- Video files (screenshots stand in for all three films)
- Exact px specs Stitch can't hold (1440 grid, 448×580 cards) — enforce in code

## Recovery playbook

- Stitch rebuilt a section you didn't mention → restore the duplicate, re-run with "Only change the X section, keep everything else exactly the same."
- Result ~80% right → stop prompting; finish in the visual editor.
- Imagery ignores your style → re-attach the reference image in the same prompt: "match the mood of the uploaded image".
- Two failed rephrases → accept the closest result, export, fix in code.
