import type { Metadata } from "next";
import { site } from "@/content/site";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Convenium Studio handles information submitted through this site.",
};

export default function PrivacyPage() {
  return (
    <HeaderZone theme="light">
      <article className={`wrap ${styles.page}`}>
        <header className={styles.header}>
          <p className="eyebrow">Legal</p>
          <h1 className={styles.heading}>Privacy</h1>
          <p className={styles.lede}>
            How {site.name} handles information submitted through this site. This notice will be
            completed before client work is taken on through this site.
          </p>
        </header>

        <div className={styles.sections}>
          <section className={styles.block} aria-labelledby="privacy-collect">
            <h2 id="privacy-collect" className={styles.subhead}>
              Data collected
            </h2>
            <p className={styles.body}>
              Information submitted through the contact form — name, email, company, project type,
              budget range, and message — is collected only when you choose to send an inquiry.
            </p>
          </section>

          <section className={styles.block} aria-labelledby="privacy-use">
            <h2 id="privacy-use" className={styles.subhead}>
              How it is used
            </h2>
            <p className={styles.body}>
              That information is used only to respond to your inquiry. It is not sold or shared
              with third parties for marketing purposes.
            </p>
          </section>

          <section className={styles.block} aria-labelledby="privacy-retain">
            <h2 id="privacy-retain" className={styles.subhead}>
              Retention
            </h2>
            <p className={styles.body}>
              Inquiry records are kept only as long as needed to reply and, if relevant, to continue
              a conversation you initiate. A full retention schedule will be published with the
              completed policy.
            </p>
          </section>

          <section className={styles.block} aria-labelledby="privacy-contact">
            <h2 id="privacy-contact" className={styles.subhead}>
              Contact
            </h2>
            <p className={styles.body}>
              Questions in the meantime can be sent directly to{" "}
              <a href={`mailto:${site.email}`} className={styles.link}>
                {site.email}
              </a>
              .
            </p>
          </section>
        </div>

        <p className={styles.note}>
          This page is intentionally incomplete. A complete privacy policy covering analytics,
          cookies, and rights under applicable law will be published here before {site.name} takes
          on client work through this site.
        </p>
      </article>
    </HeaderZone>
  );
}
