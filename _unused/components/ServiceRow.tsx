import type { Service } from "@/content/services";
import styles from "./ServiceRow.module.css";

export function ServiceRow({ service }: { service: Service }) {
  return (
    <article id={service.slug} className={`wrap ${styles.row}`}>
      <div className={styles.left}>
        <span className={styles.index}>{service.index}</span>
        <h2 className={styles.name}>{service.name}</h2>
        <p className={styles.role}>{service.role}</p>
      </div>

      <div className={styles.right}>
        <p className={styles.description}>{service.description}</p>

        <ul className={styles.scope}>
          {service.scope.map((item) => (
            <li key={item} className={styles.scopeItem}>
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.mediaStrip}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image} alt="" className={styles.mediaImg} />
        </div>
      </div>
    </article>
  );
}
