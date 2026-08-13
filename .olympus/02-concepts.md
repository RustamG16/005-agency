# Three design directions

## Shared constraints

- Build a separate `/about-v2`; preserve `/about` unchanged.
- Preserve the existing Archivo Black, Newsreader, and Inter typography; warm noir, cotton, and cherry palette; established header/footer; and the site’s editorial-industrial character.
- Position Convenium for high-budget luxury hospitality, real-estate, and adjacent premium businesses without claiming unverified clients or outcomes.
- Make Marija and Rustam visible as the people who sell and deliver the work, with their responsibilities clearly distinguished.
- Use motion and 3D only where they communicate capability. Every direction needs a reduced-motion/static fallback and a mobile-specific composition.
- Reuse the current Next.js, GSAP, Lenis, and Three.js stack. No new dependency is assumed.
- Generated luxury work must be labeled as a concept study unless it represents a real delivered project.

## Concept 1 — The Material Monolith

- **Thesis:** Turn the existing monolith into a changing luxury-material artifact whose surfaces reveal the studio’s thinking, proof, and two-person delivery model.
- **Best for:** Demonstrating real-time WebGL craft immediately while preserving the strongest recognizable structure of the current About page.
- **Why it fits:** Luxury property and hospitality buyers understand materiality—stone, glass, metal, light, scale. A monolith that transforms with purpose makes technical skill legible without abandoning Convenium’s current identity.
- **Page hierarchy and layout:**
  1. **Arrival — “Small enough to be personal. Built for ambitious places.”** The monolith appears as a closed smoked-glass object.
  2. **Luxury fit.** Three concise audience signals: hospitality, property, and experience-led premium brands.
  3. **Brand systems.** Stone/foil panels open to identity and campaign fragments; Marija’s role is introduced.
  4. **Digital environments.** The object becomes wireframe and spatial; Rustam’s design, engineering, WebGL, and motion role is introduced.
  5. **Content engine.** One screen becomes a short looping concept film while surrounding plates show social/campaign systems.
  6. **Two founders, one delivery line.** Real portraits replace placeholder cards; roles and shared process sit beside the resolved monolith.
  7. **Invitation.** Object closes into a cherry-lit portal leading to “Start a Project.”
- **Typography and color logic:** Keep the current fonts and warm noir ground. Use Archivo Black for decisive chapter claims, Newsreader for the premium editorial voice, and Inter for technical annotations. Cotton remains dominant; cherry appears only at interaction and material-transition moments. No extra colors except neutral material reflections.
- **Material and media logic:** Four coherent materials—smoked glass, dark travertine, brushed warm metal, and black lacquer—mark different capabilities. Surface plates show controlled concept-study fragments rather than unrelated decorative images.
- **Interaction/motion posture:** Keep the current long-form sticky-stage model but shorten total pacing by roughly 20–25%. One master GSAP timeline rotates, opens, fractures, and resolves the object. Copy reveals remain discrete. Hovering capability labels subtly lights the corresponding surface; no free-orbit interaction.
- **WebGL:** **Candidate, strongly justified.** The persistent object is both navigation and proof of the exact real-time 3D service being sold. It can extend the existing Three.js implementation rather than add a dependency.
- **Mobile behavior:** Replace the full object rotation with three controlled camera states. Chapters become shorter snap-like scenes with media above and copy below; the global guide is moved/suppressed around founder content. Static poster frames replace video textures on constrained devices.
- **Required assets:** Two founder portraits; one 4:5 monolith cover artwork; six square material/proof plates; one 6–8 second square silent screen loop; three high-resolution seamless material maps with legal provenance; optional environment/reflection map; three concept-study captions and provenance labels.
- **Implementation risk:** **Medium.** Reuses existing architecture, but texture legibility, GPU memory, mobile framing, and material color consistency require disciplined asset limits. Avoid physically heavy shaders and large 4K texture sets.
- **Accessibility/performance posture:** Canvas remains decorative; all meaning stays in semantic HTML. Cap DPR, gate video playback, use compressed WebP/AVIF and MP4/WebM, and preserve the existing reduced-motion normal-flow version with static chapter posters.
- **Representative frame/wireframe:**

```text
┌─────────────────────────────────────────────────────────────┐
│ LOGO                STUDIO                    START PROJECT  │
│                                                             │
│  03 / DIGITAL ENVIRONMENTS        ┌─────────────────────┐   │
│  THIS PAGE SHOULD                  │  MATERIAL MONOLITH  │   │
│  FEEL LIKE PROOF.                  │  opening → screen   │   │
│                                    │  plate / wireframe  │   │
│  Real-time 3D, motion and          └─────────────────────┘   │
│  engineering by Rustam.                    WEB · 3D · MOTION │
└─────────────────────────────────────────────────────────────┘
```

## Concept 2 — Two Hands, One Studio

- **Thesis:** Build the page around the complementary founders: two vertical creative tracks that repeatedly separate, exchange work, and reunite into one finished outcome.
- **Best for:** Establishing trust, personal access, and the rare breadth of a two-person senior team without making technology the only selling point.
- **Why it fits:** High-budget clients often fear handoffs to junior teams. This direction makes “the people you meet are the people who make the work” the primary commercial differentiator.
- **Page hierarchy and layout:**
  1. **Dual portrait arrival.** Marija and Rustam enter from opposite sides with one shared headline between them.
  2. **The split.** Left rail: negotiation, brand systems, graphic design, content, SMM. Right rail: creative direction, product design, software engineering, WebGL, motion, content generation.
  3. **The exchange.** Alternating work fragments cross the center line to show collaboration rather than isolated disciplines.
  4. **The client experience.** A concise five-step process—conversation, direction, prototype, production, launch—shows both founder owners at every step.
  5. **Premium-fit statement.** Specific language for hotels, real estate, and brands that treat digital presence as an asset rather than a commodity.
  6. **One studio.** Portraits meet in one shared cinematic frame, followed immediately by contact CTA and availability note.
- **Typography and color logic:** Same type system, but denser and more editorial than the current page. Archivo Black creates opposing vertical statements; Newsreader carries founder voice and process; Inter labels ownership. A hairline cherry axis divides the two tracks and becomes the final CTA rule.
- **Material and media logic:** Human-first photography, hands/process details, marked-up layouts, interface fragments, social/campaign crops, and restrained screen recordings. No generic luxury architecture unless it is a labeled concept study.
- **Interaction/motion posture:** GSAP is justified for synchronized dual-column choreography and the center-line exchange. Motion is closer to an editorial title sequence than a 3D demo: masked portrait reveals, horizontal transfers, split-screen pinning, and one final merge. CSS handles hover states.
- **WebGL:** **No.** A lightweight version is a strategic counterpoint: it proves Convenium can choose clarity and trust over spectacle. Small CSS perspective treatments can maintain depth without a second canvas.
- **Mobile behavior:** The two desktop rails become an alternating conversation: Marija card → shared outcome → Rustam card → shared outcome. A persistent M/R ownership marker replaces the desktop divider. Portraits remain 4:5 and never sit beneath the guide character. Total scroll is shorter than the current page.
- **Required assets:** Two final 4:5 founder portraits plus two alternate crops; two 5–7 second silent founder/process clips; six to eight genuine work-detail images or clearly labeled concept studies; four annotated process artifacts; optional founder signature/handwriting scans.
- **Implementation risk:** **Low–medium.** Strongest dependency is art direction and authentic photography. Motion complexity is manageable in existing GSAP. The concept fails if portraits feel generic, mismatched, or over-retouched.
- **Accessibility/performance posture:** All key content remains regular HTML and images. Videos are short, muted, optional, and poster-backed. Reduced motion shows the same editorial sequence without pinned exchanges.
- **Representative frame/wireframe:**

```text
┌─────────────────────────────────────────────────────────────┐
│ MARĲA / 01                    │                    02 / RUSTAM│
│ ┌────────────────────┐        │       ┌────────────────────┐ │
│ │  PORTRAIT / PROCESS│        │       │ PORTRAIT / PROCESS │ │
│ └────────────────────┘        │       └────────────────────┘ │
│ BRAND · CONTENT · SMM         │       WEB · 3D · ENGINEERING │
│ “I shape how it speaks.”      │       “I build how it works.”│
│                         ONE STUDIO.                           │
└─────────────────────────────────────────────────────────────┘
```

## Concept 3 — The Private Viewing

- **Thesis:** Present Convenium as a guided private viewing: one cinematic sequence moves through a fictional premium property while each room demonstrates a different layer of brand, content, and digital experience.
- **Best for:** Making the page feel unmistakably targeted at luxury hotels and real-estate businesses while showcasing cinematic art direction and scroll-led storytelling.
- **Why it fits:** Instead of merely saying “we understand luxury,” the page adopts the spatial rhythm of arrival, reveal, material detail, private access, and invitation familiar to hospitality and property sales.
- **Page hierarchy and layout:**
  1. **Threshold.** A closed architectural portal and the line “Digital places worth entering.”
  2. **Lobby — positioning.** Convenium’s two-person senior model appears like a property plaque/concierge card.
  3. **Gallery — identity and campaigns.** Framed graphic systems animate along a wall.
  4. **Suite — web product.** A display surface reveals interface and 3D product studies.
  5. **Terrace — content and reach.** Day-to-night transition carries social, campaign, and content capability.
  6. **Private table — founders.** Marija and Rustam appear in a composed editorial diptych with their ownership areas.
  7. **Invitation card.** “Request a private conversation” links to `/contact`.
- **Typography and color logic:** Existing typography behaves like luxury wayfinding: large Archivo room names, Newsreader invitation language, and Inter room numbers/specifications. The noir/cherry system remains dominant; generated environments use warm stone, smoked glass, dark wood, and selective cotton lighting.
- **Material and media logic:** A single continuous 12–16 second architectural film is the hero medium, delivered as scroll-scrub chapters with six intentional hold frames. Interface and identity studies appear as embedded displays inside the environment, not floating UI cards.
- **Interaction/motion posture:** GSAP ScrollTrigger scrubs the cinematic film or an image-sequence fallback. Copy enters only at established camera holds. Subtle pointer parallax affects foreground light, not camera navigation. This is a controlled film, not free navigation.
- **WebGL:** **No for the primary experience.** Pre-rendered cinematic media provides 3D art direction with more predictable lighting, mobile performance, and generative-video integration. A lightweight Three.js portal reflection is optional only if later testing proves communication value.
- **Mobile behavior:** Use a separately composed 9:16 film with closer crops and four rooms instead of seven. Chapter copy sits on opaque lower panels at camera holds. No desktop film is cropped into mobile. Reduced motion uses the six best still frames as an editorial sequence.
- **Required assets:** One 12–16 second 16:9 master architectural film; one 9:16 mobile cut; six desktop and six mobile poster frames; four interface/brand screen inserts; two founder portraits; one founder diptych; ambient room-tone audio only if an explicit opt-in control is approved; provenance for all generated architecture and embedded work.
- **Implementation risk:** **High.** Visual continuity across generated rooms, typography inside generated scenes, compression, scrub decoding, and separate mobile production demand the most asset work. Generated media must not imply a real client property.
- **Accessibility/performance posture:** Audio remains off by default. Use poster-first loading, short GOP video encoding, device-specific sources, and a still-frame reduced-motion version. HTML holds every message; video is illustrative.
- **Representative frame/wireframe:**

```text
┌─────────────────────────────────────────────────────────────┐
│ 04 / THE SUITE                              PRIVATE VIEWING │
│                                                             │
│      ┌──────────────── CINEMATIC ROOM ─────────────────┐    │
│      │ stone wall     embedded digital product screen │    │
│      │              slow camera hold                  │    │
│      └─────────────────────────────────────────────────┘    │
│ WEB PRODUCTS THAT FEEL BUILT INTO THE BRAND.                │
│ Strategy · Design · Engineering · WebGL                     │
└─────────────────────────────────────────────────────────────┘
```

## Meaningful differences

| Dimension | Concept 1 — Material Monolith | Concept 2 — Two Hands | Concept 3 — Private Viewing |
|---|---|---|---|
| Information model | Capability chapters carried by one transforming artifact | Founder ownership and collaboration drive the entire story | Audience-first spatial journey through a fictional luxury property |
| Composition | Alternating copy around a persistent central/right WebGL object | Dual rails, center exchange line, portrait-led editorial layout | Full-bleed cinematic rooms with timed wayfinding overlays |
| Primary media | Real-time 3D materials, plates, one embedded loop | Portraits, process clips, authentic work fragments | Generated 3D architectural film, posters, embedded screen inserts |
| Motion | Scrubbed WebGL transformation plus discrete reveals | Synchronized split-screen transfers and merges | Scroll-scrubbed cinematic film with camera holds |
| Luxury signal | Material craft and bespoke digital engineering | Founder access and senior personal service | Direct hospitality/property spatial language |
| Mobile model | Three controlled 3D camera states and shorter chapters | Alternating founder conversation | Separate vertical film with reduced room count |
| Production cost | Medium | Low–medium | High |
| Delivery risk | Medium | Low–medium | High |

## Concept Studio recommendation

**Recommend Concept 1 — The Material Monolith.** It addresses the user’s stated missing pieces directly, preserves the admired layout and animation structure, reuses the strongest technical investment already present, and demonstrates the high-end WebGL capability the target audience is expected to value. Unlike Concept 3, it can reach a convincing first implementation without depending on a long, continuity-sensitive generated film. Unlike Concept 2, it makes real-time 3D an unmistakable part of the sales argument while still strengthening founder trust and luxury positioning.

The three directions are frozen for independent critique. No production media has been generated and no implementation has begun.
