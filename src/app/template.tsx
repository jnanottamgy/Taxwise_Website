/**
 * Route transition. A template remounts on every navigation, so each page
 * resolves into focus through the same blur-and-rise the reveals use —
 * continuity between pages without a router animation library. Reduced motion
 * collapses it to nothing via the global override.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
