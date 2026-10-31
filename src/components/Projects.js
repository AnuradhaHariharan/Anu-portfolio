import React from "react";
import { projects } from "../data/content";
import "./Projects.css";

export default function Projects() {

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="projects-title">Side projects</h2>
          <p>Things I built outside work to try ideas end to end.</p>
        </div>

        <ul role="list" className="project-list">
          {projects.map((p) => (
            <li key={p.name} className="project">
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <p className="stack-line">
                <span className="sr-only">Built with: </span>
                {p.stack.join(" / ")}
              </p>
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
