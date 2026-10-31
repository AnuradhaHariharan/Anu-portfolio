import { useCallback, useEffect, useState } from "react";

const query = (q) =>
  typeof window !== "undefined" && window.matchMedia ? window.matchMedia(q) : null;

export function useMediaQuery(q) {
  const [matches, setMatches] = useState(() => !!query(q)?.matches);
  useEffect(() => {
    const mq = query(q);
    if (!mq) return undefined;
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [q]);
  return matches;
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

function readStoredTheme() {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

/** Theme follows the OS until the visitor picks one, then remembers it. */
export function useTheme() {
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [stored, setStored] = useState(readStoredTheme);
  const theme = stored || (systemDark ? "dark" : "light");

  useEffect(() => {
    if (stored) document.documentElement.dataset.theme = stored;
    else delete document.documentElement.dataset.theme;
  }, [stored]);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setStored(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked: theme still changes for this visit */
    }
  }, [theme]);

  return { theme, toggle };
}

/** Persist a small value per visitor; falls back to memory if storage is blocked. */
export function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);
  return [value, setValue];
}

/** Which section is currently in view, for the nav's aria-current. */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}
