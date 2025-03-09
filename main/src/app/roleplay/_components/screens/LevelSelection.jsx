"use client";

import React from "react";
import Spline from "@splinetool/react-spline";

// Example HSK levels – you can pass these as a prop or fetch from an API
const hskLevels = [
  { level: 1 },
  { level: 2 },
  { level: 3 },
  { level: 4 },
  { level: 5 },
  { level: 6 },
];

export default function LevelSelection({ setSelectedLevel }) {
  return (
    <div className="level-selection-container">
      {/* Left Panel: Big Bubble + Title (unchanged) */}
      <div className="left-panel">
        <div className="bubble-wrapper">
          <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
        </div>
        <div className="title-area">
          <h1 className="main-title">HSK Roleplay</h1>
          <p className="subtitle">With Xiao Qiu</p>
        </div>
      </div>

      {/* Right Panel: Stacked Rounded Rectangles for Level Selection */}
      <div className="right-panel">
        <h2 className="instruction">Select Your HSK Level:</h2>
        <div className="levels-container">
          {hskLevels.map((hsk) => (
            <div
              key={hsk.level}
              className="level-rectangle"
              onClick={() => setSelectedLevel(hsk.level)}
            >
              <p>HSK {hsk.level}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
