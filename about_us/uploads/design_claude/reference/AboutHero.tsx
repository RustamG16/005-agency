import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./AboutHero.module.css";

/** Facts only — derived from published content (project years, services, studio model). */
const ledger = [
  { label: "Active", value: "2024–" },
  { label: "Disciplines", value: "Five connected capabilities" },
  { label: "Engagement", value: "Direct collaboration" },
];

export function AboutHero() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Studio introduction">
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className="eyebrow">Studio</p>
            <InteriorRevealBlock as="h1" className={styles.heading}>
              Built close to the work.
            </InteriorRevealBlock>
            <p className={styles.supporting}>
              Convenium exists for companies that have outgrown generic design — brands that need a
              system precise enough to hold under scrutiny and loud enough to be remembered.
            </p>
          </div>

          <ul className={styles.ledger} aria-label="Studio floors">
            {ledger.map((row) => (
              <li key={row.label} className={styles.ledgerRow}>
                <span className={styles.ledgerLabel}>{row.label}</span>
                <span className={styles.ledgerValue}>{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </HeaderZone>
  );
}
