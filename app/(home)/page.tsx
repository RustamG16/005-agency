import type { Metadata } from "next";
import { Hero } from "@/components/sections/home/Hero";
import { ServicesPreview } from "@/components/sections/home/ServicesPreview";
import { WorkDeck } from "@/components/sections/home/WorkDeck";
import { ProcessFilm } from "@/components/sections/home/ProcessFilm";
import { Principles } from "@/components/sections/home/Principles";
import { Faq } from "@/components/sections/Faq";
import { site } from "@/content/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} — ${site.tagline}`,
  },
  description: site.supporting,
};

/**
 * Section anchors live here rather than inside the sections, so the guide's
 * radial menu and hint triggers have one place to read the page's structure
 * from — and so the frozen Capabilities and FAQ sections keep their internals
 * untouched. `guide-content.ts` mirrors these ids.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <div id="capabilities" className={styles.overHero}>
        <ServicesPreview />
      </div>
      <div id="work">
        <WorkDeck />
      </div>
      <div id="process">
        <ProcessFilm />
      </div>
      <div id="principles">
        <Principles />
      </div>
      <div id="faq">
        <Faq />
      </div>
    </>
  );
}
