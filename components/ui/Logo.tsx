import styles from "./Logo.module.css";

/**
 * Convenium density-ramp mark.
 *
 * Geometry is derived, not drawn: bar heights follow a 1.18 geometric
 * progression and the gap between bars is constant. The gap is the base
 * spacing unit of the design system and 1.18 is the type-scale ratio, so the
 * mark and the tokens stay locked to the same two numbers.
 *
 * Read bottom-up: raw input refining into systematic output.
 * Read top-down: one hairline accumulating into full weight.
 */

export type Bar = { y: number; h: number };

/** 12 bars, ratio 1.18, constant gap 4.01. For 32px and above. */
export const RAMP_FULL: Bar[] = [
  { y: 0.0, h: 1.6 },
  { y: 5.61, h: 1.89 },
  { y: 11.51, h: 2.23 },
  { y: 17.75, h: 2.63 },
  { y: 24.39, h: 3.1 },
  { y: 31.5, h: 3.66 },
  { y: 39.17, h: 4.32 },
  { y: 47.5, h: 5.1 },
  { y: 56.6, h: 6.01 },
  { y: 66.63, h: 7.1 },
  { y: 77.73, h: 8.37 },
  { y: 90.12, h: 9.88 },
];

/** 5 bars, ratio 1.5, constant gap 5.22. For 18–32px (header, avatars). */
export const RAMP_COMPACT: Bar[] = [
  { y: 0.0, h: 6.0 },
  { y: 11.22, h: 9.0 },
  { y: 25.44, h: 13.5 },
  { y: 44.16, h: 20.25 },
  { y: 69.63, h: 30.37 },
];

/** 3 bars, ratio 1.6, constant gap 6. Survives a true 16px favicon. */
export const RAMP_MICRO: Bar[] = [
  { y: 0, h: 13.64 },
  { y: 27.27, h: 22.73 },
  { y: 63.64, h: 36.36 },
];

const RAMPS = {
  full: RAMP_FULL,
  compact: RAMP_COMPACT,
  micro: RAMP_MICRO,
} as const;

export type MarkDetail = keyof typeof RAMPS;

type MarkProps = {
  /** Which ramp to draw. Pick by rendered size, not by taste. */
  detail?: MarkDetail;
  /** Rendered edge length in px. */
  size?: number;
  /**
   * Index of the bar rendered in the accent colour — this marks the AI layer
   * in the stack. Pass null for a pure monochrome mark.
   */
  accentIndex?: number | null;
  /** Stagger the bars in on mount. Respects prefers-reduced-motion. */
  animate?: boolean;
  className?: string;
};

export function Mark({
  detail = "full",
  size = 64,
  accentIndex = null,
  animate = false,
  className,
}: MarkProps) {
  const bars = RAMPS[detail];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={[styles.mark, animate ? styles.animate : "", className]
        .filter(Boolean)
        .join(" ")}
      shapeRendering="crispEdges"
    >
      {bars.map((bar, i) => (
        <rect
          key={bar.y}
          x="0"
          y={bar.y}
          width="100"
          height={bar.h}
          className={i === accentIndex ? styles.accentBar : undefined}
          style={animate ? { animationDelay: `${i * 34}ms` } : undefined}
        />
      ))}
    </svg>
  );
}

type LockupProps = {
  /** Size of the mark; the wordmark scales from it. */
  size?: number;
  accentIndex?: number | null;
  animate?: boolean;
  /** Hide the wordmark below this breakpoint, leaving the mark alone. */
  compactWordmark?: boolean;
  className?: string;
};

/** Horizontal mark + CONVENIUM wordmark. The primary lockup. */
export function Lockup({
  size = 22,
  accentIndex = null,
  animate = false,
  compactWordmark = true,
  className,
}: LockupProps) {
  return (
    <span
      className={[styles.lockup, className].filter(Boolean).join(" ")}
      style={{ ["--mark-size" as string]: `${size}px` }}
    >
      <Mark
        detail={size >= 32 ? "full" : "compact"}
        size={size}
        accentIndex={accentIndex}
        animate={animate}
      />
      <span
        className={[
          styles.wordmark,
          compactWordmark ? styles.wordmarkResponsive : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        Convenium
      </span>
    </span>
  );
}
