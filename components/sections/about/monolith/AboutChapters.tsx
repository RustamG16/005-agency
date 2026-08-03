import Image from "next/image";
import { site } from "@/content/site";
import styles from "./AboutChapters.module.css";

/**
 * The six chapters of /about, in normal document flow — one semantic copy of the
 * content, no aria-hidden duplication. Each `<section>` sets the scroll length for its
 * chapter; the inner `.sticky` div pins the copy at viewport center while that length
 * scrolls past, exactly like the WebGL stage pins behind it (`MonolithScene.tsx`).
 *
 * `data-head` / `data-body` are read by `MonolithScene`'s reveal pass — independent,
 * once-only ScrollTriggers, not the scrubbed object timeline.
 */

const founders = [
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

export function AboutChapters() {
  return (
    <>
      <section className={styles.chArrival}>
        <div className={styles.sticky}>
          <div className={styles.grid}>
            <h1 className={`${styles.hero} ${styles.heroPlacement}`} data-head>
              Convenium is two people.
            </h1>
          </div>
        </div>
      </section>

      <section className={styles.chPosition}>
        <div className={styles.sticky}>
          <div className={styles.grid}>
            <p className={`${styles.manifesto} ${styles.manifestoPlacement}`} data-head>
              Small by design. The people you meet are the people who make the work —
              strategy, identity, web, content and media, carried personally from first
              call to launch.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.chIdentity}>
        <div className={styles.sticky}>
          <div className={`${styles.grid} ${styles.tightGap}`}>
            <p className={`${styles.eyebrow} ${styles.leftCol}`}>Identity · Graphic design</p>
            <h2 className={`${styles.display} ${styles.leftCol}`} data-head>
              Systems, not one-offs.
            </h2>
            <p className={`${styles.body} ${styles.leftCol} ${styles.bodyMeasure}`} data-body>
              Identity and graphic design built to extend — a brand should get stronger
              with use, not need a redesign in a year.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.chWeb}>
        <div className={styles.sticky}>
          <div className={`${styles.grid} ${styles.tightGap}`}>
            <p className={`${styles.eyebrow} ${styles.leftCol}`}>Web · 3D · Motion</p>
            <h2 className={`${styles.display} ${styles.leftCol}`} data-head>
              This page is the portfolio.
            </h2>
            <p className={`${styles.body} ${styles.leftCol} ${styles.bodyMeasure}`} data-body>
              Scroll-driven, real-time 3D, built in-house. What you are watching is what
              we ship.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.chContent}>
        <div className={styles.sticky}>
          <div className={`${styles.grid} ${styles.tightGap}`}>
            <h2 className={`${styles.display} ${styles.rightCol}`} data-head>
              Made, not sourced.
            </h2>
            <p className={`${styles.body} ${styles.rightCol} ${styles.bodyMeasure}`} data-body>
              Content, campaigns and social — produced in the studio, tuned per
              platform.
            </p>

            <ul className={styles.duo} data-body>
              {founders.map((person) => (
                <li key={person.name}>
                  <div className={styles.duoFrame}>
                    <span className={styles.duoFallback}>{person.name.charAt(0)}</span>
                    <Image
                      src={person.src}
                      alt={`${person.name}, co-founder of ${site.shortName}`}
                      fill
                      sizes="(max-width: 900px) 40vw, 22vw"
                      className={styles.duoImg}
                    />
                  </div>
                  <p className={styles.duoName}>{person.name}</p>
                  <p className={styles.duoRole}>Co-founder</p>
                  <p className={styles.duoRoles}>{person.roles}</p>
                </li>
              ))}
            </ul>

            <p className={`${styles.body} ${styles.rightCol} ${styles.kicker}`} data-body>
              Everything above was made by the two of us.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.chGoingUp}>
        <div className={styles.sticky}>
          <div className={`${styles.grid} ${styles.tightGap}`}>
            <h2 className={`${styles.footer} ${styles.centerPlacement}`} data-head>
              Going up?
            </h2>
            <p className={`${styles.body} ${styles.centerPlacement}`} data-body>
              One conversation. Both founders.
            </p>
            <p className={styles.centerPlacement} data-body>
              <a className={styles.emailLink} href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
