import Link from "next/link";
import { services } from "@/content/services";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ServicesPreview.module.css";

export function ServicesPreview() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Services overview">
        <div className={styles.head}>
          <p className="eyebrow">Capabilities</p>
          <h2 className={styles.heading}>
            Five disciplines.
            <br />
            One connected system.
          </h2>
        </div>

        <ul className={styles.list}>
          {services.map((service) => (
            <li key={service.index} className={styles.row}>
              <span className={styles.index}>{service.index}</span>
              <span className={styles.name}>{service.name}</span>
              <span className={styles.role}>{service.role}</span>
            </li>
          ))}
        </ul>

        <Link href="/services" className={styles.cta}>
          View all services
          <ArrowRightIcon />
        </Link>
      </section>
    </HeaderZone>
  );
}
