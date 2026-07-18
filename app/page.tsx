import { Hero } from "@/components/sections/home/Hero";
import { Intro } from "@/components/sections/home/Intro";
import { Manifesto } from "@/components/sections/home/Manifesto";
import { ServicesPreview } from "@/components/sections/home/ServicesPreview";
import { WorkPreview } from "@/components/sections/home/WorkPreview";
import { ProcessFilm } from "@/components/sections/home/ProcessFilm";
import { Principles } from "@/components/sections/home/Principles";
import { Faq } from "@/components/sections/Faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Manifesto />
      <ServicesPreview />
      <WorkPreview />
      <ProcessFilm />
      <Principles />
      <Faq />
    </>
  );
}
