"use client";

import { useEffect, useRef } from "react";

/**
 * A figure that counts up to its value when it enters the viewport.
 *
 * The server renders the final value, so the number is correct without
 * JavaScript and for crawlers; the animation only replaces it once the
 * element is actually on screen. Digits are tabular everywhere on this site,
 * so the width never shifts while counting. Under reduced motion the final
 * value simply stays.
 */
export default function CountUp({
  value,
  duration = 1.4,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / (duration * 1000));
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} data-figure>
      {value}
    </span>
  );
}
