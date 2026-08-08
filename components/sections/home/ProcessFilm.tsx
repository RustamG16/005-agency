"use client";

/**
 * Inside the process.
 *
 * REBUILT 2026-08-08 (R6). The previous version was a pinned band that opened
 * from letterbox to full while type arrived on solid noir — competent, but it
 * did not speak the same language as `/about`, where one continuous medium
 * carries six chapters and the page demonstrates the studio rather than
 * describing it. This rebuild adopts `/about`'s mechanism directly:
 *
 * THE STICKY BED, not a pin. `.plateStage` is `position: sticky; top: 0;
 * height: 100svh; margin-bottom: -100svh` — identical to
 * `MonolithScene.module.css`'s `.stage`. The negative margin keeps the sticky
 * element out of the height calculation, so the four beat `<section>`s' own
 * `min-height`s (from `content/process.ts`) are the only thing setting scroll
 * length. A sticky bed cannot have a dead pin, because the page never stops —
 * this retires the whole class of bug the old docblock recorded fighting once
 * ("the last real motion used to land at t=0.72").
 *
 * TWO INDEPENDENT RHYTHMS, exactly as `MonolithScene.tsx` documents it: the
 * plate is one continuous scrub across the WHOLE root (`start: "top top"`,
 * `end: "bottom bottom"`), while each beat's copy arrives on its own
 * once-only reveal as that beat's section crosses into view. They stay
 * decoupled on purpose — the medium is a single take, the copy is discrete.
 *
 * LEGIBILITY BY CONSTRUCTION, not by tuning. The plate lives in `.plateStage`
 * at `grid-column: 7 / span 6`; every beat's copy lives in its OWN sticky
 * wrapper at `grid-column: 1 / span 5`. Two separate elements, not a shared
 * one, so cotton type can never sit over the moving image at any progress on
 * any breakpoint — there is no clip-path or z-index trick for a future edit
 * to get wrong.
 *
 * Media contract matches the rest of the site: `ProcessPlate` degrades
 * through a manifest (scrub → stills → poster → bare), desktop-motion only,
 * extracted posters, `-an`. Below 900px there is no sticky bed at all — the
 * beats stack in normal flow with one static poster image ahead of them,
 * matching how Hero and Principles both collapse outside desktop motion.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { MQ } from "@/components/motion/motion";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { processBeats } from "@/content/process";
import { ProcessPlate, type ProcessPlateHandle } from "./ProcessPlate";
import manifest from "@/public/media/process/manifest.json";
import styles from "./ProcessFilm.module.css";

const TOTAL_VH = processBeats.reduce((sum, b) => sum + b.lengthVh, 0);

export function ProcessFilm() {
  const rootRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<ProcessPlateHandle>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduced = window.matchMedia(MQ.reduced).matches;
      const cleanups: Array<() => void> = [];
      const splits: SplitText[] = [];

      /* ---- copy reveals: per-beat, once-only, independent of the scrub ---- */
      const wireCopyReveals = () => {
        root.querySelectorAll<HTMLElement>("[data-head]").forEach((el) => {
          const trigger = { trigger: el, start: "top 82%", once: true };
          if (reduced) {
            gsap.from(el, { autoAlpha: 0, duration: 0.32, scrollTrigger: trigger });
            return;
          }
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              splits.push(self);
              return gsap.from(self.lines, {
                yPercent: 100,
                duration: 0.42,
                ease: "expo.out",
                stagger: 0.06,
                scrollTrigger: trigger,
              });
            },
          });
        });

        root.querySelectorAll<HTMLElement>("[data-body]").forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: reduced ? 0 : 24,
            duration: 0.42,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      };
      cleanups.push(() => splits.forEach((s) => s.revert()));

      void (async () => {
        await (document.fonts?.ready ?? Promise.resolve());
        wireCopyReveals();
      })();

      /* ---- the plate: one continuous scrub across the whole root ---- */
      const mm = gsap.matchMedia();
      mm.add(MQ.desktopMotion, () => {
        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
          onUpdate: (self) => plateRef.current?.setProgress(self.progress),
        });
        return () => trigger.kill();
      });
      cleanups.push(() => mm.revert());

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: rootRef }
  );

  return (
    <HeaderZone theme="dark">
      <div ref={rootRef} className={styles.root}>
        {/* Mobile / reduced-motion poster — the whole sticky mechanism is
            desktop-motion only, so this is the entire process visual outside
            it: one static frame ahead of the stacked beats. A plain <img>
            reading the manifest directly, NOT a second `ProcessPlate` mount —
            two mounts would both pass the same desktop-motion check and fetch
            the scrub video twice regardless of which one CSS hides. */}
        {manifest.poster && (
          <div className={styles.mobilePoster} aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element -- must match the encoded frame pixel for pixel */}
            <img className={styles.mobilePosterImg} src={`/images/process/${manifest.poster}`} alt="" />
          </div>
        )}

        <div className={styles.plateStage}>
          <div className={`wrap ${styles.plateGrid}`}>
            <div className={styles.plateSlot}>
              <ProcessPlate handleRef={plateRef} />
            </div>
          </div>
        </div>

        {processBeats.map((beat, i) => (
          <section
            key={beat.id}
            className={styles.beat}
            // Read by CSS only under desktop motion — the mobile/reduced
            // stylesheet fixes min-height to `auto` regardless of this value,
            // so a huge dead gap under a static (non-sticky) copy block is
            // structurally impossible rather than tuned away.
            style={{ ["--beat-vh" as string]: beat.lengthVh }}
            aria-label={beat.heading}
          >
            <div className={styles.sticky}>
              <div className={`wrap ${styles.copyGrid}`}>
                <div className={styles.copySlot}>
                  <p className={styles.eyebrow}>
                    {beat.eyebrow}
                    <span className={styles.eyebrowIndex}>
                      {String(i + 1).padStart(2, "0")} / {String(processBeats.length).padStart(2, "0")}
                    </span>
                  </p>
                  <h3 className={styles.heading} data-head>
                    {beat.heading}
                  </h3>
                  <p className={styles.body} data-body>
                    {beat.body}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </HeaderZone>
  );
}

/** Exposed for the verification harness — total scroll length in vh, so a
 *  script can compute exact scroll offsets for each beat boundary without
 *  guessing at layout. */
export const PROCESS_TOTAL_VH = TOTAL_VH;
