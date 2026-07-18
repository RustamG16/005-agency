import Link from "next/link";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { HeaderZone } from "@/components/chrome/HeaderZone";
import styles from "./WorkPreview.module.css";

export function WorkPreview() {
  return (
    <HeaderZone theme="dark">
      <section className={`wrap ${styles.section}`} aria-label="Selected work">
        <div className={styles.head}>
          <p className="eyebrow" style={{ color: "var(--color-gray)" }}>
            Selected Work
          </p>
          <h2 className={styles.heading}>
            We do not decorate businesses.
            <br />
            We change the level at which they compete.
          </h2>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <Link href="/works" className={styles.cta}>
          View all work
          <ArrowRightIcon />
        </Link>
      </section>
    </HeaderZone>
  );
}
