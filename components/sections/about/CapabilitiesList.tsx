import Link from "next/link";
import { services } from "@/content/services";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./CapabilitiesList.module.css";

export function CapabilitiesList() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Capabilities">
        <p className="eyebrow">Capabilities</p>
        <ul className={styles.list}>
          {services.map((service) => (
            <li key={service.slug}>
              <InteriorRevealBlock as="div">
                <Link href={`/services#${service.slug}`} className={styles.link}>
                  <span className={styles.name}>{service.name}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </InteriorRevealBlock>
            </li>
          ))}
        </ul>
      </section>
    </HeaderZone>
  );
}
