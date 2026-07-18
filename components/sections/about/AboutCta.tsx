import Link from "next/link";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./AboutCta.module.css";

export function AboutCta() {
  return (
    <HeaderZone theme="dark">
      <section className={`wrap ${styles.section}`} aria-label="Contact call to action">
        <h2 className={styles.heading}>Let&rsquo;s find your next floor.</h2>
        <Link href="/contact" className={styles.cta}>
          Start a Project
        </Link>
      </section>
    </HeaderZone>
  );
}
