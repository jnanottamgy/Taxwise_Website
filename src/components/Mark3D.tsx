"use client";

import { useEffect, useRef } from "react";
import { markPaths, markViewBox } from "@/lib/brand";

/**
 * The firm's shield, as an object.
 *
 * The same three paths that draw the mark in the nav are sampled and extruded
 * into a slowly turning wireframe — the crest given mass, edges warming to
 * gold where they near the light. A bakery puts the cupcake in the masthead;
 * this practice's cupcake is its own crest.
 *
 * The geometry is not hand-traced: the paths are sampled with the browser's
 * own `getPointAtLength`, so the object is exactly the logo — including the
 * arcs in the W that would be miserable to parse by hand. Hand projection on
 * the 2D canvas, like everything else on this page; no renderer dependency.
 *
 * Scroll turns it, the pointer leans it, reduced motion holds it still,
 * offscreen pauses it, and below lg it is not rendered at all.
 */

const SAMPLES = 120; // per path — the mark's edges are gentle, this is plenty
const DEPTH = 0.34; // extrusion depth as a fraction of the mark's height
const SPOKE_EVERY = 6; // connector between front and back every Nth sample

type V3 = { x: number; y: number; z: number };

/** Sample the mark's outlines into normalized loops centred on the origin. */
function sampleLoops(): V3[][] {
  const [vx, vy, vw, vh] = markViewBox.split(" ").map(Number);
  const cx = vx + vw / 2;
  const cy = vy + vh / 2;
  const s = 2 / Math.max(vw, vh); // longest side spans -1..1

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;visibility:hidden";
  document.body.appendChild(svg);

  const loops: V3[][] = [];
  for (const d of markPaths) {
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
    const len = path.getTotalLength();
    const loop: V3[] = [];
    for (let i = 0; i < SAMPLES; i++) {
      const p = path.getPointAtLength((i / SAMPLES) * len);
      loop.push({ x: (p.x - cx) * s, y: (cy - p.y) * s, z: 0 });
    }
    loops.push(loop);
  }
  svg.remove();
  return loops;
}

export default function Mark3D({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let started = false;
    let start = 0;

    let yaw = -0.4;
    let pitch = -0.12;
    let yawT = -0.4;
    let pitchT = -0.12;
    let spinScroll = 0;
    let spinScrollT = 0;

    const loops = sampleLoops();

    function size() {
      const el = ref.current;
      if (!el || !ctx) return;
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function project(p: V3, rot: number) {
      const cy = Math.cos(yaw + rot);
      const sy = Math.sin(yaw + rot);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      // yaw about the vertical axis, then a light pitch toward the viewer
      const rx = p.x * cy + p.z * sy;
      const rz = -p.x * sy + p.z * cy;
      const ry = p.y * cp - rz * sp;
      const rz2 = p.y * sp + rz * cp;
      const scale = Math.min(w, h) * 0.42;
      const f = 3.4 / (3.4 + rz2);
      return { x: w / 2 + rx * f * scale, y: h / 2 - ry * f * scale, d: rz2 };
    }

    /** Depth → colour: near edges carry the gold, far edges fall to slate. */
    function pen(d1: number, d2: number) {
      const near = Math.max(0, Math.min(1, 0.5 - ((d1 + d2) / 2) * 0.55));
      const t = Math.pow(near, 1.7);
      const R = Math.round(138 + (232 - 138) * t);
      const G = Math.round(155 + (201 - 155) * t);
      const B = Math.round(191 + (122 - 191) * t);
      return {
        style: `rgba(${R}, ${G}, ${B}, ${(0.1 + near * 0.6).toFixed(3)})`,
        width: 0.7 + near * 0.9,
      };
    }

    function stroke(a: { x: number; y: number; d: number }, b: { x: number; y: number; d: number }) {
      if (!ctx) return;
      const p = pen(a.d, b.d);
      ctx.strokeStyle = p.style;
      ctx.lineWidth = p.width;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    function draw(t: number) {
      if (!ctx) return;
      yaw += (yawT - yaw) * 0.05;
      pitch += (pitchT - pitch) * 0.05;
      spinScroll += (spinScrollT - spinScroll) * 0.06;
      const rot = (reduced ? 0 : Math.sin(t * 0.00019) * 0.42) + spinScroll;

      ctx.clearRect(0, 0, w, h);

      for (const loop of loops) {
        const front = loop.map((p) => project({ ...p, z: -DEPTH / 2 }, rot));
        const back = loop.map((p) => project({ ...p, z: DEPTH / 2 }, rot));

        // Back outline first, then the walls, then the front edge over them.
        for (let i = 0; i < back.length; i++) {
          stroke(back[i], back[(i + 1) % back.length]);
        }
        for (let i = 0; i < front.length; i += SPOKE_EVERY) {
          stroke(front[i], back[i]);
        }
        for (let i = 0; i < front.length; i++) {
          stroke(front[i], front[(i + 1) % front.length]);
        }
      }
    }

    function loop(nowT: number) {
      if (!running) return;
      if (!start) start = nowT;
      draw(nowT - start);
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
      const p = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
      spinScrollT = p * 2.4; // one viewport of scroll turns the crest well past profile
      pitchT = -0.12 + p * 0.18;
    }
    function onPointer(e: PointerEvent) {
      yawT = -0.4 + (e.clientX / window.innerWidth - 0.5) * 0.5;
      pitchT = -0.12 - (e.clientY / window.innerHeight - 0.5) * 0.24;
    }

    size();
    onScroll();
    draw(0);

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
