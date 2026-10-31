import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { edges, nodes, principles, tiers } from "../data/systems";
import "./Systems.css";

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
const neighbours = (id) =>
  edges.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));

export default function Systems() {
  const [selected, setSelected] = useState("trading");
  const [preview, setPreview] = useState(null);
  const [lines, setLines] = useState([]);
  const mapRef = useRef(null);
  const nodeRefs = useRef({});

  const focusId = preview || selected;
  const related = new Set(neighbours(focusId));

  // Draw connectors from the real positions of the node buttons.
  const measure = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const box = map.getBoundingClientRect();
    const next = edges
      .map(([a, b]) => {
        const ea = nodeRefs.current[a];
        const eb = nodeRefs.current[b];
        if (!ea || !eb) return null;
        const ra = ea.getBoundingClientRect();
        const rb = eb.getBoundingClientRect();
        const [top, bottom] = ra.top < rb.top ? [ra, rb] : [rb, ra];
        return {
          key: `${a}-${b}`,
          a,
          b,
          x1: top.left + top.width / 2 - box.left,
          y1: top.bottom - box.top,
          x2: bottom.left + bottom.width / 2 - box.left,
          y2: bottom.top - box.top,
        };
      })
      .filter(Boolean);
    setLines(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = "ResizeObserver" in window ? new ResizeObserver(measure) : null;
    if (mapRef.current) ro?.observe(mapRef.current);
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const active = byId[focusId];

  return (
    <section id="systems" className="section" aria-labelledby="systems-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="systems-title">Systems I work on</h2>
          <p>
            A simplified map of the frontend platform at Rupeezy. Select a part to see what it does and what it
            depends on.
          </p>
        </div>

        <div className="sys">
          <div className="sys-map" ref={mapRef}>
            <svg className="sys-lines" aria-hidden="true" focusable="false">
              {lines.map((l) => {
                const on = l.a === focusId || l.b === focusId;
                const midY = (l.y1 + l.y2) / 2;
                return (
                  <path
                    key={l.key}
                    className={on ? "is-on" : ""}
                    d={`M${l.x1},${l.y1} C${l.x1},${midY} ${l.x2},${midY} ${l.x2},${l.y2}`}
                  />
                );
              })}
            </svg>
            {tiers.map((t) => (
              <div className="sys-tier" key={t.id} role="group" aria-labelledby={`tier-${t.id}`}>
                <p className="sys-tier-label" id={`tier-${t.id}`}>
                  {t.label}
                </p>
                <div className="sys-row">
                  {nodes
                    .filter((n) => n.tier === t.id)
                    .map((n) => (
                      <button
                        key={n.id}
                        ref={(el) => (nodeRefs.current[n.id] = el)}
                        type="button"
                        className={`sys-node${n.id === focusId ? " is-active" : ""}${
                          related.has(n.id) ? " is-related" : ""
                        }`}
                        aria-pressed={n.id === selected}
                        aria-controls="sys-detail"
                        onClick={() => setSelected(n.id)}
                        onPointerEnter={() => setPreview(n.id)}
                        onPointerLeave={() => setPreview(null)}
                      >
                        <span className="sys-node-name">{n.name}</span>
                        <span className="sys-node-tech">{n.tech}</span>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div id="sys-detail" className="sys-detail" aria-live="polite">
            <h3>{active.name}</h3>
            <p className="sys-detail-tech">{active.tech}</p>
            <p>{active.detail}</p>
            {neighbours(active.id).length > 0 && (
              <p className="sys-detail-links">
                <span>Connects to </span>
                {neighbours(active.id)
                  .map((id) => byId[id].name)
                  .join(", ")}
              </p>
            )}
          </div>
        </div>

        <div className="principles">
          <h3 id="principles-title">How I approach frontend work</h3>
          <dl className="principles-grid" aria-labelledby="principles-title">
            {principles.map((p) => (
              <div key={p.title}>
                <dt>{p.title}</dt>
                <dd>{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
