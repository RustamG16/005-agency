/**
 * The page's motion vocabulary — defined once, reused everywhere.
 *
 * Every section entrance, pin choreography and hover on the homepage draws its
 * durations, easing and travel from this file. The point is that a visitor
 * scrolling the page reads ONE motion language, not six sections each with their
 * own idea of how fast an entrance is.
 *
 * `EASE` is the GSAP twin of `--ease-out-sharp` (cubic-bezier(.16,1,.3,1)) in
 * `styles/tokens.css`, so a CSS transition and a GSAP tween on the same element
 * arrive on the same curve. Nothing here is linear and nothing is a bare fade —
 * opacity always travels with a transform.
 */

export const MOTION = {
  /** Entrance of a copy block or a line. */
  enter: 0.62,
  /** Media masks — a beat slower, because there is more of them to move. */
  media: 0.78,
  /** Anything leaving. Exits are always faster than entrances. */
  exit: 0.24,

  /** Arrivals. `expo.out` matches --ease-out-sharp. */
  ease: "expo.out",
  /** Scrubbed / two-way motion, where an out-only curve reads wrong in reverse. */
  easeInOut: "power2.inOut",

  /** Between siblings in one group. */
  stagger: 0.07,

  /** Travel for a block reveal, in px. */
  yBlock: 24,
  yBlockMobile: 14,
  /** Travel for a masked line, as a % of its own height. */
  yPercentLine: 110,

  /** Where a reveal fires relative to the viewport. */
  start: "top 85%",
} as const;

/** matchMedia queries, so the same three contexts are spelled the same way everywhere. */
export const MQ = {
  desktopMotion: "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
  mobileMotion: "(max-width: 768px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;
