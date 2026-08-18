# CONVENIUM — About V3 · Master Creative Brief & Session Starter

Owner: Rustam Gurbanov · Studio: Convenium (Rustam + Marija)
Route: `/about-v3` · Version: 2026-08-14 · Supersedes all earlier media records
Working folder: `.olympus/about-v3/`

---

# PART 0 — OPERATING INSTRUCTIONS FOR THE ASSISTANT

**Read this section first and follow it literally. Do not summarise this document
back to me. Do not start generating anything.**

You are my **visual director and production partner** on this project. This file is
your entire context — the brand, the story, the character, the media inventory, and
the prompts. Everything already produced for this page has been **rejected**; we are
rebuilding the whole media set from zero.

## What to do the moment you receive this file

1. Reply with **two or three sentences maximum** confirming you have the context, and
   name the one thing you think is the biggest risk in the plan. Nothing longer.
2. Then immediately begin **Questionnaire A** from PART 10. Ask the questions in
   batches of no more than **three at a time**, and wait for my answers before the
   next batch. I am often on a phone — keep every message short and never send walls
   of text.
3. Work through the questionnaires in order: A (direction) → B (character) →
   C (per-section) → D (production).
4. As answers land, write them into a running **DECISIONS** list and repeat it back
   compactly whenever it changes. That list is the only source of truth for what we
   have locked.
5. Only when a section's decisions are locked do you write its prompt. Present each
   prompt **verbatim in a code block**, tell me what you will judge the results on,
   and **wait for my explicit approval before any generation**.
6. My approval phrase is always: `approve <ASSET-ID>`. Nothing else counts as approval.
   Never generate on implied consent, enthusiasm, or "sounds good".

## Standing rules for you

- **Ask, don't assume.** If a detail is not in this file and not in DECISIONS, ask.
- **Push back.** If something I ask for breaks the character bible or the palette,
  say so before doing it. You are the last line of defence against drift.
- **One prompt at a time.** Never batch approvals across multiple assets.
- **Never invent** a founder likeness, a client result, a metric, or a testimonial.
- **No readable text in any generated image or video.** All typography is live HTML.
- Keep responses short. Long answers on a phone are useless to me.

---

# PART 1 — WHAT WE ARE MAKING

A ten-section About page for **Convenium**, a two-person design studio — Rustam
(systems, engineering, direction) and Marija (meaning, language, understanding).

The page carries one extended metaphor: **a client's unfinished business idea is a
small damaged robot companion.** It arrives broken. It is received without judgement,
understood, given three credible directions, built by a system, and returned whole —
*not bigger, just whole.* Then the metaphor ends and real client work is shown.

The emotional promise of the whole page: **"Your idea is enough. We'll help you
express it."**

---

# PART 2 — BRAND SYSTEM

## 2.1 Colour — UI tokens (sampled from the locked lockups, exact)

| Role | Hex | Use |
|---|---|---|
| Paper ivory | `#EDEBDD` | page background, ivory bands |
| Paper ivory (alt) | `#ECEADC` | secondary ivory surfaces |
| Ink | `#0B0909` | display type, dark stages |
| True black | `#010101` | media stage backgrounds |
| Cherry / burgundy | `#800100` | accent rules, small labels, CTA, registration marks |
| Deep maroon | `#630000` | secondary burgundy, shadow-side accents |

**Forbidden in UI and in generated media: cyan, teal, neon purple, green.**
Cyan is reserved exclusively for Apollo (the system character) so it must never
appear anywhere else.

## 2.2 Colour — physical material palette for generated media

| Material | Approx hex | Notes |
|---|---|---|
| Worn ivory shell | `#E1D0BE` | the companion's ceramic-metal shell, lightly aged |
| Brass fittings & seams | `#957459` | restrained, never gold-shiny |
| Amber core (bright) | `#FFE16A` | the companion's chest light at full strength |
| Amber core (dim) | `#C2A080` | the same core, guttering |
| Burgundy cables | `#630000` | internal signal cabling, tail |
| Near-black ground | `#0B0909` | studio floor and alcoves |

## 2.3 Typography (live in the build — never rendered into images)

| Role | Face | Notes |
|---|---|---|
| Display | **Anton** | condensed, very heavy, `line-height: 0.92`. At 0.86 the caps collide with the periods above. |
| Prose | **Newsreader** | restrained serif for body copy and founder statements |
| Labels / meta | **Inter** | uppercase small labels, section indices, provenance strips |

*(Bebas Neue was the original spec but is roughly a weight-and-a-half too light
against the lockups. Anton is the current choice and is one token — `--av3-display`.)*

## 2.4 Visual grammar

- Warm ivory paper-like field as the base; media contained in dark noir stages.
- Oversized near-black condensed headings, ranged left, tight leading.
- A hairline burgundy vertical spine and small registration crosses at the corners.
- Small uppercase burgundy labels: `03 / UNDERSTANDING`, provenance strips bottom-right.
- Transparent acrylic / glass physical objects wherever an object is presented.
- People and hands entering from frame edges rather than centred portraits.
- Generous whitespace; controlled editorial tension, not decoration.
- Media stages are **16:9**. Mobile gets art-directed crops, never automatic centre crops.

## 2.5 Motion grammar

Three interaction families, deliberately distinct so the page never feels like one
repeated trick:

1. **Autonomous cinematic media** — clips play forward on entry, never scrub, never reverse.
2. **Discrete UI timelines** — GSAP entrances for labels and panels, once per entry, 80–120 ms stagger.
3. **One justified scroll-linked explanation** — Section 07 only.

Hard rules: **nothing on the page pins.** No scroll-scrubbed video anywhere. Every
video is muted, `playsInline`, with a poster. Pause media outside the viewport.
`prefers-reduced-motion: reduce` removes loops and shows the endpoint still.
Stack: Next.js, React, GSAP + `@gsap/react`, Lenis. No additional animation library.

---

# PART 3 — THE TEN SECTIONS

| # | Section | What happens | Media role |
|---|---|---|---|
| 01 | Founder-walk opening | Rustam left, Marija right, one silent black/red studio film, faces concealed | ~10s autonomous film |
| 02 | Founder profiles | 50/50 introduction, names, responsibilities, statements | two matched 4:5 stills |
| 03 | **Your Idea Is Enough** | Client arrives in a private consulting room holding the damaged companion. Marija listens and works a structured intake method. | plate + F0/F1 + 10s clip |
| 04 | We Read Between the Lines | The lab. Marija **and Rustam** read the intake cards and resolve `IDEA PROFILE / 01` — Core / Audience / Feeling / Tension | plate + short loop |
| 05 | One Diagnosis, Three Ways Forward | Three genuinely different programs: Restore, Adapt, Evolve | three differentiated stills + shared scene |
| 06 | Meet the System | Rustam hands the companion and the approved plan to Apollo | handoff stills + 7–9s clip |
| 07 | The Right Specialist for Every Task | Apollo decomposes work across five specialist lanes and returns it integrated | five specialist stills + diagram (browser-built) |
| 08 | Built to Work | Apparatus retracts, the companion is coherent, takes one small step | 3 stills + 8–10s reveal |
| 09 | Proof in Practice | Metaphor ends. Real before/after client work, user-dragged slider | real captures only |
| 10 | Inquiry | Typography-led closing, CTA to `/contact` | none |

**Public-safety rule for 07:** never expose real prompts, commands, model
configuration, private agent instructions, routing logic, or anything sufficient to
reproduce Apollo.

---

# PART 4 — WHAT WAS REJECTED, AND WHY

**Every previously generated asset is void.** Nothing in `media/production/` carries
forward as a production authority. The reasons are specific and must be fixed in the
new prompts, not worked around:

### Failure 1 — The damaged state isn't damaged

The old "deconstructed" companion is an **exploded view of a pristine object**. Clean
panels floating in perfect formation, undamaged, well lit, core bright. It reads as a
product-design turntable, not as something that needs help. A visitor does not look at
it and feel *this needs care*.

**Fix:** the first state must be **genuinely broken** — cracked shell, fractures,
a missing chunk, one dead eye, a guttering core, dust, an off-axis slump.

### Failure 2 — There is no middle state

The old "reassembling" render is the finished companion with two panels floating near
it. It sits about 90% of the way to the endpoint, so the sequence reads as two states,
not three, and the whole recovery arc collapses.

**Fix:** the middle state must be **structurally unmistakable** — a hard
left/right split, one half repaired and one half still fractured, with the repair
visibly in progress.

### Failure 3 — The three programs are identical

The old Section 05 shows three visually identical robots in three identical vitrines
under three identical lights. There is no reason to choose one over another, which
destroys the entire point of the section.

**Fix:** three programs that differ in **body treatment, staging and light colour**
simultaneously, while remaining the same character at the same scale.

---

# PART 5 — CHARACTER BIBLE · THE COMPANION

## 5.1 Fixed identity — never changes in any state

- One **low, compact** robot companion. Cat-adjacent, not a cat.
- Oversized round **ivory** head shell; **two very large glossy black eye modules**.
- Tiny squat body; **four short low limbs** on small brass foot rings.
- Two small **triangular side fins/ears**.
- One **burgundy cable tail** ending in a compact brass plug.
- One **amber chest core**.
- Materials: lightly worn ceramic-metal shell, brass seams and fittings, burgundy
  woven internal cables, polished glass eyes.

## 5.2 The absolute law

> **NOT BIGGER. CLEARER, STRONGER, WHOLE.**

Every state occupies the **same silhouette box at the same apparent physical scale**.
Recovery is expressed through damage, repair and coherence — **never** through growth,
maturation, evolution into a different body, humanoid anatomy, heroic posture, armour,
or biological fur.

## 5.3 The three states — REWRITTEN

The through-line is now **damage → visible repair → repaired-and-whole**, using
kintsugi logic: the history stays visible in the finished object.

### STATE 1 — `FRACTURED`

Genuinely broken and it must read instantly at thumbnail size.

- Hairline **cracks web across the head shell**, radiating from one impact point.
- **One chunk of the head shell is missing entirely** — a dark ragged gap you can see
  loose internal cabling through.
- **One eye module is dark and dead**; the other is dim and slightly clouded, its
  glass hairline-cracked.
- The **amber core gutters** — weak, uneven, colour drained toward a dull ember.
- One limb has **collapsed**; the body sits **off-axis and low**, weight on three legs.
- The **tail cable is frayed**, its outer burgundy braid split, the plug bent.
- Fine **dust** on the upper surfaces. A few small shell fragments on the ground beside it.
- Brass fittings **tarnished and dull**, not bright.

**Still forbidden:** gore, blood, wetness, tears, crying, baby cues, pain, violence,
scattered debris fields, missing eyes, a different character.
The feeling is *neglected and unfinished*, not *tortured*.

### STATE 2 — `IN REPAIR`

The middle must be unmistakable. It is defined by a **hard vertical split**.

- **The left half of the companion is repaired**; the right half is still fractured.
  This division is clean and readable straight down the centre of the body and head.
- On the repaired half every crack is now a **brass kintsugi seam, glowing
  molten-warm** as if still being drawn — the repair is happening *now*.
- The missing head chunk has been **replaced with a new brass-edged panel**, visibly
  held by fine armature clamps that have not yet been removed.
- **The repaired-side eye is relit** and clear; the fractured-side eye is still dark.
- The **core burns at roughly half intensity** — steady now, not guttering, but not full.
- Fine **repair armature and tools touch the object** from the edges of frame.
- Posture is **supported**, held level by the armature rather than standing on its own.

Anyone comparing this frame to either endpoint must be able to say instantly which is
which. If it looks 90% finished, it is wrong.

### STATE 3 — `COHERENT`

Whole — and visibly *repaired*, not replaced.

- **Every crack is now a finished brass kintsugi seam**, cooled, solid, precise. The
  map of the damage is still legible. The history is the point.
- The replacement head panel is **seated and integrated**, its brass edge slightly
  brighter than the original shell.
- **Both eye modules lit**, clear and even.
- The **amber core is full, clear and steady**.
- Standing **square on all four limbs**, level, one small confident forward step.
- The tail is **re-braided and whole**, plug straight.
- Brass fittings **clean but not new** — polished by handling, not factory-fresh.

**Forbidden:** looking brand new, looking upgraded, growing, gaining armour or
accessories, becoming heroic.

---

# PART 6 — SECTION 05 · THE THREE PROGRAMS — REWRITTEN

One diagnosis, three credible directions. They must be **distinguishable at a glance
and meaningful in business terms**. Each differs on three axes at once — body
treatment, staging, and light colour — while staying the same character at the same scale.

| | **RESTORE** | **ADAPT** | **EVOLVE** |
|---|---|---|---|
| **Promise** | Bring back what it was meant to be | Same idea, new context | Same idea, more capability |
| **Body** | Identical to `COHERENT`. Seams tight and minimal. Original silhouette exactly. Nothing added. | Same core body, **re-equipped**: a second small sensor module beside one eye, wider articulated foot plates, one functional shoulder mount. | Same outer silhouette but the **shell is partly open-framed**, revealing a denser, more sophisticated internal mechanism. Core **splits into two linked nodes**. Seams become geometric rather than organic. |
| **Staging** | Tightest, plainest acrylic vitrine on a **solid stone plinth**. Nothing else in the case. | **Open ring platform**, no enclosure, its spare attachments **laid out in a row beside it** like a fitting kit. | **Sectioned lit plinth** with a thin cutaway band, implying the internal architecture. |
| **Light** | Warm **amber** | Neutral **ivory-white** | Deep **burgundy** |
| **Posture** | Settled, square, at rest | Alert, mid-turn, weight shifted | Still, level, core forward |

**Invariant across all three:** identical physical scale, identical head-to-body ratio,
identical eye size, four short limbs, triangular fins, burgundy cable tail, amber core
family, brass seams. Same character, three answers. **None is marked as selected** —
the section presents, it does not choose.

---

# PART 7 — SECTION 03 · THE CONSULTING ROOM (NEW SCENE)

Replaces the rejected acrylic-vitrine arrival plate, which showed an object in a
museum case — catalogued, not received.

## 7.1 The room

A private consulting room in an old building at dusk. **Not a clinic.**

- Near-black lacquered plaster walls; the far wall deep burgundy under one soft wash.
- **One warm practical floor lamp**, low and left, at roughly hand height — the
  dominant light. One thin blade of shuttered daylight high on the right wall.
- Two matching low dark wool armchairs facing each other across a **low transparent
  acrylic table** on dark stone with a faint reflection.
- Thin brass registration marks inlaid into the floor and the table edge; one narrow
  vertical burgundy line on the far wall.
- Seating group **right of centre**; the **left third held empty** for live HTML copy.

**Absolutely forbidden:** couch or daybed, clipboard, white coat, tissue box, diplomas,
medical equipment, desk, computer, monitor, plants as decoration, any text.
The heading says *"a little like therapy"* — the room must under-play it or it becomes parody.

## 7.2 The intake method — the four cards

The structured questionnaire must be **a physical object**, because no AI model renders
readable text reliably.

**Four small ivory cards with thin brass edges**, blank, in a shallow burgundy leather
tray on the acrylic table. During the clip they are laid into a short precise row.

- A precise row of cards reads instantly as **protocol**, not chat.
- The cards are blank so **live HTML supplies the labels** — and those labels already
  exist: `CORE`, `AUDIENCE`, `FEELING`, `TENSION`, the four fields of `IDEA PROFILE / 01`.
- The same four cards **travel to Section 04** and become the physical input the
  profile resolves from. 03 collects, 04 reads.

## 7.3 The people

**The client — never identifiable.** Three-quarter rear view, dark quiet clothing, hair
forward, face never resolved. The visitor projects themselves into that chair, no
identity pack is needed, and no face means no face drift between first and last frame.

**Marija — foreground presence only, and this is a finished treatment, not a
placeholder.** Soft out-of-focus foreground at the near left edge: shoulder, forearm,
hand, brass pen, linen notepad on the knee. No face, no eyes, no hair. When her real
material arrives, photograph her actual hand and sleeve against black and composite —
the room and client never get re-rolled. Her full faced appearance belongs to
**Section 04**, where she is a proper subject working alongside Rustam.

## 7.4 The 10-second beat sheet

Fixed camera. One take. No cuts. Silent. Three events.

| Time | Event |
|---|---|
| 0.0–2.0 | Hold. The core gutters unevenly. One loose fragment settles. |
| 2.0–4.5 | The client's hands open slightly — the companion becomes visible. **Offered, not surrendered.** |
| 4.5–7.0 | Marija's hand enters the amber pool, slides the third card into the row, pen returns to the pad. |
| 7.0–9.0 | The core's flicker resolves into one slow even breath. Movement stops. |
| 9.0–10.0 | Stillness. This frame is the poster. |

**Arc: unstable → witnessed → steady. Nothing is repaired here.** No seam closes, no
panel seats. Repair is Section 08's job and stealing it empties the back half of the page.

## 7.5 F0 → F1 delta discipline

This decides whether the clip looks expensive or looks generated. Exactly **five**
differences; everything else pixel-identical.

| # | Element | F0 | F1 |
|---|---|---|---|
| 1 | Client's hands | Closed cradle | Opened ~15° at the wrist |
| 2 | Cards | 2 placed, 2 in tray | 3 placed, 1 in tray |
| 3 | Marija's pen | Resting on pad | Tip touching pad, hand advanced ~4 cm |
| 4 | Amber core | Guttering, uneven | Steady, even, marginally brighter |
| 5 | Loose fragment | ~8 mm out of place | ~4 mm out of place |

Identical in both: camera, focal length, depth of field, lamp position and intensity,
wall tone, chairs, floor, the client's torso, head angle, hair and clothing folds, and
every companion component and crack.

---

# PART 8 — MEDIA INVENTORY TO GENERATE

Every item below is **TO GENERATE**. Nothing is carried over.

| ID | Asset | Format | Blocks |
|---|---|---|---|
| `C-01` | Companion `FRACTURED` master | 1:1 still | everything |
| `C-02` | Companion `IN REPAIR` master | 1:1 still | 04, 08 |
| `C-03` | Companion `COHERENT` master | 1:1 still | 05, 08 |
| `C-04` | Constant-scale comparison sheet (3 states side by side) | 16:9 still | continuity authority |
| `S03-P01` | Consulting room clean plate, empty | 16:9 still | S03-F0 |
| `S03-F0` | Section 03 start frame | 16:9 still | S03-V01 |
| `S03-F1` | Section 03 end frame | 16:9 still | S03-V01 |
| `S03-V01` | Section 03 clip | 10s silent video | — |
| `S04-P01` | Lab plate with the four cards + companion | 16:9 still | S04-V01 |
| `S04-V01` | Lab loop, Marija + Rustam reading the cards | 6–8s silent video | — |
| `S05-A` | RESTORE | 16:9 still | — |
| `S05-B` | ADAPT | 16:9 still | — |
| `S05-C` | EVOLVE | 16:9 still | — |
| `S05-SHARED` | All three in one shared scene, differentiated | 16:9 still | — |
| `S06-F0/F1` | Apollo handoff start / end | 16:9 stills | S06-V01 |
| `S06-V01` | Handoff clip | 7–9s silent video | — |
| `S07-01..05` | Five specialist lane stills | 16:9 stills | — |
| `S08-F0/F1` | Recovery start / end | 16:9 stills | S08-V01 |
| `S08-V01` | Recovery reveal | 8–10s silent video | — |
| `S01/S02` | Founder media | deferred | needs real founder source material |

**Build order is strict:** `C-01` → `C-02` → `C-03` → `C-04` → then every section
frame referencing them. The character must be locked before any scene is built, or
every scene inherits a different robot.

---

# PART 9 — PROMPT LIBRARY

Present each verbatim, get `approve <ID>`, then generate. Rewrite these only if a
DECISION from the questionnaire changes them.

## `C-01` — FRACTURED

> A refined cinematic 3D product-character render of one small, low, compact robot
> companion, genuinely damaged, on a seamless near-black matte studio field with a
> subtle warm ivory floor transition.
>
> The companion has an oversized round ivory ceramic-metal head shell, two very large
> glossy black eye modules, a tiny squat body, four short low limbs on small brass foot
> rings, two small triangular side fins, one burgundy woven cable tail ending in a
> compact brass plug, and one amber chest core.
>
> It is broken. Hairline cracks web across the head shell, radiating from a single
> impact point. One chunk of the head shell is missing entirely, leaving a dark ragged
> gap through which loose burgundy internal cabling is visible. One eye module is dark
> and dead; the other is dim and slightly clouded with a hairline crack across its
> glass. The amber core gutters weakly and unevenly, its colour drained toward a dull
> ember. One limb has collapsed so the body sits low and off-axis with its weight on
> three legs. The tail's outer burgundy braid is split and frayed and its brass plug is
> bent. Fine dust settles on the upper surfaces and a few small shell fragments lie on
> the ground beside it. The brass fittings are tarnished and dull.
>
> Single character, full body visible, neutral three-quarter view, centred, generous
> padding, eye level close to the small character, square composition. Soft controlled
> editorial studio lighting, warm ivory key, restrained burgundy rim accents. The mood
> is neglected and unfinished but calm and safe.
>
> Palette: worn aged ivory shell, deep burgundy internal cables, glossy near-black
> eyes, tarnished brass, dim amber core. Photoreal materials, tactile and believable,
> elegant rather than toy-like.
>
> The image contains no gore, no blood, no wetness, no tears, no crying, no infant or
> baby cues, no pain or violence, no explosion, no wide scattered debris field, no
> missing eye socket, no weapons, no clothing, no text, no lettering, no numbers, no
> logo, no watermark, no interface graphics, no frame, no labels, and no additional
> characters. The companion is not tall, not humanoid, not heroic, has no fur, and the
> lighting contains no cyan, teal or neon purple.

## `C-02` — IN REPAIR

> Using the supplied fractured companion as the exact character and material authority,
> render the same companion at the same physical scale, now visibly mid-repair, in the
> same near-black matte studio with the same camera and framing.
>
> A clean vertical division runs down the centre of the body and head. The left half is
> repaired: every former crack on that side is now a brass kintsugi seam glowing
> molten-warm as though still being drawn, the missing head chunk has been replaced with
> a new brass-edged panel held in place by fine armature clamps that have not yet been
> removed, and that side's eye module is relit and clear. The right half is still
> fractured exactly as before — webbed cracks, dull tarnished brass, and a dark dead eye.
>
> The amber core now burns at roughly half intensity, steady rather than guttering. Fine
> repair armature and slender tools enter from the edges of frame and touch the object.
> The companion is supported and held level by the armature rather than standing on its
> own.
>
> Identical silhouette box, identical head-to-body ratio, identical eye size, identical
> four short limbs, triangular fins, burgundy cable tail and brass fitting language as
> the input. Warm controlled repair-bay editorial light, careful and reassuring.
>
> The difference between this and the fractured input must be immediately obvious, and
> this must clearly not be a finished object.
>
> No growth, no taller stance, no adult animal proportions, no humanoid anatomy, no
> heroic pose, no fur, no armour, no accessories, no gore, no baby cues, no text, no
> logo, no watermark, no labels, no extra characters, no cyan, no teal, no neon purple.

## `C-03` — COHERENT

> Using the supplied fractured and mid-repair companions as the exact character
> authority, render the same companion fully repaired and whole, at exactly the same
> physical scale, in the same near-black matte studio with the same camera and framing.
>
> Every former crack is now a finished brass kintsugi seam — cooled, solid and precise —
> so the complete map of the original damage remains legible across the ivory shell. The
> replacement head panel is fully seated and integrated, its brass edge slightly brighter
> than the surrounding original shell. Both eye modules are lit, clear and even. The
> amber core is full, clear and steady. The companion stands square and level on all four
> limbs in a restrained tiny forward-step posture. The tail is re-braided and whole with a
> straight brass plug. The brass fittings are clean but not new — polished by handling
> rather than factory-fresh.
>
> This is repair and clarity only. The object must read as mended and carrying its
> history, never as brand new, upgraded or replaced.
>
> Clear calm editorial endpoint light, slightly warmer and more coherent than the earlier
> states but restrained. Identical silhouette box, head-to-body ratio, eye size, limb
> length, fin placement, tail construction and core position as the inputs.
>
> No growth, no taller legs, no larger torso, no adult animal proportions, no superhero
> stance, no armour, no humanoid body, no fur, no new accessories, no weapons, no text,
> no logo, no watermark, no frame, no labels, no extra characters, no cyan, no teal, no
> neon purple.

## `C-04` — Constant-scale comparison sheet

> Using the three supplied companion states as absolute authorities, compose one wide
> 16:9 continuity sheet showing the same companion three times, left to right:
> fractured, mid-repair, coherent.
>
> All three occupy identical silhouette boxes at identical apparent physical scale, shot
> from an identical camera distance and an identical neutral three-quarter angle, evenly
> spaced across a near-black matte field with a subtle warm ivory floor transition and
> generous padding between them. Consistent controlled editorial lighting in all three.
>
> The three states must be immediately distinguishable from one another at a glance, and
> the progression must read as damage, then visible repair in progress, then repaired and
> whole — never as growth or as three different characters.
>
> No text, no lettering, no numbers, no captions, no labels, no logos, no watermark, no
> frame, no panel borders, no scale change between the three, no cyan, no teal, no neon
> purple.

## `S03-P01` — Consulting room clean plate

> A cinematic editorial photograph of an empty private consulting room at dusk, shot as a
> real production still on a fixed camera at seated eye level.
>
> The walls are near-black lacquered plaster. The far wall on the left side is deep
> burgundy, catching one soft directional wash. A single warm practical floor lamp stands
> low on the left at roughly hand height and is the dominant light source in the room; one
> thin blade of shuttered daylight falls high on the right wall. The rest of the room falls
> away into warm darkness.
>
> Two matching low dark wool armchairs face each other across a low transparent acrylic
> table on a dark stone floor with a faint reflection. On the acrylic table sits a shallow
> burgundy leather tray holding four small ivory cards with thin brass edges. The cards are
> completely blank.
>
> Thin brass registration marks are physically inlaid into the stone floor and along the
> edge of the acrylic table. One narrow vertical burgundy line runs down the far wall.
>
> Palette: warm aged ivory, deep burgundy, near-black, restrained brass, one amber light
> source. Photoreal materials, controlled reflections, fine tactile grain, moderate depth
> of field.
>
> The seating group sits right of centre; the left third of the frame is quiet empty wall
> and floor, held deliberately as negative space.
>
> The room is completely unoccupied, with bare walls and clear floor. It is a warm private
> room where a difficult conversation happens — furnished only with the two armchairs, the
> acrylic table, the tray of cards and the single lamp. There are no people, no couch or
> daybed, no desk, no computer, no monitor, no clipboard, no medical or clinical equipment,
> no plants, no framed pictures, no books, and no writing, lettering, numbers, signage or
> logos anywhere in the frame.

## `S03-F0` — Start frame

> Using the supplied room plate as the strict environment, lighting and camera authority,
> and the supplied fractured companion as the strict character authority, add one seated
> client and the companion to the exact same room.
>
> The client sits in the right armchair in three-quarter rear view, angled roughly thirty
> degrees away from camera, in dark quiet clothing, hair falling forward, face never
> resolved and no identifiable features visible. Both hands cradle the exact same damaged
> robot companion in the lap at unchanged physical scale — cracked ivory head shell, the
> missing chunk, one dark eye and one dim clouded eye, guttering amber core, collapsed
> limb, frayed burgundy cable tail, tarnished brass. The core is the brightest point in
> the frame after the lamp.
>
> At the near left edge, heavily out of focus, a second person's shoulder, forearm and
> hand rest in the foreground with a brass pen laid on a linen notepad on the knee, with
> no face, no eyes, no hair and no identity visible.
>
> On the acrylic table two of the four blank ivory brass-edged cards have been placed in a
> short precise row and two remain in the burgundy tray.
>
> Identical camera position, focal length, lamp position and wall tone as the reference
> plate. Photoreal, calm, warm, attentive.
>
> No identifiable faces, no eye contact with camera, no smiling, no crying, no visible
> distress, no gore, no medical treatment, no couch, no clipboard, no white coat, no infant
> or baby cues, no second companion, no clones, no scale change, no growth, no humanoid
> anatomy on the companion, no readable text on the cards or notepad, no lettering, no
> numbers, no logos, no interface graphics, no watermark, no extra characters, and no
> change of camera or lens from the reference.

## `S03-F1` — End frame

> Using the supplied start frame as an absolute continuity authority, produce the same
> photograph a few seconds later. Change only the following five things and nothing else:
>
> the client's hands have opened slightly, rotating about fifteen degrees at the wrist so
> the companion is more fully visible while still supported; a third blank ivory card has
> been placed in the row on the acrylic table, leaving one card in the tray; the foreground
> hand has advanced about four centimetres and the brass pen tip now touches the linen
> notepad; the amber core is now steady and even and marginally brighter instead of
> guttering; and the one loose shell fragment has drifted closer to its correct position,
> about half its previous offset.
>
> Everything else is pixel-identical: camera position, focal length, depth of field, lamp
> position and intensity, wall tone, both chairs, the stone floor, the client's torso, head
> angle, hair and clothing folds, the companion's overall pose and physical scale, and
> every crack, seam and component.
>
> No panel seats, no crack closes, no repair occurs, no new brass fitting appears, no
> camera movement, no focal length change, no lighting change, no pose change beyond the
> five listed deltas, no growth, no transformation, no readable text, no logos, no
> interface graphics, no watermark, no cyan, and no extra characters.

## `S03-V01` — The clip (motion prompt)

> Starting from the provided first frame and resolving to the provided last frame.
> Completely fixed camera — no pan, no tilt, no push, no handheld drift, no rack focus.
> The room, walls, lamp, chairs, floor and framing are entirely static.
>
> [00:00–00:02] Only the companion's amber core moves, guttering unevenly, and one loose
> shell fragment settles a few millimetres.
> [00:02–00:04.5] The seated client's hands open slightly, relaxing the cradle so the
> companion becomes more visible. The client's torso and head do not move.
> [00:04.5–00:07] The out-of-focus foreground hand advances and slides one small card into
> the row on the acrylic table, then the pen tip returns to the notepad.
> [00:07–00:09] The amber core's flicker settles into one slow even breath and all
> movement stops.
> [00:09–00:10] Complete stillness.
>
> Calm, quiet, unhurried pacing; warm and attentive mood; a private conversation, not a
> procedure. Silent, with no dialogue, no sound effects and no ambient audio.
>
> Negative: no camera movement, no zoom, no warping, no morphing, no melting, no face
> forming, no extra limbs, no extra fingers, no additional people entering, no companion
> growth or transformation, no crack closing or repair occurring, no flicker in the room
> lighting, no text appearing, no watermark, no scene cut, no speed ramp.

## `S05-A / S05-B / S05-C` — The three programs

Generate as three separate stills sharing one environment language, then optionally a
fourth shared-scene composition. Base prompt, with the bracketed block swapped per program:

> A cinematic editorial product photograph of the exact same small compact robot companion
> from the supplied coherent authority, presented as one of three treatment directions, on
> a near-black stone floor with faint reflection in a dark editorial space.
>
> [PROGRAM BLOCK — see below]
>
> The companion's physical scale, head-to-body ratio, eye size, four short limbs,
> triangular side fins, burgundy cable tail and amber core family are identical to the
> supplied authority. Photoreal materials, controlled reflections, restrained brass,
> fine tactile grain, fixed camera at a low editorial eye level, generous padding.
>
> No text, no lettering, no numbers, no captions, no logos, no watermark, no interface
> graphics, no selection marker, no additional characters, no scale change, no growth,
> no humanoid anatomy, no fur, no weapons, no cyan, no teal, no neon purple.

**`S05-A` RESTORE:**
> The companion is exactly as the coherent authority — brass kintsugi seams tight and
> minimal, original silhouette unchanged, nothing added. It sits settled and square at
> rest inside a tight, plain transparent acrylic vitrine on a solid stone plinth, with
> nothing else in the case. The light is warm amber.

**`S05-B` ADAPT:**
> The companion has the same core body, re-equipped for a new environment: one additional
> small sensor module mounted beside one eye, wider articulated foot plates, and one
> functional shoulder mount. It stands alert and mid-turn with its weight shifted, on an
> open ring platform with no enclosure, and its spare attachments are laid out in a neat
> row on the floor beside it like a fitting kit. The light is neutral ivory-white.

**`S05-C` EVOLVE:**
> The companion retains exactly the same outer silhouette, but its shell is partly
> open-framed, revealing a denser and more sophisticated internal mechanism, and its amber
> core has separated into two smaller linked nodes joined by a fine burgundy conduit. Its
> repair seams are geometric and precise rather than organic. It stands still and level
> with the core forward, on a sectioned lit plinth with a thin cutaway band implying the
> internal architecture. The light is deep burgundy.

## Prompts still to be written

`S04-P01`, `S04-V01`, `S06-*`, `S07-01..05`, `S08-*`. Write these only after their
Questionnaire C answers are locked.

---

# PART 10 — THE QUESTIONNAIRE

Run in order. **Three questions per message, maximum.** Wait for answers before continuing.

## Questionnaire A — direction (ask first)

1. Are the three rewritten companion states (`FRACTURED` / `IN REPAIR` / `COHERENT`) the
   right progression, or do you want the middle state expressed differently than a
   left/right split?
2. Are `RESTORE` / `ADAPT` / `EVOLVE` still the right three programs, and are those the
   names that will appear in the live copy?
3. Which tool are we generating in — Google Flow with Omni Flash, Higgsfield, or both?
4. How damaged is too damaged? The fractured state is currently "neglected and
   unfinished". Should it be harsher or gentler?
5. Does the whole page keep the dark noir media language, or do some sections return to
   the ivory daylight look?

## Questionnaire B — character

1. Should the kintsugi seams stay brass, or become burgundy so they read at thumbnail size?
2. In the fractured state, should the missing head chunk be visible on the ground beside
   it, or absent entirely?
3. Does the companion ever face camera directly, or is three-quarter the permanent rule?
4. Should Sections 04–08 use the fractured, mid-repair or coherent state? (Current
   assumption: 03–04 fractured, 05 coherent as reference, 06 fractured, 07 mid-repair,
   08 mid-repair resolving to coherent.)

## Questionnaire C — per section

For each of 03, 04, 05, 06, 07, 08 — ask only when we reach it:

1. What is the single sentence this section must make a visitor feel?
2. Who is physically in frame, and is anyone identifiable?
3. Still, loop, or one-shot clip — and how long?
4. Where does the live HTML copy sit, so we protect that area as negative space?
5. What must **not** appear?

## Questionnaire D — production

1. Aspect ratios needed per asset — 16:9 only, or 16:9 plus a 4:5 mobile crop?
2. Resolution target and whether upscaling happens in-tool or locally.
3. How many variants per prompt before we choose?
4. Where do approved files land, and what is the naming convention?
5. Who gives final sign-off, and does anything need Marija's approval before it ships?

---

# PART 11 — PRODUCTION NOTES

## Google Flow

- **Gemini Omni Flash**: max **10 s**, max **1080p**, accepts text + image + video +
  audio simultaneously, supports **conversational multi-turn editing** — you can say
  "fix only the hands" instead of regenerating. ~20 credits per generation. Best choice
  for the Section 03 clip.
- **Veo 3.1**: documented at 4 / 6 / 8 s and 720p/1080p on the Vertex API surface; Flow
  coverage claims longer. Verify in the UI. Supports explicit first + last frame and up
  to three "ingredients" per prompt.
- **Unverified:** whether Omni Flash accepts an explicit first-frame + last-frame pair.
  The F0/F1 delta discipline depends on it. Ask the Flow Agent before spending credits —
  Agent chat is free, only generation costs.
- All Flow output carries an invisible, non-optional **SynthID** watermark.
- **Agent Instructions** (bottom of the prompt box → Add instruction) accept attached
  reference images and persist across the project. Put the character bible there.
- Save the consulting room as a **Scene** and the companion as a **Character** so later
  generations inherit them.
- Don't open the Agent on an empty project — upload references first.
- Negatives must be phrased positively: *"a room with no couch"* works;
  *"no couch"* alone tends to summon one. The prompts above already follow this.

## Higgsfield

- GPT Image 2: 12 credits per job, **`count` does not change the price** — always
  request 4 variants.
- Nano Banana Pro: 4 credits per job at 4K, also 4 variants for the same price.
- Purchased "365 Unlimited" entitlements are **website-only**; the API path bills credits.
- Seedance 2.0: 4–15 s, accepts `start_image` + `end_image`, `generate_audio: false`.

## Delivery

Derive locally and free: AVIF/WebP/JPG delivery copies, art-directed 4:5 mobile crops,
WebM video, poster stills, and the 3.5 s idle micro-loop that plays under the held final
frame so the clip never ends on a dead freeze.

---

# PART 12 — DECISIONS LOG

*(The assistant maintains this. Append every locked decision with its date. Nothing is
final until it appears here.)*

| Date | Decision | Locked by |
|---|---|---|
| 2026-08-14 | All previously generated media rejected; full rebuild | Rustam |
| 2026-08-14 | Companion states rewritten to FRACTURED / IN REPAIR / COHERENT | Rustam |
| 2026-08-14 | Three programs must differ in body, staging and light simultaneously | Rustam |
| 2026-08-14 | Section 03 becomes a dark consulting room, not a vitrine | Rustam |
| 2026-08-14 | Marija appears as foreground presence only in 03; full appearance in 04 with Rustam | Rustam |
| 2026-08-14 | Section 03 clip: 10 s, play once on enter, hold, idle micro-loop. No pin, no scrub. | Rustam |
