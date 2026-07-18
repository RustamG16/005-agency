import Link from "next/link";
import { services } from "@/content/services";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./CapabilitiesList.module.css";

export function CapabilitiesList() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Capabilities">
        <p className="eyebrow">Capabilities</p>
        <ul className={styles.list}>
          {services.map((service) => (
            <li key={service.slug}>
              <Link href={`/services#${service.slug}`} className={styles.tag}>
                {service.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </HeaderZone>
  );
}
