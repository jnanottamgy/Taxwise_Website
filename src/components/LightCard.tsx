"use client";

import { useCallback, useRef, type ReactNode } from "react";

/**
 * A surface that catches the light where the cursor is.
 *
 * Same idea as the hero: the material does not glow, it is lit. Position is
 * written straight to CSS custom properties so nothing re-renders on move.
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
  const ref = useRef<HTMLElement | null>(null);
  const frame = useRef(0);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) return; // coalesce to one write per frame
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }, []);

  return (
    <Tag
      ref={ref as never}
      onPointerMove={onPointerMove}
      className={`group relative isolate overflow-hidden transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
    >
      {/* The lit pool. Sits under the content, fades in on hover only. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(18rem 18rem at var(--mx, 50%) var(--my, 50%), rgba(113,132,169,0.22), rgba(113,132,169,0.06) 42%, transparent 70%)",
        }}
      />
      {/* A single specular edge along the top — the glass catch */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(245,244,242,0.34) 35%, rgba(245,244,242,0.34) 65%, transparent)",
        }}
      />
      {children}
    </Tag>
  );
}
