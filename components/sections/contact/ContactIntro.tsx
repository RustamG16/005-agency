import { availability } from "@/content/contact";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ContactIntro.module.css";

export function ContactIntro() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Contact introduction">
        <p className={styles.availability}>
          <span className={styles.dot} aria-hidden="true" />
          {availability}
        </p>
        <h1 className={styles.heading}>All progress starts with a conversation.</h1>
      </section>
    </HeaderZone>
  );
}
