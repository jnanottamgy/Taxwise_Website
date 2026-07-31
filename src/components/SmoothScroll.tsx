"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis } from "@/lib/smooth-scroll";

/**
 * Lenis gives the scroll its weight — a short lerp that makes the page feel
 * like a physical object being moved rather than a document being paged.
 *
 * It is not created at all under prefers-reduced-motion, in which case the
 * browser's native scrolling is untouched.
 *
 * Intercepting in-page anchors is the delicate part. Taking over a click
 * means taking over everything the browser would otherwise have done with it:
 *
 *  - Moving focus. A fragment navigation moves the sequential focus starting
 *    point; `scrollTo` does not. Without the focus handoff below, the skip
 *    link scrolls but skips nothing, and the next Tab lands back in the
 *    header — a Bypass Blocks failure.
 *  - Modified clicks. Ctrl/Cmd/Shift/middle-click open links in new tabs and
 *    windows. Calling preventDefault on those swallows them silently.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    registerLenis(lenis);

    let raf = requestAnimationFrame(function tick(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    });

    function onClick(e: MouseEvent) {
      // Leave every click the browser would treat specially alone.
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href*='#']");
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;

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

      // Hand focus to the target the way a real fragment navigation would, so
      // the next Tab continues from there. Sections are not focusable, so one
      // is made focusable for the purpose and released on blur — leaving the
      // attribute on would put a focus ring on a whole section on later clicks.
      if (!el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "-1");
        el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
      }
      el.focus({ preventScroll: true });
    }

    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
