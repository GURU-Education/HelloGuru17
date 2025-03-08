"use client";

import Spline from "@splinetool/react-spline";

export default function LevelSelection({ hskLevels, setSelectedLevel }) {
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

      {/* Right Panel: "Select Your HSK Level" + Stacked Rectangles & Circles */}
      <div className="right-panel">
        <h2 className="level-instruction">Select Your HSK Level:</h2>

        <div className="levels-stack">
          {hskLevels?.map((hsk, index) => (
            <div key={hsk.level} className="level-item">
              {/* Circle + Connecting Line */}
              <div className="circle-line-container">
                <div className="level-circle" />
                {/* Only show line if it's NOT the last item */}
                {index < hskLevels.length - 1 && (
                  <div className="vertical-line" />
                )}
              </div>

              {/* The rectangle (rounded) with the label */}
              <div
                className="level-rectangle"
                onClick={() => setSelectedLevel(hsk.level)}
              >
                <p>HSK {hsk.level}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
