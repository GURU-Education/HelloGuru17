// RoleplayComponent.jsx
"use client";
import { useState } from "react";
import { useStateManagement } from "./stateManagement";
import { useAudioRecorder } from "./audioRecorder";
import { useSessionManager } from "./sessionManager";
import LevelSelection from "./screens/LevelSelection";
import TopicSelection from "./screens/TopicSelection";
import RoleSelection from "./screens/RoleSelection";
import ConversationScreen from "./screens/ConversationScreen";
import "./RoleplayComponent.css";
import StreamVideo from "../../_components/stream-video";

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
  return (
    <>
      {!state.selectedLevel ? (
        <LevelSelection {...state} />
      ) : !state.selectedTopic ? (
        <TopicSelection {...state} />
      ) : !state.selectedRole ? (
        <RoleSelection {...state} />
      ) : (
        // Pass both audio recorder's currentTranscription and isRecording
        <>
          <StreamVideo />
          <ConversationScreen
            {...state}
            {...session}
            setSplineObj={setSplineObj}
            startRecording={audio.startRecording}
            stopRecording={audio.stopRecording}
            currentTranscription={audio.currentTranscription}
            isRecording={audio.isRecording}
          />
        </>
      )}
    </>
  );
}
