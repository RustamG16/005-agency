"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hoverActive, setHoverActive] = useState(false);
  const [viewportActive, setViewportActive] = useState(false);
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mq.matches);
    const onChange = () => setCanHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (canHover) return;
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setViewportActive(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [canHover]);

  const active = canHover ? hoverActive : viewportActive;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (active) {
      try {
        video.currentTime = project.videoOffset;
      } catch {
        // ignore seek before ready
      }
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [active, project.videoOffset]);

  return (
    <article
      ref={cardRef}
      id={project.slug}
      className={styles.card}
      onMouseEnter={() => canHover && setHoverActive(true)}
      onMouseLeave={() => canHover && setHoverActive(false)}
    >
      <Link
        href={`/works#${project.slug}`}
        className={styles.link}
        onFocus={() => canHover && setHoverActive(true)}
        onBlur={() => canHover && setHoverActive(false)}
      >
        <div className={styles.mediaFrame} data-active={active}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.poster}
            alt=""
            className={styles.poster}
            style={{ objectPosition: project.objectPosition }}
          />
          <video
            ref={videoRef}
            className={styles.video}
            muted
            playsInline
            loop
            preload="metadata"
            style={{ objectPosition: project.objectPosition }}
            aria-hidden="true"
          >
            <source src="/media/columns.mp4" type="video/mp4" />
          </video>
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
      </Link>
    </article>
  );
}
