"use client";

/* =============================================================================
   00 — The about hero banner
   =============================================================================

   THE SEQUENCE

     1. On load the take plays once, muted and inline, and holds its final
        frame. Eight seconds, no scroll involvement.
     2. On scroll everything except the two figures dissolves to cotton.
     3. The figures resolve into two 3:4 half-body portrait cards.
     4. Each silhouette fills with its photographic portrait.
     5. The editorial layer builds in around them.

   Beats 2 to 5 overlap on purpose — a gap between them would be a stretch of
   scroll where nothing moves.

   FOUR THINGS THAT ARE STRUCTURAL, NOT TUNED

   1. **One mask, two fills.** A card is a single masked box holding a flat
      noir fill and a photographic fill stacked inside it. The reveal crossfades
      the fills *inside the same mask*, so the outline is identical in both
      states by construction. Nothing is aligned to anything by eye.

   2. **The cards open at their measured position inside the still**, so while
      the film is opaque they are invisible, and as it fades they are already in
      register. Those percentages live in the stylesheet and are read back out
      of it here — the geometry has exactly one home. The travel is measured
      against the untransformed layout box on every refresh, so a resize cannot
      leave the opening position stale.

   3. **A sticky bed, never `pin: true`.** Same construction as `ProcessFilm`
      and `MonolithScene`. The page never stops scrolling, so a dead pin is
      structurally impossible here.

   4. **The endpoint is the resting state.** The stylesheet paints the finished
      composition; the timeline only animates *into* it. With no JavaScript, with
      GSAP failed, on a phone, or under reduced motion, the section renders
      complete with no work.

   Under reduced motion the film is never instantiated — the element is not in
   the DOM at all rather than hidden, so nothing is fetched or decoded.
   ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { MOTION, MQ } from "@/components/motion/motion";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { aboutV3 } from "@/content/about-v3";
import styles from "./AboutHero.module.css";

const { hero, opening } = aboutV3;

/**
 * The photographic fill. Both are null until the shoot lands; the card then
 * holds its noir silhouette and the crossfade beat is a no-op, exactly as
 * `journey.rooms` behaved before its takes were delivered. Setting these two
 * strings is the whole change — no component edit.
 */
const HERO_PORTRAITS = hero.portraits;

const CARDS = [
  { key: "a", person: opening.left, portrait: HERO_PORTRAITS.a },
  { key: "b", person: opening.right, portrait: HERO_PORTRAITS.b },
] as const;

/** Travel measured for one card, in the stage's own pixel space. */
type Travel = { dx: number; dy: number; scale: number };

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
        const frame = root.querySelector<HTMLElement>("[data-hero-frame]");
        const film = root.querySelector<HTMLElement>("[data-hero-film]");
        const cards = gsap.utils.toArray<HTMLElement>("[data-hero-card]", root);
        const editorial = gsap.utils.toArray<HTMLElement>("[data-hero-editorial]", root);
        const cardLabels = gsap.utils.toArray<HTMLElement>("[data-hero-cardlabel]", root);
        if (!frame || !film || cards.length !== CARDS.length) return;

        /* The editorial layer is hidden up front rather than relying on a
           `from` tween positioned later in the timeline. A scrubbed timeline
           does not render a tween it has not reached, so at progress 0 those
           elements would otherwise sit at their CSS state — ink type at full
           opacity on a near-black film. */
        gsap.set([...editorial, ...cardLabels], { autoAlpha: 0, y: MOTION.yBlock });

        /* The film gets 8 seconds and no scroll involvement — but a visitor can
           scroll before it has finished. The cards are registered to the FINAL
           frame, so a part-played film would hand off out of register. On the
           first deliberate scroll the film jumps to its end, which is the same
           contract Section 01's opening runs under. Stopping a hair short of
           `duration` keeps some browsers off a blank frame. */
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

        /* --- measure the travel ------------------------------------------
           The opening rect is a percentage of `.frame`, which is exactly the
           rectangle the 16:9 media occupies under `object-fit: cover`. The
           closing rect is wherever CSS has laid the card out. Both are read
           with transforms cleared, so this is safe to re-run on every refresh
           and cannot accumulate drift. */
        const travels: Travel[] = cards.map(() => ({ dx: 0, dy: 0, scale: 1 }));

        const measure = () => {
          gsap.set(cards, { clearProps: "transform" });
          const fr = frame.getBoundingClientRect();

          cards.forEach((card, i) => {
            const cs = getComputedStyle(card);
            const left = parseFloat(cs.getPropertyValue("--in-left"));
            const top = parseFloat(cs.getPropertyValue("--in-top"));
            const width = parseFloat(cs.getPropertyValue("--in-width"));
            const rect = card.getBoundingClientRect();
            if (!rect.width || !Number.isFinite(left)) return;

            travels[i] = {
              dx: fr.left + (fr.width * left) / 100 - rect.left,
              dy: fr.top + (fr.height * top) / 100 - rect.top,
              scale: (fr.width * width) / 100 / rect.width,
            };
          });
        };

        measure();

        /* --- one timeline, position parameters, not four triggers --------- */

        const tl = gsap.timeline({
          defaults: { ease: MOTION.easeInOut },
          scrollTrigger: {
            id: "about-v3-hero",
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onUpdate: (self) => {
              if (self.progress > 0.001) settleFilm();
            },
          },
        });

        /* 0.00 – 0.30 — the still dissolves; cotton arrives behind it. */
        tl.to(film, { autoAlpha: 0, duration: 0.3 }, 0);

        /* 0.20 – 0.50 — the cards travel from in-frame to layout position.
           `power2.inOut` because this is scrubbed two-way movement, where an
           out-only curve reads wrong in reverse. Function-based values so
           `invalidateOnRefresh` re-reads the measurement after a resize. */
        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            {
              x: () => travels[i].dx,
              y: () => travels[i].dy,
              scale: () => travels[i].scale,
            },
            { x: 0, y: 0, scale: 1, duration: 0.3 },
            0.2
          );
        });

        /* 0.45 – 0.70 — the fill crossfade, noir silhouette to photograph.
           A straight opacity crossfade reads as two objects overlapping,
           because that is what it is. A blur through the middle of the
           transition, easing back to zero at both ends, bridges the gap so the
           eye reads one transformation instead of a swap. Kept well under 20px
           — heavy blur is expensive in Safari.

           With the portraits still pending this loop has nothing to attach to
           and the beat is simply absent from the timeline. */
        cards.forEach((card) => {
          const noir = card.querySelector<HTMLElement>("[data-hero-fill='noir']");
          const photo = card.querySelector<HTMLElement>("[data-hero-fill='photo']");
          if (!noir || !photo) return;

          tl.to(noir, { autoAlpha: 0, duration: 0.25 }, 0.45);
          tl.fromTo(photo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.45);
          tl.to([noir, photo], { filter: "blur(2px)", duration: 0.125 }, 0.45);
          tl.to([noir, photo], { filter: "blur(0px)", duration: 0.125 }, 0.575);
        });

        /* 0.52 – 0.72 — each name arrives just after its own card lands, because
           a name belongs to the card rather than to the page furniture. */
        tl.to(
          cardLabels,
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

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          gsap.set([...cards, ...editorial, ...cardLabels, film], { clearProps: "all" });
        };
      });

      /* ---- reduced motion: gentler, not absent -------------------------
         No sticky bed, no scrub, no film. The composition is already at rest;
         the only thing added back is the opacity transition that tells you the
         editorial layer belongs to this section. It does not travel. */

      mm.add(MQ.reduced, () => {
        const editorial = gsap.utils.toArray<HTMLElement>(
          "[data-hero-editorial], [data-hero-cardlabel]",
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
        {/* z1 — the two cards, behind the film and already in register.

            These sit in the STAGE's coordinate space, not the frame's: their
            resting position is a page layout decision, so measuring it against
            the oversized cover rect would push them off the viewport edges.
            Only their OPENING position is registered to the frame, and that is
            read from the frame's own rect at measure time. */}
        <div className={styles.cards}>
            {CARDS.map(({ key, person, portrait }) => (
              <div key={key} className={styles.card} data-card={key} data-hero-card>
                <div className={styles.cardMask}>
                  <span
                    className={`${styles.fill} ${styles.fillNoir}`}
                    data-hero-fill="noir"
                    aria-hidden="true"
                  />
                  {portrait ? (
                    /* A plain <img>, not next/image: it must register pixel for
                       pixel with the mask, so it cannot go through the image
                       optimiser's re-encoding. */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={`${styles.fill} ${styles.fillPhoto}`}
                      data-hero-fill="photo"
                      src={portrait}
                      alt={`${person.name}, ${person.discipline}.`}
                    />
                  ) : null}
                </div>

                <p className={styles.cardLabel} data-hero-cardlabel>
                  <span className={styles.cardLabelName}>{person.name}</span>
                  <span>{person.discipline}</span>
                </p>
              </div>
            ))}
        </div>

        {/* The rectangle the 16:9 media fills under `object-fit: cover`. The
            film fills it, and the cards' opening positions are percentages of
            it. */}
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
