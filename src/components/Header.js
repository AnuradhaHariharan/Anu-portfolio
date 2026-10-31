import React, { useEffect, useRef, useState } from "react";
import { navLinks, profile } from "../data/content";
import { useActiveSection } from "../hooks";
import "./Header.css";

const ids = navLinks.map((l) => l.id);
const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || "");

export const ThemeIcon = ({ dark }) =>
  dark ? (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </g>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="currentColor" />
    </svg>
  );

export default function Header({ ready = true, theme, onToggleTheme, inspecting, onToggleInspect, onOpenPalette }) {
  const active = useActiveSection(ids, ready);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtn = useRef(null);
  const dark = theme === "dark";

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a className="brand" href="#top" aria-label={`${profile.name}, back to top`}>
          <span className="brand-mark" aria-hidden="true">
            A
          </span>
          <span className="brand-name">{profile.name}</span>
        </a>

        <nav aria-label="Main" className="main-nav">
          <button
            ref={menuBtn}
            type="button"
            className="icon-btn menu-btn"
            aria-expanded={menuOpen}
            aria-controls="nav-list"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <ul id="nav-list" role="list" className={`nav-list${menuOpen ? " is-open" : ""}`}>
            {navLinks.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={active === l.id ? "true" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className={`icon-btn inspect-btn${inspecting ? " is-on" : ""}`}
            aria-pressed={inspecting}
            onClick={onToggleInspect}
            data-inspector-ui
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
              <rect x="3" y="3" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2.5" />
              <path d="M12 12l9 3.5-4 1.5-1.5 4z" fill="currentColor" />
            </svg>
            <span className="inspect-label">Inspect</span>
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            data-inspector-ui
          >
            <ThemeIcon dark={dark} />
          </button>
          <button
            type="button"
            className="icon-btn palette-btn"
            onClick={onOpenPalette}
            aria-label="Open command menu"
            aria-haspopup="dialog"
            data-inspector-ui
          >
            <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd>K</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
