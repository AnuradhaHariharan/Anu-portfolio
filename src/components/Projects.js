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
      expanded: true,
      activeKey: "1"
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(eventKey) {
    this.setState({
      activeKey: eventKey
    });
  }

  render() {
    const projects = {
      "Wanderlust": {
        desc: "A travel website where you can book destinations and explore various travel options. This project was created to learn advanced CSS and SCSS techniques.",
        techStack: "CSS/SCSS",
        link: "https://github.com/AnuradhaHariharan/wanderlust_project/tree/master",
        open: "https://anuradhahariharan.github.io/wanderlust_project/"
      },
      "AirbnbX": {
        desc: "A full-stack application inspired by Airbnb, featuring Express.js for the backend and a sleek front-end design. This project aims to provide a seamless booking experience, allowing users to explore and book various destinations with ease.",
        techStack: "Node.js, Express.js, HTML / CSS",
        link: "https://github.com/AnuradhaHariharan/Airbnb",
        open: "",
        spinner: true // Add spinner key here
      },
      "Anime Games Hub": {
        desc: "A website that combines my passion for anime and learning JavaScript to create interactive anime-themed games. It showcases a blend of anime aesthetics and coding skills.",
        techStack: "HTML, CSS,JavaScript",
        link: "https://github.com/AnuradhaHariharan/anime-hub",
        open:"https://anuradhahariharan.github.io/anime-hub/"
      },
      "EcomX": {
        desc: "A backend system designed for an e-commerce website, focusing on managing user interactions and product data to deliver a smooth and efficient shopping experience.",
        techStack: "Java, Spring Boot, MySQL",
        link: "https://github.com/AnuradhaHariharan/e-commerce_website",
        open:""
      },
      "Vaccination Booking System": {
        desc: "Designed a vaccination booking system with a monolithic architecture.",
        techStack: "Java, Spring boot, MySQL , Hibernate",
        link: "https://github.com/AnuradhaHariharan/VaccinationBookingSystem",
        open: ""
      },
      "": {
        desc: "Loading..",
        techStack: "",
        link: "https://github.com/AnuradhaHariharan",
        open: "",
        spinner:true
      }
    };

    return (
      <div id="projects">
        <div className="shining-button-container">
          <ShiningButton>PROJECTS</ShiningButton>
        </div>
        <div className="section-header">
          <span className="section-title">Code & Coffee: My Project Gallery &#x2615;👩‍💻</span>
        </div>
        <div className="project-container">
          <ul className="projects-grid">
            {Object.keys(projects).map((key, i) => (
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
        </div>
      </div>
    );
  }
}

export default Projects;