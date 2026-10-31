import React, { useRef, useState } from "react";
import { jobs, skills } from "../data/content";
import { useMediaQuery } from "../hooks";
import "./Experience.css";

/**
 * WAI-ARIA tabs with automatic activation: arrow keys move focus and
 * select. Home/End jump to the first and last role.
 */
export default function Experience() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef([]);
  const wide = useMediaQuery("(min-width: 52rem)");

  const onKeyDown = (e, i) => {
    const last = jobs.length - 1;
    let next = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next !== null) {
      e.preventDefault();
      setSelected(next);
      tabs.current[next]?.focus();
    }
  };

  const job = jobs[selected];

  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="exp-title">Experience</h2>
          <p>
            Four teams since 2024: a stock broker, a SaaS product, a ride-hailing startup and an expense
            platform. Pick a role to see what I owned there.
          </p>
        </div>

        <div className="exp">
          <div role="tablist" aria-label="Roles" aria-orientation={wide ? "vertical" : "horizontal"} className="exp-tabs">
            {jobs.map((j, i) => (
              <button
                key={j.id}
                ref={(el) => (tabs.current[i] = el)}
                role="tab"
                type="button"
                id={`tab-${j.id}`}
                aria-selected={i === selected}
                aria-controls={`panel-${j.id}`}
                tabIndex={i === selected ? 0 : -1}
                className="exp-tab"
                onClick={() => setSelected(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                <span className="exp-tab-company">{j.company}</span>
                <span className="exp-tab-dates">
                  {j.start} to {j.end}
                </span>
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`panel-${job.id}`}
            aria-labelledby={`tab-${job.id}`}
            tabIndex={0}
            className="exp-panel"
            key={job.id}
          >
            <h3>
              {job.title} at {job.company}
            </h3>
            <p className="exp-meta">
              {job.start} to {job.end}. {job.context}
            </p>
            <p className="exp-focus">
              <span>Focus:</span> {job.focus}
            </p>
            <ul className="exp-points">
              {job.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <ul role="list" className="chip-list" aria-label="Tools used">
              {job.stack.map((s) => (
                <li className="chip" key={s}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="toolkit">
          <h3 id="toolkit-title">Toolkit</h3>
          <dl className="toolkit-grid" aria-labelledby="toolkit-title">
            {skills.map((g) => (
              <div key={g.group}>
                <dt>{g.group}</dt>
                <dd>{g.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
