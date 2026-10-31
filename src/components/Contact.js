import React, { useEffect, useRef, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { profile } from "../data/content";
import "./Contact.css";

const FORM_ENDPOINT = "https://formspree.io/f/xldrbgpo";

export default function Contact() {
  // Plain fetch to Formspree: same endpoint, without the SDK's payment code.
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const doneRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next = {};
    if (!String(data.get("name") || "").trim()) next.name = "Enter your name.";
    const email = String(data.get("email") || "").trim();
    if (!email) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter an email address like name@example.com.";
    if (!String(data.get("message") || "").trim()) next.message = "Write a short message.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const fieldProps = (name) => ({
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const FieldError = ({ name }) =>
    errors[name] ? (
      <p id={`${name}-error`} className="field-error">
        {errors[name]}
      </p>
    ) : null;

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <picture>
            <source srcSet={`${profile.photo}.webp`} type="image/webp" />
            <img
              className="contact-photo"
              src={`${profile.photo}.jpg`}
              alt="Anuradha Hariharan, smiling"
              width="720"
              height="960"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <h2 id="contact-title">Let's build something people enjoy using</h2>
          <p>
            I'm open to frontend roles where performance and accessibility matter. Send a message, or reach me
            directly.
          </p>
          <ul role="list" className="contact-links">
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin aria-hidden="true" focusable="false" /> LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                <FaGithub aria-hidden="true" focusable="false" /> GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.resume} download>
                Resume (PDF)
              </a>
            </li>
          </ul>
        </div>

        {status === "sent" ? (
          <div className="contact-done" role="status">
            <h3 ref={doneRef} tabIndex={-1}>
              Message sent.
            </h3>
            <p>Thanks for reaching out. I will get back to you soon.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" type="text" autoComplete="name" required {...fieldProps("name")} />
              <FieldError name="name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" required {...fieldProps("email")} />
              <FieldError name="email" />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required {...fieldProps("message")} />
              <FieldError name="message" />
            </div>
            {status === "error" && (
              <p ref={errorRef} tabIndex={-1} className="field-error" role="alert">
                The message didn't send. Check your connection and try again, or email {profile.email}.
              </p>
            )}
            <button type="submit" className="btn" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
