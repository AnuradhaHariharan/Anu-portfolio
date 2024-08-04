import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Intro.css";
import Typist from "react-typist";
import "react-typist/dist/Typist.css";
import FadeInSection from "./FadeInSection";
import SocialIcons from "./SocialIcons.js";
import ImageComponent from "./IntroImg.js";
import ShiningButton from "./Badge.js";
import NavBar from "./NavBar.js";

const Intro = () => {
  const [isInView, setIsInView] = useState(false);
  const introRef = useRef(null);
  const location = useLocation();

  const checkIfInView = () => {
    if (introRef.current) {
      const rect = introRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      setIsInView(rect.top <= viewHeight && rect.bottom >= 0);
    }
  };

  useEffect(() => {
    const handleScroll = () => checkIfInView();
    window.addEventListener("scroll", handleScroll);
    checkIfInView(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  return (
    <div id="intro" ref={introRef}>
      <NavBar />
      <div className="image-container">
        <ImageComponent />
      </div>
      <div className="typist-container">
        <ShiningButton>ABOUT</ShiningButton>

        {isInView && (
          <Typist avgTypingDelay={100}>
            <span className="intro-name">
              Developer👩‍💻
            </span>
            <Typist.Backspace count={15} delay={600} />
            <span className="intro-name">Problem Solver &#x1F609;</span>
            <Typist.Backspace count={20} delay={600} />
            <span className="intro-name">Globetrotter🌍✈️</span>
            <Typist.Backspace count={17} delay={600} />
            <span className="intro-name">Fitness Fanatic💪</span>
            <Typist.Backspace count={19} delay={600} />
            <span className="intro-name">
              Full Stack Developer👩‍💻
            </span>
          </Typist>
        )}

        <FadeInSection>
          <div className="intro-subtitle">
            Hi! I'm Anuradha, a full-stack developer based in Chennai, India. When I'm not knee-deep in code, I'm either working out or dreaming up my next travel destination. If you're into anime, let’s chat,I’d love to hear your favorite series or debate the best plot twists!
          </div>
        </FadeInSection>
        <SocialIcons />
      </div>
    </div>
  );
};

export default Intro;