import type { NextConfig } from "next";
import path from "path";

// GitHub Pages serves this repo at rustamg16.github.io/005-agency, so every
// asset/route needs that prefix baked in at build time (no server to rewrite it).
const repoBasePath = process.env.GITHUB_PAGES ? "/005-agency" : "";

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
  // GitHub Pages is static hosting only: no server for route handlers, redirects(),
  // or on-demand image optimization, so `next export` needs everything pre-rendered.
  output: "export",
  basePath: repoBasePath,
  assetPrefix: repoBasePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: repoBasePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
