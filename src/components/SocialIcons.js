import React, { useState, useEffect } from "react";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const SocialIcons = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Define section IDs and check if the scroll position is within any section
      const sections = ["#intro", "#projects", "#skills", "#contact"];
      const currentScroll = window.scrollY + window.innerHeight / 2;

      let isVisible = false;

      sections.forEach((sectionId) => {
        const section = document.querySelector(sectionId);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (currentScroll > offsetTop && currentScroll < offsetTop + offsetHeight) {
            isVisible = true;
          }
        }
      });

      setVisible(isVisible || location.pathname !== "/");
    };

    window.addEventListener("scroll", handleScroll);

    // Initial check when the component mounts
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <>
      {visible && (
        <div className="social-icons">
          <a href="https://www.linkedin.com/in/anuradhahariharan13/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://github.com/AnuradhaHariharan" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://www.instagram.com/a_n_u_r_a_d_h_a__?igsh=dGo3bnl3amwwZHd6" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>
      )}
    </>
  );
};

export default SocialIcons;