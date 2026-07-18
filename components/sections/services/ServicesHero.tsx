import { services } from "@/content/services";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ServicesHero.module.css";

export function ServicesHero() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Services introduction">
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

        <nav className={styles.quicknav} aria-label="Jump to service">
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className={styles.quicknavItem}>
              <span className={styles.quicknavIndex}>{s.index}</span>
              {s.name}
            </a>
          ))}
        </nav>
      </section>
    </HeaderZone>
  );
}
