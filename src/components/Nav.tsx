"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { firm, nav, whatsappUrl } from "@/lib/content";
import { setScrollLocked } from "@/lib/smooth-scroll";
import { Container } from "./Section";
import Mark from "./Mark";
import Magnetic from "./Magnetic";

/**
 * The nav does not simply stick — it evolves. At the top of the page it is a
 * transparent rail; once the page moves it becomes a floating glass pill:
 * inset, rounded, blurred, compressed. A gold rule across its top fills as
 * you read (spring-smoothed), and a scrollspy keeps the underline on the
 * section you are actually in.
 */
function Wordmark() {
  return (
    <a
      href="/"
      className="group flex items-center gap-3 rounded-sm"
      aria-label={`${firm.name} — home`}
    >
      <Mark className="h-7 w-auto shrink-0 text-paper" />
      <span className="flex items-baseline gap-[0.3em] font-display text-[1.375rem] leading-none tracking-[-0.01em]">
        <span className="text-paper">TaxWise</span>
        <span className="text-mist transition-colors duration-300 group-hover:text-paper">
          Consultants
        </span>
      </span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scrollspy — only meaningful on the homepage, where the sections live.
  useEffect(() => {
    if (pathname !== "/") {
      setActive(null);
      return;
    }
    const ids = nav.map((i) => i.href.split("#")[1]).filter(Boolean);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Close the panel on Escape, and lock the page behind it. Lenis drives the
  // scroll itself, so `overflow: hidden` alone leaves the page scrolling
  // behind the open panel — it has to be stopped directly.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // The panel unmounts on close; without this, focus inside it is
      // destroyed with it and falls to <body>, so the next Tab restarts from
      // the top of the document.
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setScrollLocked(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      setScrollLocked(false);
    };
  }, [open]);

  const pill = scrolled || open;

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-50">
      {/* Reading progress — the ledger line that fills as you go */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: reduce ? 1 : progress }}
        className="absolute left-0 top-0 z-10 h-[2px] w-full origin-left bg-gold/70"
      />

      <div
        data-pill={pill ? "true" : undefined}
        className={`nav-shell transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pill
            ? "mx-3 mt-3 rounded-2xl border border-paper-12 bg-ink/70 shadow-[0_24px_70px_-32px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:mx-6 lg:mx-10"
            : "mx-0 mt-0 rounded-none border border-transparent bg-transparent"
        }`}
      >
        <Container>
          <div
            className={`flex items-center justify-between gap-6 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              pill ? "h-[3.75rem]" : "h-[4.5rem]"
            }`}
          >
            <Wordmark />

            <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
              {nav.map((item) => {
                const id = item.href.split("#")[1];
                const isActive = active === id;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    data-active={isActive || undefined}
                    aria-current={isActive ? "true" : undefined}
                    className={`nav-link relative rounded-sm py-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                      isActive ? "text-paper" : "text-paper-64 hover:text-gold-lit"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <Magnetic strength={0.3}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sheen block rounded-full border border-paper-12 bg-paper-06 px-5 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:border-gold hover:text-gold-lit"
                >
                  Book a consultation
                </a>
              </Magnetic>
            </nav>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-sm lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 block h-px w-6 bg-paper transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-6 bg-paper transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </Container>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={reduce ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduce ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-paper-12 lg:hidden"
            >
              <Container>
                <nav aria-label="Primary" className="flex flex-col py-6">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="border-b border-paper-12 py-4 font-display text-2xl text-paper"
                    >
                      {item.label}
                    </a>
                  ))}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="mt-6 rounded-full border border-paper-40 px-6 py-3.5 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper"
                  >
                    Book a consultation
                  </a>
                </nav>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
