export type ProcessStep = {
  index: string;
  title: string;
  body: string;
};

export const processSteps: ProcessStep[] = [
  { index: "01", title: "Discover", body: "Interviews, category research and a clear-eyed audit of where the brand actually stands today." },
  { index: "02", title: "Position", body: "One defensible argument for why this brand, for this audience, over every alternative." },
  { index: "03", title: "Design", body: "Identity, voice and digital expression built from the position outward, not the other way round." },
  { index: "04", title: "Build", body: "Guidelines, templates and working files a team can run without us in the room." },
  { index: "05", title: "Launch", body: "A coordinated entry into market, with the system tested under real conditions first." },
];
