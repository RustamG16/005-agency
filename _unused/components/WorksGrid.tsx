"use client";

import { useMemo, useState } from "react";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./WorksGrid.module.css";

export function WorksGrid() {
  const sectors = useMemo(() => ["All", ...new Set(projects.map((p) => p.sector))], []);
  const [filter, setFilter] = useState("All");

  const visible = filter === "All" ? projects : projects.filter((p) => p.sector === filter);

  return (
    <HeaderZone theme="light">
      <section className={`wrap ${styles.section}`} aria-label="Work index">
        <div className={styles.filterRow} role="group" aria-label="Filter work by sector">
          {sectors.map((sector) => (
            <button
              key={sector}
              type="button"
              className={styles.filterButton}
              data-active={filter === sector}
              onClick={() => setFilter(sector)}
              aria-pressed={filter === sector}
            >
              {sector}
            </button>
          ))}
        </div>

        <div className={styles.mosaic}>
          {visible.map((project, i) => (
            <div key={project.slug} className={styles.mosaicItem} data-offset={i % 3 === 1}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </section>
    </HeaderZone>
  );
}
