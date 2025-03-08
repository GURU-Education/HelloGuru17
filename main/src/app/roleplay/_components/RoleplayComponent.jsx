// RoleplayComponent.jsx
"use client";
import { useState } from "react";
import { useStateManagement } from "./StateManagement";
import { useAudioRecorder } from "./AudioRecorder";
import { useSessionManager } from "./SessionManager";
import LevelSelection from "./screens/LevelSelection";
import TopicSelection from "./screens/TopicSelection";
import RoleSelection from "./screens/RoleSelection";
import ConversationScreen from "./screens/ConversationScreen";
import "./RoleplayComponent.css";

export default function RoleplayComponent() {
  const state = useStateManagement();
  const audio = useAudioRecorder(state.setPronunciationAnalysisResult);

  // Store the Spline object reference
  const [splineObj, setSplineObj] = useState(null);

  // Pass splineObj to SessionManager
  const session = useSessionManager(
    state.pronunciationAnalysisResult,
    state.selectedTopicData,
    state.selectedRole,
    audio.startRecording,
    audio.stopRecording,
    state.selectedHSK,
    state.selectedTopic,
    state.selectedConversation,
    splineObj // Pass the splineObj to SessionManager
  );

  // Handle screen selection logic
  if (!state.selectedLevel) {
    return <LevelSelection {...state} />;
  }
  if (state.selectedLevel && !state.selectedTopic) {
    return <TopicSelection {...state} />;
  }
  if (state.selectedLevel && state.selectedTopic && !state.selectedRole) {
    return <RoleSelection {...state} />;
  }

  // Pass setSplineObj to ConversationScreen
  return (
    <ConversationScreen
      {...state}
      {...audio}
      {...session}
      setSplineObj={setSplineObj}
    />
  );
}
