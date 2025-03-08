// screens/ConversationScreen.jsx
import { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import "../RoleplayComponent.css";

export default function ConversationScreen({
  selectedLevel,
  selectedTopic,
  selectedTopicData,
  dialogueIndex,
  chatBoxRef,
  handleNextLine,
  handleReset,
  startSession,
  stopSession,
  isSessionActive,
  events,
  setSplineObj, // Receive setSplineObj function from parent
}) {
  // Generate subtitles from AI responses
  const [aiResponse, setAiResponse] = useState("");
  const [splineLoaded, setSplineLoaded] = useState(false);

  // Handle Spline scene load
  function handleSplineLoad(spline) {
    console.log("Spline scene loaded:", spline);

    // Debug: list available events if the method exists
    if (typeof spline.getAvailableEvents === "function") {
      try {
        const events = spline.getAvailableEvents();
        console.log("Available Spline events:", events);
      } catch (err) {
        console.warn("Could not get available events:", err);
      }
    }

    // Debug: list available objects if the method exists
    if (typeof spline.getAllObjects === "function") {
      try {
        const objects = spline.getAllObjects();
        console.log("Available Spline objects:", objects);
      } catch (err) {
        console.warn("Could not get available objects:", err);
      }
    }

    // Store the spline object in parent component
    setSplineObj(spline);
    setSplineLoaded(true);

    // Test mouth animation if spline is loaded
    try {
      console.log("Testing mouth animation...");
      spline.emitEvent("keyDown", "Mouth");

      // Close mouth after 1 second
      setTimeout(() => {
        spline.emitEvent("keyUp", "Mouth");
      }, 1000);
    } catch (err) {
      console.warn("Error testing mouth animation:", err);
    }
  }

  // Process events to extract AI responses
  useEffect(() => {
    if (!events || events.length === 0) return;

    // Extract text content from content.delta events
    const contentEvents = events.filter(
      (event) =>
        event.type === "content.delta" &&
        event.delta &&
        event.delta.type === "text"
    );

    if (contentEvents.length > 0) {
      // Combine all text deltas
      let fullText = "";
      contentEvents.forEach((event) => {
        if (event.delta && event.delta.text) {
          fullText += event.delta.text;
        }
      });

      setAiResponse(fullText);
    }
  }, [events]);

  return (
    <div className="background-container">
      <div className="spline-wrapper-chat">
        <Spline
          scene="https://prod.spline.design/Njxbejqx8MuiFCUy/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>

      <div className="conversation-panel">
        <h2 className="conv-title">
          HSK {selectedLevel} | {selectedTopic}
        </h2>

        <div className="chat-box" ref={chatBoxRef}>
          {selectedTopicData.conversation
            .slice(0, dialogueIndex + 1)
            .map((line, index) => {
              const isPerson1 = line.startsWith("Person 1");
              return (
                <div
                  key={index}
                  className={`chat-bubble ${isPerson1 ? "person1" : "person2"}`}
                >
                  {line.replace("Person 1: ", "").replace("Person 2: ", "")}
                </div>
              );
            })}

          {/* Display AI Response as a chat bubble */}
          {isSessionActive && aiResponse && (
            <div className="chat-bubble ai-response">{aiResponse}</div>
          )}
        </div>

        <div className="conv-buttons">
          <button
            className="conv-next"
            onClick={handleNextLine}
            disabled={
              !selectedTopicData ||
              dialogueIndex >= selectedTopicData.conversation.length - 1
            }
          >
            {dialogueIndex >= (selectedTopicData?.conversation.length || 0) - 1
              ? "No More Lines"
              : "Next"}
          </button>
          <button
            onClick={startSession}
            className="btn next-btn"
            disabled={isSessionActive || !splineLoaded}
          >
            {splineLoaded ? "Start Session" : "Loading..."}
          </button>
          <button
            onClick={stopSession}
            className="btn next-btn"
            disabled={!isSessionActive}
          >
            Stop Session
          </button>
          <button className="conv-reset" onClick={handleReset}>
            Start Over
          </button>
        </div>

        <p className="pro-tip">
          Pro Tip: Optimize your speaking lesson by enabling your microphone.
        </p>
      </div>
    </div>
  );
}
