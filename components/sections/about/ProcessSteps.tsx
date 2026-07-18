import { processSteps } from "@/content/process";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ProcessSteps.module.css";

export function ProcessSteps() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Process">
        <p className="eyebrow">Process</p>
        <h2 className={styles.heading}>Five steps, in order, every time.</h2>

        <ol className={styles.list}>
          {processSteps.map((step) => (
            <li key={step.index} className={styles.item}>
              <span className={styles.index}>{step.index}</span>
              <span className={styles.title}>{step.title}</span>
              <span className={styles.body}>{step.body}</span>
            </li>
          ))}
        </ol>
      </section>
    </HeaderZone>
  );
}
