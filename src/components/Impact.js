import React from "react";
import { impact } from "../data/content";
import "./Impact.css";

function Bars({ item }) {
  const max = Math.max(item.before, item.after);
  const pct = (n) => `${Math.max(3, (n / max) * 100)}%`;
  return (
    <div className="bars" aria-hidden="true">
      <div className="bar-row">
        <span className="bar-key">Before</span>
        <span className="bar-track">
          <span className="bar is-before" style={{ "--w": pct(item.before) }} />
        </span>
        <span className="bar-val">{item.beforeLabel}</span>
      </div>
      <div className="bar-row">
        <span className="bar-key">After</span>
        <span className="bar-track">
          <span className="bar is-after" style={{ "--w": pct(item.after) }} />
        </span>
        <span className="bar-val">{item.afterLabel}</span>
      </div>
    </div>
  );
}

export default function Impact() {
  return (
    <section id="work" className="section impact" aria-labelledby="impact-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="impact-title">What my work changed</h2>
          <p>Measured in production, on products real people use every day.</p>
        </div>
        <ul role="list" className="impact-list">
          {impact.map((item) => (
            <li key={item.id} className="impact-item">
              <Bars item={item} />
              <div className="impact-text">
                <h3>{item.summary}</h3>
                <p>{item.detail}</p>
                <p className="impact-where">At {item.where}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
