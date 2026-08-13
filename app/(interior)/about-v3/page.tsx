import type { Metadata } from "next";
import { TwoLensesPage } from "@/components/sections/about-v3/TwoLensesPage";

export const metadata: Metadata = {
  title: "About the Studio",
  description:
    "Meet the two founders behind Convenium Studio and see how two perspectives become one accountable project direction.",
};

export default function AboutV3Page() {
  return <TwoLensesPage />;
}
