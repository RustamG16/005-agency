import { ContactForm } from "@/components/sections/contact/ContactForm";
import styles from "./AboutInquiry.module.css";

export function AboutInquiry() {
  return (
    <div className={styles.closing}>
      <div className={styles.closingPrelude} aria-hidden="true">
        <span className={`${styles.processFrame} ${styles.processFrameLeft}`}><i /><i /><i /></span>
        <p>Begin with<br />one sentence</p>
        <span className={`${styles.processFrame} ${styles.processFrameRight}`}><i /><i /><i /></span>
        <span className={styles.closingDot} />
      </div>

      <div className={styles.grid}>
        <div className={styles.intro} data-inquiry-column="left">
          <h2>What should feel different when this project is finished?</h2>
          <p>
            Begin with one sentence. The same shared inquiry system powers this compact form and the
            full Contact page.
          </p>
          <a href="mailto:hello@convenium.studio">hello@convenium.studio</a>
        </div>
        <div data-inquiry-column="right">
          <ContactForm variant="compact" />
        </div>
      </div>
    </div>
  );
}
