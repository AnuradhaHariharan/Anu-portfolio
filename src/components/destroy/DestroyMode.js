import React, { useCallback, useEffect, useRef, useState } from "react";
import { POINTS, splitPage } from "./split";
import { playBoom, playRebuild, playShot } from "./sound";
import { useReducedMotion, useStoredState } from "../../hooks";
import "./destroy.css";

const WIN_AT = 0.7; // share of targets destroyed to "win"
const FIRE_RATE = 90; // ms between shots while the button is held
const COMBO_WINDOW = 1200; // ms to keep a streak alive
const MAX_COMBO = 5;

const blastRadius = () => (window.innerWidth < 640 ? 64 : 95);

/** Distance from a point to the nearest edge of a rect (0 if inside). */
function distanceTo(rect, x, y) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

export default function DestroyMode({ onRebuild }) {
  const reduced = useReducedMotion();
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [combo, setCombo] = useState(1);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [best, setBest] = useStoredState("destroy-best", 0);
  const [soundOn, setSoundOn] = useStoredState("destroy-sound", true);
  const [aim, setAim] = useState(null);

  const canvasRef = useRef(null);
  const fx = useRef([]);
  const raf = useRef(0);
  const targets = useRef([]);
  const total = useRef(1);
  const dead = useRef(0);
  const shots = useRef(0);
  const comboRef = useRef({ n: 1, until: 0 });
  const firing = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const announceAt = useRef(0);
  const rebuildRef = useRef(null);
  const doneRef = useRef(false);
  const soundRef = useRef(soundOn);
  soundRef.current = soundOn;

  // Turn the page into targets once, when the game starts.
  useEffect(() => {
    // Anything still waiting to scroll-reveal should be shootable right away.
    document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => el.classList.add("is-in"));
    const roots = [document.getElementById("main"), document.querySelector(".site-footer")];
    total.current = Math.max(1, splitPage(roots));
    targets.current = Array.from(document.querySelectorAll(".dx-t, .dx-b"));
    document.documentElement.classList.add("is-destroying");
    setMessage(
      "Destroy mode on. Click or tap to shoot, hold to fire rapidly. With a keyboard, use the arrow keys to aim and Space to fire. Press Escape to rebuild the page."
    );
    return () => {
      document.documentElement.classList.remove("is-destroying");
      cancelAnimationFrame(raf.current);
      clearInterval(firing.current);
    };
  }, []);

  // ---------- Effects layer (canvas) ----------
  const tick = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    fx.current = fx.current.filter((p) => p.life > 0);
    for (const p of fx.current) {
      p.life -= 1;
      const a = Math.max(0, Math.min(1, p.life / p.fade));
      ctx.globalAlpha = a;
      if (p.type === "bit") {
        p.vy += 0.42;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
        ctx.restore();
      } else if (p.type === "ring") {
        p.r += (p.max - p.r) * 0.22;
        ctx.strokeStyle = "#00ff66";
        ctx.lineWidth = 3 * a + 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === "flash") {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.35, "rgba(0,255,102,0.55)");
        g.addColorStop(1, "rgba(0,255,102,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "text") {
        p.y -= 1.1;
        ctx.font = `700 ${p.size}px "Atkinson Hyperlegible Next", system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#0b0b0b";
        ctx.strokeText(p.text, p.x, p.y);
        ctx.fillStyle = "#00ff66";
        ctx.fillText(p.text, p.x, p.y);
      }
    }
    ctx.globalAlpha = 1;
    if (fx.current.length) raf.current = requestAnimationFrame(tick);
  }, []);

  const startFx = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }, [tick]);

  const debris = useCallback((rect, color, amount) => {
    const n = Math.min(60, amount);
    for (let i = 0; i < n; i += 1) {
      fx.current.push({
        type: "bit",
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 11,
        vy: -Math.random() * 9 - 2,
        s: Math.random() * 5 + 2,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        life: 55 + Math.random() * 35,
        fade: 30,
        color: Math.random() < 0.4 ? "#00ff66" : color,
      });
    }
  }, []);

  const shake = useCallback(
    (strength) => {
      if (reduced) return;
      const main = document.getElementById("main");
      if (!main) return;
      main.style.setProperty("--shake", `${Math.min(10, 2 + strength)}px`);
      main.classList.remove("dx-shake");
      // restart the animation
      void main.offsetWidth; // eslint-disable-line no-void
      main.classList.add("dx-shake");
    },
    [reduced]
  );

  // ---------- Shooting ----------
  const shoot = useCallback(
    (x, y) => {
      if (doneRef.current) return;
      shots.current += 1;
      if (soundRef.current) playShot();

      const R = blastRadius();
      const hit = [];
      for (const el of targets.current) {
        if (el.classList.contains("dx-dead")) continue;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight || rect.width === 0) continue;
        if (distanceTo(rect, x, y) <= R) hit.push([el, rect]);
      }

      if (!reduced) {
        fx.current.push({ type: "flash", x, y, r: R * 0.9, life: 7, fade: 7 });
        fx.current.push({ type: "ring", x, y, r: 6, max: R * 1.25, life: 18, fade: 18 });
      }

      if (!hit.length) {
        if (!reduced) startFx();
        return;
      }

      // Streaks within the combo window multiply the score.
      const now = performance.now();
      const c = comboRef.current;
      c.n = now < c.until ? Math.min(MAX_COMBO, c.n + 1) : 1;
      c.until = now + COMBO_WINDOW;
      setCombo(c.n);

      let gained = 0;
      let killed = 0;
      let big = false;
      for (const [el, rect] of hit) {
        if (el.classList.contains("dx-dead")) continue; // already taken out by a parent block
        const kind = el.dataset.dx || "word";
        const inner = el.querySelectorAll(".dx-t:not(.dx-dead), .dx-b:not(.dx-dead)");
        el.classList.add("dx-dead");
        inner.forEach((n) => n.classList.add("dx-dead"));
        killed += 1 + inner.length;
        gained += POINTS[kind] || 5;
        if (kind === "block" || kind === "image") big = true;
        if (!reduced) {
          const color = getComputedStyle(el).color || "#eaeaea";
          debris(rect, color, kind === "letter" ? 10 : Math.round(rect.width / 5) + 8);
        }
      }
      gained *= c.n;
      dead.current += killed;

      if (soundRef.current && big) playBoom(0.8);
      shake(hit.length / 3 + (big ? 4 : 0));
      if (!reduced) {
        fx.current.push({
          type: "text",
          x,
          y: y - 18,
          text: c.n > 1 ? `+${gained}  x${c.n}` : `+${gained}`,
          size: c.n > 2 ? 26 : 20,
          life: 50,
          fade: 25,
        });
        startFx();
      }

      setScore((s) => s + gained);
      const share = Math.min(1, dead.current / total.current);
      setProgress(share);

      if (now - announceAt.current > 1500) {
        announceAt.current = now;
        setMessage(`${Math.round(share * 100)} percent destroyed${c.n > 1 ? `, combo times ${c.n}` : ""}.`);
      }
      if (share >= WIN_AT) {
        doneRef.current = true;
        setDone(true);
        clearInterval(firing.current);
        if (soundRef.current) playBoom(1.6);
        shake(10);
        setMessage("Page destroyed. Press Rebuild to put it back.");
      }
    },
    [debris, reduced, shake, startFx]
  );

  const rebuild = useCallback(() => {
    if (soundRef.current) playRebuild();
    onRebuild();
  }, [onRebuild]);

  // Mouse and touch: fire on press, keep firing while held. Clicks are swallowed
  // so links and buttons on the page don't trigger.
  useEffect(() => {
    const isUi = (e) => e.target.closest && e.target.closest("[data-destroy-ui]");
    const onDown = (e) => {
      if (isUi(e) || (e.pointerType === "mouse" && e.button !== 0)) return;
      e.preventDefault();
      pointer.current = { x: e.clientX, y: e.clientY };
      shoot(e.clientX, e.clientY);
      clearInterval(firing.current);
      firing.current = setInterval(() => shoot(pointer.current.x, pointer.current.y), FIRE_RATE);
    };
    const onMove = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const stop = () => clearInterval(firing.current);
    const onClick = (e) => {
      if (isUi(e)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    // Stop clicks on the page from stealing focus (e.g. from the Rebuild button).
    const onMouseDown = (e) => {
      if (!isUi(e)) e.preventDefault();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerup", stop);
    document.addEventListener("pointercancel", stop);
    window.addEventListener("blur", stop);
    document.addEventListener("click", onClick, true);
    document.addEventListener("mousedown", onMouseDown, true);
    return () => {
      document.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", stop);
      document.removeEventListener("pointercancel", stop);
      window.removeEventListener("blur", stop);
      document.removeEventListener("click", onClick, true);
      clearInterval(firing.current);
    };
  }, [shoot]);

  // Keyboard: arrows aim a reticle (Shift for big steps), Space fires, Escape rebuilds.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        rebuild();
        return;
      }
      if (e.target.closest && e.target.closest("[data-destroy-ui]") && (e.key === " " || e.key === "Enter")) return;
      const step = e.shiftKey ? 90 : 30;
      const moves = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] };
      if (moves[e.key]) {
        e.preventDefault();
        setAim((a) => {
          const base = a || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
          const x = Math.max(8, Math.min(window.innerWidth - 8, base.x + moves[e.key][0]));
          let y = base.y + moves[e.key][1];
          if (y < 90) window.scrollBy(0, -step);
          if (y > window.innerHeight - 90) window.scrollBy(0, step);
          y = Math.max(90, Math.min(window.innerHeight - 90, y));
          return { x, y };
        });
      } else if (e.key === " ") {
        e.preventDefault();
        const a = aim || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        if (!aim) setAim(a);
        shoot(a.x, a.y);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aim, rebuild, shoot]);

  // Let the combo badge cool down when the streak ends.
  useEffect(() => {
    if (combo <= 1) return undefined;
    const t = setTimeout(() => setCombo(1), COMBO_WINDOW);
    return () => clearTimeout(t);
  }, [combo, score]);

  useEffect(() => {
    if (done) {
      setBest((b) => Math.max(b, score));
      rebuildRef.current?.focus();
    }
  }, [done, score, setBest]);

  const pct = Math.round(progress * 100);

  return (
    <>
      <canvas ref={canvasRef} className="dx-canvas" aria-hidden="true" />
      {aim && <div className="dx-reticle" style={{ left: aim.x, top: aim.y }} aria-hidden="true" />}
      <div className="dx-hud" data-destroy-ui role="region" aria-label="Destroy this site">
        <p className="dx-stat">
          <span>Score</span> <strong>{score}</strong>
          {combo > 1 && <span className="dx-combo">x{combo}</span>}
        </p>
        <div className="dx-meter" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="dx-stat">
          <strong>{pct}%</strong> <span>destroyed</span>
        </p>
        <p className="dx-stat dx-best">
          <span>Best</span> <strong>{Math.max(best, done ? score : 0)}</strong>
        </p>
        <button
          type="button"
          className="dx-sound"
          aria-pressed={soundOn}
          onClick={() => setSoundOn((s) => !s)}
        >
          {soundOn ? "Sound on" : "Sound off"}
        </button>
        <button type="button" className="btn" onClick={rebuild}>
          Rebuild <kbd>Esc</kbd>
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
      {done && (
        <div className="dx-end" data-destroy-ui role="dialog" aria-modal="false" aria-labelledby="dx-end-title">
          <h2 id="dx-end-title">Site destroyed.</h2>
          <p>
            {score} points from {shots.current} shots. Every letter can come back, because it's all just React state.
          </p>
          <button ref={rebuildRef} type="button" className="btn" onClick={rebuild}>
            Rebuild the site
          </button>
        </div>
      )}
    </>
  );
}
