import { availability } from "@/content/contact";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./ContactIntro.module.css";

export function ContactIntro() {
  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Contact introduction">
        <InteriorRevealBlock as="p" className={styles.availability}>
          {availability}
        </InteriorRevealBlock>
        <InteriorRevealBlock as="h1" className={styles.heading}>
          All progress starts with a conversation.
        </InteriorRevealBlock>
      </section>
    </HeaderZone>
  );
}
