"use client";

/**
 * The homepage hero.
 *
 * REBUILT 2026-08-08 (R6) around the new film, which changed what this section
 * is. `new_hero.mp4` is not a dark architectural ascent — it is the Convenium
 * ident: the extruded ink wordmark building on a paper ground, the striped mark
 * carrying the single red rule. So the hero inverted from dark to light. The
 * statement is set in ink on cotton, not cotton on noir, and the DESIGN.md hero
 * grade is gone (see `HeroMedia`).
 *
 * THREE BEATS, ONE PIN.
 *
 *   0.00 → 0.86   the ident scrubs full-bleed and alone. No statement over it:
 *                 an <h1> on top of an animating CONVENIUM logotype is two brand
 *                 statements fighting for one viewport, and DESIGN.md's own brief
 *                 says the hero opens with minimal interface copy and lets the
 *                 film carry it.
 *   0.41 → 0.66   the film cuts to its inverted passage and back. Measured, not
 *                 guessed: mean luma runs 207 → 28 → 191 across those bounds.
 *                 The chrome flips with it, twice.
 *   0.86 → 1.00   a cotton field RISES over the resolved ident, carrying the
 *                 statement. The seam is a hard edge, never a dissolve —
 *                 DESIGN.md: the transition after the final frame is built in
 *                 code and holds a sharp frame boundary. It reaches full cover
 *                 at exactly 1.0, so the pin releases into Capabilities (also
 *                 cotton) with nothing to keep in sync.
 *
 * WHY THE STATEMENT NEEDS THAT PANEL. The settled ident occupies the middle band
 * of the frame (measured: the wordmark spans 39–65% of frame height, its shadow
 * to ~75%). The two clear bands are 0–28% and 72–100%, ~250px each at 1440×900,
 * which cannot hold two display lines plus the serif turn plus the support
 * paragraph at hero scale. Shrinking the statement to fit would make the claim
 * subordinate to the mark. Giving it its own clean ground instead keeps it at
 * full size, keeps ink-on-cotton at a flat 13.5:1, and makes the arrival a beat
 * rather than an overlap.
 *
 * WHY THE PIN IS 300%. The film is 15.04s. One viewport of pin (the pre-R6
 * value) put it at ~14ms of film per scroll pixel — three times the old film's
 * density, which reads as a whip rather than a held shot. 300% with the playhead
 * mapped to 0 → 0.86 restores ~6.5ms/px.
 *
 * That is ~2700px of scroll before the page moves on, and it is deliberate: the
 * whole ident plays or none of it does. A "skip the intro" control was built and
 * then removed (Russ, 2026-08-08) — the ident IS the front door, and offering an
 * exit from it undercuts the reason for showing it at full length. Do not
 * reintroduce one without revisiting the pin length at the same time; they are
 * the same decision.
 *
 * `pinSpacing` is TRUE now, unlike the pre-R6 hero. It was false so the real
 * Capabilities section could scroll up over the held hero and BE the wipe, which
 * only works when the pin is exactly one viewport. Over 300% that section would
 * finish covering at progress 0.33 and the remaining two thirds of the ident
 * would scrub behind an opaque panel.
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

/* The film's hard cut into its inverted passage, and back out. Measured off the
 * shipping encode at 4fps: YAVG 206.6 at 0.38 → 28.5 at 0.42, then 95.3 at 0.58
 * → 190.9 at 0.66. The chrome has to flip across both or the header vanishes
 * into its own ground. */
const INVERT_FROM = 0.41;
const INVERT_TO = 0.66;

/** Where the cotton field starts rising, and where the ident's playhead ends. */
const REVEAL_AT = 0.86;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HeroMediaHandle>(null);
  const { theme, setTheme } = useHeaderTheme();

  /* Mirrors what the chrome is ACTUALLY showing, not what this timeline last
   * asked for. The zone observer below also writes the theme, and comparing
   * against our own last request would let its value stand. */
  const chromeRef = useRef<"dark" | "light">(theme);
  useEffect(() => {
    chromeRef.current = theme;
  }, [theme]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const q = gsap.utils.selector(section);
      const reveal = q(`.${styles.reveal}`);
      const statement = q(`.${styles.statement}`);
      const content = q(`.${styles.content}`);
      const cue = q(`.${styles.cue}`);

      const mm = gsap.matchMedia();

      mm.add(MQ.desktopMotion, () => {
        /* Four explicit values on both ends. Chrome normalises
         * `inset(100% 0 0 0)` to a shorthand and GSAP then interpolates the two
         * forms against each other — the same trap ProcessFilm documents. */
        gsap.set(reveal, { clipPath: "inset(100% 0% 0% 0%)" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            id: "hero",
            start: "top top",
            end: "+=300%",
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;

              /* The playhead finishes as the wipe begins, so the ident has fully
               * resolved by the time the cotton edge starts crossing it. */
              mediaRef.current?.setProgress(Math.min(1, p / REVEAL_AT));

              /* The header sits over whatever the film is currently showing, so
               * it flips across the film's own inversion. Outside that window
               * the ground is paper in both directions — including under the
               * risen cotton field, which is why the wipe needs no flip of its
               * own. */
              const next = p >= INVERT_FROM && p < INVERT_TO ? "dark" : "light";
              if (next !== chromeRef.current) {
                chromeRef.current = next;
                setTheme(next);
                /* Mirrored onto the section so anything sitting over the film
                 * can invert with it in CSS. One write per change, not per
                 * frame. */
                section.dataset.ground = next;
              }
            },
          },
        });

        tl
          // The statement is on screen at rest, over the film's opening frame —
          // a near-empty paper ground measuring 253 mean / 219 min luma, so ink
          // holds everywhere on it. It lifts out as the wordmark starts building,
          // because an <h1> over an animating logotype is two brand statements
          // fighting for one viewport.
          .to(content, { yPercent: -16, autoAlpha: 0, ease: "none", duration: 0.14 }, 0)
          // The cue has said its piece within the first tenth.
          .to(cue, { autoAlpha: 0, y: 12, ease: "none", duration: 0.1 }, 0)
          /* The statement is restored instantly at the moment the seam starts,
           * while it is still fully clipped and therefore invisible. From here
           * the rising edge — not an opacity ramp — is what brings it back.
           *
           * `immediateRender: false` is load-bearing, not tidiness: a `set` or a
           * `fromTo` renders at build time, which would stamp these values on
           * the element before the lift-out tween above ever captures its start
           * state, and the hero would open blank. */
          .set(
            content,
            { yPercent: 0, autoAlpha: 1, immediateRender: false },
            REVEAL_AT
          )
          .set(
            statement,
            { clipPath: "inset(100% 0% 0% 0%)", immediateRender: false },
            REVEAL_AT
          )
          /* The rising seam, on both layers at once and with identical values.
           * Linear on purpose: it tracks the scroll 1:1, so reversing it
           * reverses the beat exactly. */
          .to(
            [reveal, statement],
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", duration: 1 - REVEAL_AT },
            REVEAL_AT
          );

        /* Dev-only scroll range for QA capture — mirrors `__monolithProgress` on
         * /about. A scrubbed pin cannot be screenshotted deterministically
         * without knowing where its range actually is, and the constants above
         * were chosen from exactly these frames. Stripped by NODE_ENV. */
        if (process.env.NODE_ENV !== "production") {
          const w = window as typeof window & { __heroRange?: () => { start: number; end: number } };
          w.__heroRange = () => ({
            start: tl.scrollTrigger?.start ?? 0,
            end: tl.scrollTrigger?.end ?? 0,
          });
          return () => {
            delete w.__heroRange;
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      /* Mobile and reduced motion: no pin, no wipe. The panel
       * is transparent and in normal flow there, so the statement sits in ink
       * directly over the poster — which is frame 0, a near-empty paper ground
       * measuring 253 mean / 219 min luma. Ink holds everywhere on it. */
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <HeaderZone theme="light">
      {/* `data-guide-reveal-after` tells the Guide to stay off stage until this
          whole section — pin spacer included — has scrolled past. Without it he
          gates on a flat 0.98 viewports and walks on a third of the way through
          the ident, over the film. See GuideScene's REVEAL_AT. */}
      <section
        ref={sectionRef}
        id="top"
        className={styles.hero}
        aria-label="Convenium Studio"
        data-guide-reveal-after
      >
        <div className={styles.stage}>
          <HeroMedia handleRef={mediaRef} />

          {/* The cotton field that rises over the resolved ident. Deliberately
              EMPTY and behind the statement rather than wrapping it: the
              statement has to be readable at progress 0 too, over the film's
              own opening frame, and it cannot be if it lives inside an opaque
              panel that must start hidden. */}
          <div className={styles.reveal} aria-hidden="true" />

          {/* `.statement` exists only to be clipped by the same rising edge as
              `.reveal`, which is why it is a full-stage box rather than wrapping
              the copy tightly: identical inset percentages only track each other
              if the two boxes are the same size. Without it the statement
              cross-fades in ACROSS the seam and its display lines sit on top of
              the ident's wordmark for the length of the wipe. */}
          <div className={styles.statement}>
            <div className={`wrap ${styles.content}`}>
              <h1 className={styles.headline}>
                <span className={styles.display}>Your idea,</span>{" "}
                <span className={styles.display}>at full volume.</span>{" "}
                <span className={styles.serif}>Designed to be heard, and to be kept.</span>
              </h1>
              <p className={styles.support}>{site.supporting}</p>
            </div>
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
