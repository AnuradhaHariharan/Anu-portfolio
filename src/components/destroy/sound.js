// Gun and explosion sounds synthesised with the Web Audio API:
// no audio files to download, and nothing plays until the player starts the game.

let ctx = null;
let noise = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const len = ctx.sampleRate * 0.6;
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function burstOfNoise(ac, { at, duration, from, to, gain, type = "lowpass" }) {
  const src = ac.createBufferSource();
  src.buffer = noise;
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(from, at);
  filter.frequency.exponentialRampToValueAtTime(to, at + duration);
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.001, at + duration);
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(at);
  src.stop(at + duration + 0.02);
}

function thump(ac, { at, from, to, duration, gain }) {
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + duration);
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, at);
  g.gain.exponentialRampToValueAtTime(0.001, at + duration);
  osc.connect(g).connect(ac.destination);
  osc.start(at);
  osc.stop(at + duration + 0.02);
}

/** A short, punchy gunshot. Pitch varies slightly so rapid fire doesn't sound robotic. */
export function playShot() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  const v = 0.9 + Math.random() * 0.2;
  burstOfNoise(ac, { at: t, duration: 0.09, from: 6000 * v, to: 900, gain: 0.55, type: "bandpass" });
  burstOfNoise(ac, { at: t, duration: 0.22, from: 2400 * v, to: 200, gain: 0.35 });
  thump(ac, { at: t, from: 160 * v, to: 45, duration: 0.14, gain: 0.6 });
}

/** A deeper explosion for big hits and the final destruction. */
export function playBoom(size = 1) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  burstOfNoise(ac, { at: t, duration: 0.5 * size, from: 1400, to: 60, gain: 0.5 });
  thump(ac, { at: t, from: 90, to: 28, duration: 0.45 * size, gain: 0.8 });
}

/** Rebuild chime: two quick rising notes. */
export function playRebuild() {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime;
  [523.25, 783.99].forEach((f, i) => {
    const osc = ac.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = f;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t + i * 0.09);
    g.gain.exponentialRampToValueAtTime(0.25, t + i * 0.09 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.3);
    osc.connect(g).connect(ac.destination);
    osc.start(t + i * 0.09);
    osc.stop(t + i * 0.09 + 0.32);
  });
}
