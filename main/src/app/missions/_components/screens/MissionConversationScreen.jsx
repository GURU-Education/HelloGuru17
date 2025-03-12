import { useEffect, useState, useRef } from "react";
import Spline from "@splinetool/react-spline";
import "./MissionConversationScreen.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MissionConversationScreen({
  selectedHSK,
  selectedTopic,
  selectedMission,
  missionPhrases,
  handleReset,
  startSession,
  stopSession,
  isSessionActive,
  events,
  setSplineObj,
  focusOnPhrase,
  sendTextMessage,
}) {
  // Generate subtitles from AI responses
  const [aiResponse, setAiResponse] = useState("");
  const [aiSubtitle, setAiSubtitle] = useState(""); // State for AI subtitle text
  const [showAiSubtitle, setShowAiSubtitle] = useState(false); // Control subtitle visibility
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineLoadAttempts, setSplineLoadAttempts] = useState(0);
  const [splineFullyLoaded, setSplineFullyLoaded] = useState(false);
  const splineInitTimer = useRef(null);
  const chatBoxRef = useRef(null);
  const subtitleTimerRef = useRef(null);

  // Force re-render of Spline component when needed
  const [splineKey, setSplineKey] = useState(0);

  // For phrase highlighting during practice
  const [highlightedPhrase, setHighlightedPhrase] = useState(null);
  const [userMessage, setUserMessage] = useState("");

  // Handle Spline scene load
  function handleSplineLoad(spline) {
    // Check if the scene is properly loaded by checking for objects
    const isProperlyLoaded =
      spline._proxyObjectCache && spline._proxyObjectCache.size > 0;

    if (!isProperlyLoaded) {
      // If not properly loaded and we haven't tried too many times, try reloading
      if (splineLoadAttempts < 3) {
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
      } catch (err) {
        console.warn("Could not get available events:", err);
      }
    }

    // Debug: list available objects if the method exists
    if (typeof spline.getAllObjects === "function") {
      try {
        const objects = spline.getAllObjects();

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
      } catch (err) {
        console.warn("Could not get available objects:", err);
      }
    }

    // Store the spline object in parent component
    setSplineObj(spline);
    setSplineLoaded(true);

    // Test mouth animation if spline is loaded
    try {
      // Try standard event
      try {
        spline.emitEvent("keyDown", "Mouth");
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
      if (subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current);
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

    // Look for audio transcripts for subtitles
    const doneEvents = events.filter(
      (event) => event.type === "response.output_item.done"
    );

    if (doneEvents.length > 0) {
      // Get the most recent done event
      const latestDoneEvent = doneEvents[0]; // Events are stored newest first

      try {
        // Extract the transcript from the content array
        if (
          latestDoneEvent.item &&
          latestDoneEvent.item.content &&
          latestDoneEvent.item.content.length > 0
        ) {
          const contentItem = latestDoneEvent.item.content.find(
            (item) => item.type === "audio" && item.transcript
          );

          if (contentItem && contentItem.transcript) {
            // Update the AI subtitle
            setAiSubtitle(contentItem.transcript);
            setShowAiSubtitle(true);

            // Hide subtitle after a delay
            if (subtitleTimerRef.current) {
              clearTimeout(subtitleTimerRef.current);
            }

            subtitleTimerRef.current = setTimeout(() => {
              setShowAiSubtitle(false);
            }, 8000); // Adjust time as needed
          }
        }
      } catch (error) {
        console.error("Error extracting transcript:", error);
      }
    }
  }, [events]);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [aiResponse]);

  // Function to handle phrase click for pronunciation focus
  const handlePhraseClick = (phrase) => {
    // Highlight the selected phrase
    setHighlightedPhrase(phrase);

    // If a session is active, send a message to practice this phrase
    if (isSessionActive && focusOnPhrase) {
      // Make sure we can handle both object phrases and string phrases
      if (typeof phrase === "object" && phrase.chinese) {
        focusOnPhrase(phrase);
      } else if (typeof phrase === "string") {
        // If it's just a string, create a simple object
        focusOnPhrase({ chinese: phrase });
      }
    }
  };

  // Handle sending a text message
  const handleSendMessage = () => {
    if (userMessage.trim() && isSessionActive && sendTextMessage) {
      sendTextMessage(userMessage);
      setUserMessage("");
    }
  };

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

        {/* AI speech subtitle overlay */}
        {/* {showAiSubtitle && aiSubtitle && (
          <div className="ai-subtitle-container">
            <div className="ai-subtitle">{aiSubtitle}</div>
          </div>
        )} */}
      </div>

      <div className="conversation-panel">
        <h2 className="conv-title">
          {selectedHSK} | {selectedTopic}
          <br />
          <span style={{ fontSize: "0.8em" }}>
            {selectedMission.missionTitle}
          </span>
        </h2>

        {/* Mission Phrases Panel */}
        <div className="phrases-panel">
          <h3>Key Phrases</h3>
          <div className="phrases-container">
            {missionPhrases.map((phrase, index) => (
              <div
                key={index}
                className={`phrase-item ${
                  highlightedPhrase === phrase ? "phrase-highlighted" : ""
                }`}
                onClick={() => handlePhraseClick(phrase)}
              >
                <div className="chinese">{phrase.chinese}</div>
                <div className="pinyin">{phrase.pinyin}</div>
                <div className="english">{phrase.english}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="chat-box" ref={chatBoxRef}>
          {/* Initial instruction message */}
          {!aiResponse && (
            <div className="chat-bubble system-message">
              Click "Start Session" to begin practicing with the key phrases
              above.
            </div>
          )}

          {/* AI messages */}
          {isSessionActive && aiResponse && (
            <div className="chat-bubble ai-response">{aiResponse}</div>
          )}
        </div>

        {/* User input area - only shown when session is active */}
        {isSessionActive && (
          <div className="user-input-area">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Type your message here..."
              className="form-control"
            />
            <button onClick={handleSendMessage} className="btn btn-primary">
              Send
            </button>
          </div>
        )}

        <div className="conv-buttons">
          <button
            onClick={startSession}
            className="btn btn-success"
            disabled={isSessionActive || !splineLoaded}
          >
            {isSessionActive ? "Session Started" : "Start Session"}
          </button>
          <button
            onClick={stopSession}
            className="btn btn-danger"
            disabled={!isSessionActive}
          >
            Stop Session
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Choose New Mission
          </button>
        </div>

        <p className="pro-tip">
          Pro Tip: Click on a phrase above to practice it specifically.
        </p>
      </div>
    </div>
  );
}
