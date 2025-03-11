// MissionStateManagement.js
import { useState, useEffect } from "react";

export function useStateManagement() {
  // Mission data states
  const [missions, setMissions] = useState(null);
  const [selectedHSKLevel, setSelectedHSKLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [missionPhrases, setMissionPhrases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch missions data on component mount
  useEffect(() => {
    async function fetchMissions() {
      try {
        setIsLoading(true);
        // You can replace this with your actual API endpoint
        const response = await fetch("/api/mission");
        const data = await response.json();

        // Format the data correctly for our state
        if (data) {
          // Remove MongoDB ObjectId and create a consistent missions array
          const formattedMissions = [];

          // Check if data has keys like HSK1, HSK2, etc.
          const hskKeys = Object.keys(data).filter((key) =>
            key.startsWith("HSK")
          );

          if (hskKeys.length > 0) {
            // Structure is like your third document
            hskKeys.forEach((hskKey) => {
              const hskData = data[hskKey];
              const missionObj = {};
              missionObj[hskKey] = hskData;
              formattedMissions.push(missionObj);
            });
          } else if (data.missions) {
            // Structure has a missions array
            formattedMissions.push(...data.missions);
          } else {
            // Assume it's a single mission object
            formattedMissions.push(data);
          }

          setMissions(formattedMissions);
        } else {
          console.error("Failed to fetch missions");
        }
      } catch (error) {
        console.error("Error fetching missions:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMissions();
  }, []);

  // Get available HSK levels from missions
  const availableHSKLevels = missions
    ? missions
        .map((mission) => Object.keys(mission)[0])
        .filter((key) => key.startsWith("HSK"))
    : [];

  // Handle selection of HSK level
  const handleSelectHSKLevel = (level) => {
    setSelectedHSKLevel(level);
    setSelectedTopic(null);
    setSelectedMission(null);
    setMissionPhrases([]);
  };

  // Get topics available for the selected HSK level
  const getTopicsForLevel = () => {
    if (!missions || !selectedHSKLevel) return [];

    const missionForLevel = missions.find(
      (mission) => Object.keys(mission)[0] === selectedHSKLevel
    );
    if (!missionForLevel) return [];

    const hskLevelData = missionForLevel[selectedHSKLevel];

    // Check if structure has 'topics' array (like in your third document)
    if (hskLevelData.topics && Array.isArray(hskLevelData.topics)) {
      // Extract topic names from the array of topic objects
      return hskLevelData.topics.map((topicObj) => {
        return Object.keys(topicObj)[0];
      });
    }

    // Original format: topics is an object with keys as topic names
    if (
      hskLevelData &&
      hskLevelData.topics &&
      typeof hskLevelData.topics === "object"
    ) {
      return Object.keys(hskLevelData.topics);
    }

    return [];
  };

  // Get available topics for the selected HSK level
  const availableTopics = getTopicsForLevel();

  // Handle selection of a topic
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setSelectedMission(null);
    setMissionPhrases([]);

    // Automatically load missions for this topic
    if (selectedHSKLevel && topic) {
      loadMissionsForTopic(selectedHSKLevel, topic);
    }
  };

  // Function to load missions for a specific topic
  const loadMissionsForTopic = (hskLevel, topic) => {
    if (!missions) return [];

    const missionForLevel = missions.find(
      (mission) => Object.keys(mission)[0] === hskLevel
    );
    if (!missionForLevel) return [];

    const hskLevelData = missionForLevel[hskLevel];

    // Handle the array format from your third document
    if (hskLevelData.topics && Array.isArray(hskLevelData.topics)) {
      const topicObj = hskLevelData.topics.find(
        (t) => Object.keys(t)[0] === topic
      );
      if (topicObj) {
        return topicObj[topic]; // This should be an array of missions
      }
      return [];
    }

    // Original format
    if (hskLevelData && hskLevelData.topics && hskLevelData.topics[topic]) {
      return hskLevelData.topics[topic];
    }

    return [];
  };

  // Get missions for the selected topic
  const availableMissions =
    selectedHSKLevel && selectedTopic
      ? loadMissionsForTopic(selectedHSKLevel, selectedTopic) || []
      : [];

  // Handle selection of a mission
  const handleSelectMission = (mission) => {
    setSelectedMission(mission);

    // Load phrases for this mission
    if (mission && mission.phrases) {
      setMissionPhrases(mission.phrases);
    }
  };

  // Reset all selections
  const resetMissionSelections = () => {
    setSelectedHSKLevel(null);
    setSelectedTopic(null);
    setSelectedMission(null);
    setMissionPhrases([]);
  };

  return {
    // Data states
    missions,
    availableHSKLevels,
    availableTopics,
    availableMissions,
    selectedHSKLevel,
    selectedTopic,
    selectedMission,
    missionPhrases,
    isLoading,

    // Actions
    setSelectedHSKLevel: handleSelectHSKLevel,
    setSelectedTopic: handleSelectTopic,
    setSelectedMission: handleSelectMission,
    resetMissionSelections,
  };
}
