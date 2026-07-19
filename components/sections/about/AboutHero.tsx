import { principles } from "@/content/principles";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./AboutHero.module.css";

export function AboutHero() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Studio introduction">
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className="eyebrow">Studio</p>
            <h1 className={styles.heading}>Built close to the work.</h1>
            <p className={styles.supporting}>
              Convenium exists for companies that have outgrown generic design — brands that need a
              system precise enough to hold under scrutiny and loud enough to be remembered.
            </p>
          </div>

          <ul className={styles.principles} aria-label="Working principles">
            {principles.map((p) => (
              <li key={p.index} className={styles.principleRow}>
                <span className={styles.principleIndex}>{p.index}</span>
                <span className={styles.principleTitle}>{p.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </HeaderZone>
  );
}
