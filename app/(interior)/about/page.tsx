import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { StudioModel } from "@/components/sections/about/StudioModel";
import { Principles } from "@/components/sections/home/Principles";
import { ProcessSteps } from "@/components/sections/about/ProcessSteps";
import { CapabilitiesList } from "@/components/sections/about/CapabilitiesList";
import { StudioFilm } from "@/components/sections/about/StudioFilm";
import { AboutCta } from "@/components/sections/about/AboutCta";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Convenium is an independent creative studio built around direct collaboration — strategy, identity and digital expression in one connected process.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StudioModel />
      <Principles />
      <ProcessSteps />
      <CapabilitiesList />
      <StudioFilm />
      <AboutCta />
    </>
  );
}
