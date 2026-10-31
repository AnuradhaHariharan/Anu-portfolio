import React, { useEffect, useRef, useState } from "react";
import { ROUNDS } from "./rounds";
import { useStoredState } from "../../hooks";
import "./game.css";

const ROUNDS_PER_GAME = 5;

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const newGame = () => shuffle(ROUNDS).slice(0, ROUNDS_PER_GAME);

const verdict = (score) => {
  if (score === ROUNDS_PER_GAME) return "Perfect run. You'd pass my code review.";
  if (score >= ROUNDS_PER_GAME - 1) return "Nearly flawless. One more go for a perfect run?";
  if (score >= 2) return "Solid. Each run picks different rounds, so play again to see the rest.";
  return "These catch out plenty of teams. Play again and the explanations will stick.";
};

export default function FixTheUI({ startSignal, onDestroy }) {
  const [rounds, setRounds] = useState(newGame);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [best, setBest] = useStoredState("fix-the-ui-best", 0);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const feedbackRef = useRef(null);
  const firstFocus = useRef(true);

  const done = index >= rounds.length;
  const round = rounds[index];
  const correct = checked && choice === round?.answer;

  // The command palette can start the game: scroll here and focus the round.
  useEffect(() => {
    if (!startSignal) return;
    sectionRef.current?.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [startSignal]);

  useEffect(() => {
    if (firstFocus.current) {
      firstFocus.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [index, rounds]);

  useEffect(() => {
    if (checked) feedbackRef.current?.focus();
  }, [checked]);

  const check = (e) => {
    e.preventDefault();
    if (!choice || checked) return;
    const ok = choice === round.answer;
    setChecked(true);
    setHistory((h) => [...h, ok]);
    if (ok) setScore((s) => s + 1);
  };

  const next = () => {
    const isLast = index + 1 >= rounds.length;
    if (isLast) setBest((b) => Math.max(b, score));
    setIndex((i) => i + 1);
    setChoice("");
    setChecked(false);
  };

  const restart = () => {
    setRounds(newGame());
    setIndex(0);
    setChoice("");
    setChecked(false);
    setScore(0);
    setHistory([]);
  };

  return (
    <section id="play" ref={sectionRef} className="section game" aria-labelledby="play-title">
      <div className="wrap">
        <div className="section-head">
          <h2 id="play-title">Play: Fix the UI</h2>
          <p>
            Five broken interfaces I see in real codebases. Pick the fix for each one. Fully playable with a keyboard or
            a screen reader.
          </p>
        </div>

        <div className="game-card">
          <div className="game-top">
            <ol className="game-progress" role="list" aria-label="Rounds">
              {rounds.map((r, i) => {
                const state = history[i] === undefined ? (i === index ? "current" : "todo") : history[i] ? "won" : "lost";
                const label =
                  state === "won" ? "fixed" : state === "lost" ? "missed" : state === "current" ? "current" : "not played";
                return (
                  <li key={r.id} className={`pip is-${state}`}>
                    <span className="sr-only">
                      Round {i + 1}, {label}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="game-score">
              Score {score}
              <span className="game-best"> Best {Math.max(best, done ? score : 0)}</span>
            </p>
          </div>

          {!done ? (
            <div className="game-body">
              <h3 ref={headingRef} tabIndex={-1} className="game-q">
                <span className="game-round">
                  Round {index + 1} of {rounds.length}
                </span>
                {round.prompt}
              </h3>

              <div className="game-grid">
                <figure className="game-mock">
                  {round.visual}
                  <figcaption>
                    <span className="sr-only">What it looks like: </span>
                    {round.description}
                  </figcaption>
                  <pre className="game-code">
                    <code>{checked ? round.fix : round.code}</code>
                  </pre>
                  <p className="game-code-label">{checked ? "The fix" : "The code"}</p>
                </figure>

                <form onSubmit={check} className="game-form">
                  <fieldset disabled={checked}>
                    <legend className="sr-only">Choose a fix</legend>
                    {round.options.map((o) => {
                      const isAnswer = checked && o.id === round.answer;
                      const isWrongPick = checked && o.id === choice && !isAnswer;
                      return (
                        <label
                          key={o.id}
                          className={`opt${choice === o.id ? " is-picked" : ""}${isAnswer ? " is-answer" : ""}${
                            isWrongPick ? " is-wrong" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`round-${round.id}`}
                            value={o.id}
                            checked={choice === o.id}
                            onChange={() => setChoice(o.id)}
                          />
                          <span>{o.text}</span>
                          {isAnswer && <span className="opt-tag">Correct fix</span>}
                          {isWrongPick && <span className="opt-tag">Your pick</span>}
                        </label>
                      );
                    })}
                  </fieldset>
                  {!checked && (
                    <button type="submit" className="btn" disabled={!choice}>
                      Check my fix
                    </button>
                  )}
                </form>
              </div>

              {checked && (
                <div className={`feedback ${correct ? "is-right" : "is-wrong"}`}>
                  <h4 ref={feedbackRef} tabIndex={-1}>
                    {correct ? "Fixed it." : "Not quite."}
                  </h4>
                  <p>{round.explain}</p>
                  <p className="feedback-wcag">WCAG {round.wcag}</p>
                  <button type="button" className="btn" onClick={next}>
                    {index + 1 >= rounds.length ? "See my score" : "Next round"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="game-body game-end">
              <h3 ref={headingRef} tabIndex={-1}>
                You fixed {score} of {rounds.length}.
              </h3>
              <p>{verdict(score)}</p>
              <div className="game-end-actions">
                <button type="button" className="btn" onClick={restart}>
                  Play again
                </button>
                <a className="btn btn--ghost" href="#contact">
                  Talk to the person who made this
                </a>
              </div>
            </div>
          )}
        </div>
        {onDestroy && (
          <p className="game-alt">
            Prefer chaos?{" "}
            <button type="button" className="link-btn" onClick={onDestroy}>
              Destroy this site
            </button>{" "}
            and shoot it apart letter by letter. It rebuilds itself.
          </p>
        )}
      </div>
    </section>
  );
}
