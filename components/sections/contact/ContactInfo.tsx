import Image from "next/image";
import { site } from "@/content/site";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./ContactInfo.module.css";

export function ContactInfo() {
  return (
    <div className={styles.info}>
      <InteriorRevealBlock as="p" className={styles.statement}>
        Tell us where the brand is today and where it needs to compete. We read every inquiry
        personally — no forms disappearing into a queue.
      </InteriorRevealBlock>
      <a href={`mailto:${site.email}`} className={styles.email}>
        {site.email}
      </a>
      <div className={styles.media}>
        <Image
          src="/images/still-columns-15.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className={styles.mediaImg}
        />
      </div>
    </div>
  );
}
