// screens/ConversationScreen.jsx with pronunciation results modal
import { useEffect, useState, useRef } from "react";
import Spline from "@splinetool/react-spline";
import "../RoleplayComponent.css";
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
  setSplineObj, // Receive setSplineObj function from parent
  // Audio recorder props
  currentTranscription = "",
  isRecording = false,
}) {
  // Generate subtitles from AI responses
  const [aiResponse, setAiResponse] = useState("");
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineLoadAttempts, setSplineLoadAttempts] = useState(0);
  const [splineFullyLoaded, setSplineFullyLoaded] = useState(false); // Track if Spline is fully loaded
  const splineInitTimer = useRef(null);

  // For subtitle display
  const [showSubtitle, setShowSubtitle] = useState(false);
  const subtitleTimerRef = useRef(null);

  // For pronunciation results modal
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [pronunciationResults, setPronunciationResults] = useState(null);

  // Force re-render of Spline component when needed
  const [splineKey, setSplineKey] = useState(0);

  // Update subtitle visibility when transcription changes
  useEffect(() => {
    if (currentTranscription && currentTranscription.trim() !== "") {
      setShowSubtitle(true);

      // Clear any existing timer
      if (subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current);
      }

      // Set a new timer to hide subtitle after speaking stops
      subtitleTimerRef.current = setTimeout(() => {
        if (!isRecording) {
          setShowSubtitle(false);
        }
      }, 3000);
    } else if (!isRecording) {
      // No transcription and not recording, hide subtitles
      setShowSubtitle(false);
    }

    return () => {
      if (subtitleTimerRef.current) {
        clearTimeout(subtitleTimerRef.current);
      }
    };
  }, [currentTranscription, isRecording]);

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

        if (potentialMouthObjects.length > 0) {
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
            {
              Word: "我",
              Offset: 187500000,
              Duration: 3000000,
              PronunciationAssessment: {
                AccuracyScore: 50,
                ErrorType: "None",
              },
            },
            {
              Word: "一个",
              Offset: 190500000,
              Duration: 4000000,
              PronunciationAssessment: {
                AccuracyScore: 70,
                ErrorType: "None",
              },
            },
            {
              Word: "人",
              Offset: 194500000,
              Duration: 3000000,
              PronunciationAssessment: {
                AccuracyScore: 65,
                ErrorType: "None",
              },
            },
            {
              Word: "请",
              Offset: 197500000,
              Duration: 3000000,
              PronunciationAssessment: {
                AccuracyScore: 75,
                ErrorType: "None",
              },
            },
            {
              Word: "给",
              Offset: 200500000,
              Duration: 3000000,
              PronunciationAssessment: {
                AccuracyScore: 40,
                ErrorType: "None",
              },
            },
            {
              Word: "我",
              Offset: 203500000,
              Duration: 3000000,
              PronunciationAssessment: {
                AccuracyScore: 85,
                ErrorType: "None",
              },
            },
            {
              Word: "一个",
              Offset: 206500000,
              Duration: 4000000,
              PronunciationAssessment: {
                AccuracyScore: 70,
                ErrorType: "None",
              },
            },
            {
              Word: "靠窗",
              Offset: 210500000,
              Duration: 4000000,
              PronunciationAssessment: {
                AccuracyScore: 65,
                ErrorType: "None",
              },
            },
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
        {/* User speech subtitle overlay */}
        {showSubtitle && currentTranscription && (
          <div className="user-subtitle-container">
            <div className="user-subtitle">{currentTranscription}</div>
          </div>
        )}
        </div>

      <div className="conversation-panel">
        <h2 className="conv-title">
          HSK {selectedLevel} | {selectedTopic}
        </h2>

        <div className="chat-box" ref={chatBoxRef}>
          {selectedTopicData.conversation
            .slice(0, dialogueIndex + 1)
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
          Pro Tip: Optimize your speaking lesson by enabling your microphone.
        </p>
      </div>

      {/* Pronunciation Results Modal */}
      {showResultsModal && pronunciationResults && (
        <div
          className="modal show pronunciation-modal"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-mic-fill me-2"></i>
                  Pronunciation Assessment Results
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowResultsModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* Overall Scores */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h4 className="text-center mb-3">Overall Performance</h4>
                    <div className="row g-2 text-center">
                      {pronunciationResults.NBest[0]
                        .PronunciationAssessment && (
                        <>
                          <div className="col-md-3">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">Pronunciation</h5>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "20px" }}
                                >
                                  <div
                                    className={`progress-bar bg-${getScoreColor(
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment.PronScore
                                    )}`}
                                    role="progressbar"
                                    style={{
                                      width: `${pronunciationResults.NBest[0].PronunciationAssessment.PronScore}%`,
                                    }}
                                    aria-valuenow={
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment.PronScore
                                    }
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    {pronunciationResults.NBest[0].PronunciationAssessment.PronScore.toFixed(
                                      1
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">Accuracy</h5>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "20px" }}
                                >
                                  <div
                                    className={`progress-bar bg-${getScoreColor(
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment.AccuracyScore
                                    )}`}
                                    role="progressbar"
                                    style={{
                                      width: `${pronunciationResults.NBest[0].PronunciationAssessment.AccuracyScore}%`,
                                    }}
                                    aria-valuenow={
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment.AccuracyScore
                                    }
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    {
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment.AccuracyScore
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">Fluency</h5>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "20px" }}
                                >
                                  <div
                                    className={`progress-bar bg-${getScoreColor(
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment.FluencyScore
                                    )}`}
                                    role="progressbar"
                                    style={{
                                      width: `${pronunciationResults.NBest[0].PronunciationAssessment.FluencyScore}%`,
                                    }}
                                    aria-valuenow={
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment.FluencyScore
                                    }
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    {
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment.FluencyScore
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="card">
                              <div className="card-body">
                                <h5 className="card-title">Completeness</h5>
                                <div
                                  className="progress mb-2"
                                  style={{ height: "20px" }}
                                >
                                  <div
                                    className={`progress-bar bg-${getScoreColor(
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment
                                        .CompletenessScore
                                    )}`}
                                    role="progressbar"
                                    style={{
                                      width: `${pronunciationResults.NBest[0].PronunciationAssessment.CompletenessScore}%`,
                                    }}
                                    aria-valuenow={
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment
                                        .CompletenessScore
                                    }
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  >
                                    {
                                      pronunciationResults.NBest[0]
                                        .PronunciationAssessment
                                        .CompletenessScore
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recognized Text */}
                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Recognized Text</h5>
                  </div>
                  <div className="card-body">
                    <p className="display-text mb-0 fs-5">
                      {pronunciationResults.DisplayText}
                    </p>
                  </div>
                </div>

                {/* Word-by-word Analysis */}
                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Word-by-word Analysis</h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Word</th>
                            <th className="text-center">Accuracy Score</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pronunciationResults.NBest[0].Words.map(
                            (word, index) => (
                              <tr key={index}>
                                <td className="fs-5">{word.Word}</td>
                                <td className="text-center">
                                  <span
                                    className={`badge ${getScoreBadgeClass(
                                      word.PronunciationAssessment.AccuracyScore
                                    )}`}
                                  >
                                    {word.PronunciationAssessment.AccuracyScore}
                                  </span>
                                </td>
                                <td>
                                  {word.PronunciationAssessment.ErrorType ===
                                  "None" ? (
                                    <span className="text-success">
                                      <i className="bi bi-check-circle-fill me-1"></i>
                                      Correct
                                    </span>
                                  ) : (
                                    <span className="text-danger">
                                      <i className="bi bi-x-circle-fill me-1"></i>
                                      {word.PronunciationAssessment.ErrorType}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowResultsModal(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="bi bi-download me-1"></i> Save Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showResultsModal && <div className="modal-backdrop show"></div>}
    </div>
  );
}
