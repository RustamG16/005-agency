"use client";

/**
 * How we work.
 *
 * REBUILT 2026-08-04. The previous version set the three entries at staggered
 * column starts, which left the right half of every row empty — a dead half-page
 * at 1440. Each entry now spans the container: numeral and copy on the left, a
 * media plate filling the rest, so neither side reads as what was left over.
 *
 * The numerals stay. These are three positions rather than three steps, so the
 * numbers are an index, not a sequence — which is exactly what the full-bleed
 * hairlines between them say too. They are the one device the old layout got
 * right and they are kept unchanged.
 *
 * The media plates are DELIBERATELY empty noir fields. Russ is supplying the
 * three images (subject and aspect are listed in the PROMPT D report); until
 * they land, a plate of the site's own dark ground is honest, and nothing is
 * invented or pulled from stock to fill the hole. Dropping the images in means
 * putting an <Image> inside `.plate` and nothing else.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { MOTION, MQ } from "@/components/motion/motion";
import { principles } from "@/content/principles";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./Principles.module.css";

export function Principles() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      const build = (distance: number) => () => {
        const items = gsap.utils.toArray<HTMLElement>(`.${styles.item}`, section);

        const tweens = items.map((item) => {
          const parts = item.querySelectorAll<HTMLElement>("[data-principle-part]");
          gsap.set(parts, { y: distance, autoAlpha: 0 });

          return gsap.to(parts, {
            y: 0,
            autoAlpha: 1,
            duration: MOTION.enter,
            ease: MOTION.ease,
            stagger: MOTION.stagger,
            immediateRender: false,
            scrollTrigger: {
              trigger: item,
              start: MOTION.start,
              // Both directions, per row: scrolling back up through the section
              // used to leave the rows already arrived, so coming down a second
              // time there was nothing to watch.
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
              refreshPriority: -10,
            },
          });
        });

        return () => {
          tweens.forEach((tween) => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
        };
      };

      mm.add(MQ.desktopMotion, build(MOTION.yBlock));
      mm.add(MQ.mobileMotion, build(MOTION.yBlockMobile));

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <HeaderZone theme="light">
      <section ref={sectionRef} className={styles.section} aria-label="Working principles">
        <div className="wrap">
          <p className={`eyebrow ${styles.eyebrow}`} data-interior-reveal="block">
            How We Work
          </p>
        </div>

        <ol className={styles.list}>
          {principles.map((p) => (
            <li key={p.index} className={styles.item}>
              <div className={`wrap ${styles.itemGrid}`}>
                <span className={styles.index} data-principle-part aria-hidden="true">
                  {p.index}
                </span>
                <div className={styles.copy}>
                  <h3 className={styles.title} data-principle-part>
                    {p.title}
                  </h3>
                  <p className={styles.body} data-principle-part>
                    {p.body}
                  </p>
                </div>
                <div className={styles.media} data-principle-part aria-hidden="true">
                  <div className={styles.plate} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </HeaderZone>
  );
}
