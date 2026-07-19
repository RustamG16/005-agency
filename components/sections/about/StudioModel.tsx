import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./StudioModel.module.css";

export function StudioModel() {
  return (
    <HeaderZone theme="dark">
      <section className={`wrap ${styles.section}`} aria-label="Studio model">
        <p className={`eyebrow ${styles.eyebrow}`}>Studio Model</p>
        <InteriorRevealBlock as="p" className={styles.statement}>
          Convenium is an independent creative studio built around direct collaboration. Strategy,
          identity and digital expression stay connected from the first question to the final
          frame. Specialist partners are brought in when the work requires them.
        </InteriorRevealBlock>
      </section>
    </HeaderZone>
  );
}
