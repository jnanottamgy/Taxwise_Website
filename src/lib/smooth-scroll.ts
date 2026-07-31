import type Lenis from "lenis";

/**
 * A handle on the page's Lenis instance.
 *
 * Lenis drives scrolling itself rather than deferring to the browser, so
 * `overflow: hidden` on the body does not stop it — anything that needs to
 * lock the page (the mobile menu) has to tell Lenis directly.
 */
let instance: Lenis | null = null;

export function registerLenis(l: Lenis | null) {
  instance = l;
}

/** Locks or releases page scrolling. A no-op when Lenis is not running. */
export function setScrollLocked(locked: boolean) {
  if (!instance) return;
  if (locked) instance.stop();
  else instance.start();
}
