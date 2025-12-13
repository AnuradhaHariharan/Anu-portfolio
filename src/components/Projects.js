import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import ExternalLinks from "./ExternalLinks";

class Projects extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      activeKey: "1",
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({ activeKey: eventKey });
  }

  toggleExpand() {
    this.setState((prev) => ({ expanded: !prev.expanded }));
  }

  render() {
    const projects = {
      TaskBuddy: {
        desc:
          "TaskBuddy is a task management application built with React & TypeScript, featuring task creation, editing, filtering, and multiple view modes. The app supports Google authentication.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/task-manager",
        open: "https://task-manager-6432a.web.app/",
      },
      "Analytics Dashboard": {
        desc:
          "A data-driven analytics dashboard offering real-time visualisation of business metrics like revenue, user activity, and conversion rates using Chart.js.",
        techStack: "React, Chart.js, CSS/SCSS",
        link: "https://github.com/AnuradhaHariharan/e-commerce_website",
        open: "https://anuradhahariharan.github.io/seller-app/",
      },
      "Anime Games Hub": {
        desc:
          "Interactive anime-themed mini games—a playful way to sharpen JS while blending anime aesthetics.",
        techStack: "HTML, CSS, JavaScript",
        link: "https://github.com/AnuradhaHariharan/anime-hub",
        open: "https://anuradhahariharan.github.io/anime-hub/",
      },
      Tomato: {
        desc:
          "Full-stack food delivery app with auth, Stripe payments, and an admin panel to manage items and order statuses.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/food-del",
        open: "https://food-del-1-o79x.onrender.com/",
      },
      "Tomato Admin Panel": {
        desc:
          "Admin portal to add/delete items, view user orders, and change order statuses for the Tomato app.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/food-del",
        open: "https://food-del-admin-fouz.onrender.com/orders",
      },
      "Submission Desk": {
        desc:
          "Student assignment portal with secure login/signup for streamlined submission tracking and management.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/growthX",
        open: "https://growthx-1-portal-student.onrender.com/",
      },
      "Submission Desk Admin Panel": {
        desc:
          "Admin panel to review, approve, or reject assignments with simple, trackable workflows.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/growthX",
        open: "https://growthx-1-admin.onrender.com/",
      },
      Wanderlust: {
        desc:
          "Travel site concept for booking and discovery—built to practice advanced CSS and SCSS patterns.",
        techStack: "CSS/SCSS",
        link: "https://github.com/AnuradhaHariharan/wanderlust_project/tree/master",
        open: "https://anuradhahariharan.github.io/wanderlust_project/",
      },
      "Geo Mappy": {
        desc:
          "Distance API + UI using Great Circle Distance; drag-drop points on a world map to measure routes.",
        techStack: "HTML5, CSS3, JavaScript, DistanceAlgorithms",
        link: "https://github.com/AnuradhaHariharan/arcgis-measurement-app",
        open: "https://anuradhahariharan.github.io/arcgis-measurement-app/",
      },
      EcomX: {
        desc:
          "Backend for an e-commerce experience focused on product data and user interactions.",
        techStack: "Java, Spring Boot, MySQL",
        link: "https://github.com/AnuradhaHariharan/e-commerce_website",
        open: "",
      },
    };

    const keys = Object.keys(projects);
    const visibleKeys = this.state.expanded ? keys : keys.slice(0, 6);

    return (
      <section id="projects" className="projects-section" aria-labelledby="projects-title">
        <FadeInSection>
          <div className="section-header">
          <span className="star-container" aria-hidden="true">
    ★
  </span>
            <h2 id="projects-title" className="projects-title">
              Projects I’ve Built
            </h2>
          </div>
        </FadeInSection>

        <div className="projects-grid">
          {visibleKeys.map((key, i) => {
            const p = projects[key];
            const tech = (p.techStack || "")
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);

            return (
              <FadeInSection delay={`${i + 1}00ms`} key={key}>
                <article className="projects-card" aria-labelledby={`proj-${i}-title`}>
                  <header className="card-header">
                    <div className="folder-icon" aria-hidden="true">
                      <FolderOpenRoundedIcon style={{ fontSize: 32 }} />
                    </div>
                    <ExternalLinks
                      githubLink={p.link}
                      openLink={p.open}
                      showSpinner={p.spinner}
                    />
                  </header>

                  <h3 id={`proj-${i}-title`} className="card-title">
                    {key}
                  </h3>

                  <p className="card-desc">{p.desc}</p>

                  <footer className="card-footer">
                    <ul className="tech-list">
                      {tech.map((t, idx) => (
                        <li className="tech-chip" key={idx}>
                          {t}
                        </li>
                      ))}
                    </ul>
                  </footer>
                </article>
              </FadeInSection>
            );
          })}
        </div>

        <div className="projects-cta">
          <button className="btn-more" onClick={this.toggleExpand}>
            {this.state.expanded ? "Show Less" : "Load More"}
          </button>
        </div>
      </section>
    );
  }
}

export default Projects;

