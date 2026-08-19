import { withBasePath } from "@/lib/basePath";
/**
 * `/about` content — the studio page. Originally built and evidenced under
 * `/about-v3` against the confirmed UI lockups in
 * `.olympus/about-v3/media/confirmed-ui-lockups/`, then promoted to replace
 * the earlier Monolith-based `/about` once the founder hero media, copy pass
 * and footer landed.
 *
 * Three rules govern every string below:
 *
 *  1. Nothing here may claim a result, a launch, a metric, a testimonial or a
 *     client approval. The proof section in particular describes proposal-stage
 *     work and says so in its own labels.
 *  2. Marija's biography is not published because it has not been confirmed.
 *     The gap is stated, never filled in.
 *  3. The lockups' obsolete copy is corrected here rather than reproduced:
 *     the arrival section drops "a little like therapy", and the orchestration
 *     section drops "idea-creature". The compositions are the reference; this
 *     copy is not.
 */

export type ComparisonSource = {
  /** Deterministic capture of the current proposal. */
  proposed: string;
  /**
   * Deterministic capture of the client's existing site at a matched viewport.
   * `null` means no verified source exists — the section renders its
   * "Existing capture required" state instead of a comparison.
   */
  existing: string | null;
  /** Matched capture viewport, shown in the provenance line when both exist. */
  viewport: string;
};

export const about = {
  meta: {
    title: "About Convenium Studio",
    description:
      "Two founders, no departments between them — how Convenium turns an unfinished idea into a built, working site.",
  },

  /* 00 — Hero banner ------------------------------------------------------
   *
   * The masthead above Section 03. It opens on an 8-second take of the two
   * founders standing apart under red panels, then scroll dissolves everything
   * except the two panel frames to cotton and builds the editorial layer
   * around them.
   *
   * `frames` is the one place the photographic fill is named. `base` is a crop
   * of the held film frame and ships day one; `fill` is a crop of the
   * higher-fidelity founder plate and is the scroll-triggered finale reveal.
   */
  hero: {
    label: "About",
    heading: ["The studio", "is two", "people."],
    lede:
      "Rustam and Marija. Everything Convenium ships passes through both of them — designed, built, and signed off by name.",
    meta: ["Convenium Studio", "About", "Two founders"],
    /**
     * The pre-scroll title in the gap between the two founders. Visible while
     * the opening film plays, gone within the first beat of scroll — well
     * before the editorial heading below arrives in the same space.
     */
    intro: {
      heading: ["No department", "between you", "and the work."],
    },
    people: {
      left: { name: "Rustam", discipline: "Design + Engineering" },
      right: { name: "Marija", discipline: "Communication + Direction" },
    },
    media: {
      film: withBasePath("/media/hero/about-hero.mp4"),
      filmMobile: withBasePath("/media/hero/about-hero-m.mp4"),
      still: withBasePath("/images/hero/about-hero-last.webp"),
      stillMobile: withBasePath("/images/hero/about-hero-last-mobile.webp"),
      alt:
        "Two figures standing apart in a dark room, each lit from behind by a tall red panel.",
    },
    frames: {
      a: {
        base: withBasePath("/images/hero/frame-a-base.webp"),
        fill: withBasePath("/images/hero/frame-a-fill.webp") as string | null,
      },
      b: {
        base: withBasePath("/images/hero/frame-b-base.webp"),
        fill: withBasePath("/images/hero/frame-b-fill.webp") as string | null,
      },
    },
  },

  /* 03–06 — The journey ---------------------------------------------------
   *
   * Sections 03 to 06 are presented as one pinned scroll sequence: three
   * rooms, two orbital camera transitions, darkness as the cut. The copy for
   * each beat still lives in its own section object below — only the media is
   * described here, because the media is now three continuous takes rather
   * than four separate plates.
   *
   * `video: null` means that take has not been delivered yet. The room falls
   * back to its still, which is the same plate the section used before the
   * merge, so the sequence is complete and shippable at every stage of media
   * production rather than only at the end of it.
   *
   * Prompts, camera contract and encoding settings:
   * `.olympus/about-v3/media/AV3-JOURNEY-FLOW-PRODUCTION-GUIDE.md`
   */
  journey: {
    label: "From your idea to the direction you choose",
    rooms: {
      consulting: {
        video: withBasePath("/media/journey/consulting.mp4") as string | null,
        mobile: withBasePath("/images/about-v3/consulting-mobile.webp") as string | null,
        poster: withBasePath("/images/about-v3/consulting.webp"),
        alt:
          "First-person view from a seated consultation chair in a dark room lit by vertical red light panels; a consultant sits opposite in a black swivel chair with an open notepad.",
        meta: ["Room 01", "Consulting", "Section 03"],
      },
      lab: {
        video: withBasePath("/media/journey/lab.mp4") as string | null,
        mobile: withBasePath("/images/about-v3/lab-mobile.webp") as string | null,
        poster: withBasePath("/images/about-v3/lab.webp"),
        alt:
          "First-person view entering a dark strategy room where two consultants stand at a large illuminated wall board, studying a website analysis and talking to each other.",
        meta: ["Room 02", "Analysis", "Sections 04–05"],
      },
      directions: {
        video: withBasePath("/media/journey/directions.mp4") as string | null,
        mobile: withBasePath("/images/about-v3/directions-mobile.webp") as string | null,
        poster: withBasePath("/images/about-v3/directions.webp"),
        alt:
          "First-person view looking down at a dark table where three framed website design directions lie side by side, equally lit.",
        meta: ["Room 03", "Directions", "Section 06"],
      },
    },
  },

  /* 03 — Your idea is enough --------------------------------------------- */
  arrival: {
    index: "03",
    label: "Understanding",
    heading: ["Your idea", "is enough.", "We'll help you", "express it."],
    body:
      "Bring the idea — even if you cannot explain it yet. The first conversation is you talking and us taking notes. Nothing is proposed until we understand what you actually want.",
    caption: "Nothing arrives too early.",
    meta: ["Arrival plate", "Still", "Section 03"],
    media: {
      src: withBasePath("/images/about-v3/arrival.webp"),
      mobile: withBasePath("/images/about-v3/arrival-mobile.webp"),
      alt:
        "A compact ivory-and-burgundy companion, its shell panels gently loosened, resting intact on a low acrylic intake tray in a quiet ivory and near-black room.",
    },
  },

  /* 04 — Analysis -------------------------------------------------------- */
  analysis: {
    index: "04",
    label: "Analysis",
    heading: ["We read", "what you", "already have."],
    body:
      "What you already have goes up on one board — the pages, the words, the way people move through them. We read it in the open and tell you what we see, including the parts that are working.",
    meta: ["Lab plate", "Still", "Section 04"],
    media: {
      src: withBasePath("/images/about-v3/lab.webp"),
      mobile: withBasePath("/images/about-v3/lab-mobile.webp"),
      alt:
        "The same compact companion resting inside a lit acrylic observation cradle, with three thin glass measuring instruments standing behind it on a dark stone bench.",
    },
    profile: {
      title: "Idea profile",
      number: "01",
      rows: [
        { term: "Core", question: "What must remain", answer: "Essence" },
        { term: "Audience", question: "Who must care", answer: "Right people" },
        { term: "Feeling", question: "What it should create", answer: "Resonance" },
        { term: "Tension", question: "What makes it distinct", answer: "Irreplaceable" },
      ],
      status: "Profile in progress",
    },
  },

  /* 05 — Three ways forward ---------------------------------------------- */
  programs: {
    index: "05",
    label: "Direction",
    heading: ["One reading.", "Three directions."],
    body:
      "One reading of the work becomes three directions. They are genuinely different from one another, they are put in front of you side by side, and none of them is the one we are quietly recommending.",
    meta: ["Program study", "Three directions", "None preselected"],
    media: {
      src: withBasePath("/images/about-v3/programs-shared.webp"),
      alt:
        "The same compact companion lit on a central plinth, with three transparent projection cases standing behind it, each holding a different version of the same figure.",
    },
    items: [
      {
        key: "restore",
        index: "01",
        title: "Restore",
        body: "Keep the character the work already has, settle what has drifted out of line, and return it to something calm and consistent.",
        image: withBasePath("/images/about-v3/program-restore.webp"),
      },
      {
        key: "adapt",
        index: "02",
        title: "Adapt",
        body: "Keep the core and rebuild the structure around it — clearer routes through the pages, a layout that flexes, room to add.",
        image: withBasePath("/images/about-v3/program-adapt.webp"),
      },
      {
        key: "evolve",
        index: "03",
        title: "Evolve",
        body: "A different posture altogether — a bolder voice, a wider range, a presence that reads as new rather than revised.",
        image: withBasePath("/images/about-v3/program-evolve.webp"),
      },
    ],
  },

  /* 06 — System intake --------------------------------------------------- */
  intake: {
    index: "06",
    label: "Decision",
    heading: ["The one you choose", "is what gets built."],
    body:
      "The three lie side by side, lit the same, and the choice is yours. Whichever one you point at is the one that gets built — carried through as it was shown to you, not quietly traded for a safer version.",
    stageLabel: "Chosen direction",
    meta: ["Three directions", "None ranked"],
    states: {
      idle: "Three directions on the table",
      accepted: "Direction chosen",
    },
    action: { start: "Choose a direction", reset: "Return to all three" },
    media: {
      start: {
        src: withBasePath("/images/about-v3/directions.webp"),
        alt:
          "Three framed website design directions lying side by side on a dark table, equally lit, none of them singled out.",
      },
      end: {
        src: withBasePath("/images/about-v3/directions.webp"),
        alt:
          "The same three framed directions on the dark table, with the chosen one lifted clear of the other two.",
      },
    },
  },

  /* 07 — Orchestration atlas --------------------------------------------- */
  orchestration: {
    index: "07",
    label: "Orchestration",
    heading: ["The right specialist.", "For every task."],
    body:
      "Apollo takes one approved direction, breaks it into focused tasks, assigns the right specialist to each, and reassembles the results into one coherent product.",
    inside: {
      title: "Inside the system",
      steps: ["Route", "Assign", "Create", "Review", "Integrate"],
    },
    overview: {
      src: withBasePath("/images/about-v3/orchestration-overview.webp"),
      alt:
        "Apollo standing behind five upright glass panels arranged in an arc, each showing a different kind of working material, with the compact companion on the central plinth.",
    },
    diagram: {
      title: "How Apollo orchestrates",
      body:
        "Every task carries its own brief, its own specialist, and a review gate before it rejoins the whole. Nothing ships without passing back through Rustam.",
      facts: [
        { term: "System owner", value: "Apollo" },
        { term: "Final direction", value: "Rustam" },
        { term: "Approved plan", value: "One agreed direction" },
      ],
      input: "Approved plan",
      orchestrator: "Apollo / Orchestrator",
      integration: "Integration",
      output: "Rustam / Final direction",
    },
    lanes: [
      {
        key: "visual",
        index: "01",
        role: "Visual Director",
        skill: "Asset generation",
        short: "Visual",
        summary: "Identity, imagery, art direction.",
        image: withBasePath("/images/about-v3/specialist-visual.webp"),
        alt: "A specialist reviewing colour and layout studies on a lit glass panel beside the companion.",
      },
      {
        key: "content",
        index: "02",
        role: "Content Strategist",
        skill: "Messaging",
        short: "Content",
        summary: "Message, structure, expression.",
        image: withBasePath("/images/about-v3/specialist-content.webp"),
        alt: "A specialist arranging message and structure cards on a lit glass panel beside the companion.",
      },
      {
        key: "engineering",
        index: "03",
        role: "Design Engineer",
        skill: "Interface systems",
        short: "Experience",
        summary: "Interface, responsive system, interaction.",
        image: withBasePath("/images/about-v3/specialist-engineering.webp"),
        alt: "A specialist mapping interface components across a lit glass panel beside the companion.",
      },
      {
        key: "motion",
        index: "04",
        role: "Motion Specialist",
        skill: "GSAP",
        short: "Motion",
        summary: "Purposeful movement and timing.",
        image: withBasePath("/images/about-v3/specialist-motion.webp"),
        alt: "A specialist drawing a timing curve on a lit glass panel beside the companion.",
      },
      {
        key: "quality",
        index: "05",
        role: "Quality Critic",
        skill: "Accessibility + QA",
        short: "Quality",
        summary: "Accessibility, consistency, performance.",
        image: withBasePath("/images/about-v3/specialist-quality.webp"),
        alt: "A specialist checking a list of quality criteria on a lit glass panel beside the companion.",
      },
    ],
    stages: [
      { index: "01", verb: "Decompose", body: "The approved direction becomes bounded, testable tasks." },
      { index: "02", verb: "Match", body: "Apollo selects the agent whose role fits the task." },
      { index: "03", verb: "Equip", body: "The matching skill supplies the standards and constraints for that task." },
      { index: "04", verb: "Coordinate", body: "Dependencies, handoffs and shared context stay aligned." },
      { index: "05", verb: "Verify", body: "Specialist results are reviewed and integrated before delivery." },
    ],
    integration: {
      title: "Coordinated work. Signed off by one person.",
      body:
        "Every specialist works on one dimension of the same idea. Apollo checks the pieces fit before Rustam signs off on the whole.",
      claim: ["One system /", "Many specialists /", "One human sign-off."],
      media: {
        src: withBasePath("/images/about-v3/recovery-end.webp"),
        alt:
          "Apollo standing over the reassembled compact companion on a lit circular plinth, the surrounding apparatus withdrawn.",
      },
    },
    principles: [
      { title: "Focused expertise", body: "Each agent gets only the task and skill it needs." },
      { title: "Shared direction", body: "Every specialist works from the same approved plan." },
      { title: "Human accountability", body: "Rustam signs off on everything before it ships." },
    ],
    boundary:
      "System surface shown — internal prompts, routing criteria and private logic remain protected.",
  },

  /* 08 — Proof ------------------------------------------------------------ */
  proof: {
    index: "08",
    label: "Real work",
    heading: ["The metaphor ends here.", "The work doesn't."],
    body: "Two live projects, shown honestly — proposal stage, no invented outcomes, no cherry-picked angles.",
    labels: {
      proposed: "New direction",
      existing: "Existing website",
      pendingTitle: "Existing capture required",
      pendingBody: "Matched viewport / pending source",
      hint: "Drag, or use the arrow keys",
      viewNew: "View new",
      viewOld: "View old",
    },
    marks: [
      "Actual project files, not renders.",
      "No invented metrics.",
      "Old-site captures pending — sliders arrive once they exist.",
    ],
    footnote:
      "Before/after sliders appear only once we have a matched old capture at the same viewport.",
    projects: [
      {
        key: "sonnwerk",
        index: "01",
        name: "Sonnwerk",
        stage: "Proposal-stage redesign",
        scope: ["Digital experience /", "Responsive website"],
        note: "A clearer digital expression for an established brand.",
        newHref: "https://rustamg16.github.io/002-sonnwerk/",
        oldHref: "https://sonn-werk.at/",
        // Deterministic capture of the live proposal, produced by
        // scripts/capture-preview.mjs. Never a mockup — see PROJECT-PREVIEW-GUIDE.md.
        source: {
          proposed: withBasePath("/works/sonnwerk/cover.jpg"),
          existing: null,
          viewport: "1920 × 1080",
        } as ComparisonSource,
      },
      {
        key: "meridian",
        index: "02",
        name: "The Meridian",
        // Labelled a concept build because it is one. `content/projects.ts` says the same.
        stage: "Concept build",
        scope: ["Digital experience /", "Responsive website"],
        note: "Art direction and front-end for a concept hospitality brand.",
        newHref: "https://rustamg16.github.io/003-meridian-mvp/",
        oldHref: null,
        source: {
          proposed: withBasePath("/works/meridian/cover.jpg"),
          existing: null,
          viewport: "1920 × 1080",
        } as ComparisonSource,
      },
    ],
  },

  /* 09 — CTA --------------------------------------------------------------- */
  cta: {
    index: "09",
    label: "Next",
    heading: ["Say what should", "feel different."],
    body: "Tell us what should feel different when the project is finished.",
    primary: { label: "Start a project", href: "/contact" },
  },
} as const;
