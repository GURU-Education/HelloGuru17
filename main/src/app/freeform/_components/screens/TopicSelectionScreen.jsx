// screens/freeform/TopicSelectionScreen.jsx
import React from "react";

export default function TopicSelectionScreen({
  selectedHSK,
  missions,
  onSelectTopic,
  onReset,
}) {
  // Get topics for the selected HSK level
  const getTopics = () => {
    if (!missions || !selectedHSK) return [];

    // Find the mission object for this HSK level
    const missionForLevel = missions.find((mission) => {
      return Object.keys(mission).includes(selectedHSK);
    });

    if (!missionForLevel) return [];

    // Extract topics from the HSK level data
    const hskData = missionForLevel[selectedHSK];
    if (!hskData || !hskData.topics) return [];

    // Return topic names as an array, excluding "_id"
    return Object.keys(hskData.topics).filter((topic) => topic !== "_id");
  };

  const topics = getTopics();
  console.log(topics);
  return (
    <div className="background-container">
      <h1 className="main-title">
        {selectedHSK}
        <br />
        <span>Select Topic</span>
      </h1>

      <div className="circle-row">
        {topics.length === 0 ? (
          <p>No topics available for this HSK level</p>
        ) : (
          topics.map((topic, index) => (
            <div
              key={index}
              className="circle"
              onClick={() => onSelectTopic(topic)}
            >
              <p>{topic}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onReset}
        className="back-btn role-btn"
        style={{ marginTop: "30px" }}
      >
        Back to HSK Levels
      </button>

      <p className="subtitle">Choose a topic for your free practice session</p>
    </div>
  );
}
