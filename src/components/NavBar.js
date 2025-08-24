import React from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../styles/NavBar.css";

const NavBar = () => {
  const location = useLocation();

  return (
    <Navbar id="main-navbar" fixed="top" expand="lg">
      <Container>
        <Navbar.Brand href="#">AH</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#intro" active={location.hash === "#intro"}>ABOUT ME</Nav.Link>
            <Nav.Link href="#projects" active={location.hash === "#projects"}>PROJECTS</Nav.Link>
            <Nav.Link href="#skills" active={location.hash === "#skills"}>SKILLS</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Nav.Link
              href="https://drive.google.com/file/d/10WywI7ndMqRjWtO0L7gUIqb-CYWFYKcF/view?usp=sharing"
              className="hit-me-up"
            >
              Resume
            </Nav.Link>
            <Nav.Link href="#contact" className="hit-me-up">
              Let's Connect
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
