import { site } from "@/content/site";
import styles from "./ContactInfo.module.css";

export function ContactInfo() {
  return (
    <div className={styles.info}>
      <p className={styles.statement}>
        Tell us where the brand is today and where it needs to compete. We read every inquiry
        personally — no forms disappearing into a queue.
      </p>
      <a href={`mailto:${site.email}`} className={styles.email}>
        {site.email}
      </a>
      <div className={styles.media}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/still-columns-15.jpg" alt="" className={styles.mediaImg} />
      </div>
    </div>
  );
}
