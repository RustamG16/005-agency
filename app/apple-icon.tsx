import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home-screen / touch icon. At 180px there is room for the full 12-bar ramp,
 * so this carries the real mark rather than the favicon's 3-bar reduction.
 *
 * Mirrors RAMP_FULL in components/ui/Logo.tsx (heights x1.12 to fill a
 * 112px content box inside 34px padding). Keep the two in step.
 */

const NOIR = "#1b1717";
const BONE = "#edebdd";
// Accent bar — index 8, the same bar the web lockup highlights. Chili 300.
const ACCENT = "#e5595c";
const ACCENT_INDEX = 8;

const HEIGHTS = [
  1.79, 2.12, 2.5, 2.95, 3.47, 4.1, 4.84, 5.71, 6.73, 7.95, 9.38, 11.07,
];

export default function AppleIcon() {
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
          gap: 4.49,
          padding: 34,
          background: NOIR,
        }}
      >
        {HEIGHTS.map((h, i) => (
          <div
            key={h}
            style={{
              height: h,
              width: "100%",
              background: i === ACCENT_INDEX ? ACCENT : BONE,
            }}
          />
        ))}
      </div>
    ),
    size
  );
}
