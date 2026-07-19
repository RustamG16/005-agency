import Image from "next/image";
import { responseStatement, fitStatement } from "@/content/contact";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./ProjectFit.module.css";

export function ProjectFit() {
  return (
    <HeaderZone theme="dark">
      <section className={`wrap ${styles.section}`} aria-label="What to expect">
        <div className={styles.grid}>
          <InteriorRevealBlock as="div" className={styles.column}>
            <p className={`eyebrow ${styles.eyebrow}`}>Response Time</p>
            <p className={styles.text}>{responseStatement}</p>
          </InteriorRevealBlock>
          <InteriorRevealBlock as="div" className={styles.column}>
            <p className={`eyebrow ${styles.eyebrow}`}>Project Fit</p>
            <p className={styles.text}>{fitStatement}</p>
          </InteriorRevealBlock>
          <div className={styles.media}>
            <Image
              src="/images/still-team-55.jpg"
              alt=""
              fill
              sizes="(max-width: 1099px) 100vw, 220px"
              className={styles.mediaImg}
            />
          </div>
        </div>
      </section>
    </HeaderZone>
  );
}
