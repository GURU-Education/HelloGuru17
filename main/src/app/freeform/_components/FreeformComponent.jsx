// FreeformComponent.jsx
"use client";
import { useState } from "react";
import { useStateManagement } from "./StateMangement";
import { useAudioRecorder } from "./AudioRecorder";
import { useSessionManager } from "./SessionManager";
import HSKSelectionScreen from "./screens/HSKSelectionScreen";
import TopicSelectionScreen from "./screens/TopicSelectionScreen";
import MissionSelectionScreen from "./screens/MissionSelectionScreen";
import FreeformConversationScreen from "./screens/FreeformConversationScreen";
import "./FreeformComponent.css"; // Reuse existing styles
import StreamVideo from "@/app/_components/stream-video";

export default function FreeformComponent() {
  const state = useStateManagement();
  const audio = useAudioRecorder(state.setPronunciationAnalysisResult);

  // Store the Spline object reference
  const [splineObj, setSplineObj] = useState(null);

  // Mission-specific states
  const [selectedHSK, setSelectedHSK] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [missionPhrases, setMissionPhrases] = useState([]);

  // Fetch and store mission data
  const [missions, setMissions] = useState(null);

  // Pass splineObj to SessionManager
  const session = useSessionManager(
    state.pronunciationAnalysisResult,
    null, // No topic data in freeform mode
    "student", // Default role
    audio.startRecording,
    audio.stopRecording,
    selectedHSK,
    selectedTopic,
    null, // No conversation data in freeform mode
    splineObj, // Pass the splineObj to SessionManager
    {
      title: selectedMission?.missionTitle || "",
      phrases: missionPhrases,
    } // Pass mission data to session manager
  );

  // Reset selections
  const handleReset = () => {
    setSelectedHSK(null);
    setSelectedTopic(null);
    setSelectedMission(null);
    setMissionPhrases([]);
  };

  // Handle HSK selection
  const handleSelectHSK = (hskLevel) => {
    setSelectedHSK(hskLevel);
    setSelectedTopic(null);
    setSelectedMission(null);
    setMissionPhrases([]);
  };

  // Handle Topic selection
  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setSelectedMission(null);
    setMissionPhrases([]);
  };

  // Handle Mission selection
  const handleSelectMission = (mission) => {
    setSelectedMission(mission);
    if (mission && mission.phrases) {
      setMissionPhrases(mission.phrases);
    }
  };

  // Handle screen selection logic based on what's been selected
  if (!selectedHSK) {
    return (
      <HSKSelectionScreen
        missions={missions}
        setMissions={setMissions}
        onSelectHSK={handleSelectHSK}
      />
    );
  }

  if (selectedHSK && !selectedTopic) {
    return (
      <TopicSelectionScreen
        selectedHSK={selectedHSK}
        missions={missions}
        onSelectTopic={handleSelectTopic}
        onReset={handleReset}
      />
    );
  }

  if (selectedHSK && selectedTopic && !selectedMission) {
    return (
      <MissionSelectionScreen
        selectedHSK={selectedHSK}
        selectedTopic={selectedTopic}
        missions={missions}
        onSelectMission={handleSelectMission}
        onReset={handleReset}
      />
    );
  }

  // Render the conversation screen with mission data
  return (
    <>
      <StreamVideo />
      <FreeformConversationScreen
        {...audio}
        {...session}
        setSplineObj={setSplineObj}
        selectedHSK={selectedHSK}
        selectedTopic={selectedTopic}
        selectedMission={selectedMission}
        missionPhrases={missionPhrases}
        handleReset={handleReset}
      />
    </>
  );
}
