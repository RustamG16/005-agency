"use client";

/* =============================================================================
   03–06 — The journey
   =============================================================================

   Sections 03, 04, 05 and 06 used to be four separate ivory bands, each with
   its own media frame. They are now one continuous pinned sequence: three
   rooms and two transitions, only the first of which is a genuine cut.

   The story the scroll tells:

     ROOM 01 / CONSULTING   You are in the chair. A consultant sits
                            opposite with an open notepad and listens before
                            anything is proposed.
       ↓ a real change of location — the veil carries the full cut
     ROOM 02 / ANALYSIS     A lit wall board, two consultants reading what
                            you already have in the open, then setting out
                            three ways it could go forward.
       ↓ contiguous frames of the same take — a short veil, not a cut
     ROOM 03 / DIRECTIONS   Three framed directions on the table, lit the
                            same. None of them is ranked.

   Three rules govern the whole thing:

   1. **The camera lives in the clip, not in the DOM.** Each room is one
      generated take carrying a continuous forward move that settles at the
      end. Scroll drives `currentTime`; the browser does not fake a camera
      with transforms. That is why the move reads as a real lens move and not
      as a parallax trick.

   2. **The left column is sacred.** Every plate is art-directed so the left
      ~45% stays quiet for the whole take. Copy sits in one fixed column and
      never chases the image — a paragraph that moves while you scroll is a
      paragraph nobody reads.

   3. **The sequence is an enhancement, never the content.** The markup below
      is a plain stack of three articles: picture, heading, prose, panels. That
      is what a phone gets, what reduced motion gets, and what renders with no
      JavaScript at all. `data-enhanced` is only written once the pinned
      timeline is actually built.
   ========================================================================== */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/components/motion/gsap";
import { about } from "@/content/about";
import { Heading, MetaStrip, SectionIndex } from "./Primitives";
import styles from "./JourneySequence.module.css";

const { journey, arrival, analysis, programs, intake } = about;

/* -----------------------------------------------------------------------------
   Timing

   Units are arbitrary and relative — the whole plan is normalised into the
   scrub timeline, so changing one number re-paces that beat without touching
   any other. One unit lands at roughly 5.5% of a viewport height, which puts
   the full sequence at about six and a half screens of scrolling for four
   sections' worth of content.

   `hold` is where the copy is readable and the camera is still travelling.
   `orbit` is the settle at the end of a take plus the handover to the next
   room. `enter` is the lift back out of the veil.
   -------------------------------------------------------------------------- */

const UNIT_VH = 0.055;

/* A beat's own fade, in the same units as the plan below. The exit is faster
   than the entrance — things leave quicker than they arrive — and `swap` is
   then set to exactly BEAT_OUT so the next beat starts on the frame the
   previous one finishes. Any larger and the room reads as dead scroll; any
   smaller and the two beats double-expose over each other. */
const BEAT_IN = 3;
const BEAT_OUT = 2;

type RoomPlan = {
  /** Index into the rendered rooms. */
  room: number;
  /** Indices into the rendered beat panels, in the order they are read. */
  beats: number[];
  enter: number;
  /** Hold length per beat. Two beats means the room holds twice as long. */
  hold: number;
  /**
   * Gap while one beat swaps for the next inside the same room. Shorter than
   * a beat's own fade on purpose, so the arriving beat overlaps the departing
   * one rather than leaving a stretch of scroll with no copy on screen.
   */
  swap: number;
  orbit: number;
  /**
   * How much of the clip is the forward move. The remainder is the settle at
   * the end. Authored per clip because the delivered takes do not all stop
   * moving at the same moment.
   */
  holdRatio: number;
  /**
   * How dark the veil goes as this room hands over to the next. 1 is a full
   * cut; a low value is a blink that masks the swap between two <video>
   * elements without inventing a fade the footage does not contain.
   */
  veilOut: number;
};

const PLAN: RoomPlan[] = [
  // `holdRatio` is the second the forward move ends ÷ the clip length, measured
  // from the delivered takes: 11/12, 8/8, 3/4. If a take is re-cut, this is the
  // only number that changes.
  //
  // `hold` is weighted by clip length so the scrub runs at a comparable rate in
  // every room — room 01 carries 12 s of footage and cannot be read at the same
  // scroll cost as room 03's 4 s. 26 : 17 is exactly the 12 : 8 of the first two
  // clips; room 03 is floored at 13 rather than the proportional 8.7 because one
  // beat of copy needs a minimum dwell to be readable.
  //
  // `veilOut` is low on both room-to-room seams because the three clips are one
  // continuous first-person take split across three files — the last frame of
  // each is the next one's first frame. A full veil at either seam would insert
  // a fade the camera never makes. The final veil stays at 1: that one is not a
  // seam in the footage, it is the handover into Section 07's dark band.
  { room: 0, beats: [0], enter: 4, hold: 26, swap: 0, orbit: 8, holdRatio: 0.92, veilOut: 0.15 },
  { room: 1, beats: [1, 2], enter: 4, hold: 17, swap: 2, orbit: 5, holdRatio: 1.0, veilOut: 0.15 },
  { room: 2, beats: [3], enter: 4, hold: 13, swap: 0, orbit: 12, holdRatio: 0.75, veilOut: 1 },
];

/* -----------------------------------------------------------------------------
   Scrubbing a video without flooding the decoder

   Scroll fires far more often than a video can seek. Assigning `currentTime`
   on every event queues seeks the decoder never catches up with, which is what
   makes scrub-linked video feel like it is sticking. Instead the newest target
   is held and committed once per animation frame, and only while the element
   actually has a duration to seek within.
   -------------------------------------------------------------------------- */

function createSeeker(video: HTMLVideoElement) {
  let frame = 0;
  let target = -1;

  const commit = () => {
    frame = 0;
    const next = target;
    target = -1;
    if (next < 0) return;
    const { duration } = video;
    if (!Number.isFinite(duration) || duration <= 0 || video.readyState < 1) return;
    // Stop a hair short of the end: seeking to exactly `duration` parks some
    // browsers on a blank frame and fires `ended`.
    video.currentTime = gsap.utils.clamp(0, duration - 0.04, next * duration);
  };

  return {
    seek(progress: number) {
      target = progress;
      if (!frame) frame = requestAnimationFrame(commit);
    },
    dispose() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

/** Attach the file only when the room is about to be needed. */
function arm(video: HTMLVideoElement | undefined) {
  if (!video || video.dataset.armed === "true") return;
  const src = video.dataset.src;
  if (!src) return;
  video.dataset.armed = "true";
  video.src = src;
  video.load();
}

/* -----------------------------------------------------------------------------
   The component
   -------------------------------------------------------------------------- */

export function JourneySequence() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const media = gsap.matchMedia();

      /* The pinned sequence is desktop-and-motion only. Everything else falls
         through to the stacked markup below, which is complete on its own. */
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const viewport = root.querySelector<HTMLElement>("[data-journey-viewport]");
        const rooms = gsap.utils.toArray<HTMLElement>("[data-journey-room]", root);
        const beats = gsap.utils.toArray<HTMLElement>("[data-journey-beat]", root);
        const veil = root.querySelector<HTMLElement>("[data-journey-veil]");
        const videos = gsap.utils.toArray<HTMLVideoElement>("[data-journey-video]", root);
        if (!viewport || !veil || rooms.length !== PLAN.length) return;

        const seekers = videos.map(createSeeker);

        /* Switch the layout to the pinned composition *before* anything is
           measured. Until this line the articles are a normal stack; after it
           they are three absolute layers inside one viewport-sized box. */
        root.dataset.enhanced = "true";

        const units = PLAN.reduce(
          (total, plan) =>
            total + plan.enter + plan.hold * plan.beats.length + plan.swap + plan.orbit,
          0
        );

        gsap.set(rooms, { autoAlpha: 0 });
        gsap.set(beats, { autoAlpha: 0, y: 26 });
        gsap.set(veil, { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "about-journey",
            trigger: root,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * UNIT_VH * units)}`,
            pin: viewport,
            pinSpacing: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        let at = 0;

        PLAN.forEach((plan, index) => {
          const room = rooms[plan.room];
          const video = videos[plan.room];
          const seeker = seekers[plan.room];
          if (!room) return;
          const holdTotal = plan.hold * plan.beats.length + plan.swap;

          /* --- lift out of darkness ------------------------------------- */

          tl.set(room, { autoAlpha: 1 }, at);
          tl.to(veil, { autoAlpha: 0, duration: plan.enter, ease: "power2.out" }, at);

          /* Load the next room's file while this one is being read, so the
             cut into it never waits on the network. */
          const next = videos[plan.room + 1];
          if (next) tl.call(() => arm(next), undefined, at);

          /* --- the take ------------------------------------------------- */

          const progress = { p: 0 };
          const push = () => {
            if (video) seeker?.seek(progress.p);
          };

          // Opening hold: the clip breathes but the camera has not moved.
          tl.fromTo(
            progress,
            { p: 0 },
            { p: plan.holdRatio, duration: plan.enter + holdTotal, onUpdate: push },
            at
          );

          // The orbit itself, eased so the move settles rather than stopping dead.
          tl.to(
            progress,
            { p: 1, duration: plan.orbit, ease: "power1.inOut", onUpdate: push },
            at + plan.enter + holdTotal
          );

          /* --- the copy ------------------------------------------------- */

          plan.beats.forEach((beatIndex, order) => {
            const beat = beats[beatIndex];
            if (!beat) return;

            const beatStart = at + plan.enter + order * (plan.hold + plan.swap);

            tl.to(beat, { autoAlpha: 1, y: 0, duration: BEAT_IN, ease: "power2.out" }, beatStart);

            /* The last beat of a room hands over to the darkness; earlier ones
               hand over to the beat that follows them. */
            const isLast = order === plan.beats.length - 1;
            const outAt = isLast
              ? at + plan.enter + holdTotal + plan.orbit * 0.3
              : beatStart + plan.hold;

            tl.to(beat, { autoAlpha: 0, y: -22, duration: BEAT_OUT, ease: "power2.in" }, outAt);
          });

          /* --- into the dark -------------------------------------------- */

          const orbitStart = at + plan.enter + holdTotal;
          tl.to(
            veil,
            { autoAlpha: plan.veilOut, duration: plan.orbit * 0.5, ease: "power2.in" },
            orbitStart + plan.orbit * 0.5
          );

          // Drop the layer once it is fully behind the veil, so no more than
          // one clip is ever compositing.
          const isFinal = index === PLAN.length - 1;
          if (!isFinal) tl.set(room, { autoAlpha: 0 }, at + plan.enter + holdTotal + plan.orbit);

          at += plan.enter + holdTotal + plan.orbit;
        });

        /* The final darkness is the handover into Section 07, which opens on a
           dark band of its own — so the seam between the sequence and the
           atlas is invisible. */

        arm(videos[0]);

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
          seekers.forEach((seeker) => seeker.dispose());
          videos.forEach((video) => {
            video.pause();
            video.removeAttribute("src");
            delete video.dataset.armed;
            video.load();
          });
          gsap.set([...rooms, ...beats, veil], { clearProps: "all" });
          delete root.dataset.enhanced;
        };
      });

      return () => media.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className={styles.journey}
      aria-label={journey.label}
      data-journey
    >
      <div className={styles.viewport} data-journey-viewport>
        {/* --- Room 01 — the consulting room ------------------------------ */}

        <article className={styles.room} data-journey-room aria-labelledby="about-arrival-title">
          <Plate room={journey.rooms.consulting} />

          <div className={styles.copy}>
            <div className={styles.beat} data-journey-beat>
              <SectionIndex index={arrival.index} label={arrival.label} tone="cotton" />
              <Heading id="about-arrival-title" lines={arrival.heading} tone="cotton" size="tall" />
              <p className={styles.prose}>{arrival.body}</p>
              <p className={styles.caption}>{arrival.caption}</p>
              <MetaStrip items={journey.rooms.consulting.meta} tone="cotton" />
            </div>
          </div>
        </article>

        {/* --- Room 02 — the lab ------------------------------------------ */}

        <article className={styles.room} data-journey-room aria-labelledby="about-analysis-title">
          <Plate room={journey.rooms.lab} />

          <div className={styles.copy}>
            <div className={styles.beat} data-journey-beat>
              <SectionIndex index={analysis.index} label={analysis.label} tone="cotton" />
              <Heading
                id="about-analysis-title"
                lines={analysis.heading}
                tone="cotton"
                size="tall"
              />
              <p className={styles.prose}>{analysis.body}</p>

              {/* The profile is live HTML, exactly as it was before the merge.
                  Nothing readable has been baked into the generated plate. */}
              <div className={styles.dossier}>
                <p className={styles.dossierTitle}>
                  {analysis.profile.title} / {analysis.profile.number}
                </p>
                {analysis.profile.rows.map((row) => (
                  <div key={row.term} className={styles.dossierRow}>
                    <span className={styles.dossierTerm}>
                      <em>{row.term}</em>
                      <span>— {row.question}</span>
                    </span>
                    <span className={styles.dossierValue}>{row.answer}</span>
                  </div>
                ))}
                <p className={styles.dossierStatus}>{analysis.profile.status}</p>
              </div>
            </div>

            <div className={styles.beat} data-journey-beat>
              <SectionIndex index={programs.index} label={programs.label} tone="cotton" />
              <Heading
                id="about-programs-title"
                lines={programs.heading}
                tone="cotton"
                size="section"
              />
              <p className={styles.prose}>{programs.body}</p>

              {/* All three at once and none preselected — this is a comparison,
                  not a chooser. */}
              <ul className={styles.programs}>
                {programs.items.map((item) => (
                  <li key={item.key} className={styles.program}>
                    <p className={styles.programHead}>
                      <b>{item.index}</b> / {item.title}
                    </p>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* --- Room 03 — the three directions -------------------------- */}

        <article className={styles.room} data-journey-room aria-labelledby="about-intake-title">
          <Plate room={journey.rooms.directions} />

          <div className={styles.copy}>
            <div className={styles.beat} data-journey-beat>
              <SectionIndex index={intake.index} label={intake.label} tone="cotton" />
              <Heading
                id="about-intake-title"
                lines={intake.heading}
                tone="cotton"
                size="section"
              />
              <p className={styles.prose}>{intake.body}</p>
              <p className={styles.state}>
                <span>{intake.stageLabel}</span>
                <i aria-hidden="true" />
              </p>
              <MetaStrip items={journey.rooms.directions.meta} tone="cotton" />
            </div>
          </div>
        </article>

        <div className={styles.veil} data-journey-veil aria-hidden="true" />
      </div>
    </section>
  );
}

/* -----------------------------------------------------------------------------
   One room's media

   The still is the content: it carries the alt text, it is what a phone shows,
   it is what reduced motion shows, and it is the poster the take resolves to.
   The video is the same picture with a camera move in it, so it is hidden from
   assistive technology rather than described twice.
   -------------------------------------------------------------------------- */

function Plate({ room }: { room: (typeof journey.rooms)[keyof typeof journey.rooms] }) {
  return (
    <div className={styles.plate}>
      <picture>
        {room.mobile ? <source media="(max-width: 1023px)" srcSet={room.mobile} /> : null}
        <img
          className={styles.plateStill}
          src={room.poster}
          alt={room.alt}
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
        />
      </picture>

      {/* `video: null` is the honest state before a take has been delivered:
          the element stays in the DOM so the timeline's indices line up, it
          simply has nothing to attach and the still carries the room. */}
      <video
        className={styles.plateVideo}
        data-journey-video
        data-src={room.video ?? undefined}
        poster={room.poster}
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
