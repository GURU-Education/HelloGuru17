import React, { useEffect } from "react";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; 
import { Popover } from "bootstrap";

export default function Subtitle({ text, email }) {
  const words = text.split(" ");

  const handleClick = async (word) => {
    try {
      await fetch("http://localhost:5001/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, word }),
      });
      console.log(`Word clicked: ${word}`);
    } catch (error) {
      console.error("Error logging click:", error);
    }
  };

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList.forEach((popoverTriggerEl) => {
      new Popover(popoverTriggerEl); // ✅ Correctly initializing popovers
    });
  }, []);
  
  return (
    <div>
      {words.map((word, index) => (
        <span
          key={index}
          onClick={() => handleClick(word)}
          style={{ margin: "5px 5px", cursor: "pointer" }}
          className="btn btn-outline-dark"
          tabIndex="0"
          data-bs-toggle="popover"
          data-bs-trigger="focus"
          data-bs-placement="top"
          data-bs-content={`Translation of ${word}`}
        >
          {word}
        </span>
      ))}
    </div>
  );
}
