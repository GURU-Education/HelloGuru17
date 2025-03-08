import React, { useState, useEffect } from "react";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; 
import { Popover } from "bootstrap";

export default function Subtitle({ text, email }) {
  const words = text.split(" ");
  const [sessionId, setSessionId] = useState(null);

  // Function to start session
  const startSession = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/start-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId);
        console.log("Session started:", data.sessionId);
      }
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  // Function to end session
  const endSession = async () => {
    try {
      await fetch("http://localhost:5001/api/end-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setSessionId(null);
      console.log("Session ended");
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };

  // Function to log word clicks
  const handleClick = async (word) => {
    if (!sessionId) {
      console.warn("No active session, word click not recorded.");
      return;
    }

    try {
      await fetch("http://localhost:5001/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, word, sessionId }),
      });

      console.log(`Word clicked: ${word} (Session: ${sessionId})`);
    } catch (error) {
      console.error("Error logging click:", error);
    }
  };

  useEffect(() => {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList.forEach((popoverTriggerEl) => {
      new Popover(popoverTriggerEl);
    });
  }, []);
  
  return (
    <div>
      <button onClick={startSession} className="btn btn-success m-2">Start Session</button>
      <button onClick={endSession} className="btn btn-danger m-2">End Session</button>

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
    </div>
  );
}
