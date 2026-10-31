import React, { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Impact from "./components/Impact";
import Experience from "./components/Experience";
import Lab from "./components/Lab";
import FixTheUI from "./components/game/FixTheUI";
import Projects from "./components/Projects";
import Recommendations from "./components/Recommendations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Inspector from "./components/inspector/Inspector";
import CommandPalette from "./components/CommandPalette";
import { navLinks, profile } from "./data/content";
import { useTheme } from "./hooks";
import "./App.css";

const goTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ block: "start" });
  const heading = el.querySelector("h1, h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
};

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [inspecting, setInspecting] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [gameSignal, setGameSignal] = useState(0);
  const [toast, setToast] = useState("");

  const stopInspect = useCallback(() => setInspecting(false), []);
  const toggleInspect = useCallback(() => setInspecting((v) => !v), []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const commands = useMemo(
    () => [
      ...navLinks.map((l) => ({
        id: `go-${l.id}`,
        group: "Go to",
        label: l.label,
        run: () => goTo(l.id),
      })),
      { id: "play", group: "Play", label: "Start Fix the UI", keywords: "game quiz", run: () => setGameSignal((n) => n + 1) },
      {
        id: "inspect",
        group: "Tools",
        label: inspecting ? "Turn off inspect mode" : "Turn on inspect mode",
        keywords: "devtools box model contrast",
        run: toggleInspect,
      },
      {
        id: "theme",
        group: "Tools",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        keywords: "dark light mode colour",
        run: toggleTheme,
      },
      {
        id: "email",
        group: "Contact",
        label: "Copy my email address",
        keywords: "mail",
        run: async () => {
          try {
            await navigator.clipboard.writeText(profile.email);
            setToast(`Copied ${profile.email}`);
          } catch {
            setToast(`Email: ${profile.email}`);
          }
        },
      },
      {
        id: "resume",
        group: "Contact",
        label: "Download resume (PDF)",
        keywords: "cv",
        run: () => {
          const a = document.createElement("a");
          a.href = profile.resume;
          a.download = "";
          a.click();
        },
      },
      { id: "linkedin", group: "Contact", label: "Open LinkedIn", run: () => window.open(profile.linkedin, "_blank", "noopener") },
      { id: "github", group: "Contact", label: "Open GitHub", run: () => window.open(profile.github, "_blank", "noopener") },
    ],
    [inspecting, theme, toggleInspect, toggleTheme]
  );

  return (
    <>
      <a className="skip-link" href="#main" data-inspector-ui>
        Skip to content
      </a>
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        inspecting={inspecting}
        onToggleInspect={toggleInspect}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <main id="main" tabIndex={-1}>
        <Hero inspecting={inspecting} onStartInspect={() => setInspecting(true)} />
        <Impact />
        <Experience />
        <Lab />
        <FixTheUI startSignal={gameSignal} />
        <Projects />
        <Recommendations />
        <Contact />
      </main>
      <Footer />
      <Inspector active={inspecting} onExit={stopInspect} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
      <div className="toast" role="status" aria-live="polite">
        {toast && <p>{toast}</p>}
      </div>
    </>
  );
}
