import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./WorksHero.module.css";

export function WorksHero() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Works introduction">
        <p className="eyebrow">Selected Work</p>
        <h1 className={styles.heading}>
          We do not decorate businesses.
          <br />
          We change the level at which they compete.
        </h1>
        <p className={styles.supporting}>
          Four engagements, four industries, one method: strategy first, system second, expression
          third.
        </p>
      </section>
    </HeaderZone>
  );
}
