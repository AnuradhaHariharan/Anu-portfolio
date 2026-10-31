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
  ".lab-grid",
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

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
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
