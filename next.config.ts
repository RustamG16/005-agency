import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  outputFileTracingRoot: path.join(__dirname),
  // OneDrive syncs this Desktop-scoped project and repeatedly locks .next/trace mid-write,
  // crashing `next dev` with EPERM. Redirect the build cache to a fresh, less-contended name.
  // NEXT_BUILD_DIR lets a one-off `next build`/`next start` (e.g. for verification) target its
  // own directory instead of fighting a live `next dev` process over `.next-dev`.
  distDir:
    process.env.NEXT_BUILD_DIR ||
    (process.env.NODE_ENV === "development" ? ".next-dev" : ".next"),
};

export default nextConfig;
