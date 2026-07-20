import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealBlock, InteriorRevealMedia } from "@/components/motion/InteriorReveal";
import styles from "./Intro.module.css";

export function Intro() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.intro}`} aria-label="Studio point of view">
        <div className={styles.rule} aria-hidden="true" />
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className="eyebrow">Studio Note</p>
            <InteriorRevealBlock as="h2" className={styles.heading}>
              Most brands are not underperforming.
              <br />
              They are under-leveled.
            </InteriorRevealBlock>
          </div>
          <div className={styles.right}>
            <p className={styles.body}>
              Convenium Studio turns strategic clarity into identities, digital experiences and
              campaigns built to compete at a higher level. We work with ambitious, founder-led
              companies who are ready to leave the ground floor.
            </p>
            <div className={styles.media}>
              <InteriorRevealMedia className={styles.mediaMask}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/still-team-25.jpg" alt="" className={styles.mediaImg} />
              </InteriorRevealMedia>
              <span className={styles.caption}>Fig. 01 — Process, observed.</span>
            </div>
          </div>
        </div>
      </section>
    </HeaderZone>
  );
}
