import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./StudioModel.module.css";

export function StudioModel() {
  return (
    <HeaderZone theme="dark">
      <section className={`wrap ${styles.section}`} aria-label="Studio model">
        <p className="eyebrow" style={{ color: "var(--color-gray)" }}>
          Studio Model
        </p>
        <p className={styles.statement}>
          Convenium is an independent creative studio built around direct collaboration. Strategy,
          identity and digital expression stay connected from the first question to the final
          frame. Specialist partners are brought in when the work requires them.
        </p>
      </section>
    </HeaderZone>
  );
}
