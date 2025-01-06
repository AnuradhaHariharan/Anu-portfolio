import React, { useEffect, useRef } from "react";
import "../styles/Experience.css";

const Experience = () => {
  const experienceRef = useRef(null);

  const skills = [
    { name: 'Sass', image: `${process.env.PUBLIC_URL}/assets/icons8-sass-avatar.svg` },
    { name: 'JavaScript', image: `${process.env.PUBLIC_URL}/assets/icons8-javascript.svg` },
    { name: 'HTML5', image: `${process.env.PUBLIC_URL}/assets/icons8-html5.svg` },
    { name: 'React', image: `${process.env.PUBLIC_URL}/assets/react.png` },
    { name: 'CSS3', image: `${process.env.PUBLIC_URL}/assets/icons8-css3.svg` },
    { name: 'Webpack', image: `${process.env.PUBLIC_URL}/assets/icons8-webpack.svg` },
    { name: 'MongoDB', image: `${process.env.PUBLIC_URL}/assets/mongodb.svg` },
    { name: 'Express.js', image: `${process.env.PUBLIC_URL}/assets/icons8-express-js.svg` },
    { name: 'Node.js', image: `${process.env.PUBLIC_URL}/assets/icons8-node-js.svg` },
    { name: 'Java', image: `${process.env.PUBLIC_URL}/assets/icons8-java.svg` },
    { name: 'Spring Boot', image: `${process.env.PUBLIC_URL}/assets/icons8-java.svg` },
    { name: 'MySQL', image: `${process.env.PUBLIC_URL}/assets/logo-mysql-170x115.png` },
  ];

  useEffect(() => {
    const container = experienceRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 2; // Set scroll speed (higher is faster)

    const moveCarousel = () => {
      if (container) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= container.scrollWidth - container.clientWidth) {
          // Reset to the start for seamless scrolling
          scrollPosition = 0;
        }
        container.scrollLeft = scrollPosition;
      }
      requestAnimationFrame(moveCarousel);
    };

    requestAnimationFrame(moveCarousel); // Start the smooth scrolling animation

    return () => cancelAnimationFrame(moveCarousel); // Cleanup on unmount
  }, []);

  return (
    <div id="skills">
      <div className="section-header">
        <span className="section-title">My Toolkit..👩‍💻</span>
      </div>
      <div className="experience-container" ref={experienceRef}>
        <div className="experience-column">
          {skills.map((skill, index) => (
            <div className="experience-item" key={index}>
              <div className="experience-image-wrapper">
                <img src={skill.image} alt={skill.name} className="experience-image" />
              </div>
              <div className="experience-name">{skill.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;






