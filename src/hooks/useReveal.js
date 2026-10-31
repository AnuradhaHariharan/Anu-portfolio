import { useEffect } from "react";

// Elements that ease in as they scroll into view. Items inside the same
// parent get a small stagger. Skipped entirely for reduced motion.
const SELECTORS = [
  ".section-head",
  ".impact-item",
  ".sys-tier",
  ".sys-detail",
  ".principles-grid > div",
  ".exp",
  ".toolkit",
  ".game-card",
  ".project",
  ".rec-list > li",
  ".contact-intro",
  ".contact-form",
].join(", ");

export default function useReveal(deps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (!("IntersectionObserver" in window)) return undefined;
    const root = document.documentElement;
    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0 }
    );

    // Safety net: never leave content hidden. Anything at or above the bottom
    // of the screen is revealed on scroll, even if the observer misses it.
    let ticking = false;
    const sweep = () => {
      ticking = false;
      const limit = window.innerHeight;
      document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => {
        if (el.getBoundingClientRect().top < limit) el.classList.add("is-in");
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(sweep);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const firstSweep = setTimeout(sweep, 400);

    const prepare = (scope) => {
      scope.querySelectorAll(SELECTORS).forEach((el) => {
        if (el.classList.contains("reveal")) return;
        const siblings = Array.from(el.parentElement?.children || []).filter((c) => c.matches(SELECTORS));
        el.style.setProperty("--i", Math.min(siblings.indexOf(el), 6));
        el.classList.add("reveal");
        io.observe(el);
      });
    };

    prepare(document);
    // Sections that mount later (lazy Lab and game) get picked up too.
    const mo = new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach((n) => n.nodeType === 1 && prepare(n.parentElement || n)));
    });
    const main = document.getElementById("main");
    if (main) mo.observe(main, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(firstSweep);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
