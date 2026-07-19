"use client";

import Link from "next/link";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useIsMobile } from "@/components/motion/useIsMobile";
import { projects } from "@/content/projects";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./WorksFrame.module.css";

function indexLabel(i: number) {
  return String(i + 1).padStart(2, "0");
}

function SectionHead() {
  return (
    <div className={`wrap ${styles.head}`}>
      <p className="eyebrow" style={{ color: "var(--color-gray)" }}>
        Selected Work
      </p>
    </div>
  );
}

function CaseText({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <>
      <span className={styles.caseIndex}>{indexLabel(index)}</span>
      <h3 className={styles.caseName}>{project.name}</h3>
      <p className={styles.caseMeta}>
        {project.sector} — {project.scope}
      </p>
      <p className={styles.caseOutcome}>{project.outcome}</p>
    </>
  );
}

/**
 * Desktop pin lives in OpeningSequence. This export is the static / mobile fallback
 * (and a safe desktop no-op if called alone).
 */
export function WorksFrame() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  if (reducedMotion) return <WorksFrameStatic variant="grid" />;
  if (isMobile) return <WorksFrameStatic variant="stack" />;
  return <WorksFrameStatic variant="grid" />;
}

export function WorksFrameStatic({ variant }: { variant: "grid" | "stack" }) {
  return (
    <HeaderZone theme="dark">
      <section className={styles.section} aria-label="Selected work">
        <SectionHead />
        <div className={`wrap ${styles.staticWrap}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/gallery_final.jpg" alt="" className={styles.staticHeader} />
          <div className={variant === "grid" ? styles.staticGrid : styles.staticStack}>
            {projects.map((project, i) => (
              <Link key={project.slug} href={`/works#${project.slug}`} className={styles.staticCase}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.poster}
                  alt=""
                  className={styles.staticCaseImage}
                  style={{ objectPosition: project.objectPosition }}
                />
                <div className={styles.staticCaseText}>
                  <CaseText project={project} index={i} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </HeaderZone>
  );
}
