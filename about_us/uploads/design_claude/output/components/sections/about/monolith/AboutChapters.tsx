"use client";

/**
 * Chapter DOM — copy verbatim from ABOUT-MONOLITH-SPEC.md §4.
 * Each chapter's span in svh matches its share of master progress (spec §2),
 * so scroll position and monolith state stay locked together: 1000svh total
 * (every chapter holds one full viewport panel — see INTEGRATION.md deviations).
 */

import { useRef, useState, type ReactNode } from "react";
import { useChapterReveal } from "./useChapterReveal";
import styles from "./AboutChapters.module.css";

type ChapterProps = {
  span: number;
  side?: "left" | "right" | "center";
  label: string;
  children: ReactNode;
};

function Chapter({ span, side = "left", label, children }: ChapterProps) {
  const ref = useRef<HTMLElement>(null);
  useChapterReveal(ref);
  return (
    <section
      ref={ref}
      className={styles.chapter}
      style={{ ["--span" as string]: `${span}svh` }}
      data-side={side}
      aria-label={label}
    >
      <div className={styles.sticky}>
        <div className={`wrap ${styles.inner}`}>{children}</div>
      </div>
    </section>
  );
}

export function ChapterArrival() {
  return (
    <Chapter span={120} side="center" label="Arrival">
      <h1 className={styles.h1} data-chapter-head>
        Convenium is two people.
      </h1>
    </Chapter>
  );
}

export function ChapterPosition() {
  return (
    <Chapter span={160} side="left" label="Position">
      <p className={styles.manifesto} data-chapter-head>
        Small by design. The people you meet are the people who make the work — strategy,
        identity, web, content and media, carried personally from first call to launch.
      </p>
    </Chapter>
  );
}

export function ChapterIdentity() {
  return (
    <Chapter span={220} side="left" label="Identity and graphic design">
      <p className={styles.eyebrow}>Identity · Graphic design</p>
      <h2 className={styles.head} data-chapter-head>
        Systems, not one-offs.
      </h2>
      <p className={styles.body} data-chapter-body>
        Identity and graphic design built to extend — a brand should get stronger with use,
        not need a redesign in a year.
      </p>
    </Chapter>
  );
}

export function ChapterWeb() {
  return (
    <Chapter span={220} side="left" label="Web, 3D and motion">
      <p className={styles.eyebrow}>Web · 3D · Motion</p>
      <h2 className={styles.head} data-chapter-head>
        This page is the portfolio.
      </h2>
      <p className={styles.body} data-chapter-body>
        Scroll-driven, real-time 3D, built in-house. What you are watching is what we ship.
      </p>
    </Chapter>
  );
}

type Founder = {
  name: string;
  src: string;
  roles: string;
};

const founders: Founder[] = [
  {
    name: "Marija",
    src: "/images/team/marija.jpg",
    roles: "Graphic design · Brand applications · Content · Social",
  },
  {
    name: "Rustam",
    src: "/images/team/rustam.jpg",
    roles: "Direction & strategy · Web & 3D · Motion · Marketing & ads",
  },
];

function FounderCard({ founder }: { founder: Founder }) {
  const [missing, setMissing] = useState(false);
  return (
    <li className={styles.card}>
      <div className={styles.portrait}>
        {missing ? (
          <div className={styles.portraitFallback} aria-hidden="true" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={styles.portraitImg}
            src={founder.src}
            alt={`${founder.name}, co-founder of Convenium`}
            loading="lazy"
            onError={() => setMissing(true)}
          />
        )}
      </div>
      <p className={styles.cardName}>{founder.name}</p>
      <p className={styles.cardRole}>Co-founder</p>
      <p className={styles.cardRoles}>{founder.roles}</p>
    </li>
  );
}

export function ChapterContent() {
  return (
    <Chapter span={180} side="right" label="Content and the two of us">
      <h2 className={styles.head} data-chapter-head>
        Made, not sourced.
      </h2>
      <p className={styles.body} data-chapter-body>
        Content, campaigns and social — produced in the studio, tuned per platform.
      </p>
      <ul className={styles.duo} data-chapter-body>
        {founders.map((f) => (
          <FounderCard key={f.name} founder={f} />
        ))}
      </ul>
      <p className={styles.kicker} data-chapter-body>
        Everything above was made by the two of us.
      </p>
    </Chapter>
  );
}

export function ChapterGoingUp() {
  return (
    <Chapter span={100} side="center" label="Contact">
      <h2 className={styles.cta} data-chapter-head>
        Going up?
      </h2>
      <p className={styles.body} data-chapter-body>
        One conversation. Both founders.
      </p>
      <p data-chapter-body>
        <a className={styles.email} href="mailto:hello@convenium.studio">
          hello@convenium.studio
        </a>
      </p>
    </Chapter>
  );
}
