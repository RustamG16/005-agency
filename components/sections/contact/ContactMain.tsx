import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ContactMain.module.css";

export function ContactMain() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Contact form">
        <div className={styles.grid}>
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
    </HeaderZone>
  );
}
