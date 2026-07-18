export type Service = {
  index: string;
  slug: string;
  name: string;
  role: string;
  scope: string[];
  description: string;
  image: string;
};

export const services: Service[] = [
  {
    index: "01",
    slug: "strategy",
    name: "Strategy",
    role: "Find the position worth owning.",
    scope: ["Positioning", "Naming", "Market and category analysis", "Verbal identity"],
    description:
      "Before anything is designed, we find the argument. Strategy sets the position a brand can defend and the story that makes it matter.",
    image: "/images/still-team-45.jpg",
  },
  {
    index: "02",
    slug: "brand-identity",
    name: "Brand Identity",
    role: "Build the system that makes it visible.",
    scope: ["Identity systems", "Logo and mark", "Design guidelines", "Print and packaging"],
    description:
      "An identity is a set of decisions applied without exception. We build the visual system that carries a brand's position into every surface.",
    image: "/images/still-columns-15.jpg",
  },
  {
    index: "03",
    slug: "digital-experiences",
    name: "Digital Experiences",
    role: "Make the system move and respond.",
    scope: ["Websites and products", "Design systems", "Interaction and motion", "Webflow / Framer builds"],
    description:
      "Digital is where a brand is tested daily. We design and build interfaces that hold the identity together under real use.",
    image: "/images/still-team-05.jpg",
  },
  {
    index: "04",
    slug: "campaigns",
    name: "Campaigns",
    role: "Put the idea into culture.",
    scope: ["Launch campaigns", "Art direction", "Content systems", "Naming extensions"],
    description:
      "A strong identity needs a moment to enter the world. We plan and produce the campaigns that introduce it with intent.",
    image: "/images/still-columns-65.jpg",
  },
  {
    index: "05",
    slug: "motion",
    name: "Motion",
    role: "Give the brand a recognizable behavior.",
    scope: ["Motion identity", "Film direction", "Sound-adjacent pacing", "Scroll and interaction choreography"],
    description:
      "Motion is a signature, not decoration. We define how a brand moves so it stays recognizable in silence, on scroll, or on screen.",
    image: "/images/still-team-65.jpg",
  },
];
