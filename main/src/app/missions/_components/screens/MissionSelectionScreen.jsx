import React from "react";

export default function MissionSelectionScreen({
  selectedHSK,
  selectedTopic,
  missions,
  onSelectMission,
  onReset,
}) {
  // Get missions for the selected HSK level and topic
  const getMissions = () => {
    if (!missions || !selectedHSK || !selectedTopic) return [];

    // Find the mission object for this HSK level
    const missionForLevel = missions.find((mission) => {
      return Object.keys(mission).includes(selectedHSK);
    });

    if (!missionForLevel) return [];

    // Extract missions for this topic
    const hskData = missionForLevel[selectedHSK];

    // Handle case where topics is an array of objects (as in your JSON)
    if (hskData && hskData.topics && Array.isArray(hskData.topics)) {
      // Find the topic object that matches the selected topic
      const topicObj = hskData.topics.find(
        (t) => Object.keys(t)[0] === selectedTopic
      );
      if (topicObj && topicObj[selectedTopic]) {
        return topicObj[selectedTopic];
      }
      return [];
    }

    // Handle original case where topics is an object
    if (hskData && hskData.topics && hskData.topics[selectedTopic]) {
      return hskData.topics[selectedTopic];
    }

    return [];
  };

  const availableMissions = getMissions();

  return (
    <div className="background-container">
      <h1 className="main-title">
        {selectedTopic}
        <br />
        <span>{selectedHSK} - Select Mission</span>
      </h1>

      <div className="circle-row">
        {availableMissions.length === 0 ? (
          <p>No missions available for this topic</p>
        ) : (
          availableMissions.map((mission, index) => (
            <div
              key={index}
              className="circle"
              onClick={() => onSelectMission(mission)}
              style={{ width: "200px", height: "200px" }}
            >
              <p>{mission.missionTitle}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={onReset}
        className="back-btn role-btn"
        style={{ marginTop: "30px" }}
      >
        Start Over
      </button>

      <p className="subtitle">
        Select a mission for your free practice session
      </p>
    </div>
  );
}
