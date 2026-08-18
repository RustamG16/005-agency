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
  async redirects() {
    return [
      // `/about-v3` was the gated redesign's working route; it replaced the
      // Monolith `/about` outright rather than living alongside it, so any
      // stale link or bookmark still needs to land somewhere real.
      { source: "/about-v3", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
