import { redirect } from "next/navigation";

// `/about-v3` was the gated redesign's working route before it replaced the
// Monolith `/about` outright, so stale links or bookmarks still need to land
// somewhere real. Static export has no server-side redirects(), so this is a
// prerendered page that redirects at request time instead.
export default function AboutV3Redirect() {
  redirect("/about");
}
