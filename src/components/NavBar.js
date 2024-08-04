import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../styles/NavBar.css";

const NavBar = () => {
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
        <Navbar id="main-navbar" fixed="top" expand="lg">
          <Container>
            <Navbar.Brand href="#">AH</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#intro">HOME</Nav.Link>
                <Nav.Link href="#projects">PROJECTS</Nav.Link>
                <Nav.Link href="#skills">SKILLS</Nav.Link>
              </Nav>
              <Nav className="ml-auto">
                <Nav.Link
                  href="https://drive.google.com/file/d/1MR3rG6FsKQXH3Fi6MDUSFwunGh0jzhfM/view?usp=sharing"
                  className="hit-me-up"
                >
                  Resume
                </Nav.Link>
                <Nav.Link href="#contact" className="hit-me-up">
                  Hit me up
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default NavBar;