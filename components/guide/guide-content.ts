/**
 * What the guide knows about the homepage.
 *
 * Homepage only — PROMPT-B (Cursor) adds the per-route map on top of this shape.
 *
 * COPY STATUS, and it matters:
 *
 * - `line` for stops 01–06 is the original APPROVED copy from
 *   `homepage/HOME-GUIDE-SPEC.md` §5. Do not rewrite those without Russ.
 * - Everything else on this page — the work deck's lines, every `mid` line and
 *   every `explain` paragraph — is DRAFT, written 2026-08-04 because he asked
 *   for "as much fitting lines you can, then we edit them together". It is all
 *   built from copy that already exists on the site (`services.ts`,
 *   `projects.ts`, `process.ts`, `principles.ts`, `faq.ts`, `site.ts`) so
 *   nothing here claims anything the page does not already claim. Expect to
 *   edit it. Nothing is invented: no clients, numbers, awards or promises.
 *
 * This also supersedes spec amendment 10 for the work deck. That amendment kept
 * it silent because §5 predated the section and there was no approved line;
 * there is now a draft one, flagged as such rather than passed off as approved.
 *
 * `anchor` mirrors the section ids declared in `app/(home)/page.tsx`. Those two
 * files are the whole contract.
 */

import type { GuideLine } from "./guide-state";

export type GuideStop = {
  /** Element id in `app/(home)/page.tsx`, or a selector for chrome. */
  anchor: string;
  /** How the anchor is resolved. */
  by: "id" | "selector";
  /** Short label for the radial menu's index. */
  label: string;
  /** 1-based chapter number for the `GUIDE — 0n/0N` eyebrow. Null = no hint. */
  n: number | null;
  /** Hint on arrival. */
  line: string | null;
  /** A second, later beat for sections long enough to earn one. DRAFT. */
  mid?: string | null;
  /** What "Explain this section" actually says. DRAFT. */
  explain?: string | null;
};

export const HOME_STOPS: GuideStop[] = [
  {
    anchor: "top",
    by: "id",
    label: "Top",
    n: 1,
    line: "I'll walk you through.",
    explain:
      "This is Convenium Studio. The job is to take a brand from wherever it sits now to the level its ambition deserves — strategy first, then everything that carries it.",
  },
  {
    anchor: "capabilities",
    by: "id",
    label: "Capabilities",
    n: 2,
    line: "Five crafts. One system.",
    mid: "Pick any one. The other four still apply.",
    explain:
      "Five services run as one practice: branding, graphic design, web and app development, AI-directed media, and social. They share a position and a set of rules, so nothing on the list contradicts anything else on it.",
  },
  {
    anchor: "work",
    by: "id",
    label: "Selected work",
    n: 3,
    line: "Four brands. Four levels up.",
    mid: "Same studio, four completely different problems.",
    explain:
      "Four cases, each one a change of level rather than a facelift. VANTA went from a local signal to a cultural frequency, AUREL from a destination to a point of view, NULL/ONE from technical capability to human relevance, FERRO from built space to lasting memory.",
  },
  {
    anchor: "process",
    by: "id",
    label: "Inside the process",
    n: 4,
    line: "This is how a project actually runs.",
    mid: "Five stages, and you're in the room for all of them.",
    explain:
      "Discover, position, design, build, launch. Small direct teams — strategists, designers and makers in the same room — which is why the idea survives the trip from the first question to the final frame.",
  },
  {
    anchor: "principles",
    by: "id",
    label: "How we work",
    n: 5,
    line: "The rules we don't break.",
    explain:
      "Three positions held on every project: strategy before style, systems rather than one-offs, and direct access to the people making the decisions. No rotating account layer between you and the work.",
  },
  {
    anchor: "faq",
    by: "id",
    label: "Questions",
    n: 6,
    line: "Ask anything. These come up a lot.",
    explain:
      "The things people ask before starting: what the process looks like, how long a full identity takes, whether we work with early-stage companies, whether you can have just the website, and how pricing is structured.",
  },
  {
    anchor: "footer",
    by: "selector",
    label: "Contact",
    n: 7,
    line: "Your turn.",
    explain:
      "If there's a brand worth fighting for, this is where it starts. One email — hello@convenium.studio — and no form to fill in first.",
  },
];

/** How many numbered beats the eyebrow counts against. */
const TOTAL = HOME_STOPS.filter((s) => s.n !== null).length;

const eyebrow = (n: number) =>
  `GUIDE — ${String(n).padStart(2, "0")}/${String(TOTAL).padStart(2, "0")}`;

/** `GUIDE — 02/07` + the arrival line, in the shape the bubble consumes. */
export function stopLine(stop: GuideStop): GuideLine | null {
  if (stop.n === null || !stop.line) return null;
  return { eyebrow: eyebrow(stop.n), text: stop.line };
}

/** The section's second beat, if it has one. */
export function stopMidLine(stop: GuideStop): GuideLine | null {
  if (stop.n === null || !stop.mid) return null;
  return { eyebrow: eyebrow(stop.n), text: stop.mid };
}

/** What "Explain this section" says — falls back to the arrival line. */
export function stopExplain(stop: GuideStop): GuideLine | null {
  if (stop.n === null) return null;
  const text = stop.explain ?? stop.line;
  if (!text) return null;
  return { eyebrow: eyebrow(stop.n), text };
}

export function resolveStop(stop: GuideStop): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return stop.by === "id"
    ? document.getElementById(stop.anchor)
    : document.querySelector<HTMLElement>(stop.anchor);
}
