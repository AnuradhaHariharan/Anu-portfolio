import React from "react";
import Intro from "./components/Intro";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Credits from "./components/Credits";
import "./App.css";
import "./styles/Global.css";
import "rsuite/dist/styles/rsuite-default.css";
import Contact from "./components/Contact";
import FrontPage from "./components/FrontPage";
import Recommendations from "./components/Recommendations";



function App() {
  return (
    <div className="App">
     <div id="content">
        <FrontPage />
        <Intro></Intro>
        <Projects></Projects>
        <Experience></Experience>
        <Recommendations/>
        <Contact></Contact>
        <Credits></Credits>
      </div>
    </div>
  );
}

export default App;
