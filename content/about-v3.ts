export const aboutV3 = {
  hero: {
    eyebrow: "About Convenium / Two founders",
    title: "Different disciplines. One accountable direction.",
    body:
      "Convenium is a deliberately small studio. The people in the first conversation stay close to the final work, so intent does not disappear between strategy, design and implementation.",
    location: "Klagenfurt, Austria / working internationally",
  },
  founders: [
    {
      key: "rustam",
      name: "Rustam Gurbanov",
      role: "Design, systems & engineering",
      statement: "Turns ambiguity into a system that can be designed, built and maintained.",
      detail:
        "His public record spans engineering, digital design and motion. Work shown on this page keeps its real provenance visible.",
    },
    {
      key: "marija",
      name: "Marija",
      role: "Communication & visual continuity",
      statement: "Protects how the work is understood while its form is taking shape.",
      detail:
        "Biography, selected work and contribution details remain intentionally unpublished until her production record is confirmed.",
    },
  ],
  dossier: [
    { label: "Core", value: "What must remain recognisable?" },
    { label: "Audience", value: "Who needs to understand and trust it?" },
    { label: "Feeling", value: "What should change in the room?" },
    { label: "Tension", value: "What cannot be solved by appearance alone?" },
  ],
  programs: [
    {
      key: "restore",
      index: "01",
      title: "Restore",
      short: "Recover what was always valuable.",
      body:
        "Clarify the strongest existing signals, repair the experience around them and remove the friction hiding their value.",
      image: "/images/about-v3/program-restore.webp",
    },
    {
      key: "adapt",
      index: "02",
      title: "Adapt",
      short: "Keep the core. Change the fit.",
      body:
        "Preserve recognisable equity while reshaping the system for a different audience, context or level of ambition.",
      image: "/images/about-v3/program-adapt.webp",
    },
    {
      key: "evolve",
      index: "03",
      title: "Evolve",
      short: "Build the next expression deliberately.",
      body:
        "When the current form can no longer carry the strategy, establish a more capable visual and technical language.",
      image: "/images/about-v3/program-evolve.webp",
    },
  ],
  lanes: [
    {
      key: "visual",
      title: "Visual direction",
      skill: "Identity, hierarchy, art direction",
      image: "/images/about-v3/specialist-visual.webp",
    },
    {
      key: "content",
      title: "Content",
      skill: "Structure, message, editorial continuity",
      image: "/images/about-v3/specialist-content.webp",
    },
    {
      key: "engineering",
      title: "Design engineering",
      skill: "Interaction, components, implementation",
      image: "/images/about-v3/specialist-engineering.webp",
    },
    {
      key: "motion",
      title: "Motion",
      skill: "Sequence, transition, restraint",
      image: "/images/about-v3/specialist-motion.webp",
    },
    {
      key: "quality",
      title: "Quality",
      skill: "Accessibility, runtime, release confidence",
      image: "/images/about-v3/specialist-quality.webp",
    },
  ],
  proof: [
    {
      key: "sonnwerk",
      title: "Sonnwerk",
      type: "Proposal-stage digital direction",
      image: "/works/sonnwerk/cover.jpg",
      href: "/works",
      note: "Shown as a direction proposal, not as a published outcome or performance claim.",
    },
    {
      key: "meridian",
      title: "Meridian",
      type: "Proposal-stage digital expression",
      image: "/works/meridian/cover.jpg",
      href: "/works",
      note: "Shown to demonstrate craft and framing; no testimonial or result is implied.",
    },
  ],
} as const;

export type AboutProgram = (typeof aboutV3.programs)[number];
