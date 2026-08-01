"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll reveals, done in CSS.
 *
 * These appear ~25 times across the page. Driving them with a motion library
 * would mean 25 hydrated animation components on a page that otherwise ships
 * almost no interactivity; one shared IntersectionObserver flipping a data
 * attribute does the same job for a fraction of the main-thread cost.
 * Framer Motion is still used where it earns it — the hero sequence, the
 * scroll-linked timeline, and the nav panel.
 */

type Tag = "div" | "li" | "section" | "article" | "figure";

let observer: IntersectionObserver | null = null;

/**
 * Everything still waiting to be revealed.
 *
 * An IntersectionObserver only reports *changes* in intersection, computed
 * once per frame. A fast flick or a smooth-scroll jump can carry an element
 * from below the viewport to above it between two frames — it was never
 * intersecting at any observation, so no callback ever fires and the element
 * stays hidden with its content sitting in the DOM. On a page this long that
 * is not hypothetical; it reproduced on every fast scroll.
 *
 * So the observer is backed by a sweep: anything still pending that has been
 * scrolled past is shown. The listener only runs while something is pending
 * and is throttled to one frame.
 */
const pending = new Set<Element>();
let sweepQueued = false;
let sweeping = false;

function show(el: Element) {
  (el as HTMLElement).dataset.shown = "true";
  pending.delete(el);
  if (!pending.size) stopSweep();
}

function sweep() {
  sweepQueued = false;
  for (const el of pending) {
    // Read past — below the top of the viewport is gone in a downward read.
    if (el.getBoundingClientRect().bottom < 0) {
      observer?.unobserve(el);
      show(el);
    }
  }
}

function onScroll() {
  if (sweepQueued) return;
  sweepQueued = true;
  requestAnimationFrame(sweep);
}

function startSweep() {
  if (sweeping || typeof window === "undefined") return;
  sweeping = true;
  window.addEventListener("scroll", onScroll, { passive: true });
}

function stopSweep() {
  if (!sweeping) return;
  sweeping = false;
  window.removeEventListener("scroll", onScroll);
}

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Intersecting is the normal case. The second condition is the safety
        // net: a fast flick — or a smooth-scroll jump — can carry an element
        // through the observation band entirely between two rendered frames,
        // and it would then sit hidden forever with its content in the DOM.
        // If it is reported above the viewport, it has been read past, so it
        // is shown rather than left waiting for a scroll back up.
        const passed = entry.boundingClientRect.bottom < 0;
        if (!entry.isIntersecting && !passed) continue;
        show(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "-8% 0px -8% 0px" }
  );
  return observer;
}

/**
 * Hand an element to the page's one shared observer. Anything that wants a
 * scroll-triggered entrance goes through here rather than making its own —
 * `SplitHeading` uses it too. Returns its own unobserve.
 */
export function observeReveal(el: Element | null) {
  if (!el) return;
  if (typeof IntersectionObserver === "undefined") {
    show(el);
    return;
  }
  const io = getObserver();
  pending.add(el);
  startSweep();
  io.observe(el);
  return () => {
    io.unobserve(el);
    pending.delete(el);
    if (!pending.size) stopSweep();
  };
}

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);

  // One registration path for everything on the page, so the pending set and
  // its sweep cannot be bypassed by half the reveals.
  useEffect(() => observeReveal(ref.current), []);

  return ref;
}

export function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: Tag;
}) {
  const ref = useReveal();

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      className={className}
      style={
        {
          "--reveal-y": `${y}px`,
          "--reveal-delay": `${delay}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}

/** A hairline that draws itself in from the left as it enters. */
export function DrawRule({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const ref = useReveal();

  return (
    <div
      ref={ref as never}
      data-draw-rule=""
      className={`h-px w-full origin-left bg-gold/45 ${className}`}
      style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}
    />
  );
}
