// Scroll reveals: elements marked with data-reveal start hidden and animate in
// once, the first time they scroll into view. The motion itself lives in CSS;
// this file only decides *when* by adding the is-visible class.
//
// Elements are only hidden after this script adds `reveal-on` to <html>,
// so if JavaScript fails or the user prefers reduced motion, nothing is ever
// hidden in the first place.

import { useEffect, type CSSProperties } from "react";

export function useReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const root = document.documentElement;
    root.classList.add("reveal-on");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Also reveal anything already above the viewport, e.g. after
          // following a link straight to #skills, so scrolling back up
          // never shows empty space.
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      // Trigger a little before the element's top reaches the bottom 12% of
      // the screen, so the motion finishes while it's in comfortable view.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Position in a staggered group: each step delays the animation slightly. */
export const stagger = (i: number) => ({ "--i": i }) as CSSProperties;
