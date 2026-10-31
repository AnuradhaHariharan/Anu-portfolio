import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { describe } from "./inspect";

/**
 * Draws a DevTools-style box model over `target` and a tooltip with what
 * the inspector found. Purely visual: screen readers get the same facts
 * through the live region in <Inspector>.
 */
export default function Overlay({ target, label = "Inspecting", animate = false, showTip = true }) {
  const [info, setInfo] = useState(null);
  const tipRef = useRef(null);
  const [tipPos, setTipPos] = useState({ left: 0, top: 0, above: false });

  useEffect(() => {
    if (!target) {
      setInfo(null);
      return undefined;
    }
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (target.isConnected) setInfo(describe(target));
      });
    };
    update();
    const late = setTimeout(update, 900); // after entrance animations settle
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);
    const ro = "ResizeObserver" in window ? new ResizeObserver(update) : null;
    ro?.observe(target);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(late);
      window.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [target]);

  useLayoutEffect(() => {
    if (!info || !showTip || !tipRef.current) return;
    const tip = tipRef.current.getBoundingClientRect();
    const { rect, box } = info;
    const gap = 10;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const below = rect.bottom + box.margin[2] + gap;
    const above = rect.top - box.margin[0] - gap - tip.height;
    const fitsBelow = below + tip.height < vh;
    const top = fitsBelow || above < 0 ? Math.min(below, vh - tip.height - 8) : above;
    const left = Math.max(8, Math.min(rect.left, vw - tip.width - 8));
    setTipPos({ left, top: Math.max(8, top), above: !fitsBelow && above >= 0 });
  }, [info, showTip]);

  if (!info) return null;
  const { rect, box } = info;
  const [mt, mr, mb, ml] = box.margin;
  const [pt, pr, pb, pl] = box.padding;
  const [bt, br, bb, bl] = box.border;

  const marginStyle = {
    left: rect.left - ml,
    top: rect.top - mt,
    width: rect.width + ml + mr,
    height: rect.height + mt + mb,
    borderWidth: `${mt}px ${mr}px ${mb}px ${ml}px`,
  };
  const paddingStyle = {
    left: rect.left + bl,
    top: rect.top + bt,
    width: Math.max(0, rect.width - bl - br),
    height: Math.max(0, rect.height - bt - bb),
    borderWidth: `${pt}px ${pr}px ${pb}px ${pl}px`,
  };

  return (
    <div className={`ix-overlay${animate ? " ix-overlay--intro" : ""}`} aria-hidden="true" data-inspector-ui>
      <div className="ix-margin" style={marginStyle} />
      <div className="ix-padding" style={paddingStyle} />
      <div className="ix-outline" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }} />
      {showTip && (
      <div ref={tipRef} className="ix-tip" style={{ left: tipPos.left, top: tipPos.top }}>
        <div className="ix-tip-head">
          <span className="ix-sel">{info.selector}</span>
          <span className="ix-size">
            {info.width} × {info.height}
          </span>
        </div>
        <InfoList info={info} />
        <p className="ix-label">{label}</p>
      </div>
      )}
    </div>
  );
}

export function InfoList({ info, className = "ix-rows" }) {
  return (
    <dl className={className}>
      {info.font && (
        <div>
          <dt>Font</dt>
          <dd>{info.font}</dd>
        </div>
      )}
      {info.contrast && (
        <div>
          <dt>Contrast</dt>
          <dd>
            <span className="ix-swatch" style={{ background: info.contrast.bg, color: info.contrast.fg }}>
              Aa
            </span>
            {info.contrast.ratio.toFixed(2)}:1
            <span className={`ix-badge ${info.contrast.pass ? "is-pass" : "is-fail"}`}>
              {info.contrast.pass ? "AA pass" : "AA fail"}
            </span>
          </dd>
        </div>
      )}
      <div>
        <dt>Role</dt>
        <dd>{info.role}</dd>
      </div>
      {info.name && (
        <div>
          <dt>Name</dt>
          <dd className="ix-name">{info.name}</dd>
        </div>
      )}
    </dl>
  );
}
