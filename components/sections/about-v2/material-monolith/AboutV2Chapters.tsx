import Image from "next/image";
import Link from "next/link";
import styles from "./AboutV2Chapters.module.css";

const founders = [
  {
    name: "Marija",
    image: "/images/team/marija.jpg",
    statement: "Owns the conversation and the brand’s public voice.",
    detail: "Negotiation · Graphic direction · Content · Social",
  },
  {
    name: "Rustam",
    image: "/images/team/rustam.jpg",
    statement: "Owns the systems and the digital experience behind them.",
    detail: "Creative direction · Product design · Engineering · Motion · 3D",
  },
] as const;

export function AboutV2Chapters() {
  return (
    <>
      <section className={`${styles.chapter} ${styles.arrival}`}>
        <div className={styles.sticky}>
          <div className={styles.grid}>
            <h1 className={`${styles.hero} ${styles.heroPlacement}`} data-reveal="headline">
              Convenium is two people.
            </h1>
            <p className={`${styles.lead} ${styles.heroSupport}`} data-reveal="body">
              One studio. Two accountable points of view. No handoff between the promise
              and the making.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.chapter} ${styles.proximity}`}>
        <div className={styles.sticky}>
          <div className={styles.grid}>
            <h2 className={`${styles.display} ${styles.left}`} data-reveal="headline">
              The distance is the advantage.
            </h2>
            <p className={`${styles.body} ${styles.left}`} data-reveal="body">
              You speak to Marija and Rustam. The same people question the brief, make the
              decisions and remain responsible for what leaves the studio.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.chapter} ${styles.judgment}`}>
        <div className={styles.sticky}>
          <div className={styles.grid}>
            <h2 className={`${styles.display} ${styles.right}`} data-reveal="headline">
              Less translation. More intent.
            </h2>
            <p className={`${styles.body} ${styles.right}`} data-reveal="body">
              The work does not cross a chain of departments. Context stays attached to
              every decision, so the final thing still carries the force of the first idea.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.chapter} ${styles.continuity}`}>
        <div className={styles.sticky}>
          <div className={styles.grid}>
            <h2 className={`${styles.display} ${styles.left}`} data-reveal="headline">
              No relay race.
            </h2>
            <p className={`${styles.body} ${styles.left}`} data-reveal="body">
              From the first difficult question to the last exact adjustment, the same
              context stays in the room.
            </p>
            <div className={`${styles.continuityLine} ${styles.left}`} data-reveal="body">
              <span>Listen</span>
              <span>Decide</span>
              <span>Make</span>
              <span>Hold</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.chapter} ${styles.founders}`} data-guide-avoid>
        <div className={styles.sticky}>
          <div className={styles.grid}>
            <div className={`${styles.founderIntro} ${styles.right}`}>
              <h2 className={styles.display} data-reveal="headline">
                Two signatures. One standard.
              </h2>
              <p className={styles.body} data-reveal="body">
                Different ownership. Shared judgment. Nothing important is passed out of
                sight.
              </p>
            </div>

            <ul className={`${styles.founderGrid} ${styles.right}`} data-reveal="body">
              {founders.map((founder) => (
                <li key={founder.name} className={styles.founderCard}>
                  <div className={styles.portrait}>
                    <Image
                      src={founder.image}
                      alt=""
                      fill
                      sizes="(max-width: 560px) 88vw, (max-width: 900px) 42vw, 22vw"
                      className={styles.portraitImage}
                    />
                    <span className={styles.pending}>Portrait pending</span>
                  </div>
                  <h3>{founder.name}</h3>
                  <p className={styles.founderStatement}>{founder.statement}</p>
                  <p className={styles.founderDetail}>{founder.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.chapter} ${styles.close}`} data-guide-avoid>
        <div className={styles.sticky}>
          <div className={styles.grid}>
            <h2 className={`${styles.final} ${styles.center}`} data-reveal="headline">
              The work stays intact.
            </h2>
            <p className={`${styles.body} ${styles.center}`} data-reveal="body">
              One conversation. Both founders. Every consequential decision kept close.
            </p>
            <p className={styles.center} data-reveal="body">
              <Link className={styles.projectLink} href="/contact">
                Start a project
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
