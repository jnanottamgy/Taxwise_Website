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

    // Give the ambient ground some mass.
    //
    // The lamps are `position: fixed`, so by default they are welded to the
    // viewport and the page slides over a background that never reacts to it.
    // Trailing them a few pixels behind the scroll — and letting them stretch
    // very slightly while they catch up — is what separates a background from
    // a backdrop: the light has weight, and you feel it settle when you stop.
    //
    // Two custom properties, written on the ambient element itself rather than
    // on :root, so a per-frame write invalidates one element's style instead of
    // the document's. Both are quantised and only written when they change, so
    // a still page writes nothing at all.
    //
    // None of this exists under reduced motion: this effect has already
    // returned by then, the properties are never set, and the CSS falls back to
    // its neutral defaults.
    const ambient = document.querySelector<HTMLElement>(".ambient");
    const MAX_LAG = 16; // px — past this it stops reading as inertia
    let lag = 0;
    let lastY: string | null = null;
    let lastS: string | null = null;

    let raf = requestAnimationFrame(function tick(time) {
      lenis.raf(time);

      if (ambient) {
        const target = Math.max(-MAX_LAG, Math.min(MAX_LAG, -lenis.velocity * 0.5));
        lag += (target - lag) * 0.11;

        const y = `${Math.round(lag * 2) / 2}px`;
        if (y !== lastY) {
          ambient.style.setProperty("--amb-y", y);
          lastY = y;
        }

        // Volume-preserving: it stretches along the direction of travel and
        // narrows across it, the way a smeared highlight does.
        const s = (1 + (Math.abs(lag) / MAX_LAG) * 0.035).toFixed(3);
        if (s !== lastS) {
          ambient.style.setProperty("--amb-scale", s);
          lastS = s;
        }
      }

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
      ambient?.style.removeProperty("--amb-y");
      ambient?.style.removeProperty("--amb-scale");
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
