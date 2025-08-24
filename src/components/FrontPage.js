import React, { useEffect, useRef, useState } from 'react';
import '../styles/FrontPage.css';
import FadeInSection from './FadeInSection';


const COLORS = {
  accent: '#00ff66',
  bg: '#0b0b0b',
  starRGB: '255,255,255',
  glowRGB: '0,255,120',
};

/* ---------- Falling Stars Background ---------- */
function StarfieldBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const stars = [];

    const makeStar = (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      s: Math.random() * 0.7 + 0.25,
      t: Math.random() * Math.PI * 2,
      tw: Math.random() * 0.025 + 0.01,
      g: Math.random() < 0.18,
    });

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const target = Math.min(Math.floor((w * h) / 3200), 350);
      stars.length = 0;
      for (let i = 0; i < target; i++) stars.push(makeStar(w, h));
    };

    const step = () => {
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y += s.s;
        s.t += s.tw;
        if (s.y - s.r > h) {
          stars[i] = makeStar(w, h);
          stars[i].y = -s.r;
        }
        const tw = 0.6 + 0.4 * Math.sin(s.t);
        ctx.shadowBlur = s.g ? 8 : 6;
        ctx.shadowColor = `rgba(${s.g ? COLORS.glowRGB : COLORS.starRGB}, ${0.18 * tw})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLORS.starRGB}, ${0.55 * tw})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="stars-bg" aria-label="Falling stars background" />;
}

/* ---------- FrontPage ---------- */
export default function FrontPage() {

  const [showMain, setShowMain] = useState(false);

  useEffect(() => {
    const tShowMain = setTimeout(() => setShowMain(true), 0);
    return () => {
      clearTimeout(tShowMain);

    };
  }, []);

  const stats = [{ value: '1+', label: 'Years of Experience' }];

  return (
    <div className="front-page" id='front-page'>
      <StarfieldBackground />
      <header className={`hero-wrap ${showMain ? 'enter' : ''}`}>
        <div className="hero-left">
          <h1 className="hero-stack">
            <span className="hero-line hero-accent">FRONTEND</span>
            <span className="hero-line">DEVELOPER</span>
          </h1>
         
          <FadeInSection>
          <p className="hero-sub">
            Hi! I’m <strong>Anuradha</strong>, a frontend  developer focused on performance, accessibility, and clean UI that users actually feel.
          </p>
          </FadeInSection>
          <FadeInSection>
          <div className="cta-row">
            <a className="btn btn-accent" href="#contact">HIRE ME</a>
          </div>
          </FadeInSection>
        </div>
      </header>

      {/* Right stats */}
      <aside className={`stats-rail ${showMain ? 'enter' : ''}`}>
        {stats.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat-num">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </aside>
    </div>
  );
}
