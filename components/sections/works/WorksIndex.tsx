"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects, type Project } from "@/content/projects";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import { useSingleActiveVideo } from "@/components/motion/useSingleActiveVideo";
import { InteriorRevealBlock } from "@/components/motion/InteriorReveal";
import styles from "./WorksIndex.module.css";

function floorNumber(indexFromTop: number, total: number) {
  return String(total - indexFromTop).padStart(2, "0");
}

/**
 * One index row.
 *
 * The row used to be a single `<a href="#its-own-id">` — a link that navigated to itself,
 * which is also why an external link could not live inside it (nested anchors are invalid).
 * Now the row is a plain element that owns the hover, and the project name is the link, out
 * to the live build. The whole row keeps `data-cursor` so the affordance still reads at row
 * scale rather than only over the eleven characters of a name.
 */
function WorksRow({
  project,
  floor,
  onHover,
  onLeave,
}: {
  project: Project;
  floor: string;
  onHover: (project: Project) => void;
  onLeave: () => void;
}) {
  return (
    <div
      id={project.slug}
      className={styles.row}
      data-cursor="view"
      data-cursor-label="Live"
      onMouseEnter={() => onHover(project)}
      onMouseLeave={onLeave}
    >
      <span className={styles.floor} aria-hidden="true">
        {floor}
      </span>
      <div className={styles.main}>
        {/* `data-long` drops the size for names that cannot fit the column at index
            scale. "Education4Students" is 18 characters and overflowed the document by
            1008px at 176px — the whole page scrolled sideways because of one row. */}
        <h2 className={styles.name} data-long={project.name.length > 12 || undefined}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.nameLink}
            onFocus={() => onHover(project)}
            onBlur={onLeave}
          >
            {project.name}
            <span className="visually-hidden"> — opens the live site in a new tab</span>
          </a>
        </h2>
        <p className={styles.meta}>
          {project.sector}
          <span className={styles.metaSep} aria-hidden="true">
            ·
          </span>
          {project.scope}
          <span className={styles.metaSep} aria-hidden="true">
            ·
          </span>
          {project.year}
          {/* The affordance rides the meta line rather than the name. Inside the <h2> it
              was an inline-block in a 176px line box and inflated every row to 310px
              tall. Decorative: the name is the actual link. */}
          <span className={styles.visit} aria-hidden="true">
            <span className={styles.metaSep}>·</span>
            Visit live site ↗
          </span>
        </p>
        <p className={styles.outcome}>{project.outcome}</p>
      </div>

      <div className={styles.mobileMedia}>
        {/* `0px` here made the browser fall back to the widest candidate — it was fetching
            the 3840px variant for a ~450px box. A real length keeps the descriptor valid
            while still telling desktop, where this block is display:none, to take the
            smallest thing on offer. */}
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="(max-width: 899px) 100vw, 1px"
          className={styles.mobilePoster}
          style={{ objectPosition: project.objectPosition }}
        />
        {project.loop && (
          <video
            className={styles.mobileVideo}
            muted
            playsInline
            loop
            preload="none"
            poster={project.cover}
            data-single-active
            aria-hidden="true"
            style={{ objectPosition: project.objectPosition }}
          >
            <source src={project.loop} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}

export function WorksIndex() {
  const listRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<Project | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useSingleActiveVideo(listRef);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active?.loopPortrait) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    video.play().catch(() => {
      /* refused, or no source — the cover stands in */
    });

    return () => {
      video.pause();
    };
  }, [active]);

  function handleHover(project: Project) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setActive(project);
    setPanelOpen(true);
  }

  function handleLeave() {
    setPanelOpen(false);
  }

  return (
    <HeaderZone theme="light">
      <section className={styles.section} aria-label="Work index" ref={listRef}>
        <div className={`wrap ${styles.intro}`}>
          <InteriorRevealBlock as="p" className="eyebrow">
            Index · Four floors
          </InteriorRevealBlock>
        </div>

        <div className={`wrap ${styles.list}`}>
          {projects.map((project, i) => (
            <WorksRow
              key={project.slug}
              project={project}
              floor={floorNumber(i, projects.length)}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          ))}
        </div>

        <div
          ref={panelRef}
          className={styles.panel}
          data-open={panelOpen}
          aria-hidden={!panelOpen}
        >
          {active && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.coverPortrait}
                alt=""
                className={styles.panelPoster}
              />
              {active.loopPortrait && (
                /* `key` is load-bearing. Changing a <source>'s src does not reload a
                   <video> — the element keeps playing whatever it already fetched — so
                   without a remount the panel would show the first project hovered for
                   every project after it. */
                <video
                  key={active.slug}
                  ref={videoRef}
                  className={styles.panelVideo}
                  muted
                  playsInline
                  loop
                  preload="auto"
                  poster={active.coverPortrait}
                  aria-hidden="true"
                >
                  <source src={active.loopPortrait} type="video/mp4" />
                </video>
              )}
            </>
          )}
        </div>
      </section>
    </HeaderZone>
  );
}
