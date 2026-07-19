import type { ReactNode } from "react";
import { PageEnter } from "@/components/motion/PageEnter";

export default function InteriorTemplate({ children }: { children: ReactNode }) {
  return <PageEnter>{children}</PageEnter>;
}
