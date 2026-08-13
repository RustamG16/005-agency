import type { Metadata } from "next";
import { MaterialMonolithScene } from "@/components/sections/about-v2/material-monolith/MaterialMonolithScene";

export const metadata: Metadata = {
  title: "Studio — Material Monolith",
  description:
    "Meet the two founders of Convenium Studio and the working model that keeps the idea intact from first conversation to final delivery.",
};

export default function AboutV2Page() {
  return <MaterialMonolithScene />;
}
