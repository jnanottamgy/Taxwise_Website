"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis gives the scroll its weight — a short lerp that makes the page feel
 * like a physical object being moved rather than a document being paged.
 *
 * It is not created at all under prefers-reduced-motion, in which case the
 * browser's native scrolling (and the CSS `scroll-behavior` fallback) is
 * untouched. Anchor navigation is intercepted so in-page jumps ease through
 * the same physics instead of teleporting, with an offset for the fixed nav.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let raf = requestAnimationFrame(function tick(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    });

    function onClick(e: MouseEvent) {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const [path, hash] = href.split("#");
      if (!hash) return;
      // Only handle same-page anchors; cross-page ones navigate normally.
      if (path && path !== window.location.pathname) return;
      const el = document.getElementById(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -88 });
      history.pushState(null, "", `#${hash}`);
    }
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
