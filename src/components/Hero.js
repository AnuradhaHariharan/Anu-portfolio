import React, { useEffect, useRef, useState } from "react";
import Overlay, { InfoList } from "./inspector/Overlay";
import { describe, pickTarget } from "./inspector/inspect";
import { profile } from "../data/content";
import "./Hero.css";

function BoxModel({ box, width, height }) {
  const v = (n) => (n ? Math.round(n) : "–");
  const [mt, mr, mb, ml] = box.margin;
  const [pt, pr, pb, pl] = box.padding;
  return (
    <div className="bm" aria-hidden="true">
      <div className="bm-layer bm-m">
        <span className="bm-tag">margin</span>
        <span className="bm-t">{v(mt)}</span>
        <span className="bm-r">{v(mr)}</span>
        <span className="bm-b">{v(mb)}</span>
        <span className="bm-l">{v(ml)}</span>
        <div className="bm-layer bm-p">
          <span className="bm-tag">padding</span>
          <span className="bm-t">{v(pt)}</span>
          <span className="bm-r">{v(pr)}</span>
          <span className="bm-b">{v(pb)}</span>
          <span className="bm-l">{v(pl)}</span>
          <div className="bm-c">
            {width} × {height}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ inspecting, onStartInspect }) {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const titleRef = useRef(null);
  const [target, setTarget] = useState(null);
  const [info, setInfo] = useState(null);
  const [visible, setVisible] = useState(true);

  // Default to the headline once fonts have settled, so measurements are right.
  useEffect(() => {
    const set = () => setTarget(titleRef.current);
    if (document.fonts?.ready) document.fonts.ready.then(set);
    else set();
  }, []);

  useEffect(() => {
    if (!target) return undefined;
    const update = () => setInfo(describe(target));
    update();
    const late = setTimeout(update, 900);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(late);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio > 0.35), {
      threshold: [0, 0.35, 0.6],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const follow = (e) => {
    const el = pickTarget(e.target);
    if (el && copyRef.current?.contains(el) && el !== copyRef.current) setTarget(el);
  };

  return (
    <section id="top" ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div
          ref={copyRef}
          className="hero-copy"
          onPointerOver={follow}
          onFocus={follow}
          onPointerLeave={() => setTarget(titleRef.current)}
        >
          <p className="hero-hello">Anuradha Hariharan, frontend engineer</p>
          <h1 id="hero-title" ref={titleRef} className="hero-title">
            I design frontend systems that stay fast and accessible as they grow.
          </h1>
          <p className="hero-sub">
            {profile.experience} building React and Next.js products: shared component libraries, real-time trading
            interfaces, micro-frontends and the releases behind them. Currently at Rupeezy in Bengaluru.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn" onClick={onStartInspect} data-inspector-ui>
              Inspect this page
            </button>
            <a className="hero-resume" href={profile.resume} download>
              Download resume
            </a>
          </div>
        </div>

        <div className="hero-panel" role="group" aria-label="Element inspector preview">
          {info ? (
            <div className="panel-body">
              <p className="panel-sel">
                <code>{info.selector}</code>
              </p>
              <BoxModel box={info.box} width={info.width} height={info.height} />
              <InfoList info={info} className="ix-rows panel-rows" />
              <p className="panel-hint">Point at any text on the left to inspect it.</p>
            </div>
          ) : (
            <div className="panel-body panel-loading">Measuring…</div>
          )}
        </div>
      </div>
      {visible && !inspecting && <Overlay target={target} animate showTip={false} />}
    </section>
  );
}
