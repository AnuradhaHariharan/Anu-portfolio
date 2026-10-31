import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CommandPalette.css";

/**
 * Ctrl/⌘ + K menu built on a native <dialog> (focus trap and Esc for free)
 * with the ARIA combobox + listbox pattern for the search results.
 */
export default function CommandPalette({ open, onClose, commands }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((c) => `${c.label} ${c.group} ${c.keywords || ""}`.toLowerCase().includes(term));
  }, [q, commands]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) {
      setQ("");
      setActive(0);
      d.showModal();
      inputRef.current?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  const run = (cmd) => {
    onClose();
    // Let the dialog close and focus return before acting.
    requestAnimationFrame(() => cmd.run());
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Home") {
      setActive(0);
    } else if (e.key === "End") {
      setActive(Math.max(0, results.length - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      run(results[active]);
    }
  };

  useEffect(() => {
    document.getElementById(`cmd-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <dialog
      ref={dialogRef}
      className="palette"
      aria-labelledby="palette-title"
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      data-inspector-ui
    >
      <div className="palette-inner">
        <h2 id="palette-title" className="sr-only">
          Command menu
        </h2>
        <input
          ref={inputRef}
          className="palette-input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results.length ? `cmd-${active}` : undefined}
          aria-autocomplete="list"
          aria-label="Search commands"
          placeholder="Jump to a section or run a command…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck="false"
        />
        <ul id="palette-list" role="listbox" aria-label="Commands" className="palette-list">
          {results.map((c, i) => (
            <li
              key={c.id}
              id={`cmd-${i}`}
              role="option"
              aria-selected={i === active}
              className="palette-item"
              onPointerMove={() => setActive(i)}
              onClick={() => run(c)}
            >
              <span>{c.label}</span>
              <span className="palette-group">{c.group}</span>
            </li>
          ))}
        </ul>
        {!results.length && <p className="palette-empty">No commands match “{q}”. Try “game” or “theme”.</p>}
        <p className="palette-foot" aria-hidden="true">
          <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to run, <kbd>Esc</kbd> to close
        </p>
        <p className="sr-only" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
      </div>
    </dialog>
  );
}
