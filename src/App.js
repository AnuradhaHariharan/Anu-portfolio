import React, { Suspense, lazy, startTransition, useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Impact from "./components/Impact";
import Experience from "./components/Experience";
import Systems from "./components/Systems";
import Projects from "./components/Projects";
import Recommendations from "./components/Recommendations";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Deferred from "./components/Deferred";
import Inspector from "./components/inspector/Inspector";
import { navLinks, profile } from "./data/content";
import { useTheme } from "./hooks";
import "./App.css";

const Lab = lazy(() => import("./components/Lab"));
const FixTheUI = lazy(() => import("./components/game/FixTheUI"));
const CommandPalette = lazy(() => import("./components/CommandPalette"));

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
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  useEffect(() => {
    if (paletteOpen) setPaletteLoaded(true);
  }, [paletteOpen]);
  const [gameSignal, setGameSignal] = useState(0);
  const [toast, setToast] = useState("");
  // Paint the hero first, then render the rest of the page in an
  // interruptible transition so the main thread never blocks for long.
  const [showRest, setShowRest] = useState(() => !!window.location.hash);
  useEffect(() => {
    if (showRest) return;
    startTransition(() => setShowRest(true));
  }, [showRest]);

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
      ...[{ id: "work", label: "Impact" }, ...navLinks].map((l) => ({
        id: `go-${l.id}`,
        group: "Go to",
        label: l.label,
        run: () => goTo(l.id),
      })),
      { id: "play", group: "Play", label: "Start Fix the UI", keywords: "game quiz", run: () => {
          goTo("play");
          setGameSignal((n) => n + 1);
        },
      },
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
        ready={showRest}
        theme={theme}
        onToggleTheme={toggleTheme}
        inspecting={inspecting}
        onToggleInspect={toggleInspect}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <main id="main" tabIndex={-1}>
        <Hero inspecting={inspecting} onStartInspect={() => setInspecting(true)} />
        {showRest && (
          <>
            <Impact />
            <Systems />
            <Experience />
            <Deferred id="lab" minHeight="34rem">
              <Lab />
            </Deferred>
            <Deferred id="play" minHeight="48rem">
              <FixTheUI startSignal={gameSignal} />
            </Deferred>
            <Projects />
            <Recommendations />
            <Contact />
          </>
        )}
      </main>
      {showRest && <Footer />}
      <Inspector active={inspecting} onExit={stopInspect} />
      {(paletteOpen || paletteLoaded) && (
        <Suspense fallback={null}>
          <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />
        </Suspense>
      )}
      <div className="toast" role="status" aria-live="polite">
        {toast && <p>{toast}</p>}
      </div>
    </>
  );
}
