// screens/ConversationScreen.jsx - updated for scripted roleplay
import { useEffect, useState, useRef } from "react";
import Spline from "@splinetool/react-spline";
// import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

export default function ConversationScreen({
  selectedLevel,
  selectedRole,
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
  setSplineObj,
  currentLineIndex,
  playNextLine,
  handleUserFinishedSpeaking,
  // Audio recorder props
  currentTranscription = "",
  isRecording = false,
}) {
  // Generate subtitles from AI responses
  const [aiResponse, setAiResponse] = useState("");
  const [aiSubtitle, setAiSubtitle] = useState(""); // State to hold the current AI subtitle
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineLoadAttempts, setSplineLoadAttempts] = useState(0);
  const [splineFullyLoaded, setSplineFullyLoaded] = useState(false); // Track if Spline is fully loaded
  const splineInitTimer = useRef(null);
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);

  // For subtitle display - only AI subtitles (no timeout)
  const [showAiSubtitle, setShowAiSubtitle] = useState(false);

  // For pronunciation results modal
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [pronunciationResults, setPronunciationResults] = useState(null);

  // Force re-render of Spline component when needed
  const [splineKey, setSplineKey] = useState(0);

  // When a role or line needs to be spoken
  useEffect(() => {
    if (isSessionActive && selectedTopicData) {
      // Determine if it's the user's turn to speak based on currentLineIndex and selectedRole
      const isUserTurn = (currentLineIndex + selectedRole) % 2 === 1;
      setWaitingForUserInput(isUserTurn);

      // If it's the user's turn, display their line as a prompt
      if (
        isUserTurn &&
        currentLineIndex < selectedTopicData.conversation.length
      ) {
        const line = selectedTopicData.conversation[currentLineIndex];
        const dialogueOnly = line.includes(":")
          ? line.split(":")[1].trim()
          : line;

        // Display the user's line as a prompt above the avatar
        setAiSubtitle(`Your line: "${dialogueOnly}"`);
        setShowAiSubtitle(true);
      }
    }
  }, [isSessionActive, currentLineIndex, selectedRole, selectedTopicData]);

  // Extract AI transcript from response.output_item.done events
  useEffect(() => {
    if (!events || events.length === 0) return;

    // Look for response.output_item.done events
    const doneEvents = events.filter(
      (event) => event.type === "response.output_item.done"
    );

    if (doneEvents.length > 0) {
      // Get the most recent done event
      const latestDoneEvent = doneEvents[0]; // Since events are stored newest first

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
            // Update the AI subtitle - no timeout, stays visible until new content
            setAiSubtitle(contentItem.transcript);
            setShowAiSubtitle(true);

            // After AI speaks, set waiting for user input
            const isUserNext = (currentLineIndex + selectedRole) % 2 === 1;
            setWaitingForUserInput(isUserNext);
          }
        }
      } catch (error) {
        console.error("Error extracting transcript:", error);
      }
    }
  }, [events, currentLineIndex, selectedRole]);

  // Listen for user to finish speaking
  useEffect(() => {
    if (
      isSessionActive &&
      waitingForUserInput &&
      !isRecording &&
      currentTranscription
    ) {
      // Short delay to make sure user is done speaking
      const timer = setTimeout(() => {
        handleUserFinishedSpeaking();
        setWaitingForUserInput(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [
    isRecording,
    currentTranscription,
    waitingForUserInput,
    isSessionActive,
    handleUserFinishedSpeaking,
  ]);

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

  // Process events to extract AI responses for chat box
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

  // Function to show pronunciation results
  const handleShowResults = () => {
    // Load dummy data
    const dummyResults = {
      Id: "0e078acf09b44342b650683235fd407b",
      RecognitionStatus: "Success",
      Offset: 168700000,
      Duration: 226000000,
      Channel: 0,
      DisplayText:
        "你好，就我一个人，请给我一个靠窗的座位，谢谢，我想点宫保鸡丁和一份米饭好的，谢谢。",
      SNR: 26.458223,
      NBest: [
        {
          Confidence: 0.772628,
          Lexical:
            "你好 就 我 一个 人 请 给 我 一个 靠 窗 的 座位 谢谢 我 想 点 宫保鸡丁 和 一 份 米饭 好 的 谢谢",
          ITN: "你好 就 我 一个 人 请 给 我 一个 靠 窗 的 座位 谢谢 我 想 点 宫保鸡丁 和 一 份 米饭 好 的 谢谢",
          MaskedITN:
            "你好就我一个人请给我一个靠窗的座位谢谢我想点宫保鸡丁和一份米饭好的谢谢",
          Display:
            "你好，就我一个人，请给我一个靠窗的座位，谢谢，我想点宫保鸡丁和一份米饭好的，谢谢。",
          PronunciationAssessment: {
            AccuracyScore: 62,
            FluencyScore: 41,
            CompletenessScore: 52,
            PronScore: 47.4,
          },
          Words: [
            {
              Word: "你好",
              Offset: 168700000,
              Duration: 11600000,
              PronunciationAssessment: {
                AccuracyScore: 79,
                ErrorType: "None",
              },
            },
            {
              Word: "就",
              Offset: 183700000,
              Duration: 3500000,
              PronunciationAssessment: {
                AccuracyScore: 60,
                ErrorType: "None",
              },
            },
            // Additional words omitted for brevity
          ],
        },
      ],
    };

    setPronunciationResults(dummyResults);
    setShowResultsModal(true);
  };

  // Function to get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "primary";
    if (score >= 40) return "warning";
    return "danger";
  };

  // Function to get badge color based on score
  const getScoreBadgeClass = (score) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-primary";
    if (score >= 40) return "bg-warning text-dark";
    return "bg-danger";
  };

  // Function to manually progress to the next line (for testing)
  const handleManualProgress = () => {
    if (waitingForUserInput) {
      handleUserFinishedSpeaking();
      setWaitingForUserInput(false);
    } else {
      playNextLine();
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
        {showAiSubtitle && aiSubtitle && (
          <div className="ai-subtitle-container">
            <div
              className={`ai-subtitle ${
                waitingForUserInput ? "user-prompt" : ""
              }`}
            >
              {aiSubtitle}
            </div>
          </div>
        )}

        {/* Current line indicator */}
        {isSessionActive && selectedTopicData && (
          <div className="current-line-indicator">
            <span className="line-number">
              Line {currentLineIndex} of {selectedTopicData.conversation.length}
            </span>
            <span className="speaker-indicator">
              {(currentLineIndex + selectedRole) % 2 === 1
                ? "Your turn"
                : "AI turn"}
            </span>
          </div>
        )}
      </div>

      <div className="conversation-panel">
        <h2 className="conv-title">
          HSK {selectedLevel} | {selectedTopic}
        </h2>

        <div className="chat-box" ref={chatBoxRef}>
          {selectedTopicData?.conversation
            .slice(0, currentLineIndex)
            .map((line, index) => {
              const isPerson1 = (selectedRole + index) % 2 == 1;
              return (
                <div
                  key={index}
                  className={`chat-bubble ${isPerson1 ? "person1" : "person2"}`}
                >
                  {line}
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
            className="btn btn-primary conv-next"
            onClick={handleManualProgress}
            disabled={!isSessionActive}
          >
            Next Line
          </button>
          <button
            onClick={startSession}
            className="btn btn-success next-btn"
            disabled={isSessionActive || !splineLoaded}
          >
            {splineLoaded ? "Start Session" : "Loading..."}
          </button>
          <button
            onClick={stopSession}
            className="btn btn-danger next-btn"
            disabled={!isSessionActive}
          >
            Stop Session
          </button>
          <button onClick={handleShowResults} className="btn btn-info next-btn">
            <i className="bi bi-graph-up"></i> Get Results
          </button>
          <button className="btn btn-warning conv-reset" onClick={handleReset}>
            Start Over
          </button>
        </div>

        <p className="pro-tip">
          Pro Tip: Repeat after the AI when it's your turn to practice
          pronunciation.
        </p>
      </div>

      {/* Pronunciation Results Modal code remains the same... */}
      {showResultsModal && pronunciationResults && (
        <div
          className="modal show pronunciation-modal"
          style={{ display: "block" }}
        >
          {/* Modal content remains the same */}
        </div>
      )}

      {/* Modal Backdrop */}
      {showResultsModal && <div className="modal-backdrop show"></div>}
    </div>
  );
}
