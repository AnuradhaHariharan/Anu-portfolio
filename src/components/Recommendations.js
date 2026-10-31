import React from "react";
import { recommendations } from "../data/content";
import "./Recommendations.css";

export default function Recommendations() {
  return (
    <section id="recommendations" className="section recs" aria-labelledby="recs-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="recs-title">What people I've worked with say</h2>
        </div>
        <ul role="list" className="rec-list">
          {recommendations.map((r) => (
            <li key={r.name}>
              <figure className="rec">
                <blockquote>
                  <p>“{r.quote}”</p>
                </blockquote>
                <figcaption>
                  <picture>
                    <source srcSet={`${r.photo}.webp`} type="image/webp" />
                    <img src={`${r.photo}.jpg`} alt="" width="56" height="56" loading="lazy" decoding="async" />
                  </picture>
                  <span>
                    <strong>{r.name}</strong>
                    <span className="rec-role">{r.role}</span>
                    {r.worked && <span className="rec-role">{r.worked}</span>}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
