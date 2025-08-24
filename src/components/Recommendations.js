import React, { useEffect, useRef, useState } from "react";
import "../styles/Recommendations.css";
import FadeInSection from "./FadeInSection";

const recommendationsData = [
  {
    name: "Akash Milton Marimuthu",
    role: "Associate Product Manager",
    company: "Sprinto",
    photo: `${process.env.PUBLIC_URL}/assets/akash.png`,
    review:
      "Anuradha is a quick learner with a strong grasp of frontend fundamentals and a keen eye for detail. In the time I’ve known her, she’s shown great initiative in exploring modern frontend frameworks and consistently brings clarity and structure to her code. She asks the right questions, collaborates well with others, and has a calm, thoughtful approach to solving UI challenges. I’m confident she’ll grow into a solid engineer and be a valuable asset to any team she joins."
  },
  {
    name: "Aikansh Garg",
    role: "Software Engineer",
    company: "Paylocity",
    photo: `${process.env.PUBLIC_URL}/assets/aikansh.jpg`,
    review:
      "I had the pleasure of working with Anuradha on several projects during my time at Fyle, and I can confidently say she’s one of the most driven interns I’ve worked with. She has an amazing ability to take on any challenge and learn quickly. Whether it was picking up new frameworks or diving into the latest technologies, she was always up for it. There were plenty of times when Anuradha was able to debug tricky issues on her own without needing much support, which was really impressive. She also played a key role in improving our frontend performance and ensuring the codebase stayed clean and efficient. Anuradha is passionate about what she does, and it shows in her work. I’d love to work with her again anytime and highly recommend her to any team looking for a talented and enthusiastic developer."
  },
  {
    name: "Priya Chaudhary",
    role: "Graduate Engineer",
    company: "ANZ",
    photo: `${process.env.PUBLIC_URL}/assets/priya.png`,
    review:
      "I’ve had the pleasure of working with Anuradha at Fyle, and her strong grasp of frontend technologies is truly commendable. She has an excellent ability to translate complex requirements into seamless user experiences. Beyond her technical expertise, Anuradha is a fantastic team player, always collaborative and supportive, making her a valuable asset to any team."
  }
];

/* small hook to know if section is on screen */
function useInView(ref, thresh = 0.35) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: thresh }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, thresh]);
  return inView;
}

export default function Recommendations() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, 0.5);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = recommendationsData.length;
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  // autoplay only when visible & not paused
  useEffect(() => {
    if (!inView || paused) return;
    const id = setInterval(next, 6500);
    return () => clearInterval(id);
  }, [inView, paused, total]);

  const active = recommendationsData[index];

  return (
    <section
      id="recommendations"
      className="recs-section"
      ref={sectionRef}
      aria-labelledby="recs-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <FadeInSection>
        <div className="section-header">
        <span className="star-container" aria-hidden="true">
    ★
  </span>
          <h2 id="recs-title" className="section-title">Recommendations</h2>  
        </div>
      </FadeInSection>

      <div className="recs-card" role="group" aria-roledescription="carousel" aria-label="Recommendations">
        <span className="recs-glow" aria-hidden="true" />
        <div className="recs-header">
          <img
            className="recs-avatar"
            src={active.photo}
            alt={`${active.name}`}
            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
          />
          <div className="recs-meta">
            <h3 className="recs-name">{active.name}</h3>
            <p className="recs-role">
              {active.role} <span className="at">at</span> {active.company}
            </p>
          </div>
        </div>

        <blockquote className="recs-quote">
          <span className="quote-mark" aria-hidden="true">“</span>
          {active.review}
          <span className="quote-mark end" aria-hidden="true">”</span>
        </blockquote>

        <div className="recs-controls">
          <button className="recs-btn prev" onClick={prev} aria-label="Previous recommendation">‹</button>
          <ul className="recs-dots" role="tablist" aria-label="Recommendation slides">
            {recommendationsData.map((_, i) => (
              <li key={i} role="presentation">
                <button
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show recommendation ${i + 1}`}
                  className={`dot ${i === index ? "active" : ""}`}
                  onClick={() => setIndex(i)}
                />
              </li>
            ))}
          </ul>
          <button className="recs-btn next" onClick={next} aria-label="Next recommendation">›</button>
        </div>
      </div>
    </section>
  );
}


