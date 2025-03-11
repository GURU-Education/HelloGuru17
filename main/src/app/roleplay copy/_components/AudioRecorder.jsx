// AudioRecorder.js with simple transcription
import { useState, useRef, useEffect } from "react";


async function updateConversations() {
  try {
    const response = await fetch("http://localhost:3000/api/update-conversation", {
      method: "POST",
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Failed to update conversations");
    }

    console.log("Update success:", data.message);
  } catch (error) {
    console.error("Error updating conversations:", error);
  }
}


// updateConversations();

export function useAudioRecorder(setPronunciationAnalysisResult) {
  const [audioBlob, setAudioBlob] = useState([]);
  const [currentTranscription, setCurrentTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  // Clean up function for resources
  const cleanupResources = () => {
    // Stop speech recognition if active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore errors when stopping recognition
      }
    }

    // Stop media recorder and tracks
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();

        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream
            .getTracks()
            .forEach((track) => track.stop());
        }
      } catch (err) {
        console.error("Error stopping media recorder:", err);
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  const startRecording = async () => {
    try {
      // Reset any previous state
      setCurrentTranscription("");
      cleanupResources();
      audioChunksRef.current = [];

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const newBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob((prevBlobs) => [...prevBlobs, newBlob]);
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Initialize speech recognition if available
      if (window.webkitSpeechRecognition || window.SpeechRecognition) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        // Configure recognition
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "zh-CN"; // Set to Chinese for language practice

        // Handle recognition results
        recognitionRef.current.onresult = (event) => {
          let transcript = "";

          // Collect all current transcripts (both interim and final)
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }

          // Update current transcription
          setCurrentTranscription(transcript);
        };

        // Handle recognition end
        recognitionRef.current.onend = () => {
          // Restart recognition if we're still recording
          if (isRecording) {
            try {
              recognitionRef.current.start();
            } catch (err) {
              console.error("Error restarting speech recognition:", err);
            }
          }
        };

        // Start recognition
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Error starting speech recognition:", err);
        }
      } else {
        console.warn("Speech recognition not supported in this browser");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors when stopping recognition
        }
      }

      // Stop all tracks in the stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  };

  // Handle sending the audio blob to your existing endpoint
  useEffect(() => {
    if (audioBlob && audioBlob.length !== 0) {
      saveRecordingToServer("audio_output.wav").then(() => {
        fetch("http://localhost:3000/api/recognize-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: "audio_output.wav" }),
        })
          .then((response) => response.json())
          .then((data) => {
            setPronunciationAnalysisResult(data);
          })
          .catch((error) => {
            console.error("Error in speech recognition request:", error);
          });
      });
    }
  }, [audioBlob, setPronunciationAnalysisResult]);

  const saveRecordingToServer = async (filename) => {
    if (!audioBlob || audioBlob.length === 0) return;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const mergedBlob = new Blob(audioBlob, { type: "audio/webm" });
      reader.readAsDataURL(mergedBlob);

      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];
        try {
          const response = await fetch("http://localhost:3000/api/save-audio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioData: base64Data, filename }),
          });
          await response.json();
          resolve();
        } catch (error) {
          console.error("Error saving recording:", error);
          reject(error);
        }
      };
    });
  };

  return {
    startRecording,
    stopRecording,
    audioBlob,
    currentTranscription,
    isRecording,
  };
}
