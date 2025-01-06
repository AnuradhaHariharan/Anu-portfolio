import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@material-ui/icons/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import ExternalLinks from "./ExternalLinks";
import ShiningButton from "./Badge";

class Projects extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false, // To control "Load More" functionality
      activeKey: "1"
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }

  toggleExpand() {
    this.setState((prevState) => ({
      expanded: !prevState.expanded
    }));
  }

  render() {
    const projects = {
      "Tomato": {
        desc: "Developed a full-stack food delivery application with user authentication, Stripe integration for payments, and an admin panel to manage food items and order statuses.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/food-del",
        open: "https://food-del-1-o79x.onrender.com/"
      },
      "Tomato Admin Panel": {
        desc: "Created an admin panel for the food delivery app where admins can add and delete food items, view user order details, and change order statuses.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/food-del",
        open: "https://food-del-admin-fouz.onrender.com/orders"
      },
      "Anime Games Hub": {
        desc: "A website that combines my passion for anime and learning JavaScript to create interactive anime-themed games. It showcases a blend of anime aesthetics and coding skills.",
        techStack: "HTML, CSS,JavaScript",
        link: "https://github.com/AnuradhaHariharan/anime-hub",
        open: "https://anuradhahariharan.github.io/anime-hub/"
      },
      "Analytics Dashboard": {
        desc: "An interactive analytics dashboard was created using React, with Chart.js integrated for real-time data visualizations.",
        techStack: "React, Chart.js, Local Storage, CSS/SCSS",
        link: "https://github.com/AnuradhaHariharan/e-commerce_website",
        open: "https://anuradhahariharan.github.io/seller-app/"
      },
      "Submission Desk": {
        desc: "An efficient and secure portal for students to submit assignments. With user-friendly login and sign-up features, it streamlines the assignment submission process, ensuring seamless tracking and management of submissions.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/growthX",
        open: "https://growthx-1-portal-student.onrender.com/"
      },
      "Submission Desk Admin Panel": {
        desc: "A comprehensive admin panel that allows administrators to view, approve, or reject student assignments, providing easy management and tracking of submissions.",
        techStack: "MongoDB, Express.js, React, Node.js",
        link: "https://github.com/AnuradhaHariharan/growthX",
        open: "https://growthx-1-admin.onrender.com/"
      },
      "Wanderlust": {
        desc: "A travel website where you can book destinations and explore various travel options. This project was created to learn advanced CSS and SCSS techniques.",
        techStack: "CSS/SCSS",
        link: "https://github.com/AnuradhaHariharan/wanderlust_project/tree/master",
        open: "https://anuradhahariharan.github.io/wanderlust_project/"
      },
      "Geo Mappy": {
        desc: "Designed an API that allows clients to measure distance between multiple geo co-ordinates, using the Great Circle Distance algorithm. UI has a drag-drop functionality to mark points on the world map.",
        techStack: "HTML5,CSS3,JavaScript,DistanceAlgorithms",
        link: "https://github.com/AnuradhaHariharan/arcgis-measurement-app",
        open: "https://anuradhahariharan.github.io/arcgis-measurement-app/"
      },
      "EcomX": {
        desc: "A backend system designed for an e-commerce website, focusing on managing user interactions and product data to deliver a smooth and efficient shopping experience.",
        techStack: "Java, Spring Boot, MySQL",
        link: "https://github.com/AnuradhaHariharan/e-commerce_website",
        open: ""
      }
    };

    // Conditionally show only the first few projects or all of them
    const visibleProjects = this.state.expanded
      ? Object.keys(projects)
      : Object.keys(projects).slice(0, 6); // Show the first 6 projects initially

    return (
      <div id="projects">
        <FadeInSection>
        <div className="shining-button-container">
          <ShiningButton>PROJECTS</ShiningButton>
        </div>
        </FadeInSection>
        <div className="section-header">
          <span className="section-title">Projects I've Built 👩‍💻</span>
        </div>
        <div className="project-container">
          <ul className="projects-grid">
            {visibleProjects.map((key, i) => (
              <FadeInSection delay={`${i + 1}00ms`} key={i}>
                <li className="projects-card">
                  <div className="card-header">
                    <div className="folder-icon">
                      <FolderOpenRoundedIcon style={{ fontSize: 35 }} />
                    </div>
                    <ExternalLinks
                      githubLink={projects[key].link}
                      openLink={projects[key].open}
                      showSpinner={projects[key].spinner}
                    />
                  </div>
                  <div className="card-title">{key}</div>
                  <div className="card-desc">{projects[key].desc}</div>
                  <div className="card-tech">{projects[key].techStack}</div>
                </li>
              </FadeInSection>
            ))}
          </ul>
          {/* Load More Button */}
          <div className="shining-button-container">
            <button className="show-more" onClick={this.toggleExpand}>
              {this.state.expanded ? "Show Less ↑" : "Load More ↓"}
            </button>

          </div>
        </div>
      </div>
    );
  }
}

export default Projects;


