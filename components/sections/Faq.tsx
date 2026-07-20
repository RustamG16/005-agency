"use client";

import { useState } from "react";
import { faqItems } from "@/content/faq";
import { PlusIcon } from "@/components/ui/Icons";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./Faq.module.css";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Frequently asked questions">
        <p className="eyebrow">FAQ</p>
        <InteriorRevealBlock as="h2" className={styles.heading}>
          Questions worth asking first.
        </InteriorRevealBlock>

        <div className={styles.list} data-interior-reveal="block">
          {faqItems.map((item, i) => {
            const open = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const triggerId = `faq-trigger-${i}`;
            return (
              <div key={item.question} className={styles.item}>
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    id={triggerId}
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span>{item.question}</span>
                    <PlusIcon className={`${styles.icon} ${open ? styles.iconOpen : ""}`} />
                  </button>
                </h3>
                <div
                  className={styles.panelWrap}
                  data-open={open}
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                >
                  <div className={styles.panelInner}>
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </HeaderZone>
  );
}
