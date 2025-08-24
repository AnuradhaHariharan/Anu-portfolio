import React from "react";
import "../styles/Experience.css";

const CATEGORIES = [
  {
    key: "frontend",
    title: "Frontend",
    items: [
      { name: "React",       image: `${process.env.PUBLIC_URL}/assets/react.png` },
      { name: "JavaScript",  image: `${process.env.PUBLIC_URL}/assets/icons8-javascript.svg` },
      { name: "HTML5",       image: `${process.env.PUBLIC_URL}/assets/icons8-html5.svg` },
      { name: "CSS3",        image: `${process.env.PUBLIC_URL}/assets/icons8-css3.svg` },
      { name: "Sass",        image: `${process.env.PUBLIC_URL}/assets/icons8-sass-avatar.svg` },
    ],
  },
  {
    key: "backend",
    title: "Backend",
    items: [
      { name: "Node.js",     image: `${process.env.PUBLIC_URL}/assets/icons8-node-js.svg` },
      { name: "Express.js",  image: `${process.env.PUBLIC_URL}/assets/icons8-express-js.svg` },
      { name: "Java",        image: `${process.env.PUBLIC_URL}/assets/icons8-java.svg` },
    ],
  },
  {
    key: "database",
    title: "Database",
    items: [
      { name: "MongoDB",     image: `${process.env.PUBLIC_URL}/assets/mongodb.svg` },
      { name: "MySQL",       image: `${process.env.PUBLIC_URL}/assets/logo-mysql-170x115.png` },
    ],
  },
  {
    key: "tools",
    title: "Tools",
    items: [
      { name: "Git",         image: `${process.env.PUBLIC_URL}/assets/git.png` },
    ],
  },
];

export default function Experience() {
  return (
    <section id="skills" className="stack-section" aria-labelledby="stack-title">
      <div className="section-header">
      <span className="star-container" aria-hidden="true">
    ★
  </span>
      <h2 id="stack-title" className="stack-heading">My Stack</h2>
      </div>

      <div className="stack-rows">
        {CATEGORIES.map((cat) => (
          <div className="stack-row" key={cat.key}>
            {/* Fixed, visible label (span to avoid global h3 rules) */}
            <div className="stack-label-wrap">
              <span className="stack-label" id={`${cat.key}-label`}>
                {cat.title}
              </span>
            </div>

            {/* Static chip list */}
            <div className="stack-list" role="group" aria-labelledby={`${cat.key}-label`}>
              {cat.items.map((item) => (
                <div className="stack-item" key={`${cat.key}-${item.name}`}>
                  <span className="stack-icon" aria-hidden="true">
                    <img
                      src={item.image}
                      alt=""
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  </span>
                  <span className="stack-name">{item.name}</span>
                </div>
              ))}
            </div>

            {/* Screen-reader only list (not visible) */}
            <ul className="sr-only" aria-label={`${cat.title} technologies`}>
              {cat.items.map((it) => (
                <li key={`${cat.key}-sr-${it.name}`}>{it.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

