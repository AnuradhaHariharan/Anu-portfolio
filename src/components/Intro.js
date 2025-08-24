import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/Intro.css";
import FadeInSection from "./FadeInSection";
import SocialIcons from "./SocialIcons.js";
import ImageComponent from "./IntroImg.js";
import NavBar from "./NavBar.js";

const Intro = () => {
  useLocation();

  return (
    <section id="intro" className="intro-section">
      <NavBar />

      {/* fixed left rail */}
      <SocialIcons />

      <FadeInSection>
      <h1 className="intro-lead">
        I believe in a <span className="lead-accent">user-centered design</span> approach, ensuring
        that every project I work on is tailored to meet the specific needs of its users.
      </h1>
      </FadeInSection>

      {/* BELOW: image left | content right */}
      <div className="intro-grid">
        {/* LEFT: Image */}
        <div className="intro-col intro-media">
          <figure className="image-frame">
            <ImageComponent />
          </figure>
        </div>

        {/* RIGHT: Copy */}
        <div className="intro-col intro-copy">
          <div className="intro-copy-inner">
            <FadeInSection>
              <p className="intro-kicker">This is me.</p>
              <h2 className="intro-heading">Hi, I’m Anuradha.</h2>

              <p className="intro-paragraph">
              I’m a frontend developer focused on performance, accessibility, and clean UI. I turn ideas into interfaces that feel fast and intuitive across devices. I translate product goals into scalable components, collaborate closely with design, and ship with a focus on usability, maintainability, and measurable impact
              </p>
              <div className="cta-row">
            <a className="btn btn-accent" href="#contact">HIRE ME</a>
          </div>

            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
