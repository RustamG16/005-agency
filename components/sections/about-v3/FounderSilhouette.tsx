/**
 * Drawn founder placeholders for Sections 01–02.
 *
 * No founder media exists yet, and the About V3 handoff forbids implying that
 * anything here is a portrait or a frame of finished film. So this is not an
 * attempt at photography that falls short — it is flat, hard-edged poster
 * work: near-black figures on flat cherry and maroon bands. Nobody can mistake
 * it for a photograph, which is exactly the point. It also keeps the project's
 * no-gradient rule intact; the lockups' lit studio is a photographic effect,
 * and faking it would need gradients, so the stage is reinterpreted in flat
 * colour rather than imitated badly.
 *
 * `FounderStage` is one wide scene holding both figures. Section 01's
 * transition renders it three times and clips two of the copies down to
 * portrait windows, so the figures never move — masks do all the work, which
 * is what the motion contract asks for.
 *
 * Both figures are drawn once in a local 300 × 560 box with their feet on the
 * baseline, then placed by transform, so the wide stage and the portrait tile
 * are guaranteed to show the same artwork.
 */

/** Suited figure: squared shoulders, straight-leg trousers. */
const FIGURE_A = (
  <>
    <ellipse cx="150" cy="46" rx="31" ry="39" />
    <path d="M137 80h26v28h-26z" />
    <path d="M150 100c-20 0-36 7-48 20l-14 26-13 154 20 3 11-133-6 76-2 74h104l-2-74-6-76 11 133 20-3-13-154-14-26c-12-13-28-20-48-20Z" />
    <path d="M100 316l4 242h36l10-198 10 198h36l4-242Z" />
  </>
);

/** Figure with gathered hair and wide-leg trousers. */
const FIGURE_B = (
  <>
    <circle cx="150" cy="16" r="15" />
    <ellipse cx="150" cy="50" rx="28" ry="36" />
    <path d="M139 82h22v26h-22z" />
    <path d="M150 102c-17 0-30 7-40 20l-12 26-12 148 18 3 10-127-6 78-2 72h88l-2-72-6-78 10 127 18-3-12-148-12-26c-10-13-23-20-40-20Z" />
    <path d="M108 318h84l12 240h-46l-8-138-8 138H96Z" />
  </>
);

const FIGURES = { a: FIGURE_A, b: FIGURE_B } as const;

export type FounderVariant = keyof typeof FIGURES;

/* Stage geometry.
 *
 * Measured off `01b-opening-split-transition.png`: the two portrait windows
 * are centred at 33% and 67% of the frame, are ~20% of its width, and stand in
 * a ratio near 27:50 — noticeably narrower than 4:5. `--av3-window-*` in the
 * stylesheet encodes those same numbers, and `PORTRAIT_RATIO` below is what
 * Section 02's tiles use. Change one and you must change the others. */
const STAGE_W = 1600;
const STAGE_H = 700;
const FLOOR_Y = 620;
const FIGURE_SCALE = 0.92;
const FIGURE_TOP = FLOOR_Y - 560 * FIGURE_SCALE;
const FIGURE_CX = [STAGE_W * 0.33, STAGE_W * 0.67];

export function FounderStage({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="av3-stage-floor">
          <rect x="0" y={FLOOR_Y} width={STAGE_W} height={STAGE_H - FLOOR_Y} />
        </clipPath>
      </defs>

      <rect width={STAGE_W} height={STAGE_H} fill="var(--color-noir)" />

      {/* Flat light panels, one pair behind each figure, sized to sit inside
          the portrait windows so the red field survives the crop. */}
      <g fill="var(--red-cherry)">
        <rect x="400" y="0" width="200" height={FLOOR_Y} />
        <rect x="944" y="0" width="200" height={FLOOR_Y} />
      </g>
      <g fill="var(--red-maroon)">
        <rect x="616" y="0" width="56" height={FLOOR_Y} />
        <rect x="1160" y="0" width="56" height={FLOOR_Y} />
      </g>
      <rect
        x="0"
        y={FLOOR_Y}
        width={STAGE_W}
        height={STAGE_H - FLOOR_Y}
        fill="var(--red-maroon)"
        opacity="0.3"
      />

      {/* Reflections, mirrored about the floor line and clipped to it. */}
      <g clipPath="url(#av3-stage-floor)" opacity="0.2" fill="#0B0909">
        {FIGURE_CX.map((cx, i) => (
          <g
            key={cx}
            transform={`translate(${cx - 150 * FIGURE_SCALE} ${
              FLOOR_Y * 2 - FIGURE_TOP
            }) scale(${FIGURE_SCALE} ${-FIGURE_SCALE})`}
          >
            {i === 0 ? FIGURE_A : FIGURE_B}
          </g>
        ))}
      </g>

      <g fill="#0B0909">
        {FIGURE_CX.map((cx, i) => (
          <g
            key={cx}
            transform={`translate(${cx - 150 * FIGURE_SCALE} ${FIGURE_TOP}) scale(${FIGURE_SCALE})`}
          >
            {i === 0 ? FIGURE_A : FIGURE_B}
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Section 02's resting portrait: the same figure, cropped head to thigh. */
export function FounderPortrait({
  variant,
  className,
}: {
  variant: FounderVariant;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 270 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="270" height="500" fill="var(--color-noir)" />
      <rect x="20" y="0" width="196" height="500" fill="var(--red-cherry)" />
      <rect x="228" y="0" width="34" height="500" fill="var(--red-maroon)" />
      {/* Head-to-thigh: the figure is scaled up and dropped so the frame gives
          it headroom and cuts at mid-thigh, as the lockup's portraits do. */}
      <g fill="#0B0909" transform="translate(-27 50) scale(1.08)">
        {FIGURES[variant]}
      </g>
    </svg>
  );
}
