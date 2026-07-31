import { markPaths, markViewBox } from "@/lib/brand";

/**
 * The shield mark, as a server component.
 *
 * It draws in `currentColor` rather than the supplied brand blue, so the same
 * component works on the ink ground and on the paper section without a second
 * asset. On ink it inherits `paper`; the brand blue is kept for surfaces that
 * are actually light, where it clears contrast comfortably.
 *
 * Decorative by default: the wordmark beside it already carries the firm's
 * name, so announcing the mark as well would read the name twice. Pass a
 * `title` only where the mark stands alone.
 */
export default function Mark({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={markViewBox}
      fill="currentColor"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {markPaths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
