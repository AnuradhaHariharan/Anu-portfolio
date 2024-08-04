import React from "react";
import "../styles/Experience.css";
import FadeInSection from "./FadeInSection";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import ShiningButton from "./Badge";

class Experience extends React.Component {
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

  renderTooltip(text) {
    return (
      <Tooltip id={`tooltip-${text}`}>
        {text}
      </Tooltip>
    );
  }

  render() {
    return (
      <div id="skills">
         <div className="shining-button-container">
          <ShiningButton>SKILLS</ShiningButton>
        </div>
        <FadeInSection>
          <div className="section-header">
            <span className="section-title">Skills and Experience 👩‍💻</span>
          </div>
        </FadeInSection>
        <div className="experience-container">
          <div className="experience-column tech-stack">
            <div className="tech-stack-row">
              <div className="tech-stack-item">
                <img src="/assets/icons8-sass-avatar.svg" alt="Sass" />
                <div className="tech-stack-name">Sass</div>
              </div>
              <div className="tech-stack-item">
                <img src="/assets/icons8-javascript.svg" alt="JavaScript" />
                <div className="tech-stack-name">JavaScript</div>
              </div>
              <div className="tech-stack-item">
                <img src="/assets/icons8-html5.svg" alt="HTML5" />
                <div className="tech-stack-name">HTML5</div>
              </div>
            </div>
            <div className="tech-stack-row">
              <div className="tech-stack-item">
                <img src="/assets/icons8-java.svg" alt="Java" />
                <div className="tech-stack-name">Java</div>
              </div>
              <div className="tech-stack-item">
                <img src="/assets/icons8-spring-boot.svg" alt="Spring Boot" />
                <div className="tech-stack-name">Spring Boot</div>
              </div>
              <div className="tech-stack-item">
                <img src="/assets/logo-mysql-170x115.png" alt="MySQL" />
                <div className="tech-stack-name">MySQL</div>
              </div>
            </div>
            <div className="tech-stack-row">
              <div className="tech-stack-item">
                <img src="/assets/react.png" alt="React" />
                <div className="tech-stack-name">React</div>
              </div>
              <div className="tech-stack-item">
                <img src="/assets/icons8-css3.svg" alt="CSS3" />
                <div className="tech-stack-name">CSS3</div>
              </div>
              <div className="tech-stack-item">
                <img src="/assets/icons8-webpack.svg" alt="Webpack" />
                <div className="tech-stack-name">Webpack</div>
              </div>
            </div>
          </div>
          <div className="experience-column duration">
            <div>May 2024 - July 2024 <span className="company">Fyle</span></div>
            <div></div>
            <div></div>
          </div>
          <div className="experience-column company-name">
            <OverlayTrigger
              placement="top"
              overlay={this.renderTooltip("As a front-end engineering intern, I was instrumental in implementing new pages, enhancing user interfaces, and performing critical troubleshooting to resolve front-end issues. I also contributed to a significant website revamp, which involved refining the overall design and user experience.")}
            >
              <div>Fyle</div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={this.renderTooltip("A backend system designed for an e-commerce website, focusing on managing user interactions and product data to deliver a smooth and efficient shopping experience.")}
            >
              <div></div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={this.renderTooltip("Built my personal portfolio and worked on minor projects to strengthen my React skills, focusing on component design and state management.")}
            >
              <div></div>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    );
  }
}

export default Experience;