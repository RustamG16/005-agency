import { principles } from "@/content/principles";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./Principles.module.css";

export function Principles() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Working principles">
        <p className="eyebrow" data-interior-reveal="block">
          How We Work
        </p>
        <div className={styles.grid}>
          {principles.map((p) => (
            <div key={p.index} className={styles.item} data-interior-reveal="block">
              <span className={styles.index}>{p.index}</span>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.body}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>
    </HeaderZone>
  );
}
