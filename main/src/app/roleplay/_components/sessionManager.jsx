// sessionManager.js - updated for scripted roleplay
import { useState, useRef, useEffect } from "react";

export function useSessionManager(
  pronunciationAnalysisResult,
  selectedTopicData,
  selectedRole,
  startRecording,
  stopRecording,
  hskLevel,
  convoTopic,
  conversationList,
  splineObj
) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  // Animation related refs
  const isMouthOpen = useRef(false);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const serverAudioStreamRef = useRef(null);

  // Control mouth animations
  function openMouth() {
    if (!isMouthOpen.current && splineObj) {
      try {
        splineObj.emitEvent("keyDown", "Mouth");
        isMouthOpen.current = true;
      } catch (err) {
        console.error("Error opening mouth:", err);
      }
    }
  }

  function closeMouth() {
    if (isMouthOpen.current && splineObj) {
      try {
        splineObj.emitEvent("keyUp", "Mouth");
        isMouthOpen.current = false;
      } catch (err) {
        console.error("Error closing mouth:", err);
      }
    }
  }

  // Setup audio processing for mouth animation
  function setupAudioAnalysis(stream) {
    console.log("Setting up audio analysis for mouth animation");

    // Stop previous animation loop if running
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Close previous audio context if open
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    try {
      // Create new audio context and analyzer
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      source.connect(analyser);
      // Don't connect to destination to avoid audio doubling

      function checkVolume() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

        // Open/close mouth based on volume threshold
        if (volume > 15 && !isMouthOpen.current) {
          openMouth();
        } else if (volume <= 15 && isMouthOpen.current) {
          closeMouth();
        }

        animationRef.current = requestAnimationFrame(checkVolume);
      }

      // Start volume checking
      audioContext.resume();
      checkVolume();
    } catch (err) {
      console.error("Error setting up audio analysis:", err);
    }
  }

  useEffect(() => {
    const handlePronunciationResult = async () => {
      if (pronunciationAnalysisResult) {
        await startSession();
      }
    };
    handlePronunciationResult();
  }, [pronunciationAnalysisResult]);

  useEffect(() => {
    if (pronunciationAnalysisResult && dataChannel) {
      dataChannel.addEventListener("message", (e) => {
        setEvents((prev) => [JSON.parse(e.data), ...prev]);
      });

      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
        const feedbackPrompt =
          "你是一位专业的中文老师，帮助一位母语为英语的学生提高普通话发音。\n\n" +
          "请分析以下发音数据，并提供**简明、实用**的反馈。你的反馈应包括：\n" +
          "- **指出错误**：列出学生发音不准确的字或音节。\n" +
          "- **正确示范**：用拼音和汉字展示正确发音，并附上简单的例句。\n" +
          "- **改进建议**：用简短中文解释口型、舌位或气流调整方法，必要时可用英语补充。\n\n" +
          "### 示例反馈：\n" +
          "- **误 (wù)**: 你读成了 *wǔ*，应该是 **wù**（四声）。🔹 例句：「我错了，是我的误会。」\n" +
          "  - **练习**：从高音开始，迅速降到低音，像感叹「哎呀」的语气。\n" +
          "- **吃 (chī)**: 你的舌头位置太靠后。🔹 例句：「我喜欢吃中国菜。」\n" +
          "  - **练习**：舌尖抵住上颚，轻轻送气，不要发成 *ts* 的音。\n\n" +
          "请确保你的反馈 **以中文为主，必要时少量英文解释**，使学生能直接理解和练习。\n\n" +
          "**以下是学生的发音分析数据：**\n\n" +
          "```json\n" +
          JSON.stringify(pronunciationAnalysisResult, null, 2) +
          "\n```";
        sendTextMessage(feedbackPrompt);
      });
    }
  }, [pronunciationAnalysisResult, dataChannel]);

  useEffect(() => {
    if (dataChannel && !pronunciationAnalysisResult) {
      dataChannel.addEventListener("message", (e) => {
        setEvents((prev) => [JSON.parse(e.data), ...prev]);
      });

      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);

        // Start with the first line based on selected role
        playNextLine();
      });
    }
  }, [dataChannel]);

  // Function to play the next line in the conversation
  const playNextLine = () => {
    if (!selectedTopicData || !selectedTopicData.conversation) {
      console.error("No conversation data available");
      return;
    }

    // Check if there are more lines to play
    if (currentLineIndex < selectedTopicData.conversation.length) {
      const line = selectedTopicData.conversation[currentLineIndex];
      const isCustomerLine = (currentLineIndex + selectedRole) % 2 === 1;

      // Only send the prompt if it's the AI's turn to speak
      if (!isCustomerLine) {
        // Extract just the dialogue part (remove "Customer:" or "Waiter:" prefix)
        const dialogueOnly = line.includes(":")
          ? line.split(":")[1].trim()
          : line;
        sendTextMessage(dialogueOnly);
      }

      // Increment line index for next time
      setCurrentLineIndex((prevIndex) => prevIndex + 1);
    }
  };

  // User finished speaking their line, AI should respond with next line
  const handleUserFinishedSpeaking = () => {
    const isCustomerLine = (currentLineIndex + selectedRole) % 2 === 1;

    // Only proceed if it's now the AI's turn to speak
    if (!isCustomerLine) {
      playNextLine();
    }
  };

  async function startSession() {
    startRecording();

    try {
      const tokenResponse = await fetch("api/token");
      const data = await tokenResponse.json();
      const EPHEMERAL_KEY = data.client_secret.value;

      const pc = new RTCPeerConnection();

      audioElement.current = document.createElement("audio");
      audioElement.current.autoplay = true;
      audioElement.current.muted = false;
      audioElement.current
        .play()
        .catch((error) => console.error("Autoplay blocked:", error));

      pc.ontrack = (e) => {
        console.log("Receiving AI audio stream:", e.streams[0]);

        // Save the stream reference for mouth animation
        serverAudioStreamRef.current = e.streams[0];

        // Apply the stream to the audio element
        audioElement.current.srcObject = e.streams[0];

        // Set up audio analysis for mouth movements
        if (splineObj) {
          setupAudioAnalysis(e.streams[0]);
        } else {
          console.warn("No Spline object available for mouth animation");
        }
      };

      const ms = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      pc.addTrack(ms.getTracks()[0]);

      const dc = pc.createDataChannel("oai-events");
      setDataChannel(dc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
      });

      const answer = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      peerConnection.current = pc;
    } catch (error) {
      console.error("Error starting session:", error);
    }
  }

  function stopSession() {
    // Stop analyzing audio for mouth movements
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    // Close mouth if open
    if (isMouthOpen.current && splineObj) {
      closeMouth();
    }

    stopRecording();

    if (dataChannel) {
      dataChannel.close();
    }

    if (peerConnection.current) {
      peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
        }
      });
    }

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;
    serverAudioStreamRef.current = null;

    // Reset line index
    setCurrentLineIndex(0);
  }

  function sendClientEvent(message) {
    if (dataChannel) {
      message.event_id = message.event_id || crypto.randomUUID();
      dataChannel.send(JSON.stringify(message));
      setEvents((prev) => [message, ...prev]);
    } else {
      console.error(
        "Failed to send message - no data channel available",
        message
      );
    }
  }

  function sendTextMessage(message) {
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    sendClientEvent(event);
    sendClientEvent({ type: "response.create" });
  }

  return {
    startSession,
    stopSession,
    isSessionActive,
    events,
    currentLineIndex,
    handleUserFinishedSpeaking,
    playNextLine,
  };
}
