import type { Metadata } from "next";
import { OpeningSequence } from "@/components/sections/home/OpeningSequence";
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
      <OpeningSequence />
      <ServicesPreview />
      <ProcessFilm />
      <Principles />
      <Faq />
    </>
  );
}
