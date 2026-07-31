"use client";

import { useEffect } from "react";

/**
 * One listener for everything the cursor touches.
 *
 * A single delegated pointermove drives four things on one rAF:
 *  - the page-level pool of light that trails the cursor (#cursor-glow)
 *  - the lit spot on whichever card the pointer is over (--mx / --my)
 *  - that card's tilt, a few degrees at most (--rx / --ry)
 *  - the hero's parallax, written to the hero section only (--par-x / --par-y)
 *    so the style invalidation stays scoped instead of hitting :root
 *
 * The cards themselves stay server components; nothing here hydrates them.
 * Coarse pointers and reduced motion get none of it.
 */
export default function CursorLight() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glow = document.createElement("div");
    glow.id = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    const hero = document.getElementById("top");

    let raf = 0;
    let x = 0;
    let y = 0;
    let card: HTMLElement | null = null;

    function resetCard(el: HTMLElement) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }

    function apply() {
      raf = 0;
      glow.style.opacity = "1";
      glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (card) {
        const r = card.getBoundingClientRect();
        const px = (x - r.left) / r.width;
        const py = (y - r.top) / r.height;
        card.style.setProperty("--mx", `${x - r.left}px`);
        card.style.setProperty("--my", `${y - r.top}px`);
        card.style.setProperty("--ry", `${((px - 0.5) * 5).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${((0.5 - py) * 4).toFixed(2)}deg`);
      }

      if (hero) {
        hero.style.setProperty("--par-x", (x / window.innerWidth - 0.5).toFixed(4));
        hero.style.setProperty("--par-y", (y / window.innerHeight - 0.5).toFixed(4));
      }
    }

    function onMove(e: PointerEvent) {
      x = e.clientX;
      y = e.clientY;
      const el =
        (e.target as Element | null)?.closest?.<HTMLElement>("[data-lightcard]") ?? null;
      if (card && card !== el) resetCard(card);
      card = el;
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeaveDoc() {
      if (card) resetCard(card);
      card = null;
      glow.style.opacity = "0";
    }

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeaveDoc);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeaveDoc);
      if (raf) cancelAnimationFrame(raf);
      glow.remove();
    };
  }, []);

  return null;
}
