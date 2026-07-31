"use client";

import { useEffect, useRef, useState } from "react";
import { monthly, year } from "@/lib/calendar";

/**
 * The statutory year, as an instrument.
 *
 * A ring of the Indian financial year — April at the top, March closing the
 * circle — with a tick for every filing the firm keeps. The data is not
 * decorative: it is `src/lib/calendar.ts`, the same statutory calendar
 * published further down the page. Gold ticks are the annual obligations,
 * faint ones the monthly cycle, and the gold point is today, sitting on the
 * ring wherever the year actually is. The readout in the centre names the
 * next statutory date, computed from the same data.
 *
 * This is the firm's entire argument drawn as an object: the year is a wheel
 * of deadlines, and someone has to hold it.
 *
 * Hand-projected on a 2D canvas like the ledger behind it — no renderer
 * dependency. Scroll turns the wheel, the pointer tilts it, reduced motion
 * gets a still instrument, and below lg it is not rendered at all.
 */

const FISCAL_START = 3; // April
const MONTH_INDEX: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6,
  August: 7, September: 8, October: 9, November: 10, December: 11,
};
const SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** Fiscal position 0..12 for a JS month index plus a day fraction. */
function fiscal(monthIdx: number, day: number) {
  return ((monthIdx - FISCAL_START + 12) % 12) + (day - 1) / 31;
}

/** The next statutory date from today, out of the same calendar data. */
function nextObligation(now: Date): { form: string; date: Date } | null {
  for (let i = 0; i <= 70; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const day = d.getDate();
    // Annual entries first: on a shared day the year-specific filing is the
    // one worth naming.
    for (const m of year) {
      if (MONTH_INDEX[m.month] === d.getMonth()) {
        const hit = m.entries.find((e) => parseInt(e.date, 10) === day);
        if (hit) return { form: hit.form, date: d };
      }
    }
    const rec = monthly.find((m) => parseInt(m.day, 10) === day);
    if (rec) return { form: rec.form, date: d };
  }
  return null;
}

export default function StatutoryDial({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [next, setNext] = useState<{ form: string; when: string } | null>(null);

  useEffect(() => {
    const hit = nextObligation(new Date());
    if (hit) {
      setNext({
        form: hit.form,
        when: `${hit.date.getDate()} ${SHORT[hit.date.getMonth()]}`,
      });
    }
  }, []);

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

    // Camera and wheel, eased toward their targets.
    let yaw = 0;
    let pitch = 1.04;
    let yawT = 0;
    let pitchT = 1.04;
    let spinScroll = 0;
    let spinScrollT = 0;

    // The mono family as next/font actually registered it — the literal name
    // "IBM Plex Mono" would silently fall back to the system font.
    const monoFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-plex-mono").trim() ||
      "monospace";

    const now = new Date();
    const todayF = fiscal(now.getMonth(), now.getDate());

    // Every tick, precomputed once: fiscal position + kind.
    const annual = year.flatMap((m) =>
      m.entries.map((e) => fiscal(MONTH_INDEX[m.month], parseInt(e.date, 10)))
    );
    const recurring: number[] = [];
    for (let mo = 0; mo < 12; mo++) {
      for (const m of monthly) recurring.push(mo + (parseInt(m.day, 10) - 1) / 31);
    }

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

    function project(theta: number, r: number, lift = 0) {
      const R = Math.min(w, h) * 0.4;
      const x = Math.cos(theta) * r * R;
      const z = Math.sin(theta) * r * R;
      const y = lift * R;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const rx = x * cy - z * sy;
      const rz = x * sy + z * cy;
      const ry = y * cp - rz * sp;
      const rz2 = y * sp + rz * cp;
      const f = 620 / (620 + rz2);
      return { x: w / 2 + rx * f, y: h / 2 - ry * f, d: rz2, f };
    }

    /** Depth → presence. Near side of the wheel is brighter and warmer. */
    function near(d: number) {
      return Math.max(0, Math.min(1, 0.5 - d / (Math.min(w, h) * 0.8)));
    }

    function angleOf(fis: number, rot: number) {
      return -Math.PI / 2 + (fis / 12) * Math.PI * 2 + rot;
    }

    function draw(t: number) {
      if (!ctx) return;
      yaw += (yawT - yaw) * 0.05;
      pitch += (pitchT - pitch) * 0.05;
      spinScroll += (spinScrollT - spinScroll) * 0.06;
      const rot = (reduced ? 0 : t * 0.000055) + spinScroll;

      ctx.clearRect(0, 0, w, h);

      // The ring itself, in short segments so each carries its own depth.
      for (let i = 0; i < 96; i++) {
        const a = angleOf((i / 96) * 12, rot);
        const b = angleOf(((i + 1) / 96) * 12, rot);
        const p1 = project(a, 1);
        const p2 = project(b, 1);
        const n = near((p1.d + p2.d) / 2);
        ctx.strokeStyle = `rgba(138, 155, 191, ${(0.1 + n * 0.3).toFixed(3)})`;
        ctx.lineWidth = 0.8 + n * 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // The monthly cycle: six faint ticks in every month, the routine work.
      for (const f of recurring) {
        const a = angleOf(f, rot);
        const p1 = project(a, 0.97);
        const p2 = project(a, 1.03);
        const n = near((p1.d + p2.d) / 2);
        ctx.strokeStyle = `rgba(138, 155, 191, ${(0.05 + n * 0.22).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // The annual obligations, in gold — the dates that define the year.
      for (const f of annual) {
        const a = angleOf(f, rot);
        const p1 = project(a, 0.94);
        const p2 = project(a, 1.06);
        const n = near((p1.d + p2.d) / 2);
        ctx.strokeStyle = `rgba(201, 168, 76, ${(0.15 + n * 0.65).toFixed(3)})`;
        ctx.lineWidth = 1 + n * 0.6;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Month initials around the wheel; the current month carries the gold.
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let mo = 0; mo < 12; mo++) {
        const jsMonth = (mo + FISCAL_START) % 12;
        const a = angleOf(mo + 0.5, rot);
        const p = project(a, 1.19);
        const n = near(p.d);
        const isNow = jsMonth === now.getMonth();
        ctx.font = `${(9 + n * 2).toFixed(1)}px ${monoFamily}`;
        ctx.fillStyle = isNow
          ? `rgba(232, 201, 122, ${(0.25 + n * 0.75).toFixed(3)})`
          : `rgba(138, 155, 191, ${(0.08 + n * 0.5).toFixed(3)})`;
        ctx.fillText(SHORT[jsMonth], p.x, p.y);
      }

      // Today: a gold point breathing on the ring, with its bearing line.
      const ta = angleOf(todayF, rot);
      const tp = project(ta, 1);
      const tn = near(tp.d);
      const centre = project(0, 0);
      ctx.strokeStyle = `rgba(201, 168, 76, ${(0.05 + tn * 0.22).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centre.x, centre.y);
      ctx.lineTo(tp.x, tp.y);
      ctx.stroke();
      const pulse = reduced ? 0 : Math.sin(t * 0.0024) * 0.9;
      ctx.fillStyle = `rgba(232, 201, 122, ${(0.35 + tn * 0.6).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, 2.4 + tn * 1.6 + pulse, 0, Math.PI * 2);
      ctx.fill();
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
      spinScrollT = p * 1.35; // scrolling one viewport turns the wheel ~a quarter
      pitchT = 1.04 - p * 0.22;
    }
    function onPointer(e: PointerEvent) {
      yawT = (e.clientX / window.innerWidth - 0.5) * 0.3;
      pitchT = 1.04 - (e.clientY / window.innerHeight - 0.5) * 0.16 - spinScroll * 0.16;
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

  return (
    <div className={`relative ${className}`}>
      <canvas ref={ref} className="h-full w-full" />
      {/* The readout: the next statutory date, from the same calendar the
          page publishes. Rendered only after mount, since it depends on the
          reader's clock. */}
      {next ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-mist">
            Next statutory date
          </p>
          <p className="max-w-[16ch] font-mono text-[0.6875rem] uppercase leading-[1.7] tracking-[0.16em] text-gold-lit">
            {next.form}
          </p>
          <p className="tabular font-display text-[1.75rem] leading-none text-paper">{next.when}</p>
        </div>
      ) : null}
    </div>
  );
}
