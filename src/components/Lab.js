import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "../hooks";
import "./Lab.css";

// Deterministic fake price data so the chart looks the same every time.
function makeCandles(n = 40) {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  let price = 100;
  return Array.from({ length: n }, () => {
    const open = price;
    const close = open + (rand() - 0.48) * 6;
    const high = Math.max(open, close) + rand() * 3;
    const low = Math.min(open, close) - rand() * 3;
    price = close;
    return { open, close, high, low };
  });
}

const STRATEGIES = {
  old: { label: "40 sequential requests", requests: 40, each: 40 }, // ~1.6s
  new: { label: "1 request", requests: 1, each: 150 }, // ~0.15s
};

function Chart({ candles, shown }) {
  const w = 400;
  const h = 150;
  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const y = (v) => h - 8 - ((v - min) / (max - min)) * (h - 16);
  const step = w / candles.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="lab-chart" aria-hidden="true" focusable="false">
      {candles.slice(0, shown).map((c, i) => {
        const up = c.close >= c.open;
        const x = i * step + step / 2;
        return (
          <g key={i} className={up ? "up" : "down"}>
            <line x1={x} x2={x} y1={y(c.high)} y2={y(c.low)} />
            <rect
              x={x - step * 0.32}
              width={step * 0.64}
              y={y(Math.max(c.open, c.close))}
              height={Math.max(1.5, Math.abs(y(c.open) - y(c.close)))}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function Lab() {
  const candles = useMemo(() => makeCandles(), []);
  const reduced = useReducedMotion();
  const [run, setRun] = useState(null); // { key, done, elapsed }
  const [status, setStatus] = useState("");
  const timers = useRef([]);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const start = (key) => {
    clear();
    const s = STRATEGIES[key];
    const total = s.requests * s.each;
    const finish = () => {
      setRun({ key, done: s.requests, elapsed: total });
      setStatus(`Chart loaded with ${s.label} in ${(total / 1000).toFixed(2)} seconds.`);
    };
    setStatus(`Loading the chart with ${s.label}.`);
    if (reduced) {
      finish();
      return;
    }
    setRun({ key, done: 0, elapsed: 0 });
    for (let i = 1; i <= s.requests; i += 1) {
      timers.current.push(
        setTimeout(() => {
          if (i === s.requests) finish();
          else setRun({ key, done: i, elapsed: i * s.each });
        }, i * s.each)
      );
    }
  };

  const s = run && STRATEGIES[run.key];
  const shown = !run ? 0 : run.key === "new" ? (run.done ? candles.length : 0) : run.done;
  const finished = s && run.done === s.requests;

  return (
    <section id="lab" className="section lab" aria-labelledby="lab-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="lab-title">Case study: one request instead of forty</h2>
          <p>
            A replay of a fix I shipped. The same chart, loaded the way it used to be and the way it is now. Timings
            match the before and after numbers from production.
          </p>
        </div>

        <div className="lab-grid">
          <div className="lab-controls">
            <button type="button" className="btn btn--ghost" onClick={() => start("old")} aria-pressed={run?.key === "old"}>
              Load with 40 requests
            </button>
            <button type="button" className="btn" onClick={() => start("new")} aria-pressed={run?.key === "new"}>
              Load with 1 request
            </button>
            <p className="lab-note">
              Each request had to wait for the one before it, so the chart filled in slowly. Asking the server for
              ready-made bars in one call made it about 11x faster.
            </p>
          </div>

          <div className="lab-stage">
            <div className="lab-readout">
              <span>
                Requests: <strong>{run ? run.done : 0}</strong>
                {s ? ` of ${s.requests}` : ""}
              </span>
              <span>
                Time: <strong>{run ? (run.elapsed / 1000).toFixed(2) : "0.00"}s</strong>
              </span>
              {finished && <span className="lab-done">Done</span>}
            </div>
            <div className="lab-waterfall" aria-hidden="true">
              {s &&
                Array.from({ length: s.requests }, (_, i) => (
                  <span
                    key={`${run.key}-${i}`}
                    className={`wf${i < run.done ? " is-done" : ""}`}
                    style={{
                      left: `${((i * s.each) / 1600) * 100}%`,
                      width: `${Math.max(0.6, (s.each / 1600) * 100)}%`,
                      top: run.key === "old" ? `${(i % 20) * 5}%` : "45%",
                    }}
                  />
                ))}
            </div>
            <div className="lab-chart-wrap">
              {run ? <Chart candles={candles} shown={shown} /> : <p className="lab-empty">Pick a strategy to load the chart.</p>}
            </div>
          </div>
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </section>
  );
}
