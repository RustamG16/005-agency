"use client";

import { useRef } from "react";
import { useMediaActivation } from "@/components/motion/useMediaActivation";
import type { Project } from "@/content/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { active, activate, deactivate } = useMediaActivation(cardRef, videoRef);

  return (
    <article
      ref={cardRef}
      id={project.slug}
      className={styles.card}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        onFocus={activate}
        onBlur={deactivate}
      >
        <div className={styles.mediaFrame} data-active={active}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.cover}
            alt=""
            className={styles.poster}
            style={{ objectPosition: project.objectPosition }}
          />
          {project.loop && (
            <video
              ref={videoRef}
              className={styles.video}
              muted
              playsInline
              loop
              preload="none"
              style={{ objectPosition: project.objectPosition }}
              aria-hidden="true"
            >
              <source src={project.loop} type="video/mp4" />
            </video>
          )}
        </div>
        <div className={styles.meta}>
          <div className={styles.metaTop}>
            <h3 className={styles.name}>{project.name}</h3>
            <span className={styles.year}>{project.year}</span>
          </div>
          <p className={styles.sector}>
            {project.sector} — {project.scope}
          </p>
        </div>
      </a>
    </article>
  );
}
