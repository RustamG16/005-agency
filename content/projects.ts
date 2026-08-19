import { withBasePath } from "@/lib/basePath";
/**
 * Selected Works — four real, shipped projects.
 *
 * Media contract. Two orientations, because the two surfaces genuinely differ:
 *
 *   cover / loop                 1440×810   WorkDeck plate (home, full-bleed) and the
 *                                           /works mobile row (16:9)
 *   coverPortrait / loopPortrait  960×1200  the /works hover panel (4:5, ≥900px)
 *
 * `cover` is extracted from `loop`'s own frame 0, so the poster→video handover on hover is
 * byte-exact. Both are produced by scripts/capture-preview.mjs + scripts/encode-preview.mjs
 * — deterministic headless capture of the live site, never a screen recording. See
 * PROJECT-PREVIEW-GUIDE.md.
 *
 * `loop` and `loopPortrait` are optional on purpose: a project without them shows its cover
 * and nothing else, which is a valid state rather than a broken one.
 *
 * `objectPosition` is what survives the crop. The plate is 100svh, so a 16:9 cover meets a
 * portrait box on phones and only a slice of the frame shows — these values choose which
 * slice. Verify them at 390×844, not on a desktop.
 */

export type Project = {
  slug: string;
  name: string;
  sector: string;
  scope: string;
  year: string;
  outcome: string;
  /** Live site. Opens in a new tab. */
  url: string;
  cover: string;
  coverPortrait: string;
  /** Absent → the surface shows the cover and does not attempt playback. */
  loop?: string;
  loopPortrait?: string;
  objectPosition: string;
};

export const projects: Project[] = [
  {
    slug: "sonnwerk",
    name: "Sonn'werk",
    sector: "Regenerative agriculture",
    scope: "Brand system and shop",
    year: "2026",
    // The site's own promise — "Vom Feld in die Flasche" — carried into English rather
    // than an outcome claim we cannot substantiate.
    outcome: "From the field to the bottle, in one scroll.",
    url: "https://rustamg16.github.io/002-sonnwerk/",
    cover: withBasePath("/works/sonnwerk/cover.jpg"),
    coverPortrait: withBasePath("/works/sonnwerk/cover-portrait.jpg"),
    loop: withBasePath("/works/sonnwerk/loop.mp4"),
    loopPortrait: withBasePath("/works/sonnwerk/loop-portrait.mp4"),
    objectPosition: "50% 50%",
  },
  {
    slug: "meridian",
    name: "The Meridian",
    // Labelled a concept build because it is one — a demo brand, not a booked hotel client.
    // Passing it off as the latter is exactly the fabrication CLAUDE.md forbids.
    sector: "Hospitality · concept build",
    scope: "Art direction and front-end",
    year: "2026",
    outcome: "An arrival you scroll through before you book.",
    url: "https://rustamg16.github.io/003-meridian-mvp/",
    cover: withBasePath("/works/meridian/cover.jpg"),
    coverPortrait: withBasePath("/works/meridian/cover-portrait.jpg"),
    loop: withBasePath("/works/meridian/loop.mp4"),
    loopPortrait: withBasePath("/works/meridian/loop-portrait.mp4"),
    objectPosition: "50% 50%",
  },
  {
    slug: "sr-urologie",
    name: "SR Urologie",
    sector: "Medical practice",
    scope: "Identity and practice site",
    year: "2026",
    outcome: "Clinical precision, at the pace of a conversation.",
    url: "https://sr-urologie.netlify.app/",
    cover: withBasePath("/works/sr-urologie/cover.jpg"),
    coverPortrait: withBasePath("/works/sr-urologie/cover-portrait.jpg"),
    loop: withBasePath("/works/sr-urologie/loop.mp4"),
    loopPortrait: withBasePath("/works/sr-urologie/loop-portrait.mp4"),
    // Type-led hero: the headline sits left of centre, so a portrait crop that centres
    // lands in the gutter between the type and the photograph.
    objectPosition: "28% 50%",
  },
  {
    slug: "education4students",
    name: "Education4Students",
    sector: "Education advisory",
    scope: "Brand and multilingual site",
    year: "2026",
    outcome: "Study abroad, explained in your own language.",
    url: "https://rustamg16.github.io/education-hub-connect/",
    cover: withBasePath("/works/education4students/cover.jpg"),
    coverPortrait: withBasePath("/works/education4students/cover-portrait.jpg"),
    // TODO: no loop yet. The live URL serves an unbuilt Vite index (it requests
    // /src/main.tsx and renders blank), so there is nothing to capture. Once the GitHub
    // Pages deploy is fixed:
    //   node scripts/capture-preview.mjs --site education4students
    //   node scripts/capture-preview.mjs --site education4students --portrait
    //   node scripts/encode-preview.mjs  --site education4students [--portrait]
    // then add `loop` and `loopPortrait` here. Beats still need writing — guide §8.
    objectPosition: "30% 50%",
  },
];
