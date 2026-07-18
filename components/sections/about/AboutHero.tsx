import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./AboutHero.module.css";

export function AboutHero() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Studio introduction">
        <p className="eyebrow">Studio</p>
        <h1 className={styles.heading}>Built close to the work.</h1>
        <p className={styles.supporting}>
          Convenium exists for companies that have outgrown generic design — brands that need a
          system precise enough to hold under scrutiny and loud enough to be remembered.
        </p>
      </section>
    </HeaderZone>
  );
}
