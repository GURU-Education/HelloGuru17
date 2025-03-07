// RoleplayComponent.jsx
"use client";
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
  const session = useSessionManager(
    state.pronunciationAnalysisResult,
    state.selectedTopicData,
    state.selectedRole,
    audio.startRecording,
    audio.stopRecording,
    state.selectedHSK,
    state.selectedTopic,
    state.selectedConversation
  );

  if (!state.selectedLevel) {
    return <LevelSelection {...state} />;
  }
  if (state.selectedLevel && !state.selectedTopic) {
    return <TopicSelection {...state} />;
  }
  if (state.selectedLevel && state.selectedTopic && !state.selectedRole) {
    return <RoleSelection {...state} />;
  }
  return <ConversationScreen {...state} {...audio} {...session} />;
}