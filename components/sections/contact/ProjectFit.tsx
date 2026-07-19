import { responseStatement, fitStatement } from "@/content/contact";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ProjectFit.module.css";

export function ProjectFit() {
  return (
    <HeaderZone theme="dark">
      <section className={`wrap ${styles.section}`} aria-label="What to expect">
        <div className={styles.grid}>
          <div className={styles.column}>
            <p className="eyebrow" style={{ color: "var(--color-gray)" }}>
              Response Time
            </p>
            <p className={styles.text}>{responseStatement}</p>
          </div>
          <div className={styles.column}>
            <p className="eyebrow" style={{ color: "var(--color-gray)" }}>
              Project Fit
            </p>
            <p className={styles.text}>{fitStatement}</p>
          </div>
          <div className={styles.media}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/still-team-55.jpg" alt="" className={styles.mediaImg} />
          </div>
        </div>
      </section>
    </HeaderZone>
  );
}
