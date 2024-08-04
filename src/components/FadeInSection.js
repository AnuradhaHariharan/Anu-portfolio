import React, { useRef, useEffect, useState } from "react";

const FadeInSection = ({ children }) => {
  const domRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const domNode = domRef.current;

    const handleIntersection = (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(domNode);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
    });

    if (domNode) {
      observer.observe(domNode);
    }

    return () => {
      if (domNode) {
        observer.unobserve(domNode);
      }
    };
  }, [domRef]);

  return (
    <div
      ref={domRef}
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
    >
      {children}
    </div>
  );
};

export default FadeInSection;
