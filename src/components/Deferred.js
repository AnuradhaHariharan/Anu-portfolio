import React, { Suspense, useEffect, useRef, useState } from "react";

/**
 * Renders a placeholder (keeping the section id so links still work) and
 * only loads the real component when it gets near the viewport.
 */
export default function Deferred({ id, children, minHeight = "40rem", force = false }) {
  const ref = useRef(null);
  const [show, setShow] = useState(() => typeof window === "undefined" || window.location.hash === `#${id}`);

  useEffect(() => {
    if (force) setShow(true);
  }, [force]);

  useEffect(() => {
    if (show) return undefined;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShow(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  const placeholder = <div ref={ref} id={id} className="lazy-slot" style={{ minHeight }} />;
  if (!show) return placeholder;
  return <Suspense fallback={placeholder}>{children}</Suspense>;
}
