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

function show(el: Element) {
  (el as HTMLElement).dataset.shown = "true";
}

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: "-8% 0px -8% 0px" }
  );
  return observer;
}

function useReveal() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen, or any browser without the observer, is
    // shown at once — content must never be left stranded at opacity 0.
    if (typeof IntersectionObserver === "undefined") {
      show(el);
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show(el);
      return;
    }

    const io = getObserver();
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

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
      className={`h-px w-full origin-left bg-paper-12 ${className}`}
      style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}
    />
  );
}
