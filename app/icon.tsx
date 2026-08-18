import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export const dynamic = "force-static";

/**
 * Favicon — the mark browsers show in the tab strip, bookmarks and history.
 *
 * Uses the 3-bar micro ramp, not the full 12-bar mark: at a true 16px the
 * full ramp's hairlines fall below one device pixel and mush into a grey
 * block. Three bars on a 1.6 ratio with a 6-unit gap still read as
 * "increasing weight" at 16px, which is the whole idea.
 *
 * Mirrors RAMP_MICRO in components/ui/Logo.tsx — keep the two in step.
 */

const NOIR = "#1b1717";
const BONE = "#edebdd";
// Accent bar. Chili 300 — the lightened variant that holds against noir at 4.97:1.
// Swap alongside --color-accent-on-noir in styles/tokens.css.
const ACCENT = "#e5595c";

const BARS = [
  { h: 6, color: BONE },
  { h: 10, color: ACCENT },
  { h: 16, color: BONE },
];

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 6,
          padding: 10,
          background: NOIR,
        }}
      >
        {BARS.map((bar) => (
          <div
            key={bar.h}
            style={{ height: bar.h, width: "100%", background: bar.color }}
          />
        ))}
      </div>
    ),
    size
  );
}
