"use client";

/* =============================================================================
   00 — The about hero banner
   =============================================================================

   THE SEQUENCE

     1. On load the take plays once, muted and inline, and holds its final
        frame. Eight seconds, no scroll involvement. A title sits in the gap
        between the two founders while this plays.
     2. On scroll the title fades first. Everything except the two full-height
        panel frames then dissolves to cotton.
     3. The editorial layer builds in around the panels — name labels, then
        heading, lede and meta.
     4. Only once all of that has landed do the panels themselves crossfade
        from the held-frame crop to the higher-fidelity founder plate. This is
        the finale, not a mid-sequence beat.

   THREE THINGS THAT ARE STRUCTURAL, NOT TUNED

   1. **The panels need no measurement.** They are full-height rectangles
      whose horizontal position is a fixed fraction of `.frame`'s own
      cover-fit width — expressible entirely in CSS `calc()` against
      `--frame-w`/`--frame-left` (declared on `.bed`), because unlike the old
      person-shaped cards they never travel from an "in-film" position to a
      resting layout position. There is nothing to read with
      `getBoundingClientRect()` and nothing that can drift on resize.

   2. **A sticky bed, never `pin: true`.** Same construction as `ProcessFilm`
      and `MonolithScene`. The page never stops scrolling, so a dead pin is
      structurally impossible here.

   3. **The endpoint is the resting state — with one deliberate exception.**
      The stylesheet paints the finished composition and the timeline only
      animates *into* it, EXCEPT for `.intro`, which defaults to hidden in CSS
      because it occupies the same grid cell as the editorial heading that
      arrives later. Showing both by default (the "no JS" failure mode every
      other element in this file uses) would mean two overlapping headlines
      if GSAP never runs — worse than one of them silently not appearing.
      Every other element here still renders complete with no JavaScript.

   Under reduced motion the film is never instantiated — the element is not in
   the DOM at all rather than hidden, so nothing is fetched or decoded. The
   panel fill (the higher-fidelity plate) is what reduced-motion and mobile
   visitors see at rest — see the CSS for why that is the correct default.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { MOTION, MQ } from "@/components/motion/motion";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { about } from "@/content/about";
import styles from "./AboutHero.module.css";

const { hero } = about;

const PANELS = [
  { key: "a", person: hero.people.left, frame: hero.frames.a },
  { key: "b", person: hero.people.right, frame: hero.frames.b },
] as const;

export function AboutHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  /* The film is mounted only under desktop motion. Rendering it and hiding it
     with CSS would still fetch and decode it, and §4.5 asks for no video
     element at all outside desktop motion. */
  const [filmMounted, setFilmMounted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MQ.desktopMotion);
    const sync = () => setFilmMounted(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      /* ---- desktop motion: the full scrubbed sequence -------------------- */

      mm.add(MQ.desktopMotion, () => {
        const film = root.querySelector<HTMLElement>("[data-hero-film]");
        const intro = root.querySelector<HTMLElement>("[data-hero-intro]");
        const panels = gsap.utils.toArray<HTMLElement>("[data-hero-panel]", root);
        const editorial = gsap.utils.toArray<HTMLElement>("[data-hero-editorial]", root);
        const panelLabels = gsap.utils.toArray<HTMLElement>("[data-hero-panellabel]", root);
        if (!film || !intro || panels.length !== PANELS.length) return;

        /* The editorial layer and the panel labels are hidden up front rather
           than relying on a `from` tween positioned later in the timeline. A
           scrubbed timeline does not render a tween it has not reached, so at
           progress 0 those elements would otherwise sit at their CSS state —
           ink type at full opacity on a near-black film. `intro` is the
           opposite: it starts visible (it has to be readable before any
           scroll happens at all) and the timeline animates it OUT. */
        gsap.set([...editorial, ...panelLabels], { autoAlpha: 0, y: MOTION.yBlock });
        gsap.set(intro, { autoAlpha: 1, y: 0 });

        /* The film gets 8 seconds and no scroll involvement — but a visitor can
           scroll before it has finished. The panels are registered to the
           FINAL frame's own crop, so a part-played film would hand off out of
           register. On the first deliberate scroll the film jumps to its end,
           which is the same contract Section 03's opening runs under.
           Stopping a hair short of `duration` keeps some browsers off a blank
           frame. */
        let filmSettled = false;
        const settleFilm = () => {
          if (filmSettled) return;
          /* Looked up lazily on purpose: the element is mounted by React state
             one tick AFTER this context is built, so capturing it here would
             capture null and this would never fire. */
          const video = root.querySelector<HTMLVideoElement>("[data-hero-video]");
          if (!video) return;
          const { duration } = video;
          if (!Number.isFinite(duration) || duration <= 0) return;
          filmSettled = true;
          video.pause();
          video.currentTime = Math.max(0, duration - 0.04);
        };

        /* --- one timeline, position parameters, not four triggers --------- */

        const tl = gsap.timeline({
          defaults: { ease: MOTION.easeInOut },
          scrollTrigger: {
            id: "about-hero",
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress > 0.001) settleFilm();
            },
          },
        });

        /* 0.00 — the title in the gap leaves first. It has to be gone well
           before the editorial heading arrives in the same grid cell, and it
           is the visitor's very first scroll cue that the page is alive. */
        tl.to(intro, { autoAlpha: 0, y: -MOTION.yBlock, duration: 0.08 }, 0);

        /* 0.00 – 0.30 — the still dissolves; cotton arrives behind it. The two
           panels sit BELOW the film (z-index), showing a pixel-identical crop
           of the same frame, so nothing about them visibly changes here — only
           the ground around them turns to cotton. */
        tl.to(film, { autoAlpha: 0, duration: 0.3 }, 0);

        /* 0.52 – 0.72 — each name arrives once the ground has settled, because
           a name belongs to its panel rather than to the page furniture. */
        tl.to(
          panelLabels,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.13,
            ease: MOTION.ease,
            stagger: MOTION.stagger,
          },
          0.52
        );

        /* 0.60 – 0.94 — the editorial layer builds in. `expo.out` because these
           are arrivals, and the repo's own stagger, which already sits inside
           the 30–80 ms band. Transform and opacity only. */
        tl.to(
          editorial,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.13,
            ease: MOTION.ease,
            stagger: MOTION.stagger,
          },
          0.6
        );

        /* 0.94 → — the finale: each panel crossfades from the held-frame crop
           to the higher-fidelity founder plate. Appended flush against
           editorial's own end, with nothing else added after it, so GSAP's
           auto-sized `tl.duration()` grows to cover it — which rescales every
           EARLIER label's true scroll-progress fraction down proportionally
           while preserving their relative shape exactly. That is what turns
           this into a genuine finale rather than an overlapping beat: editorial
           lands, in true progress, at roughly 52–82% of the scroll, and this
           crossfade owns the remaining ~18% outright. Changing this beat's own
           raw duration re-shifts that split — it is not independent of the
           labels above it, even though their raw numbers never move.

           A straight opacity crossfade reads as two objects overlapping,
           because that is what it is. A blur through the middle of the
           transition, easing back to zero at both ends, bridges the gap so the
           eye reads one transformation instead of a swap. Kept well under 20px
           — heavy blur is expensive in Safari.

           With a panel's `fill` still pending this loop has nothing to attach
           to and the beat is simply absent for that panel. */
        panels.forEach((panel) => {
          const base = panel.querySelector<HTMLElement>("[data-hero-panelfill='base']");
          const fill = panel.querySelector<HTMLElement>("[data-hero-panelfill='fill']");
          if (!base || !fill) return;

          tl.to(base, { autoAlpha: 0, duration: 0.21 }, 0.94);
          tl.fromTo(fill, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.21 }, 0.94);
          tl.to([base, fill], { filter: "blur(2px)", duration: 0.105 }, 0.94);
          tl.to([base, fill], { filter: "blur(0px)", duration: 0.105 }, 1.045);
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set([...panels, ...editorial, ...panelLabels, intro, film], { clearProps: "all" });
        };
      });

      /* ---- reduced motion: gentler, not absent -------------------------
         No sticky bed, no scrub, no film. The composition is already at rest
         — including each panel's higher-fidelity fill, which is CSS-visible by
         default (see the stylesheet) — and the only thing added back is the
         opacity transition that tells you the editorial layer belongs to this
         section. It does not travel. The intro title never appears here: the
         static stack has no "before you scroll" moment for it to occupy. */

      mm.add(MQ.reduced, () => {
        const editorial = gsap.utils.toArray<HTMLElement>(
          "[data-hero-editorial], [data-hero-panellabel]",
          root
        );
        const tween = gsap.from(editorial, {
          autoAlpha: 0,
          duration: 0.32,
          ease: MOTION.ease,
          stagger: MOTION.stagger,
          scrollTrigger: { trigger: root, start: MOTION.start, once: true },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(editorial, { clearProps: "all" });
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={styles.root} data-about-hero>
      <div className={styles.bed}>
        {/* z1 — the two full-height panels, behind the film and already in
            register: their crop is a fixed fraction of `.frame`'s own
            cover-fit width (see the stylesheet), so unlike the old cards they
            need no measured "opening" position and never travel. */}
        <div className={styles.panels}>
          {PANELS.map(({ key, person, frame }) => (
            <div key={key} className={styles.panel} data-panel={key} data-hero-panel>
              {/* The held-frame crop — always present, the resting content. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.panelLayer}
                data-hero-panelfill="base"
                src={frame.base}
                alt={frame.fill ? "" : `${person.name}, ${person.discipline}.`}
                aria-hidden={frame.fill ? true : undefined}
              />
              {/* The higher-fidelity plate — the scroll-triggered finale. Absent
                  until the crop exists, exactly as the old `portraits` field
                  behaved: no image, no beat, no broken reference. */}
              {frame.fill ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={`${styles.panelLayer} ${styles.panelFill}`}
                  data-hero-panelfill="fill"
                  src={frame.fill}
                  alt={`${person.name}, ${person.discipline}.`}
                />
              ) : null}

              <p className={styles.panelLabel} data-hero-panellabel>
                <span className={styles.panelLabelName}>{person.name}</span>
                <span>{person.discipline}</span>
              </p>
            </div>
          ))}
        </div>

        {/* The rectangle the 16:9 media fills under `object-fit: cover`. The
            film fills it, and the panels' horizontal position is a percentage
            of it. */}
        <div className={styles.frame} data-hero-frame>
          {/* z2 — the film group. The still is the frame the take holds on, so
              the handoff when it ends is invisible; it is also the entire
              visual outside desktop motion. */}
          <div className={styles.film} data-hero-film>
            <picture>
              <source media="(max-width: 768px)" srcSet={hero.media.stillMobile} />
              {/* Must match the encoded frame pixel for pixel so the video can
                  hand off to it without a visible step. Inside a <picture>, so
                  next/no-img-element does not fire and needs no directive. */}
              <img
                className={styles.filmStill}
                src={hero.media.still}
                alt={hero.media.alt}
                width={1920}
                height={1080}
                fetchPriority="high"
              />
            </picture>

            {filmMounted ? (
              <video
                className={styles.filmVideo}
                data-hero-video
                src={hero.media.film}
                poster={hero.media.still}
                autoPlay
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                tabIndex={-1}
              />
            ) : null}
          </div>
        </div>

        {/* z3 — the editorial layer. */}
        <div className={styles.editorial}>
          <p className={styles.label} data-hero-editorial>
            <i aria-hidden="true" />
            {hero.label}
          </p>

          {/* The pre-scroll title, in the same gap the heading below occupies.
              A <p>, not a second heading level — it is ephemeral copy, gone
              before a screen-reader user reading top to bottom would reach it
              in the resting document, not a structural section title. */}
          <p className={styles.intro} data-hero-intro>
            {hero.intro.heading.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          <div className={styles.headingBlock}>
            <h1 className={styles.heading} data-hero-editorial>
              {hero.heading.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>
            <p className={styles.lede} data-hero-editorial>
              {hero.lede}
            </p>
          </div>

          <p className={styles.meta} data-hero-editorial>
            {hero.meta.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        </div>
      </div>

      {/* The scroll length after the first viewport. */}
      <div className={styles.spacer} aria-hidden="true" />

      {/* Header theme. The hero opens on a near-black film and ends on cotton,
          so a single zone would be wrong for one of those halves; the split
          lands where the dissolve finishes. Both are out of flow, so they add
          no height of their own. */}
      <HeaderZone theme="dark" className={styles.zoneDark}>
        <span />
      </HeaderZone>
      <HeaderZone theme="light" className={styles.zoneLight}>
        <span />
      </HeaderZone>
    </div>
  );
}
