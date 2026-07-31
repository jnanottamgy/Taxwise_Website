"use client";

import { useEffect } from "react";

/**
 * One listener for every lit surface on the page.
 *
 * Each card used to own its own pointer handler, which meant every card was a
 * hydrated client component. Delegating to a single document-level listener
 * writes the same two custom properties for a fraction of the cost, and the
 * cards themselves render on the server.
 */
export default function CursorLight() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let target: HTMLElement | null = null;

    function apply() {
      raf = 0;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${x - rect.left}px`);
      target.style.setProperty("--my", `${y - rect.top}px`);
    }

    function onMove(e: PointerEvent) {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-lightcard]");
      if (!el) return;
      target = el;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
