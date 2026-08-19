// GitHub Pages serves this site under /005-agency, but only Next's own
// asset pipeline (next/image, next/script, _next/*) rewrites for that
// automatically. Every raw <img>/<video>/<source> src and any manually
// loaded asset (GLB models, textures) needs this prefix applied by hand.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return path.startsWith("/") ? `${basePath}${path}` : path;
}
