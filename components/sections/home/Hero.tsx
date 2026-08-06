"use client";

/**
 * The homepage hero.
 *
 * Rebuilt from zero 2026-08-04. There is no film here yet and no elevator-door
 * sequence — the statement carries the viewport on its own. Two lines of
 * brutalist display set the claim; the third lands it in Newsreader italic,
 * which is the one face break on the page and the reason the sentence reads as
 * a promise rather than a slogan.
 *
 * One pinned ScrollTrigger owns everything: the media progress plumbing (see
 * `HeroMedia`), the type parallax, and the handoff to Capabilities. Keeping the
 * handoff on this timeline rather than giving it its own trigger is what makes
 * scrolling back up exact — there is only one progress value, and reversing it
 * reverses the whole beat.
 *
 * THE HANDOFF, REVISED 2026-08-04. It used to be a cotton overlay (`.wipe`) that
 * rose over the hero while the pin ran on for 120% of the viewport. Measured, it
 * covered the frame at progress 1.0 and then the now-blank cotton hero still had
 * its own 900px to scroll off — about 450px of solid empty ground before
 * Capabilities arrived. The overlay is gone. The pin now holds for exactly one
 * viewport with NO pin spacing, so the real Capabilities section — already cotton
 * — rises over the hero and IS the wipe. The pin releases the frame it finishes
 * covering: no blank ground either way, and nothing to keep in sync.
 */

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { MQ } from "@/components/motion/motion";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { useHeaderTheme } from "@/components/chrome/HeaderThemeContext";
import { site } from "@/content/site";
import { HeroMedia, type HeroMediaHandle } from "./HeroMedia";
import styles from "./Hero.module.css";

/** Where the type lifts out ahead of the section arriving over it. */
const HANDOFF_AT = 0.62;

/* Where the covering section's top edge has passed under the header, so the
 * chrome must flip. The pin spans one viewport, so progress IS the fraction of
 * the frame Capabilities has covered; 0.92 puts its edge at ~72px, the header's
 * own baseline. */
const CHROME_FLIP_AT = 0.92;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HeroMediaHandle>(null);
  const { theme, setTheme } = useHeaderTheme();

  /* Mirrors what the chrome is ACTUALLY showing, not what this timeline last
   * asked for. The zone observer below also writes the theme, and comparing
   * against our own last request would let its value stand: it flips to light
   * the moment Capabilities covers 85% of the frame, while the header still sits
   * over 135px of noir, and dark ink on noir is an invisible header. Comparing
   * against the real value means the next scroll frame puts it back. */
  const chromeRef = useRef<"dark" | "light">(theme);
  useEffect(() => {
    chromeRef.current = theme;
  }, [theme]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const q = gsap.utils.selector(section);
      const displayLines = q(`.${styles.display}`);
      const serifLine = q(`.${styles.serif}`);
      const support = q(`.${styles.support}`);
      const cue = q(`.${styles.cue}`);

      const mm = gsap.matchMedia();

      mm.add(MQ.desktopMotion, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            id: "hero",
            start: "top top",
            // One viewport, and no spacer: the section below scrolls up over the
            // held hero, so every pixel of this range shows real content.
            end: "+=100%",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // The plumbing the film will use. Normalised across the whole pin
              // so the eventual scrub covers the full clip, not just the first
              // beat.
              mediaRef.current?.setProgress(self.progress);

              /* The header sits above the covering section, so it has to flip
               * with it. The zone observer cannot see this on its own: while the
               * hero is pinned its box still sits under the header band, so it
               * would keep reporting "dark" over a light ground and the wordmark
               * would vanish into it. This timeline is the authority for the
               * hero's range — which is why the section below is NOT wrapped in
               * a `HeaderZone`. */
              const next = self.progress >= CHROME_FLIP_AT ? "light" : "dark";
              if (next !== chromeRef.current) {
                chromeRef.current = next;
                setTheme(next);
              }
            },
          },
        });

        // Type travels at three rates, heaviest line fastest — the parallax that
        // sells depth on a flat ground.
        tl.to(displayLines, { yPercent: -14, ease: "none", stagger: 0.04 }, 0)
          .to(serifLine, { yPercent: -6, ease: "none" }, 0)
          .to(support, { yPercent: -4, autoAlpha: 0.55, ease: "none" }, 0)
          .to(cue, { autoAlpha: 0, y: 12, ease: "none", duration: 0.15 }, 0);

        // The handoff: the statement lifts out ahead of the edge coming up over
        // it, so the two are never fighting for the same band of the frame.
        tl.to(
          [displayLines, serifLine, support],
          { yPercent: "-=8", ease: "none", duration: 1 - HANDOFF_AT },
          HANDOFF_AT
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      // Mobile and reduced motion: no pin, no parallax. The hero is a full
      // statement at rest and the ground changes at the section boundary.
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  /* The zone observer is what restores dark chrome when you scroll back up to
   * the top — and it is the ONLY thing doing that on mobile, where the timeline
   * above never runs. On desktop the timeline outranks it (see `chromeRef`). */
  return (
    <HeaderZone theme="dark">
      <section ref={sectionRef} id="top" className={styles.hero} aria-label="Convenium Studio">
        <div className={styles.stage}>
          <HeroMedia handleRef={mediaRef} />

          <div className={`wrap ${styles.content}`}>
            <h1 className={styles.headline}>
              <span className={styles.display}>We take businesses</span>{" "}
              <span className={styles.display}>to the level</span>{" "}
              <span className={styles.serif}>their ambition deserves.</span>
            </h1>
            <p className={styles.support}>{site.supporting}</p>
          </div>

          <div className={styles.cue} aria-hidden="true">
            <span className={styles.cueLine} />
            Scroll to go up
          </div>
        </div>
      </section>
    </HeaderZone>
  );
}
