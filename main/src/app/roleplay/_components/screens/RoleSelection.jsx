"use client";

import Spline from "@splinetool/react-spline";

export default function RoleSelection({
  selectedLevel,
  selectedTopic,
  setSelectedRole,
  setSelectedTopic,
}) {
  return (
    <div className="level-selection-container">
      {/* Left Panel: Spline Bubble + Text */}
      <div className="left-panel">
        <div className="bubble-wrapper">
          <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
        </div>
        <div className="title-area">
          <h1 className="main-title">HSK {selectedLevel}</h1>
          <h2 className="subtitle">{selectedTopic}</h2>
        </div>
      </div>

      {/* Right Panel: Role Selection */}
      <div className="right-panel-role-selection">
        <h2 className="instruction-role">Select Your Role:</h2>
        <div className="role-container">
          <button className="role-btn" onClick={() => setSelectedRole(1)}>
            Person 1
          </button>
          <button className="role-btn" onClick={() => setSelectedRole(2)}>
            Person 2
          </button>
          {/* <button
            className="role-btn back-btn"
            onClick={() => setSelectedTopic(null)}
          >
            ← Back
          </button> */}
        </div>
      </div>
    </div>
  );
}
