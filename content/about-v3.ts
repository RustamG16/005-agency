export const aboutV3 = {
  hero: {
    title: "Two perspectives. One accountable direction.",
    support:
      "We keep the studio deliberately small so the people in the first conversation remain responsible for the final work.",
    location: "Klagenfurt, Austria / working internationally",
    founders: [
      {
        key: "rustam",
        name: "Rustam",
        statement: "We build the system.",
        detail: "Experience, interaction and implementation are considered as one connected decision.",
      },
      {
        key: "marija",
        name: "Marija",
        statement: "We protect how it is understood.",
        detail: "Language, context and visual meaning stay present as the work takes shape.",
      },
    ],
  },
  origins: {
    title: "Individual experience, brought together under one name.",
    intro:
      "Convenium is a new studio built from founder experience. Career work and independent work are labelled by their real provenance; neither is presented as historic Convenium client work.",
    rustam: [
      {
        provenance: "Founder career",
        title: "10+ years in software and digital production",
        body: "Experience spanning engineering, design and motion, including a verified career role at Infineon.",
      },
      {
        provenance: "Independent work",
        title: "20+ projects shipped",
        body: "The currently supported public figure. Project names and outcomes remain outside this page unless their provenance is confirmed.",
      },
      {
        provenance: "Convenium",
        title: "One connected delivery line",
        body: "System decisions stay close to design and implementation instead of passing between departments.",
      },
    ],
  },
  briefReadings: [
    {
      phrase: "Exclusive, but not cold.",
      rustam:
        "Use restraint in the system, then let interaction and material detail create welcome rather than distance.",
      marija:
        "Clarify whether ‘exclusive’ means selective, private or simply distinctive—and who must still feel invited.",
      decision:
        "Build a disciplined frame with human warmth at the moments where trust is formed.",
      visual: "warmth",
    },
    {
      phrase: "Modern, but it still has to feel established.",
      rustam:
        "Keep the interaction current while anchoring navigation, rhythm and hierarchy in patterns people already trust.",
      marija:
        "Separate the desire for freshness from the fear of looking temporary or trend-dependent.",
      decision:
        "Pair contemporary behavior with a stable editorial structure and durable material cues.",
      visual: "continuity",
    },
    {
      phrase: "Memorable without becoming loud.",
      rustam:
        "Concentrate motion and contrast around one recognisable behavior instead of raising the volume everywhere.",
      marija:
        "Find the detail the audience should remember, then remove signals that compete with it.",
      decision:
        "Let proportion, pacing and one signature transition carry recognition.",
      visual: "memory",
    },
  ],
  decisionRows: [
    {
      title: "Discovery",
      rustam: "Maps system constraints and technical realities.",
      marija: "Surfaces language, context and the motive beneath the brief.",
      shared: "Confirm the actual decision the project needs to make.",
    },
    {
      title: "Direction",
      rustam: "Shapes the experience and technical logic.",
      marija: "Shapes visual and content continuity.",
      shared: "Lock one principle before the work expands.",
    },
    {
      title: "Making",
      rustam: "Owns design-engineering execution within the agreed scope.",
      marija: "Owns communication and visual-content work within the agreed scope.",
      shared: "Review the expression as one connected system.",
    },
    {
      title: "Review",
      rustam: "Translates feedback into implementable change.",
      marija: "Maintains clarity across the conversation.",
      shared: "Document decisions so intent survives every revision.",
    },
    {
      title: "Activation",
      rustam: "Keeps the digital system maintainable.",
      marija: "Maintains continuity where ongoing communication is in scope.",
      shared: "Bring in a trusted specialist only for a bounded question while founder accountability remains intact.",
    },
  ],
} as const;

export type BriefReading = (typeof aboutV3.briefReadings)[number];
