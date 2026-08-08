export type ProcessBeat = {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  /** Scroll length this beat owns, in vh. `ProcessFilm` derives the timeline
   *  position of every beat by a cumulative sum over this array — the CSS
   *  height and the scrub progress can never drift apart because both read
   *  the same numbers. */
  lengthVh: number;
};

/* Four beats, checkable line by line: no headcount beyond two, no clients,
 * no metrics. Replaces the old five-stage "Discover/Position/Design/Build/
 * Launch" agency-process copy, which named disciplines as if they were staff
 * ("strategists, designers and makers") — /about is explicit that Convenium
 * is two people, and this page said something else. */
export const processBeats: ProcessBeat[] = [
  {
    id: "brief",
    eyebrow: "Brief",
    heading: "The work stays close to the idea.",
    body: "No account layer and no handoff. The two people you brief are the two people who make it.",
    lengthVh: 80,
  },
  {
    id: "make",
    eyebrow: "Make",
    heading: "Made here, not bought in.",
    body: "Strategy, identity, web, 3D, motion and content — all of it made by the two of us, in one place.",
    lengthVh: 120,
  },
  {
    id: "test",
    eyebrow: "Test",
    heading: "Shown early, shown unfinished.",
    body: "You see the work while it is still wrong. Rough is cheaper to change than polished.",
    lengthVh: 120,
  },
  {
    id: "handover",
    eyebrow: "Hand over",
    heading: "Built to run without us.",
    body: "You get the working files and a system you can operate yourself.",
    lengthVh: 80,
  },
];
