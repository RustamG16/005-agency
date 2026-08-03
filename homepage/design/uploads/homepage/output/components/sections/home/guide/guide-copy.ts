// Chapter map + callout copy — HOME-GUIDE-SPEC §3 and §5.
// Deliberately three-free so both the DOM layer (GuideCallouts) and the WebGL
// layer (guide.ts, dynamically imported) can share one source of truth.

export type GuideChapterId = "arrival" | "services" | "process" | "principles" | "faq" | "cta";

export type GuideChapter = {
  id: GuideChapterId;
  /** Master-timeline window on the Stage B scrub, spec §3. */
  range: [number, number];
  /** Callout number, rendered as `GUIDE — 02/06`. */
  index: string;
  /** Callout sentence — spec §5, verbatim. */
  line: string;
  /**
   * Default surface of the section this chapter sits on. Drives the connector
   * colour (hairline on cotton, chili on noir — spec §4). Overridable per page
   * with `data-guide-surface` on the chapter anchor.
   */
  surface: "cotton" | "noir";
  /** Card dock, viewport percentages. The connector closes the gap to the eye. */
  card: { x: number; y: number };
  /** Accessible destination for the chapter, when it has one. */
  href?: string;
};

export const GUIDE_CHAPTERS: GuideChapter[] = [
  {
    id: "arrival",
    range: [0, 0.08],
    index: "01",
    line: "I'll walk you through.",
    surface: "cotton",
    card: { x: 0.3, y: 0.4 },
  },
  {
    id: "services",
    range: [0.08, 0.3],
    index: "02",
    line: "Five crafts. One system.",
    surface: "cotton",
    card: { x: 0.28, y: 0.52 },
  },
  {
    id: "process",
    range: [0.3, 0.5],
    index: "03",
    line: "This is how a project actually runs.",
    surface: "noir",
    card: { x: 0.14, y: 0.62 },
  },
  {
    id: "principles",
    range: [0.5, 0.7],
    index: "04",
    line: "The rules we don't break.",
    surface: "cotton",
    card: { x: 0.34, y: 0.36 },
  },
  {
    id: "faq",
    range: [0.7, 0.85],
    index: "05",
    line: "Ask anything. These come up a lot.",
    surface: "cotton",
    card: { x: 0.3, y: 0.58 },
  },
  {
    id: "cta",
    range: [0.85, 1],
    index: "06",
    line: "Your turn.",
    surface: "noir",
    card: { x: 0.62, y: 0.42 },
    href: "/contact",
  },
];

export const GUIDE_TOTAL = GUIDE_CHAPTERS.length;

export const guideEyebrow = (index: string) => `GUIDE — ${index}/0${GUIDE_TOTAL}`;

export const chapterById = (id: GuideChapterId) =>
  GUIDE_CHAPTERS.find((chapter) => chapter.id === id);
