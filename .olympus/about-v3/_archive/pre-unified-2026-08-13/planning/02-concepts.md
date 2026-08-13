# Three design directions

## Shared constraints

- Route: `/about-v3`; concept and planning only in this run.
- Preserve Convenium's global navigation, footer behavior, Archivo Black / Newsreader / Inter typography, and noir / cotton / cherry identity.
- Do not reuse either previous About page's structure, copy, monolith, or decorative WebGL.
- Do not repeat the Homepage's principles/FAQ, the Services directory, the Work grid, or the Contact page's complete form.
- Public story: boutique, founder-led, selective, attentive, multilingual and technically capable. AI remains an internal method, not the proposition.
- Trust must come from founder experience, clearly labelled independent work, real documents and observable working behavior—not invented studio clients, testimonials or outcomes.
- Public proof baseline: “10+ years in software and digital production” and “20+ projects shipped” as Rustam's career experience, pending final factual verification. Employer experience must never be styled as a Convenium client list.
- “Psychology-informed discovery” means structured listening that helps a client articulate preferences, motives and trade-offs. It must not imply therapy or a clinical qualification.
- Showreel target: 45–60 seconds, intentional playback with captions/transcript, plus a quiet 8–12 second poster loop. It should combine the two supplied scroll recordings, existing independent-work footage and newly produced founder/process footage.
- WebGL: no for all three. A meaningful page can be built through editorial composition, real media and controlled scroll choreography; another abstract 3D object would weaken the About story.
- Conversion: a compact first-step project-fit module that reuses the future shared Contact submission system. It may ask one useful opening question and then expand/continue, but it must not become a second disconnected form.
- Motion: GSAP/ScrollTrigger is justified only for chapter transitions, media choreography and restrained scroll-linked typography. All essential content remains present without animation and has a reduced-motion state.

## Concept 1 — The Private Briefing

- **Thesis:** Convenium feels like entering a discreet, highly prepared first meeting in which two senior makers listen closely, reveal how they think and turn an indistinct ambition into a precise digital direction.
- **Best for:** Premium hospitality, property, architecture and founder-led brands whose buyer values discretion, taste, clarity and direct senior attention more than agency scale.
- **Why it fits:** It makes the About page useful to a cautious premium buyer: who will listen, what the first conversation feels like, how ambiguity becomes direction, and why the founders are credible. It avoids repeating deliverables and portfolio cards.
- **Page hierarchy and layout:**
  1. **Arrival / thesis:** a calm cotton field with an oversized editorial statement: “A small studio for businesses that cannot afford to look ordinary.” Supporting copy promises direct founder access and limited concurrent engagements. A narrow “Klagenfurt / working internationally / seven languages” evidence rail anchors the claim.
  2. **The room:** one cinematic two-founder image occupies roughly two thirds of the viewport; an adjacent editorial note introduces Rustam and Marija as the people present from first conversation through final review.
  3. **Showreel theatre:** a noir inset, about 25% into the page, labelled “Selected motion, interfaces and image-making / 00:55.” The reel is proof, not the hero slogan.
  4. **What we listen for:** three long-form editorial chapters—identity/status, commercial reality, and personal taste. Each pairs a concise question with a visual annotation or working artifact. This explains the psychology-informed discovery without pretending to show a client session.
  5. **Two people, clear ownership:** an asymmetric founder spread. Rustam's column focuses on direction, design, engineering, motion and delivery; Marija's on visual communication, social content, negotiation and multilingual continuity. Career facts and portfolio/CV links sit in restrained footnotes.
  6. **How the relationship feels:** a vertical “before / during / after” collaboration agreement covering response rhythm, who joins meetings, language matching, decision checkpoints and what happens when trusted specialist insight is needed. This is behavior, not a Services process.
  7. **Independent proof ledger:** two full-width media strips from real work, explicitly labelled “Founder work / selected independent projects.” Each shows one problem, one judgment and one observable detail; it links out to Work rather than reproducing a case study.
  8. **Private invitation:** noir closing field with a single opening prompt—“What should feel different when this project is finished?”—then a clear continuation into the shared project inquiry flow. Convenium footer follows.
- **Typography and color logic:** Newsreader carries reflective statements, pull quotes and questions; Archivo Black is reserved for decisive chapter titles; Inter handles evidence, languages and annotations. Cotton dominates roughly 65%, noir 30%, cherry under 5% for focus and action. Fine rules, marginal notes and editorial folios create precision without borrowing Symbol's layouts.
- **Media strategy:** Human presence is primary. One two-founder hero, two individual portraits, observed working-detail stills and a restrained showreel form a coherent photographic essay. Existing site footage appears only where it proves a judgment. No generic luxury stock, fake meeting imagery or decorative 3D.
- **Interaction/motion posture:** Measured and cinematic. The opening statement resolves in two short typographic beats; the hero image slowly reveals through a moving crop; the showreel enters as a dark spatial interruption; discovery questions crossfade with their annotations; the proof ledger uses horizontal media movement inside normal vertical scroll. No long empty pins. Reduced motion uses immediate reveals and native video controls.
- **WebGL:** No. The core communication value is intimacy and evidence; a 3D scene would compete with both.
- **Mobile behavior:** The evidence rail becomes a compact four-item ribbon below the thesis. The hero uses a portrait crop rather than shrinking the desktop composition. “What we listen for” becomes three tap-to-focus editorial cards with all copy accessible in the document. Founder ownership alternates image/copy rather than stacking two identical bios. Proof strips become swipeable with visible progress and non-swipe links. The fit prompt opens an accessible stepped form or routes to Contact.
- **Required assets:** one horizontal two-founder editorial portrait; two individual portrait crops; 6–8 authentic hands/materials/screen/studio-detail stills; 3–5 short founder/process video clips; two clean scroll-site recordings; selected existing work loops; CV/award/education documents already linked; verified Marija bio/languages; showreel master, poster loop, captions and transcript.
- **Implementation risk:** Medium. The grid and GSAP choreography are controlled, but the direction depends on excellent founder photography and a disciplined showreel edit. Without those assets it will feel sparse again. The form requires a real shared submission backend during implementation.
- **Representative frame/wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────┐
│ GLOBAL HEADER                                                        │
├──────────────────────────────────────────────────────────────────────┤
│ A SMALL STUDIO FOR BUSINESSES         KLAGENFURT  /  INTERNATIONAL  │
│ THAT CANNOT AFFORD TO LOOK ORDINARY.  7 LANGUAGES / 2 FOUNDERS      │
│                        [quiet scroll cue]                             │
├───────────────┬──────────────────────────────────────────────────────┤
│ editorial     │                                                      │
│ note: direct  │        TWO-FOUNDER CINEMATIC PORTRAIT                │
│ access        │                                                      │
├───────────────┴──────────────────────────────────────────────────────┤
│ SHOWREEL / 00:55                    [cinematic work + human montage] │
│ [play]                                                               │
├──────────────────────────────┬───────────────────────────────────────┤
│ WHAT WE LISTEN FOR           │  01 STATUS / 02 REALITY / 03 TASTE  │
│ long-form question           │  annotated working evidence          │
└──────────────────────────────┴───────────────────────────────────────┘
```

## Concept 2 — Two Lenses, One Direction

- **Thesis:** The page is a visible conversation between two complementary founders, showing how different perspectives and languages converge into one exact interpretation of a client's ambition.
- **Best for:** Founder-led premium businesses that fear being misunderstood, passed between departments or forced into a generic agency method.
- **Why it fits:** The two-person structure becomes the design system and the central proof. It makes Marija essential rather than a secondary biography, turns multilingual communication into a concrete advantage and gives the page an original story the other routes do not own.
- **Page hierarchy and layout:**
  1. **Dual opening:** the viewport is divided by an active central seam. Rustam begins one half—“We build the system.” Marija begins the other—“We protect how it is understood.” On scroll the two sentences align into the shared thesis: “One studio, one conversation, one accountable direction.”
  2. **Origins in parallel:** two non-symmetrical timelines run beside each other: engineering/design/career evidence on one side; social communication/graphic design/community/negotiation on the other. Cross-connections mark the decisions that formed Convenium. The page says the studio is new without announcing “no clients”: its credibility is explicitly founder experience brought together under a new name.
  3. **Conversation reel:** the showreel is an intercut diptych—interfaces and systems on one side, communication/images/human detail on the other—periodically joining full-width. Minimal subtitles let each founder state one sentence about their responsibility. It appears earlier than in Concept 1, immediately after origin.
  4. **The translation table:** real buyer statements occupy the center (“I want it to feel exclusive, but not cold”). Rustam's interpretation, Marija's interpretation and the shared design decision unfold across three columns. Four examples demonstrate listening without claiming client research; they are clearly labelled “How we interrogate a brief.”
  5. **Language as continuity:** a circular/linear language map explains who leads German, English, Croatian, Italian, Russian, Turkish and Azerbaijani conversations, how summaries are confirmed, and how meaning is preserved between meeting and implementation. No flag-wall decoration.
  6. **Decision duet:** a scroll chapter alternates ownership across discovery, direction, making, review and ongoing activation. Only behavior and responsibility are described; deliverables link to Services.
  7. **Credibility, not scale:** one composed evidence table separates founder career experience, independent published work and Convenium standards. Links point to Rustam's CV/portfolio and selected Work entries. A short note explains that trusted specialists may be consulted when their expertise materially improves a decision, while founder accountability remains intact.
  8. **Begin with one sentence:** the two columns merge into one noir closing plane containing the opening project-fit question and continuation to the shared inquiry flow.
- **Typography and color logic:** The same type families play two voices: Rustam's information uses precise Inter and controlled Archivo Black; Marija's uses Newsreader for nuance with Inter labels; shared conclusions combine both. Cotton and warm white alternate subtly across the split, with noir only when the two sides converge. Cherry animates along the central seam and marks agreement, not decoration.
- **Media strategy:** Two coordinated portrait sessions with different but compatible lighting/crops; paired working shots; a diptych showreel; screen recordings and graphic/social artifacts divided by responsibility, then reunited. Media must show complementary authorship rather than two headshots beside job titles.
- **Interaction/motion posture:** The central seam responds to scroll and occasional pointer movement within strict limits. Split media drifts at slightly different rates, then locks when a shared decision appears. Translation examples use a short three-step reveal. GSAP/ScrollTrigger is justified for synchronization and the joining motion. Reduced motion presents fixed side-by-side/stacked conclusions with no dependency on the seam.
- **WebGL:** No. The meaningful interactive object is the relationship between two perspectives, which is clearer and lighter in DOM/CSS/GSAP.
- **Mobile behavior:** Mobile does not collapse into “Rustam, then Marija.” Each chapter uses a visible R / M / WE tab strip and short alternating panels; shared conclusions always follow both perspectives. The conversation reel uses vertical split or fast-cut full-frame edits prepared specifically for 9:16. The language map becomes an accessible role list. The center seam becomes a persistent 1px timeline with labelled intersections.
- **Required assets:** matched portrait set for both founders (horizontal, vertical, close crop); 4–6 paired working/detail shots; 6–10 short clips divided across each founder's role; two scroll recordings; 3–4 Marija graphic/social artifacts with rights; verified Marija origin/role/language copy; Rustam career documents and portfolio links; recorded one-line founder voice/text statements; diptych showreel in 16:9 and 9:16; captions/transcript/poster.
- **Implementation risk:** Medium-high. The concept is differentiated, but editorial balance depends on equivalent evidence for both founders. It requires careful responsive art direction and bespoke showreel editing. If Marija's artifacts or bio remain provisional, the two-column promise becomes visually uneven.
- **Representative frame/wireframe:**

```text
┌───────────────────────────────┬──────────────────────────────────────┐
│ RUSTAM                        │ MARIJA                               │
│ WE BUILD THE SYSTEM.          │ WE PROTECT HOW IT IS UNDERSTOOD.    │
│             ╲                 │                 ╱                    │
│              └──── ONE ACCOUNTABLE DIRECTION ─┘                    │
├───────────────────────────────┼──────────────────────────────────────┤
│ origin / engineering / design │ origin / social / communication     │
│ career evidence               │ lived community experience          │
├───────────────────────────────┴──────────────────────────────────────┤
│ CONVERSATION REEL     [split footage → one full-width composition] │
├──────────────────┬─────────────────────┬─────────────────────────────┤
│ CLIENT PHRASE    │ R / M INTERPRET     │ WE DECIDE                   │
│ “exclusive...”  │ tension + motive    │ specific design principle   │
└──────────────────┴─────────────────────┴─────────────────────────────┘
```

## Concept 3 — The Studio Journal

- **Thesis:** Convenium is introduced as a living, edited record of decisions, experiments and founder evidence—less a corporate biography than a proof-rich journal of how taste becomes a working digital system.
- **Best for:** Design-literate creative directors, developers, architects and premium founders who judge a studio by the quality of its artifacts and thinking before they read a long origin story.
- **Why it fits:** This is the most media-dense and proof-first direction. It addresses the current emptiness while keeping claims honest: the studio can show independent work, documents, interface details, visual experiments and decision notes without pretending they are Convenium client results.
- **Page hierarchy and layout:**
  1. **Journal cover / reel:** a large noir editorial cover leads with the showreel itself, not an abstract hero. Overlaid issue metadata reads “Convenium / About the studio / Klagenfurt / 2026.” A short cotton statement beneath defines the boutique model and limited capacity.
  2. **Issue index:** a sticky but compact contents rail lists Origin, Two Authors, Evidence, Reading a Brief, Standards and Invitation. It makes a long dense page easy to scan and gives every chapter a purpose.
  3. **Origin essay:** a multi-column editorial story about the transition from software engineering and independent making into Convenium, interrupted by real timeline documents, CV fragments and a link to Rustam's portfolio. Marija's provisional story appears only after verification.
  4. **Two authors / contact sheet:** a modular contact sheet mixes portraits, role notes, handwriting/annotations, language labels and working stills. Hover/focus reveals one responsibility or belief per frame; it never becomes a generic team grid.
  5. **Evidence cabinet:** a dense but labelled set of artifacts—project motion crop, code/system diagram, graphic/social artifact, award/document detail, design iteration. Each has provenance (“founder career,” “independent work,” or “studio experiment”), one-line context and an external/deeper link.
  6. **Reading a brief:** one long annotated case simulation starts with an intentionally ambiguous fictional premium-hotel brief, then exposes questions, tensions, mood directions and a decision memo. It demonstrates the method without fabricating a real client. The scenario is visibly labelled “Demonstration, not client work.”
  7. **Studio standards:** a typographic charter of five specific operating commitments—direct access, written decisions, paced review, language continuity and honest scope. Each commitment expands to one short practical example. These are standards, not Homepage philosophy cards.
  8. **Elsewhere / next:** an asymmetric editorial index sends visitors to one Services entry and two selected Work stories, then opens the compact project-fit question on a noir field before the global footer.
- **Typography and color logic:** Archivo Black functions as journal masthead, issue numerals and chapter markers; Newsreader carries the origin essay and captions; Inter handles metadata, provenance and navigation. Alternating cotton sheets, thin noir rules and one full noir opening/closing create the feel of an art/architecture annual. Cherry behaves like an editor's mark—underlines, crop marks, active index state—not a large fill.
- **Media strategy:** Maximum authentic artifact density. The showreel is the opening proof layer; portraits appear as a contact sheet; work is shown through close crops and annotated details rather than duplicate project cards. Documents, diagrams, mood fragments and clearly labelled studio demonstrations support the claim that the founders think rigorously.
- **Interaction/motion posture:** Editorial rather than cinematic. The sticky issue index highlights chapters; media contact sheets reveal captions on focus; artifact rows use controlled lateral movement; the fictional brief becomes a scroll-linked annotated board. GSAP is justified for index synchronization and the single brief deconstruction, not every module. Reduced motion keeps the entire board visible and uses native anchor navigation.
- **WebGL:** No. The page's richness comes from provenance and editorial assembly. If future real 3D work becomes available, it can appear as video/canvas within the evidence cabinet rather than as ambient decoration.
- **Mobile behavior:** The issue index becomes a top progress dropdown with anchors. Multi-column essays become short editorial blocks separated by full-bleed evidence. The contact sheet uses a two-column rhythm with visible captions instead of hover. The evidence cabinet becomes a filterable provenance list (“career / independent / experiment”) with no masonry dependence. The fictional brief uses a sequence of five annotated frames instead of a pinned oversized board.
- **Required assets:** 45–60s showreel and poster; founder portrait/contact-sheet set; 8–12 authentic working/detail stills; two scroll recordings and selected existing project clips; verified documents/career milestones; 5–8 publishable screenshots/artifacts with provenance and permissions; 2–3 Marija social/graphic artifacts; handwriting/mark-making samples or designed annotations; a clearly fictional premium-hospitality brief and its created mood/decision artifacts; captions/transcript.
- **Implementation risk:** High content-production risk, medium technical risk. The layout is technically achievable in the current stack, but it demands the largest volume of curated, rights-cleared material and rigorous provenance labels. Too many weak artifacts would feel like filler; too many simultaneous scroll effects would damage readability and mobile performance.
- **Representative frame/wireframe:**

```text
┌──────────────────────────────────────────────────────────────────────┐
│ CONVENIUM / ABOUT / ISSUE 01                              2026      │
│                                                                      │
│            [SHOWREEL AS MOVING EDITORIAL COVER]        PLAY 00:55   │
├──────────────┬───────────────────────────────────────────────────────┤
│ ISSUE INDEX  │ A BOUTIQUE STUDIO, EDITED AROUND EACH COMMISSION.    │
│ 01 ORIGIN    │ short thesis + limited-capacity note                 │
│ 02 AUTHORS   ├────────────────────────┬──────────────────────────────┤
│ 03 EVIDENCE  │ origin essay           │ document / portrait / note   │
│ 04 BRIEF     ├──────────┬─────────────┼────────────┬─────────────────┤
│ 05 STANDARDS │ artifact │ artifact    │ artifact   │ artifact        │
│ 06 INVITE    │ labelled provenance on every item                   │
└──────────────┴──────────┴─────────────┴────────────┴─────────────────┘
```

## Meaningful differences

| Dimension | Concept 1 — Private Briefing | Concept 2 — Two Lenses | Concept 3 — Studio Journal |
|---|---|---|---|
| Information model | Buyer questions and relationship expectations | Two founder perspectives converging into shared decisions | Edited archive of origin, evidence and working artifacts |
| Composition | Asymmetric editorial spreads with cinematic interruptions | Persistent dual-column/seam system that joins at conclusions | Dense journal grid with issue index, contact sheets and provenance labels |
| Media | Human-first photography; showreel as early proof | Paired founder media and diptych showreel | Showreel-first plus maximum artifact/document density |
| Motion | Slow reveals, moving crops, restrained proof-strip travel | Synchronized split movement and merge moments | Chapter index, contact-sheet reveals and one annotated brief board |
| Main differentiator | Discreet high-touch client experience | Being understood through complementary founders and languages | Visible rigor and breadth of evidence |
| Production cost | Medium | Medium-high | High |
| Primary risk | Weak photography makes the page sparse | Unequal founder evidence weakens the central metaphor | Asset volume becomes filler or overwhelms the story |

## Recommendation

**Recommend Concept 1 — The Private Briefing.** It best matches the buyer's emotional risk: premium decision-makers are not only purchasing output; they are choosing who will understand, guide and remain accountable for an identity-sensitive commission. It gives Convenium a confident boutique posture without needing a long client history, uses the showreel as proof rather than spectacle, and creates enough media density without requiring the very large artifact library of Concept 3.

Concept 2 is the strongest alternative if Marija can supply equally credible story, media and artifacts before implementation. Concept 3 is the boldest editorial object, but it should be selected only if the full evidence cabinet can be produced at a consistently high level.
