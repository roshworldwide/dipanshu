import { brand } from "@/content/site";

/**
 * One Collective brand mark. The SVG lives in /public so it can be
 * cached aggressively as a static asset; using <img> keeps the
 * component tiny. Aspect-ratio of the source is ~1.413:1.
 */
export function Logo({
  className,
  size = 28,
}: {
  className?: string;
  /** Rendered height in pixels. Width auto-derives from the source. */
  size?: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={brand.logoSrc}
      alt={brand.name}
      width={Math.round(size * 1.413)}
      height={size}
      style={{ height: size, width: "auto" }}
      className={className}
      draggable={false}
    />
  );
}
