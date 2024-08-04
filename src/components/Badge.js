import React, { useEffect, useState } from "react";
import "../styles/Badge.css";

const ShiningButton = ({ children }) => {
  const [shining, setShining] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShining(true);
      setTimeout(() => setShining(false), 400); // Remove shine after 500ms
    }, 4000); 

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <button className={`shining-button ${shining ? "shining" : ""}`}>
      {children}
    </button>
  );
};

export default ShiningButton;