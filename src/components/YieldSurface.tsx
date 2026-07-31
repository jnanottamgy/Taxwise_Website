"use client";

import { useEffect, useRef } from "react";

/**
 * The surface.
 *
 * A yield surface is the real instrument this evokes: plot a rate against
 * maturity and time and you get a landscape that rises, sags and twists as
 * the market moves. It is the most three-dimensional object in finance, and
 * it is abstract — no coins, no currency signs, no rising arrow.
 *
 * It is also the site's own ledger grid lifted into three dimensions, which
 * is why it belongs here rather than being decoration bolted on: the page is
 * ruled paper, and this is the same ruling seen from an angle.
 *
 * Written against a 2D canvas with the projection done by hand — about a
 * hundred lines and no dependency. A WebGL renderer would cost roughly 150KB
 * to draw a few hundred straight lines, which is the trade this project has
 * already measured and declined once.
 *
 * Scroll drives the camera: the surface tilts and turns as the hero leaves,
 * so it reads as an object you are moving past rather than a looping GIF.
 */

const COLS = 26;
const ROWS = 26;

type P = { x: number; y: number; d: number };

export default function YieldSurface({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let started = false;
    let start = 0;

    // Camera, eased toward its targets so scroll and pointer never snap.
    let yaw = -0.5;
    let pitch = 0.72;
    let yawT = -0.5;
    let pitchT = 0.72;
    const grid: P[][] = [];

    function size() {
      const el = ref.current;
      if (!el || !ctx) return;
      const rect = el.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /** The surface itself: three waves crossing, which is enough to read as
     *  a term structure without looking like a single tidy sine. */
    function height(u: number, v: number, t: number) {
      return (
        Math.sin(u * 2.6 + t * 0.00021) * 0.5 +
        Math.sin(v * 2.1 - t * 0.00016) * 0.38 +
        Math.sin((u + v) * 1.7 + t * 0.00012) * 0.26
      );
    }

    function project(x: number, y: number, z: number): P {
      // Yaw about the vertical, then pitch the whole thing toward the viewer.
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const rx = x * cy - z * sy;
      const rz = x * sy + z * cy;
      const ry = y * cp - rz * sp;
      const rz2 = y * sp + rz * cp;

      // Camera distance and scale are set so the widest corner of the mesh,
      // at the most extreme yaw the scroll reaches, still lands inside the
      // canvas box — the surface should sit in its space, not be cropped by it.
      const dist = 4.6;
      const f = 2.35 / (dist + rz2);
      const scale = Math.min(w, h) * 0.54;
      return { x: w * 0.5 + rx * f * scale, y: h * 0.5 - ry * f * scale, d: rz2 };
    }

    function build(t: number) {
      grid.length = 0;
      for (let r = 0; r < ROWS; r++) {
        const row: P[] = [];
        const v = r / (ROWS - 1) - 0.5;
        for (let c = 0; c < COLS; c++) {
          const u = c / (COLS - 1) - 0.5;
          row.push(project(u * 2, height(u * 2, v * 2, t) * 0.36, v * 2));
        }
        grid.push(row);
      }
    }

    /** Depth decides everything: nearer lines are brighter and warmer. */
    function stroke(a: P, b: P) {
      if (!ctx) return;
      const d = (a.d + b.d) * 0.5;
      // d runs roughly -1.4 .. 1.4; map to 1 (near) .. 0 (far)
      const near = Math.max(0, Math.min(1, 0.5 - d * 0.42));
      const alpha = 0.05 + near * 0.42;
      const warmth = Math.pow(near, 2.4);
      const R = Math.round(113 + (201 - 113) * warmth);
      const G = Math.round(132 + (168 - 132) * warmth);
      const B = Math.round(169 + (76 - 169) * warmth);
      ctx.strokeStyle = `rgba(${R}, ${G}, ${B}, ${alpha.toFixed(3)})`;
      ctx.lineWidth = 0.6 + near * 0.7;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    function draw(t: number) {
      if (!ctx) return;
      yaw += (yawT - yaw) * 0.045;
      pitch += (pitchT - pitch) * 0.045;
      build(t);
      ctx.clearRect(0, 0, w, h);

      // Painter's order: far rows first, so near ones lie over them.
      const order = grid
        .map((row, i) => ({ i, d: row.reduce((s, p) => s + p.d, 0) / row.length }))
        .sort((a, b) => b.d - a.d);

      for (const { i } of order) {
        const row = grid[i];
        for (let c = 0; c < COLS - 1; c++) stroke(row[c], row[c + 1]);
        if (i < ROWS - 1) {
          for (let c = 0; c < COLS; c++) stroke(row[c], grid[i + 1][c]);
        }
      }
    }

    function loop(now: number) {
      if (!running) return;
      if (!start) start = now;
      draw(now - start);
      raf = requestAnimationFrame(loop);
    }
    function play() {
      if (running || reduced || !started) return;
      running = true;
      raf = requestAnimationFrame(loop);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onScroll() {
      // The camera turns and drops as the hero leaves the screen.
      const p = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      yawT = -0.5 + p * 0.85;
      pitchT = 0.72 - p * 0.5;
    }

    function onPointer(e: PointerEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      const p = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      yawT = -0.5 + p * 0.85 + nx * 0.3;
      pitchT = 0.72 - p * 0.5 - ny * 0.18;
    }

    size();
    build(0);
    draw(0);
    onScroll();

    const begin = () => {
      started = true;
      play();
    };
    const ric: typeof window.requestIdleCallback | undefined = window.requestIdleCallback;
    const usedIdle = typeof ric === "function";
    const idle: number = usedIdle ? ric(begin, { timeout: 2200 }) : window.setTimeout(begin, 900);

    const ro = new ResizeObserver(() => {
      size();
      draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? play() : pause()),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("scroll", onScroll, { passive: true });

    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine && !reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      pause();
      if (usedIdle) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
