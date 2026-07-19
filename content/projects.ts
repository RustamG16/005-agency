export type Project = {
  slug: string;
  name: string;
  sector: string;
  scope: string;
  year: string;
  outcome: string;
  poster: string;
  loop: string[];
  nav?: string;
  videoOffset: number;
  objectPosition: string;
};

export const projects: Project[] = [
  {
    slug: "vanta",
    name: "VANTA",
    sector: "Cultural platform",
    scope: "Brand system",
    year: "2025",
    outcome: "From local signal to cultural frequency.",
    poster: "/images/still-columns-05.jpg",
    loop: [
      "/images/still-columns-05.jpg",
      "/images/still-columns-15.jpg",
      "/images/still-columns-25.jpg",
    ],
    videoOffset: 0,
    objectPosition: "20% 50%",
  },
  {
    slug: "aurel",
    name: "AUREL",
    sector: "Hospitality",
    scope: "Identity and campaign",
    year: "2025",
    outcome: "From a destination to a point of view.",
    poster: "/images/still-columns-25.jpg",
    loop: [
      "/images/still-columns-25.jpg",
      "/images/still-columns-15.jpg",
      "/images/still-columns-45.jpg",
    ],
    videoOffset: 2,
    objectPosition: "50% 50%",
  },
  {
    slug: "null-one",
    name: "NULL/ONE",
    sector: "Artificial intelligence",
    scope: "Strategy and digital",
    year: "2024",
    outcome: "From technical capability to human relevance.",
    poster: "/images/still-columns-45.jpg",
    loop: [
      "/images/still-columns-45.jpg",
      "/images/still-columns-65.jpg",
      "/images/still-columns-15.jpg",
    ],
    videoOffset: 4,
    objectPosition: "65% 50%",
  },
  {
    slug: "ferro",
    name: "FERRO",
    sector: "Architecture",
    scope: "Naming and identity",
    year: "2024",
    outcome: "From built space to lasting memory.",
    poster: "/images/still-columns-65.jpg",
    loop: [
      "/images/still-columns-65.jpg",
      "/images/still-columns-45.jpg",
      "/images/still-columns-05.jpg",
    ],
    videoOffset: 6,
    objectPosition: "80% 50%",
  },
];
