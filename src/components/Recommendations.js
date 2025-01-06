import React, { useState, useEffect } from "react";
import "../styles/Recommendations.css";
import FadeInSection from "./FadeInSection";

const recommendationsData = [
  {
    name: "Aikansh Garg",
    role: "Software Engineer",
    company: "Paylocity",
    photo: `${process.env.PUBLIC_URL}/assets/aikansh.jpg`,
    review: "I had the pleasure of working with Anuradha on several projects during my time at Fyle, and I can confidently say she’s one of the most driven interns I’ve worked with. She has an amazing ability to take on any challenge and learn quickly. Whether it was picking up new frameworks or diving into the latest technologies, she was always up for it.There were plenty of times when Anuradha was able to debug tricky issues on her own without needing much support, which was really impressive. She also played a key role in improving our frontend performance and ensuring the codebase stayed clean and efficient.Anuradha is passionate about what she does, and it shows in her work. I’d love to work with her again anytime and highly recommend her to any team looking for a talented and enthusiastic developer."
  },
  {
    name: "Priya Chaudhary",
    role: "Graduate Engineer",
    company: "ANZ",
    photo: `${process.env.PUBLIC_URL}/assets/priya.png`,
    review: "I’ve had the pleasure of working with Anuradha at Fyle, and her strong grasp of frontend technologies is truly commendable. She has an excellent ability to translate complex requirements into seamless user experiences. Beyond her technical expertise, Anuradha is a fantastic team player, always collaborative and supportive, making her a valuable asset to any team."
  }
];

const Recommendations = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGoldDust, setShowGoldDust] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendationsData.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setShowGoldDust(true);
      } else {
        setShowGoldDust(false);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.5, // Trigger when 50% of the section is visible
    });

    const section = document.querySelector(".recommendations");
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <FadeInSection>
      <div className="recommendations">
        {showGoldDust && (
          <>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="gold-dust"></div>
            ))}
          </>
        )}
        <div className="section-header">
          <span className="section-title">
            What My Exes (colleagues) Have to Say 😉
          </span>

        </div>
        <div className="recommendation-card">
          <img
            src={recommendationsData[currentIndex].photo}
            alt={recommendationsData[currentIndex].name}
            className="recommendation-photo"
          />
          <h2 className="recommendation-name">
            {recommendationsData[currentIndex].name}
          </h2>
          <p className="recommendation-review">
            "{recommendationsData[currentIndex].review}"
          </p>
          <p className="recommendation-role">
            {recommendationsData[currentIndex].role} at{" "}
            {recommendationsData[currentIndex].company}
          </p>
        </div>
      </div>
    </FadeInSection>
  );
};

export default Recommendations;


