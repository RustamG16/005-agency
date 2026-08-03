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
    slug: "branding",
    name: "Branding",
    role: "Identity systems built to be recognized and remembered.",
    scope: ["Positioning and naming", "Logo and mark", "Identity systems", "Brand guidelines"],
    description:
      "A brand is a set of decisions applied without exception. We build the identity system that carries a position into every surface, and the guidelines that keep it intact.",
    image: "/images/still-columns-15.jpg",
  },
  {
    index: "02",
    slug: "graphic-design",
    name: "Graphic Design",
    role: "Editorial, print and visual communication with a point of view.",
    scope: ["Editorial layout", "Print collateral", "Packaging", "Visual communication"],
    description:
      "Design work that has to be held, read and re-read. We handle editorial, print and packaging with the same rigor we apply to a full identity system.",
    image: "/images/still-columns-25.jpg",
  },
  {
    index: "03",
    slug: "web-app-development",
    name: "Web + App Development",
    role: "Digital products designed and engineered as one system.",
    scope: ["Websites and products", "Design systems", "Front-end engineering", "Webflow / Framer builds"],
    description:
      "Digital is where a brand is tested daily. We design and build the interfaces that hold an identity together under real use, from first click to checkout.",
    image: "/images/still-team-05.jpg",
  },
  {
    index: "04",
    slug: "media-creation-ai",
    name: "Media Creation (AI)",
    role: "Cinematic stills and film made with directed AI pipelines.",
    scope: ["Directed AI pipelines", "Cinematic stills", "Film and motion", "Post-production"],
    description:
      "AI as a production tool, not a shortcut. We direct generative pipelines toward a specific look and story, then finish the work by hand.",
    image: "/images/still-columns-65.jpg",
  },
  {
    index: "05",
    slug: "smm",
    name: "SMM",
    role: "Social presence with the same standards as the brand itself.",
    scope: ["Channel strategy", "Content systems", "Community management", "Platform-native formats"],
    description:
      "Social is the highest-frequency surface a brand has. We keep it running to the same system as everything else, instead of treating it as an afterthought.",
    image: "/images/still-team-65.jpg",
  },
];
