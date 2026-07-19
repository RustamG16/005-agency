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

function WorksRow({
  project,
  floor,
  onHover,
  onLeave,
}: {
  project: Project;
  floor: string;
  onHover: (project: Project, el: HTMLElement) => void;
  onLeave: () => void;
}) {
  return (
    <a
      id={project.slug}
      href={`#${project.slug}`}
      className={styles.row}
      data-cursor="view"
      data-cursor-label="View"
      onMouseEnter={(e) => onHover(project, e.currentTarget)}
      onMouseLeave={onLeave}
      onFocus={(e) => onHover(project, e.currentTarget)}
      onBlur={onLeave}
    >
      <span className={styles.floor} aria-hidden="true">
        {floor}
      </span>
      <div className={styles.main}>
        <h2 className={styles.name}>{project.name}</h2>
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
        </p>
        <p className={styles.outcome}>{project.outcome}</p>
      </div>

      <div className={styles.mobileMedia}>
        <Image
          src={project.poster}
          alt=""
          fill
          sizes="(max-width: 899px) 100vw, 0px"
          className={styles.mobilePoster}
          style={{ objectPosition: project.objectPosition }}
        />
        <video
          className={styles.mobileVideo}
          muted
          playsInline
          loop
          preload="metadata"
          poster={project.poster}
          data-single-active
          data-video-offset={project.videoOffset}
          aria-hidden="true"
          style={{ objectPosition: project.objectPosition }}
        >
          <source src="/media/columns.mp4" type="video/mp4" />
        </video>
      </div>
    </a>
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
    if (!video || !active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const seek = () => {
      try {
        video.currentTime = active.videoOffset;
      } catch {
        /* ignore seek before ready */
      }
      video.play().catch(() => {});
    };

    if (video.readyState >= 1) seek();
    else video.addEventListener("loadedmetadata", seek, { once: true });

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
                src={active.poster}
                alt=""
                className={styles.panelPoster}
                style={{ objectPosition: active.objectPosition }}
              />
              <video
                ref={videoRef}
                className={styles.panelVideo}
                muted
                playsInline
                loop
                preload="metadata"
                poster={active.poster}
                aria-hidden="true"
                style={{ objectPosition: active.objectPosition }}
              >
                <source src="/media/columns.mp4" type="video/mp4" />
              </video>
            </>
          )}
        </div>
      </section>
    </HeaderZone>
  );
}
