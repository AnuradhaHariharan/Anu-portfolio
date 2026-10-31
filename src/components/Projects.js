import React, { useMemo, useState } from "react";
import { projects } from "../data/content";
import "./Projects.css";

export default function Projects() {
  const tags = useMemo(() => ["All", ...new Set(projects.flatMap((p) => p.stack))], []);
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.stack.includes(filter));

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="projects-title">Side projects</h2>
          <p>Things I built outside work to try ideas end to end.</p>
        </div>

        <div className="filter" role="group" aria-label="Filter projects by technology">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              className="filter-btn"
              aria-pressed={filter === t}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
          {filter === "All" ? "" : ` using ${filter}`}.
        </p>

        <ul role="list" className="project-list">
          {shown.map((p) => (
            <li key={p.name} className="project">
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <ul role="list" className="chip-list" aria-label="Built with">
                {p.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
              {(p.live || p.code) && (
                <p className="project-links">
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer">
                      Open {p.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                  {p.code && (
                    <a href={p.code} target="_blank" rel="noopener noreferrer">
                      View code
                      <span className="sr-only"> for {p.name} on GitHub (opens in a new tab)</span>
                    </a>
                  )}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
