"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, whatsappUrl } from "@/lib/content";
import { Container } from "./Section";

function Wordmark() {
  return (
    <a
      href="#top"
      className="group flex items-baseline gap-2.5 rounded-sm"
      aria-label="TaxWise Consultants — back to top"
    >
      <span className="font-display text-[1.375rem] leading-none tracking-[-0.01em] text-paper">
        TaxWise
      </span>
      <span className="hidden font-mono text-[0.5625rem] uppercase leading-none tracking-[0.22em] text-mist transition-colors duration-300 group-hover:text-paper-80 sm:inline">
        Chartered Accountants
      </span>
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the panel on Escape, and lock the page behind it
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled || open
          ? "border-b border-paper-12 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-6">
          <Wordmark />

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative rounded-sm py-1 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper-64 transition-colors duration-300 hover:text-paper"
              >
                {item.label}
              </a>
            ))}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-paper-12 bg-paper-06 px-5 py-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:border-paper-40 hover:bg-paper-12"
            >
              Book a consultation
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-sm md:hidden"
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
            className="overflow-hidden border-t border-paper-12 md:hidden"
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
    </header>
  );
}
