"use client";

/**
 * Selected work — the deck.
 *
 * `/works` already owns the numbered index, so the homepage does not repeat it.
 * Here the four cases behave like physical plates: each holds the viewport while
 * the next slides up and covers it, and the covered plate settles back and dims.
 * By the end of the section the four are a stack you have pushed through.
 *
 * The stacking itself is CSS `position: sticky` — no ScrollTrigger pin. That
 * matters: the hero and the process film both pin, and a third pinned region
 * competing for the same scroll space is where two-way scrubbing starts to
 * drift. Sticky reverses perfectly for free, keyboard focus still scrolls the
 * panel into view, and with motion off it degrades to an ordinary stack.
 *
 * GSAP only handles the settle-back of a covered plate.
 */

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { MQ } from "@/components/motion/motion";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { projects } from "@/content/projects";
import styles from "./WorkDeck.module.css";

function indexLabel(i: number) {
  return String(i + 1).padStart(2, "0");
}

export function WorkDeck() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MQ.desktopMotion, () => {
        const panels = gsap.utils.toArray<HTMLElement>(`.${styles.panel}`, section);
        if (panels.length < 2) return;

        const triggers = panels.slice(0, -1).map((panel, i) => {
          const inner = panel.querySelector<HTMLElement>(`.${styles.inner}`);
          const cover = panel.querySelector<HTMLElement>(`.${styles.cover}`);
          const next = panels[i + 1];
          if (!inner || !cover) return null;

          // Driven by the arrival of the plate ABOVE it, so the settle is
          // exactly synchronous with being covered — and reverses on the way up.
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          tl.to(inner, { scale: 0.96, ease: "none" }, 0).to(
            cover,
            { autoAlpha: 0.55, ease: "none" },
            0
          );

          return tl;
        });

        return () => {
          triggers.forEach((tl) => {
            tl?.scrollTrigger?.kill();
            tl?.kill();
          });
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <HeaderZone theme="dark">
      <section ref={sectionRef} className={styles.section} aria-label="Selected work">
        <div className={`wrap ${styles.head}`}>
          <p className="eyebrow" data-interior-reveal="block">
            Selected Work
          </p>
          <Link href="/works" className={styles.headLink} data-cursor="link">
            View all work
            <ArrowRightIcon />
          </Link>
        </div>

        <div className={styles.deck}>
          {projects.map((project, i) => (
            <article key={project.slug} className={styles.panel}>
              <div className={styles.inner}>
                <Link href={`/works#${project.slug}`} className={styles.plate} data-cursor="view" data-cursor-label="View">
                  <span className={styles.mediaWrap}>
                    <Image
                      src={project.poster}
                      alt=""
                      fill
                      sizes="100vw"
                      className={styles.media}
                      style={{ objectPosition: project.objectPosition }}
                      priority={i === 0}
                    />
                  </span>

                  <span className={styles.text}>
                    <span className={styles.index} aria-hidden="true">
                      {indexLabel(i)}
                    </span>
                    <h3 className={styles.name}>{project.name}</h3>
                    <span className={styles.meta}>
                      {project.sector}
                      <span className={styles.sep} aria-hidden="true">
                        ·
                      </span>
                      {project.scope}
                      <span className={styles.sep} aria-hidden="true">
                        ·
                      </span>
                      {project.year}
                    </span>
                    <span className={styles.outcome}>{project.outcome}</span>
                  </span>
                </Link>

                {/* Darkens as the next plate covers this one. */}
                <span className={styles.cover} aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </HeaderZone>
  );
}
