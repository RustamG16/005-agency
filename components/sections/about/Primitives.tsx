/**
 * `/about` page-system primitives.
 *
 * The confirmed lockups are one continuous warm-ivory editorial canvas with
 * contained noir media stages cut into it. Seven devices recur across all ten
 * compositions, so they live here rather than being rebuilt per section:
 *
 *   SectionIndex    "04 / ANALYSIS" — the section number and its one-word role
 *   RegistrationCross  the thin cherry "+" at the printable corners
 *   CentralAxis     the hairline vertical rule at the page's centre
 *   Heading         the oversized condensed display block
 *   MediaFrame      a square-cornered noir stage with a fixed aspect ratio
 *   MetaStrip       the small slash-separated provenance line under a stage
 *   RuledRow        term / value on a hairline, used by profiles and dossiers
 *
 * Every one of them is decoration *carrying information*: the index says where
 * you are, the axis says the page has a spine, the meta strip says where a
 * picture came from. None of them is a generic card.
 */

import type { ReactNode } from "react";
import styles from "./AboutPage.module.css";

type Tone = "ink" | "cotton";

export function SectionIndex({
  index,
  label,
  tone = "ink",
}: {
  index: string;
  label: string;
  tone?: Tone;
}) {
  return (
    <p className={styles.sectionIndex} data-tone={tone}>
      <span>{index}</span>
      <span aria-hidden="true">/</span>
      <span>{label}</span>
    </p>
  );
}

/**
 * Printer's registration marks. Purely graphic, so they are hidden from the
 * accessibility tree; `corners` picks which of the four are drawn because the
 * lockups vary them by section.
 */
export function RegistrationCross({
  corners = ["tl", "tr", "bl", "br"],
  tone = "ink",
}: {
  corners?: Array<"tl" | "tr" | "bl" | "br">;
  tone?: Tone;
}) {
  return (
    <span className={styles.registration} data-tone={tone} aria-hidden="true">
      {corners.map((corner) => (
        <i key={corner} data-corner={corner} />
      ))}
    </span>
  );
}

/** The hairline spine running down the centre of an ivory band. */
export function CentralAxis({ tone = "ink" }: { tone?: Tone }) {
  return <span className={styles.centralAxis} data-tone={tone} aria-hidden="true" />;
}

/**
 * The display heading. `lines` is an array because the lockups break every
 * heading at a chosen point rather than letting the box decide — the ragged
 * right edge is part of the composition.
 */
export function Heading({
  id,
  lines,
  level = 2,
  tone = "ink",
  accent = false,
  size = "section",
}: {
  id?: string;
  lines: readonly string[];
  level?: 1 | 2 | 3;
  tone?: Tone;
  /** Cherry rather than near-black. Section 02 only, per the lockup. */
  accent?: boolean;
  size?: "section" | "hero" | "tall" | "compact";
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3";
  return (
    <Tag
      id={id}
      className={styles.heading}
      data-tone={tone}
      data-accent={accent ? "true" : undefined}
      data-size={size}
    >
      {lines.map((line, i) => (
        <span key={line}>
          {line}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </Tag>
  );
}

/**
 * A contained noir media stage. `ratio` is set as an explicit aspect-ratio so
 * the box reserves its height before the image decodes and nothing shifts.
 */
export function MediaFrame({
  ratio,
  className,
  children,
  ...rest
}: {
  ratio: string;
  className?: string;
  children: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`${styles.mediaFrame}${className ? ` ${className}` : ""}`}
      style={{ aspectRatio: ratio }}
      {...rest}
    >
      {children}
    </div>
  );
}

/** "LAB PLATE / STILL / SECTION 04" — provenance, not decoration. */
export function MetaStrip({
  items,
  tone = "ink",
  className,
}: {
  items: readonly string[];
  tone?: Tone;
  className?: string;
}) {
  return (
    <p className={`${styles.metaStrip}${className ? ` ${className}` : ""}`} data-tone={tone}>
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 ? <i aria-hidden="true">/</i> : null}
          {item}
        </span>
      ))}
    </p>
  );
}

/** Term on the left, value on the right, hairline underneath. */
export function RuledRow({
  index,
  term,
  value,
  tone = "ink",
  ...rest
}: {
  index?: string;
  term: ReactNode;
  value?: ReactNode;
  tone?: Tone;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={styles.ruledRow} data-tone={tone} {...rest}>
      {index ? <span className={styles.ruledIndex}>{index}</span> : null}
      <span className={styles.ruledTerm}>{term}</span>
      {value ? <span className={styles.ruledValue}>{value}</span> : null}
    </div>
  );
}
