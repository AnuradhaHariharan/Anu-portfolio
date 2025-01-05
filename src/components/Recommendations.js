import React, { useState, useEffect } from 'react';
import "../styles/Recommendations.css";

const recommendationsData = [
  {
    name: "John Doe",
    role: "Software Engineer",
    company: "Tech Corp",
    photo: "https://via.placeholder.com/150",
    review: "I had the pleasure of working with Anuradha on several projects during my time at Fyle, and I can confidently say she’s one of the most driven interns I’ve worked with. She has an amazing ability to take on any challenge and learn quickly. Whether it was picking up new frameworks or diving into the latest technologies, she was always up for it. There were plenty of times when Anuradha was able to debug tricky issues on her own without needing much support, which was really impressive. She also played a key role in improving our frontend performance and ensuring the codebase stayed clean and efficient. Anuradha is passionate about what she does, and it shows in her work. I’d love to work with her again anytime and highly recommend her to any team looking for a talented and enthusiastic developer."
  },
  {
    name: "Jane Smith",
    role: "Project Manager",
    company: "Innovate Ltd",
    photo: "https://via.placeholder.com/150",
    review: "Aikansh's dedication and attention to detail made a huge difference in our project. Highly recommended!"
  },
  {
    name: "Mark Lee",
    role: "UX Designer",
    company: "Design Hub",
    photo: "https://via.placeholder.com/150",
    review: "Creative, hardworking, and always open to feedback. It was a pleasure working with Aikansh."
  }
  // Add more recommendations here
];

const Recommendations = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically change the review every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendationsData.length);
    }, 5000); // 5000ms = 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="recommendations">
     <div className="section-header">
          <span className="section-title">What People Say &#x2764;&#xFE0F;</span>
        </div>
      <div className="recommendation-card">
        <img src={recommendationsData[currentIndex].photo} alt={recommendationsData[currentIndex].name} className="recommendation-photo" />
        <p className="recommendation-review">"{recommendationsData[currentIndex].review}"</p>
        <p className="recommendation-role">
          {recommendationsData[currentIndex].role} at {recommendationsData[currentIndex].company}
        </p>
      </div>
    </div>
  );
};

export default Recommendations;

