import { services } from "@/content/services";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ServicesHero.module.css";

export function ServicesHero() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Services introduction">
        <div className={styles.grid}>
          <div className={styles.left}>
            <p className="eyebrow">Capabilities</p>
            <h1 className={styles.heading}>
              Five disciplines.
              <br />
              One connected system.
            </h1>
            <p className={styles.supporting}>
              Every engagement draws from the same five capabilities, combined to the scope a brand
              actually needs — not a fixed package.
            </p>
          </div>

          <nav className={styles.index} aria-label="Jump to service">
            {services.map((s) => (
              <a key={s.slug} href={`#${s.slug}`} className={styles.indexRow}>
                <span className={styles.indexNum}>{s.index}</span>
                <span className={styles.indexName}>{s.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>
    </HeaderZone>
  );
}
