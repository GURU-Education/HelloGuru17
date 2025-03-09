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

        if (data.success) {
          setMissions(data.missions);
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
    if (!hskLevelData || !hskLevelData.topics) return [];

    return Object.keys(hskLevelData.topics);
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
    if (!missions) return;

    const missionForLevel = missions.find(
      (mission) => Object.keys(mission)[0] === hskLevel
    );
    if (!missionForLevel) return;

    const hskLevelData = missionForLevel[hskLevel];
    if (!hskLevelData || !hskLevelData.topics || !hskLevelData.topics[topic])
      return;

    const missionsForTopic = hskLevelData.topics[topic];
    return missionsForTopic;
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
