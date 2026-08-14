import type { Metadata } from "next";
import { AboutV3Page } from "@/components/sections/about-v3/AboutV3Page";
import { aboutV3 } from "@/content/about-v3";

export const metadata: Metadata = {
  title: aboutV3.meta.title,
  description: aboutV3.meta.description,
};

export default function AboutV3Route() {
  return <AboutV3Page />;
}
