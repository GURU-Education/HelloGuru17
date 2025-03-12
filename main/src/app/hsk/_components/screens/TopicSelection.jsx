"use client";

import Spline from "@splinetool/react-spline";

export default function TopicSelection({
  selectedLevel,
  selectedHSK,
  setSelectedTopic,
  setSelectedLevel,
}) {
  return (
    <div className="level-selection-container">
      {/* Left Panel: Spline Bubble + Title */}
      <div className="bubble-wrapper-2">
        <Spline scene="https://prod.spline.design/Njxbejqx8MuiFCUy/scene.splinecode" />
      </div>
      <div className="left-panel">
        <div className="title-area">
          <h1 className="main-title">HSK Roleplay</h1>
          <p className="subtitle">With Xiao Qiu</p>
        </div>
      </div>

      {/* Right Panel: Topic Selection */}
      <div className="right-panel">
        <h2 className="instruction-topic">
          Select a Conversation
          <br />
          Topic for HSK {selectedLevel}:
        </h2>
        <div className="topic-grid">
          {selectedHSK?.topics.map((topic) => (
            <div
              key={topic.name}
              className="topic-btn"
              onClick={() => setSelectedTopic(topic.name)}
            >
              {topic.name}
            </div>
          ))}
        </div>
        <button
          className="back-btn"
          style={{ marginTop: 20, marginRight: 35, zIndex: 100 }}
          onClick={() => setSelectedLevel(null)}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
