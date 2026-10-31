import React, { useCallback, useEffect, useRef, useState } from "react";
import { POINTS, splitPage, targetAt } from "./split";
import { useReducedMotion, useStoredState } from "../../hooks";
import "./destroy.css";

const WIN_AT = 0.85; // share of targets destroyed to "win"

export default function DestroyMode({ onRebuild }) {
  const reduced = useReducedMotion();
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [best, setBest] = useStoredState("destroy-best", 0);
  const [aim, setAim] = useState(null); // keyboard reticle position
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const raf = useRef(0);
  const total = useRef(1);
  const dead = useRef(0);
  const hits = useRef(0);
  const rebuildRef = useRef(null);
  const announceAt = useRef(0);

  // Split the page into targets once, when the game starts.
  useEffect(() => {
    const roots = [document.getElementById("main"), document.querySelector(".site-footer")];
    total.current = Math.max(1, splitPage(roots));
    document.documentElement.classList.add("is-destroying");
    setMessage(
      "Destroy mode on. Click or tap to shoot. With a keyboard, use the arrow keys to aim and Space to fire. Press Escape to rebuild the page."
    );
    return () => {
      document.documentElement.classList.remove("is-destroying");
      cancelAnimationFrame(raf.current);
    };
  }, []);

  // Particle loop: runs only while pieces are on screen.
  const tick = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (c.width !== window.innerWidth * dpr) {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.current = particles.current.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
    particles.current.forEach((p) => {
      p.vy += 0.35;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life / 30);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
      ctx.restore();
    });
    if (particles.current.length) raf.current = requestAnimationFrame(tick);
  }, []);

  const burst = useCallback(
    (rect, color, amount) => {
      if (reduced) return;
      const n = Math.min(40, amount);
      for (let i = 0; i < n; i += 1) {
        particles.current.push({
          x: rect.left + Math.random() * rect.width,
          y: rect.top + Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 7,
          vy: -Math.random() * 6 - 1,
          s: Math.random() * 4 + 2,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          life: 60 + Math.random() * 30,
          color: Math.random() < 0.35 ? "#00ff66" : color,
        });
      }
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    },
    [reduced, tick]
  );

  const shoot = useCallback(
    (x, y) => {
      if (done) return;
      const t = targetAt(x, y);
      if (!t) return;
      const rect = t.getBoundingClientRect();
      const color = getComputedStyle(t).color || "#eaeaea";
      const kind = t.dataset.dx || "word";
      const inner = t.querySelectorAll(".dx-t:not(.dx-dead), .dx-b:not(.dx-dead)");
      [t, ...inner].forEach((el) => el.classList.add("dx-dead"));
      dead.current += 1 + inner.length;
      hits.current += 1;
      burst(rect, color, kind === "letter" ? 8 : Math.round(rect.width / 6) + 6);

      const gained = POINTS[kind] || 5;
      setScore((s) => s + gained);
      const share = Math.min(1, dead.current / total.current);
      setProgress(share);

      const now = performance.now();
      if (now - announceAt.current > 1500) {
        announceAt.current = now;
        setMessage(`Hit. ${Math.round(share * 100)} percent destroyed.`);
      }
      if (share >= WIN_AT) {
        setDone(true);
        setMessage("Page destroyed. Press Rebuild to put it back.");
      }
    },
    [burst, done]
  );

  // Mouse and touch: capture clicks so links and buttons don't fire.
  useEffect(() => {
    const onClick = (e) => {
      if (e.target.closest("[data-destroy-ui]")) return;
      e.preventDefault();
      e.stopPropagation();
      shoot(e.clientX, e.clientY);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [shoot]);

  // Keyboard: arrows aim a reticle, Space fires, Escape rebuilds.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onRebuild();
        return;
      }
      if (e.target.closest && e.target.closest("[data-destroy-ui]") && (e.key === " " || e.key === "Enter")) return;
      const step = e.shiftKey ? 80 : 24;
      const moves = { ArrowUp: [0, -step], ArrowDown: [0, step], ArrowLeft: [-step, 0], ArrowRight: [step, 0] };
      if (moves[e.key]) {
        e.preventDefault();
        setAim((a) => {
          const base = a || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
          const x = Math.max(8, Math.min(window.innerWidth - 8, base.x + moves[e.key][0]));
          let y = base.y + moves[e.key][1];
          if (y < 80) window.scrollBy(0, -step);
          if (y > window.innerHeight - 80) window.scrollBy(0, step);
          y = Math.max(80, Math.min(window.innerHeight - 80, y));
          return { x, y };
        });
      } else if (e.key === " " && aim) {
        e.preventDefault();
        shoot(aim.x, aim.y);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aim, onRebuild, shoot]);

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
      <div className="dx-hud" data-destroy-ui role="region" aria-label="Destroy this page">
        <p className="dx-stat">
          <span>Score</span> <strong>{score}</strong>
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
        <button type="button" className="btn" onClick={onRebuild}>
          Rebuild <kbd>Esc</kbd>
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
      {done && (
        <div className="dx-end" data-destroy-ui role="dialog" aria-modal="false" aria-labelledby="dx-end-title">
          <h2 id="dx-end-title">Page destroyed.</h2>
          <p>
            {score} points from {hits.current} shots. Every letter can come back, because it's all just React state.
          </p>
          <button ref={rebuildRef} type="button" className="btn" onClick={onRebuild}>
            Rebuild the page
          </button>
        </div>
      )}
    </>
  );
}
