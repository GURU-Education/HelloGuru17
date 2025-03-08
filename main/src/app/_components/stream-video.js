import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import "../styles/stream-video.css";

function StreamVideo() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionColor, setEmotionColor] = useState("#4a90e2"); // Default color

  // returns emotion + face verification object
  const analyzeEmotionMutation = useMutation({
    mutationFn: async (imageBlob) => {
      const formData = new FormData();
      formData.append("image", imageBlob, "capture.jpg");

      const response = await fetch("http://127.0.0.1:5000/analyze-emotions", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const data = await response.json();
      // console.log("Response data:", data);
      return data;
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const verifyFaceMutation = useMutation({
    mutationFn: async (imageBlob) => {
      const formData = new FormData();
      formData.append("image", imageBlob, "capture1.jpg");
      const user = JSON.parse(localStorage.getItem("user"));
      formData.append("email", user?.email);
      // console.log("User email:", user?.email);

      const response = await fetch("http://127.0.0.1:5000/verify-face", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Network response was not ok");
      }

      const data = await response.json();
      // console.log("Response data:", data);
      return data;
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  useEffect(() => {
    // Start webcam
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
    setupCamera();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let intervalId;

    if (stream && !isAnalyzing) {
      intervalId = window.setInterval(async () => {
        if (videoRef.current) {
          setIsAnalyzing(true);

          // Create canvas and draw video frame
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(videoRef.current, 0, 0);

          // Convert to blob
          canvas.toBlob(async (blob) => {
            if (blob) {
              try {
                const emotionData = await analyzeEmotionMutation.mutateAsync(
                  blob
                );
                await verifyFaceMutation.mutateAsync(blob);

                // Set color based on emotion
                if (emotionData?.dominant_emotion) {
                  const emotion = emotionData.dominant_emotion;
                  switch (emotion) {
                    case "happy":
                      setEmotionColor("#ffde03"); // Yellow
                      break;
                    case "sad":
                      setEmotionColor("#0336ff"); // Blue
                      break;
                    case "angry":
                      setEmotionColor("#ff0303"); // Red
                      break;
                    case "fear":
                      setEmotionColor("#9403ff"); // Purple
                      break;
                    case "surprise":
                      setEmotionColor("#03ffa5"); // Teal
                      break;
                    case "neutral":
                      setEmotionColor("#b8b8b8"); // Gray
                      break;
                    default:
                      setEmotionColor("#4a90e2"); // Default blue
                  }
                }
              } catch (error) {
                console.error("Analysis error:", error);
              } finally {
                setIsAnalyzing(false);
              }
            }
          }, "image/jpeg");
        }
      }, 7000); // Every 7 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, isAnalyzing]);

  return (
    <div className="emotion-analyzer">
      <div className="header">
        <h1>Live Emotion Analysis</h1>
        <div className="pulse" style={{ backgroundColor: emotionColor }}></div>
      </div>

      <div className="analyzer-container">
        <div className="results-section wide">
          <div className="emotion-results">
            {analyzeEmotionMutation.isPending && (
              <div className="status-message">Analyzing emotions...</div>
            )}

            {/* {analyzeEmotionMutation.isError && (
              <div className="error-message">
                <span className="icon">❌</span>
                <p>Error: {analyzeEmotionMutation.error.message}</p>
              </div>
            )} */}

            {analyzeEmotionMutation.isSuccess && (
              <div
                className="results-card"
                style={{ borderColor: emotionColor }}
              >
                <h2>Current Emotion</h2>
                <div
                  className="emotion-display"
                  style={{ backgroundColor: emotionColor }}
                >
                  {analyzeEmotionMutation.data.dominant_emotion}
                </div>

                <div className="emotion-bubbles">
                  {Object.entries(
                    analyzeEmotionMutation.data.emotion || {}
                  ).map(([emotion, value], index) => (
                    <div
                      key={emotion}
                      className="emotion-bubble"
                      style={{
                        transform: `scale(${Math.max(0.5, value)})`,
                        animationDelay: `${index * 0.2}s`,
                        backgroundColor:
                          emotion ===
                          analyzeEmotionMutation.data.dominant_emotion
                            ? emotionColor
                            : "#ddd",
                      }}
                    >
                      {emotion}
                      <span className="value">{Math.round(value * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="verification-results">
            {verifyFaceMutation.isPending && (
              <div className="status-message">Verifying face...</div>
            )}

            {verifyFaceMutation.isError && (
              <div className="error-message">
                <span className="icon">❌</span>
                <p>Error: {verifyFaceMutation.error.message}</p>
              </div>
            )}

            {verifyFaceMutation.isSuccess && (
              <div className="results-card verification-card">
                <h2>Face Verification</h2>
                <div
                  className={`verification-status ${
                    verifyFaceMutation.data.verified
                      ? "verified"
                      : "not-verified"
                  }`}
                >
                  <span className="icon">
                    {verifyFaceMutation.data.verified ? "✓" : "✗"}
                  </span>
                  <p>
                    {verifyFaceMutation.data.verified
                      ? "Identity Verified"
                      : "Identity Not Verified"}
                  </p>
                </div>

                {verifyFaceMutation.data.score && (
                  <div className="score-meter">
                    <div
                      className="score-fill"
                      style={{
                        width: `${Math.min(
                          100,
                          verifyFaceMutation.data.score * 100
                        )}%`,
                        backgroundColor: verifyFaceMutation.data.verified
                          ? "#4caf50"
                          : "#f44336",
                      }}
                    ></div>
                    <span className="score-value">
                      {Math.round(verifyFaceMutation.data.score * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Webcam in corner */}
      <div className="corner-webcam" style={{ borderColor: emotionColor }}>
        <div
          className="scanning-line"
          style={{ backgroundColor: emotionColor }}
        ></div>
        <video ref={videoRef} autoPlay playsInline />
        <div className="scanning-effect"></div>

        {isAnalyzing && (
          <div className="analyzing-overlay">
            <div
              className="loader"
              style={{ borderTopColor: emotionColor }}
            ></div>
          </div>
        )}
      </div>

      <div className="mood-particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              backgroundColor: emotionColor,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default StreamVideo;
