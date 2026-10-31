import React, { useEffect, useRef, useState } from "react";
import Overlay from "./Overlay";
import { describe, pickTarget, spokenSummary } from "./inspect";
import "./inspector.css";

/**
 * Page-wide inspect mode. Hover, tap or Tab to any element to see its box
 * model, contrast and accessible name. Clicks are captured (like DevTools)
 * so links don't navigate while inspecting. Esc exits.
 */
export default function Inspector({ active, onExit }) {
  const [target, setTarget] = useState(null);
  const [message, setMessage] = useState("");
  const pinned = useRef(false);
  const frame = useRef(0);

  useEffect(() => {
    if (!active) {
      setTarget(null);
      pinned.current = false;
      return undefined;
    }

    document.documentElement.classList.add("is-inspecting");
    setMessage("Inspect mode on. Hover, tap or press Tab to reach any element. Press Escape to exit.");

    const announce = (el) => {
      if (el) setMessage(spokenSummary(describe(el)));
    };

    const onMove = (e) => {
      if (pinned.current || e.pointerType === "touch") return;
      cancelAnimationFrame(frame.current);
      const node = e.target;
      frame.current = requestAnimationFrame(() => {
        const el = pickTarget(node);
        if (el) setTarget(el);
      });
    };

    const onFocus = (e) => {
      const el = pickTarget(e.target);
      if (!el) return;
      pinned.current = false;
      setTarget(el);
      announce(el);
    };

    const onClick = (e) => {
      if (e.target.closest("[data-inspector-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      const el = pickTarget(e.target);
      if (!el) return;
      pinned.current = true;
      setTarget(el);
      announce(el);
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onExit();
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("focusin", onFocus);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame.current);
      document.documentElement.classList.remove("is-inspecting");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, onExit]);

  // Announce exit too, so the state change is never silent.
  const wasActive = useRef(active);
  useEffect(() => {
    if (wasActive.current && !active) setMessage("Inspect mode off.");
    wasActive.current = active;
  }, [active]);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite">
        {message}
      </div>
      {active && (
        <>
          <Overlay target={target} label={pinned.current ? "Pinned. Tap another element or press Esc." : "Inspect mode"} />
          <div className="ix-bar" data-inspector-ui>
            <p>
              <strong>Inspect mode.</strong> Hover, tap or <kbd>Tab</kbd> to any element.
              <span className="ix-bar-hint"> Links won't open until you exit.</span>
            </p>
            <button type="button" className="btn" onClick={onExit}>
              Exit <kbd className="ix-kbd">Esc</kbd>
            </button>
          </div>
        </>
      )}
    </>
  );
}
