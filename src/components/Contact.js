import React, { useEffect, useRef } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { profile } from "../data/content";
import "./Contact.css";

export default function Contact() {
  const [state, handleSubmit] = useForm("xldrbgpo");
  const doneRef = useRef(null);

  useEffect(() => {
    if (state.succeeded) doneRef.current?.focus();
  }, [state.succeeded]);

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

        {state.succeeded ? (
          <div className="contact-done" role="status">
            <h3 ref={doneRef} tabIndex={-1}>
              Message sent.
            </h3>
            <p>Thanks for reaching out. I will get back to you soon.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" type="text" autoComplete="name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-describedby="email-error"
              />
              <ValidationError id="email-error" className="field-error" prefix="Email" field="email" errors={state.errors} />
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required aria-describedby="message-error" />
              <ValidationError
                id="message-error"
                className="field-error"
                prefix="Message"
                field="message"
                errors={state.errors}
              />
            </div>
            <ValidationError className="field-error" errors={state.errors} />
            <button type="submit" className="btn" disabled={state.submitting}>
              {state.submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
