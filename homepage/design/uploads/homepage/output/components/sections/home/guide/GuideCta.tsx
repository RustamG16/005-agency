"use client";

// Chapter 06 — where the robot walks to centre and waves. Copy is spec §5 plus
// site.ts; nothing here is invented. The email hover underline is accent use
// 4 of 4 (cherry on cotton).

import { site } from "@/content/site";
import styles from "./GuideCta.module.css";

export function GuideCta() {
  return (
    <section className={styles.root} data-screen-label="06 CTA">
      <h2 className={styles.head} data-head="">
        {site.footerHeadline}
      </h2>
      <p className={styles.line} data-body="">
        One conversation. Both founders. —{" "}
        <a className={styles.email} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </p>
    </section>
  );
}
