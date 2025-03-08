// screens/ConversationScreen.jsx
import { useEffect, useState, useRef } from "react";
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
  const [splineLoadAttempts, setSplineLoadAttempts] = useState(0);
  const [splineFullyLoaded, setSplineFullyLoaded] = useState(false); // Track if Spline is fully loaded
  const splineInitTimer = useRef(null);

  // Force re-render of Spline component when needed
  const [splineKey, setSplineKey] = useState(0);

  // Handle Spline scene load
  function handleSplineLoad(spline) {
    console.log("Spline scene loaded:", spline);

    // Check if the scene is properly loaded by checking for objects
    const isProperlyLoaded =
      spline._proxyObjectCache && spline._proxyObjectCache.size > 0;

    console.log(
      `Spline properly loaded: ${isProperlyLoaded} (${
        spline._proxyObjectCache?.size || 0
      } objects)`
    );

    if (!isProperlyLoaded) {
      // If not properly loaded and we haven't tried too many times, try reloading
      if (splineLoadAttempts < 3) {
        console.log(
          `Spline not properly loaded, attempt ${
            splineLoadAttempts + 1
          } - retrying...`
        );

        // Clear any existing timer
        if (splineInitTimer.current) {
          clearTimeout(splineInitTimer.current);
        }

        // Set a timer to reload the Spline component
        splineInitTimer.current = setTimeout(() => {
          setSplineKey((prevKey) => prevKey + 1);
          setSplineLoadAttempts((prevAttempts) => prevAttempts + 1);
        }, 100);

        return;
      } else {
        console.warn("Failed to properly load Spline after multiple attempts");
        // Still proceed with what we have
        setSplineFullyLoaded(true);
      }
    } else {
      // Mark as fully loaded after successful load
      setSplineFullyLoaded(true);
    }

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

        // Try to identify objects that might be the mouth or head
        const potentialMouthObjects = objects.filter((obj) => {
          const name = obj.name.toLowerCase();
          return (
            name.includes("mouth") ||
            name.includes("head") ||
            name.includes("face") ||
            name.includes("talk")
          );
        });

        if (potentialMouthObjects.length > 0) {
          console.log("Potential mouth objects:", potentialMouthObjects);
        }
      } catch (err) {
        console.warn("Could not get available objects:", err);
      }
    }

    // Store the spline object in parent component
    setSplineObj(spline);
    setSplineLoaded(true);

    // Test mouth animation if spline is loaded
    try {
      console.log("Testing mouth animation with various methods...");

      // Try standard event
      try {
        spline.emitEvent("keyDown", "Mouth");
        console.log("Emitted keyDown Mouth event");
      } catch (err) {
        console.warn("Failed standard Mouth event", err);
      }

      // Try alternative event names
      const testEventNames = [
        "mouth",
        "talk",
        "Talk",
        "speak",
        "Speak",
        "open",
        "Open",
      ];
      testEventNames.forEach((eventName) => {
        try {
          spline.emitEvent("keyDown", eventName);
          console.log(`Tested alternative event: ${eventName}`);
        } catch (err) {
          // Silently fail for alternative events
        }
      });

      // Close mouth after 1 second
      setTimeout(() => {
        try {
          spline.emitEvent("keyUp", "Mouth");

          // Try alternative event names for keyUp
          testEventNames.forEach((eventName) => {
            try {
              spline.emitEvent("keyUp", eventName);
            } catch (err) {
              // Silently fail
            }
          });
        } catch (err) {
          console.warn("Error closing mouth", err);
        }
      }, 1000);
    } catch (err) {
      console.warn("Error testing mouth animation:", err);
    }
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (splineInitTimer.current) {
        clearTimeout(splineInitTimer.current);
      }
    };
  }, []);

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
      {/* Loading state */}
      {!splineFullyLoaded && (
        <div className="spline-loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading avatar...</p>
        </div>
      )}

      {/* Spline container - hidden until fully loaded */}
      <div
        className="spline-wrapper-chat"
        style={{
          opacity: splineFullyLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <Spline
          key={splineKey} // Force re-render when key changes
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
