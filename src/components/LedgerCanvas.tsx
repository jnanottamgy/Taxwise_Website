"use client";

import { useEffect, useRef } from "react";

/**
 * The signature element.
 *
 * A ledger page rendered as architecture: hairline column rules on a dark
 * ground, with a single soft light raking across them. The grid is always
 * there; the light is what lets you read it. Nothing glows on its own.
 *
 * The static grid lives in CSS (`ledger-ground`), so this canvas only ever
 * draws the light — a wash, plus the same grid brightened and masked to the
 * lit pool. It renders at 1x and starts only once the page is idle, so it
 * never competes with hydration.
 */

const CELL = 88; // must match the ledger-ground utility in globals.css
const HEAVY_EVERY = 4;

/** The grid at full strength. Only ever painted once, into an offscreen layer. */
function paintBrightGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1;

  const cols = Math.ceil(w / CELL) + 1;
  const rows = Math.ceil(h / CELL) + 1;

  ctx.strokeStyle = "rgba(245, 244, 242, 0.42)";
  ctx.beginPath();
  for (let r = 0; r <= rows; r++) {
    const y = Math.round(r * CELL) + 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  for (let c = 0; c <= cols; c++) {
    if (c % HEAVY_EVERY === 0) continue;
    const x = Math.round(c * CELL) + 0.5;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  ctx.stroke();

  // Column rules read brighter, the way an inked rule does against pencil —
  // and warm, because the only thing lighting them is the lamp.
  ctx.strokeStyle = "rgba(201, 168, 76, 0.62)";
  ctx.beginPath();
  for (let c = 0; c <= cols; c += HEAVY_EVERY) {
    const x = Math.round(c * CELL) + 0.5;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  ctx.stroke();
}

export default function LedgerCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let bright: HTMLCanvasElement | null = null;
    let lit: HTMLCanvasElement | null = null;
    let litCtx: CanvasRenderingContext2D | null = null;
    let w = 0;
    let h = 0;

    let lx = 0;
    let ly = 0;
    const pointer = { x: 0, y: 0, active: false };

    let raf = 0;
    let running = false;
    let started = false;
    let start = 0;

    function build() {
      const el = ref.current;
      if (!el || !ctx) return;
      const rect = el.getBoundingClientRect();
      // Deliberately 1x: this layer is a soft light, and the crisp grid
      // underneath it is CSS. Rendering at devicePixelRatio would quadruple
      // the per-frame cost for no visible gain.
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      el.width = w;
      el.height = h;

      bright = document.createElement("canvas");
      bright.width = w;
      bright.height = h;
      const bctx = bright.getContext("2d");
      if (!bctx) return;
      paintBrightGrid(bctx, w, h);

      lit = document.createElement("canvas");
      lit.width = w;
      lit.height = h;
      litCtx = lit.getContext("2d");

      lx = w * 0.5;
      ly = h * 0.42;
      draw(0);
    }

    function draw(elapsed: number) {
      if (!ctx || !bright || !lit || !litCtx) return;

      const driftX = w * 0.5 + Math.sin(elapsed * 0.00011) * w * 0.3;
      const driftY = h * 0.44 + Math.sin(elapsed * 0.00007 + 1.3) * h * 0.2;

      const tx = pointer.active ? driftX * 0.35 + pointer.x * 0.65 : driftX;
      const ty = pointer.active ? driftY * 0.35 + pointer.y * 0.65 : driftY;

      lx += (tx - lx) * 0.035;
      ly += (ty - ly) * 0.035;

      const radius = Math.max(w, h) * 0.46;

      litCtx.globalCompositeOperation = "source-over";
      litCtx.clearRect(0, 0, w, h);
      litCtx.drawImage(bright, 0, 0);
      litCtx.globalCompositeOperation = "destination-in";
      const mask = litCtx.createRadialGradient(lx, ly, 0, lx, ly, radius);
      mask.addColorStop(0, "rgba(255,255,255,1)");
      mask.addColorStop(0.34, "rgba(255,255,255,0.72)");
      mask.addColorStop(0.66, "rgba(255,255,255,0.2)");
      mask.addColorStop(1, "rgba(255,255,255,0)");
      litCtx.fillStyle = mask;
      litCtx.fillRect(0, 0, w, h);

      ctx.clearRect(0, 0, w, h);

      // Two layers, because one warm radial just reads as a smudge. The broad
      // cool wash is the room; the tight warm core is the bulb. What makes it
      // legible as light rather than colour is the ruled grid drawn on top of
      // both — structure is what the eye reads as illumination.
      const wash = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius * 0.95);
      wash.addColorStop(0, "rgba(34, 50, 80, 0.82)");
      wash.addColorStop(0.45, "rgba(34, 50, 80, 0.32)");
      wash.addColorStop(1, "rgba(34, 50, 80, 0)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      const core = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius * 0.34);
      core.addColorStop(0, "rgba(201, 168, 76, 0.26)");
      core.addColorStop(0.45, "rgba(201, 168, 76, 0.1)");
      core.addColorStop(1, "rgba(201, 168, 76, 0)");
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h);

      ctx.drawImage(lit, 0, 0);
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

    function onPointerMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }

    function onPointerLeave() {
      pointer.active = false;
    }

    // Paint one static frame immediately, then only begin animating once the
    // browser has nothing more important to do.
    build();

    const begin = () => {
      started = true;
      play();
    };
    const ric: typeof window.requestIdleCallback | undefined = window.requestIdleCallback;
    const usedIdle = typeof ric === "function";
    const idle: number = usedIdle
      ? ric(begin, { timeout: 2500 })
      : window.setTimeout(begin, 1200);

    const ro = new ResizeObserver(() => build());
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? play() : pause()),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer && !reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    return () => {
      pause();
      if (usedIdle) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
