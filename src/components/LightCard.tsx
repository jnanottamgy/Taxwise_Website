import type { ReactNode } from "react";

/**
 * A surface that catches the light where the cursor is.
 *
 * This is a server component. The two light layers are `::before` and
 * `::after` in globals.css, and pointer position is written by the single
 * delegated listener in CursorLight — so a page can carry twenty of these
 * without shipping twenty components' worth of JavaScript.
 */
export default function LightCard({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag data-lightcard="" className={`group ${className}`}>
      {children}
    </Tag>
  );
}
