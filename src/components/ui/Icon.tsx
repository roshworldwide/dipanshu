/**
 * Custom SVG icon set — no icon library. Each icon is a 24×24 stroked
 * path so weight stays consistent with the hairline language.
 */
type IconName =
  | "arrow-down"
  | "arrow-right"
  | "close"
  | "menu"
  | "arrow-up-right";

const PATHS: Record<IconName, React.ReactNode> = {
  "arrow-down": <path d="M12 4v16M6 14l6 6 6-6" />,
  "arrow-up-right": <path d="M7 17 17 7M9 7h8v8" />,
  "arrow-right": <path d="M4 12h15M13 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M3 7h18M3 17h18" />,
};

export function Icon({
  name,
  size = 24,
  className,
  strokeWidth = 1.5,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/**
 * The Venture Collective mark — an interlocked "/\" set inside a square
 * grid. Rendered as draw-on strokes so the nav can animate it on load.
 */
export function BrandMark({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 20 12 4l9 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 20 12 12l4.5 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />
    </svg>
  );
}
