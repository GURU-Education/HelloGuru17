// audioRecorder.js
import { useState, useRef, useEffect } from "react";

export function useAudioRecorder(setPronunciationAnalysisResult) {
  const [audioBlob, setAudioBlob] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const newBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob((prevBlobs) => [...prevBlobs, newBlob]);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

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
  }, [audioBlob]);

  return { startRecording, stopRecording, audioBlob };
}