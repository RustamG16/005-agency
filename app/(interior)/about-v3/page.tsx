import type { Metadata } from "next";
import { TwoLensesPage } from "@/components/sections/about-v3/TwoLensesPage";

export const metadata: Metadata = {
  title: "About Convenium Studio",
  description:
    "Meet the founders behind Convenium and follow how an unfinished idea becomes one accountable digital direction.",
};

export default function AboutV3Page() {
  return <TwoLensesPage />;
}
