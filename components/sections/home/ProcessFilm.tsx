"use client";

/**
 * Inside the process.
 *
 * Rebuilt 2026-08-04. The old version was a static headline block sitting over
 * the film. Now the section is pinned and the film opens: it starts as a
 * letterboxed band and widens to fill the frame while the type arrives against
 * it, with a progress rule tracking how far through you are.
 *
 * The type is never set over the moving image — it sits above the band on solid
 * noir. That is a legibility decision, not a layout one: cotton over an
 * unpredictable frame of a film cannot be held to AA.
 *
 * The video is NOT scrubbed. `team.mp4` is a normal encode; only the
 * all-keyframe re-encode may ever be seeked (root CLAUDE.md). It plays once when
 * the section is reached, exactly as before.
 */

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { MOTION, MQ } from "@/components/motion/motion";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./ProcessFilm.module.css";

export function ProcessFilm() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35 && !playedRef.current) {
          playedRef.current = true;
          video.play().catch(() => {});
        }
      },
      { threshold: [0, 0.35, 1] }
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktopMotion, () => {
        const lines = q("[data-process-line]");
        const band = q(`.${styles.band}`);
        const ruleFill = q(`.${styles.ruleFill}`);
        const body = q(`.${styles.body}`);

        gsap.set(lines, { yPercent: MOTION.yPercentLine, autoAlpha: 0 });
        gsap.set(body, { y: MOTION.yBlock, autoAlpha: 0 });
        gsap.set(ruleFill, { scaleX: 0 });
        // Four explicit values on both ends: Chrome normalises `inset(34% 0 34% 0)`
        // to the two-value shorthand, and GSAP then interpolates the two forms
        // against each other — the bottom edge opens before the top.
        gsap.set(band, { clipPath: "inset(34% 0% 34% 0%)" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            id: "process-film",
            start: "top top",
            // Was +=140%. The last real motion used to land at t=0.72, leaving
            // ~353px of pin where only a 1px rule moved — that dead stretch is
            // what read as the page sticking before it let go.
            end: "+=100%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        // The band now opens across almost the whole pin, so the frame is still
        // changing when the pin hands back — no dead ground at either end.
        tl.to(ruleFill, { scaleX: 1, ease: "none", duration: 1 }, 0)
          .to(lines, { yPercent: 0, autoAlpha: 1, ease: MOTION.ease, duration: 0.2, stagger: 0.08 }, 0.04)
          .to(body, { y: 0, autoAlpha: 1, ease: MOTION.ease, duration: 0.2 }, 0.26)
          .to(band, { clipPath: "inset(0% 0% 0% 0%)", ease: MOTION.easeInOut, duration: 0.8 }, 0.12);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <HeaderZone theme="dark">
      <section ref={sectionRef} className={styles.section} aria-label="Inside the process">
        <div className={styles.stage}>
          <div className={`wrap ${styles.copy}`}>
            <div className={styles.labelRow}>
              <p className={`eyebrow ${styles.label}`}>Inside the process</p>
              <span className={styles.rule} aria-hidden="true">
                <span className={styles.ruleFill} />
              </span>
            </div>

            <h2 className={styles.heading}>
              <span className={styles.lineMask}>
                <span className={styles.line} data-process-line>
                  The work stays close
                </span>
              </span>
              <span className={styles.lineMask}>
                <span className={styles.line} data-process-line>
                  to the idea.
                </span>
              </span>
            </h2>

            <p className={styles.body}>
              Convenium runs small, direct teams around every brand. Strategists, designers and makers
              work in the same room, close enough to keep an idea intact from the first question to the
              final frame. The people in this film are part of that process — not a roster, not a
              department.
            </p>
          </div>

          <div className={styles.band}>
            <video
              ref={videoRef}
              className={styles.video}
              muted
              playsInline
              preload="metadata"
              poster="/images/poster-team.jpg"
            >
              <source src="/media/team.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </HeaderZone>
  );
}
