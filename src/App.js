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
import useReveal from "./hooks/useReveal";
import "./App.css";


const CommandPalette = lazy(() => import("./components/CommandPalette"));
const loadGame = () => import("./components/game/FixTheUI");
const DestroyMode = lazy(() => import("./components/destroy/DestroyMode"));
const FixTheUI = lazy(() => loadGame());

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
  const destroyingRef = React.useRef(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  useEffect(() => {
    if (paletteOpen) setPaletteLoaded(true);
  }, [paletteOpen]);
  const [gameSignal, setGameSignal] = useState(0);
  const [toast, setToast] = useState("");
  // Paint the hero first, then render the rest of the page in an
  // interruptible transition so the main thread never blocks for long.
  // Two batches keep each commit small: sections near the top first, then the rest.
  const [stage, setStage] = useState(() => (window.location.hash ? 2 : 0));
  const showRest = stage >= 1;
  const showLate = stage >= 2;
  useEffect(() => {
    if (stage >= 2) return undefined;
    const id = setTimeout(() => startTransition(() => setStage((s) => s + 1)), stage === 0 ? 0 : 60);
    return () => clearTimeout(id);
  }, [stage]);

  const stopInspect = useCallback(() => setInspecting(false), []);

  // "Destroy this page": load every section, then turn the page into targets.
  // Rebuild remounts <main> and the footer with a new key, so the DOM is fresh.
  const [destroying, setDestroying] = useState(false);
  const [forceAll, setForceAll] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const startDestroy = useCallback(async () => {
    setInspecting(false);
    setPaletteOpen(false);
    setStage(2);
    setForceAll(true);
    await loadGame();
    setTimeout(() => setDestroying(true), 250);
  }, []);
  useEffect(() => {
    destroyingRef.current = destroying;
  }, [destroying]);
  const rebuild = useCallback(() => {
    setDestroying(false);
    setPageKey((k) => k + 1);
    document.documentElement.classList.add("is-rebuilt");
    setTimeout(() => document.documentElement.classList.remove("is-rebuilt"), 700);
  }, []);
  const toggleInspect = useCallback(() => {
    if (destroyingRef.current) return;
    setInspecting((v) => !v);
  }, []);

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

  useReveal([showLate, pageKey]);

  const commands = useMemo(
    () => [
      ...[{ id: "work", label: "Impact" }, ...navLinks].map((l) => ({
        id: `go-${l.id}`,
        group: "Go to",
        label: l.label,
        run: () => goTo(l.id),
      })),
      { id: "destroy", group: "Play", label: "Destroy this site", keywords: "game shoot fun break", run: () => startDestroy() },
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
    [inspecting, theme, toggleInspect, toggleTheme, startDestroy]
  );

  return (
    <>
      <a className="skip-link" href="#main" data-inspector-ui>
        Skip to content
      </a>
      <Header
        ready={showLate}
        theme={theme}
        onToggleTheme={toggleTheme}
        inspecting={inspecting}
        onToggleInspect={toggleInspect}
        onOpenPalette={() => setPaletteOpen(true)}
      />
      <main id="main" tabIndex={-1} key={`main-${pageKey}`}>
        <Hero inspecting={inspecting || destroying} onStartInspect={() => setInspecting(true)} />
        {showRest && (
          <>
            <Impact />
            <Systems />
            <Experience />
            {showLate && (
              <>
                <Deferred id="play" minHeight="48rem" force={forceAll}>
                  <FixTheUI startSignal={gameSignal} onDestroy={startDestroy} />
                </Deferred>
                <Projects />
                <Recommendations />
                <Contact />
              </>
            )}
          </>
        )}
      </main>
      {showLate && <Footer key={`footer-${pageKey}`} onDestroy={startDestroy} />}
      <div className="scroll-progress" aria-hidden="true" />
      {!destroying && !inspecting && showRest && (
        <button type="button" className="destroy-fab" onClick={startDestroy}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="1.8" fill="currentColor" />
            <path d="M12 1v5M12 18v5M1 12h5M18 12h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Destroy this site</span>
        </button>
      )}
      <Inspector active={inspecting} onExit={stopInspect} />
      {destroying && (
        <Suspense fallback={null}>
          <DestroyMode onRebuild={rebuild} />
        </Suspense>
      )}
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
