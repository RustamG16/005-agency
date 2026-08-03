// app/(home)/page.tsx — "The Guide".
// Stage A (HeroFilm) then Stage B (GuideScene), which wraps the existing
// sections as chapter anchors. OpeningSequence is retired: Stage A replaces it.
//
// The wrappers are the whole integration surface — the sections themselves are
// untouched, they only gain a chapter id and the surface the robot walks over.
import type { Metadata } from "next";
import { HeroFilm } from "@/components/sections/home/guide/HeroFilm";
import { GuideScene } from "@/components/sections/home/guide/GuideScene";
import { GuideCta } from "@/components/sections/home/guide/GuideCta";
import { ServicesPreview } from "@/components/sections/home/ServicesPreview";
import { ProcessFilm } from "@/components/sections/home/ProcessFilm";
import { Principles } from "@/components/sections/home/Principles";
import { Faq } from "@/components/sections/Faq";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: {
    absolute: `${site.name} — ${site.tagline}`,
  },
  description: site.supporting,
};

export default function HomePage() {
  return (
    <>
      <HeroFilm />
      <GuideScene>
        <div data-guide-chapter="services" data-guide-surface="cotton" data-screen-label="02 Services">
          <ServicesPreview />
        </div>
        <div data-guide-chapter="process" data-guide-surface="noir" data-screen-label="03 Process">
          <ProcessFilm />
        </div>
        <div data-guide-chapter="principles" data-guide-surface="cotton" data-screen-label="04 Principles">
          <Principles />
        </div>
        <div data-guide-chapter="faq" data-guide-surface="cotton" data-screen-label="05 FAQ">
          <Faq />
        </div>
        <div data-guide-chapter="cta" data-guide-surface="cotton">
          <GuideCta />
        </div>
      </GuideScene>
    </>
  );
}
