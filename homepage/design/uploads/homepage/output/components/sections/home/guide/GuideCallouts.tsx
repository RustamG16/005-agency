"use client";

// The guide callouts (spec §4). Cards are decoration — the same copy is in the
// visually-hidden list below, which is what screen readers get.

import { forwardRef, useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "@/components/motion/gsap";
import { GUIDE_CHAPTERS, guideEyebrow, type GuideChapterId } from "./guide-copy";
import styles from "./GuideCallouts.module.css";

if (typeof window !== "undefined") gsap.registerPlugin(SplitText);

type Props = {
  active: GuideChapterId | null;
  /** live = connector to the eye · inview = simple reveal · flow = static, in-page. */
  mode: "live" | "inview" | "flow";
  /** Chapter 02 speaks the active service's role line (spec §3). */
  serviceLine?: string;
};

const EASE = "expo.out";

export const GuideCallouts = forwardRef<HTMLDivElement, Props>(function GuideCallouts(
  { active, mode, serviceLine },
  ref
) {
  const localRef = useRef<HTMLDivElement>(null);
  const splits = useRef<SplitText[]>([]);

  useEffect(() => {
    const layer = localRef.current;
    if (!layer || mode === "flow") return;

    const ctx = gsap.context(() => {
      layer.querySelectorAll<HTMLElement>("[data-guide-card]").forEach((card) => {
        const on = card.dataset.chapter === active;
        const line = card.querySelector<HTMLElement>("[data-guide-line]");
        const connector = card.querySelector<HTMLElement>("[data-guide-conn] span");

        if (!on) {
          gsap.to(card, { autoAlpha: 0, duration: 0.2, ease: "power2.in", overwrite: true });
          return;
        }

        gsap.set(card, { autoAlpha: 1 });
        gsap.fromTo(
          card,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.32, ease: EASE, overwrite: true }
        );
        if (connector && mode === "live") {
          gsap.fromTo(connector, { scaleX: 0 }, { scaleX: 1, duration: 0.32, ease: EASE, delay: 0.12 });
        }
        if (!line) return;
        const split = SplitText.create(line, {
          type: "lines",
          mask: "lines",
          onSplit(self) {
            splits.current.push(self);
            return gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.42,
              ease: EASE,
              stagger: 0.06,
              delay: 0.06,
            });
          },
        });
        splits.current.push(split);
      });
    }, layer);

    return () => {
      ctx.revert();
      splits.current.forEach((s) => s.revert());
      splits.current = [];
    };
  }, [active, mode, serviceLine]);

  return (
    <>
      <div
        className={styles.layer}
        data-mode={mode}
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        aria-hidden="true"
      >
        {GUIDE_CHAPTERS.map((chapter) => (
          <div
            key={chapter.id}
            className={styles.card}
            data-guide-card=""
            data-chapter={chapter.id}
            data-surface={chapter.surface}
            style={{ left: `${chapter.card.x * 100}%`, top: `${chapter.card.y * 100}%` }}
          >
            {mode === "live" ? (
              <span className={styles.conn} data-guide-conn="">
                <span className={styles.connLine} />
              </span>
            ) : null}
            <span className={styles.eyebrow}>{guideEyebrow(chapter.index)}</span>
            <p className={styles.line} data-guide-line="">
              {chapter.id === "services" && serviceLine ? serviceLine : chapter.line}
            </p>
          </div>
        ))}
      </div>

      <ol className="visually-hidden">
        {GUIDE_CHAPTERS.map((chapter) => (
          <li key={chapter.id}>
            {chapter.href ? <a href={chapter.href}>{chapter.line}</a> : chapter.line}
          </li>
        ))}
      </ol>
    </>
  );
});
