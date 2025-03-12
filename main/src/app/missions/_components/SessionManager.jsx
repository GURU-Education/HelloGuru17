// SessionManager.js
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
  splineObj, // Spline object for animations
  missionData = null // Optional mission data for mission mode
) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);

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

        let promptText;

        // Check if we have mission data and use that for the prompt
        // Create a mission-based prompt
        promptText =
          `You are a professional Chinese teacher guiding a native English-speaking student through a specific mission.\n\n` +
          `## Mission Context:\n` +
          `The mission title is: "${missionData.title}"\n\n` +
          `## Key Phrases for this Mission:\n`;

          // Add key phrases if available
          const demoScript = [
            { speaker: "AI", mood: "Cheerful", text: "Hey Tarin! 好久不见 (hǎo jiǔ bú jiàn)! How’s my favorite student doing today?" },
            { speaker: "Student", mood: "Casual", text: "Hey XiaoQiu, I'm pretty good, thanks! Ready for another lesson." },
            { speaker: "AI", mood: "Excited", text: "Awesome! 今天我们要聊聊旅游 (lǚyóu), traveling! I know you mentioned last time that you're excited to travel more." },
            { speaker: "Student", mood: "Enthusiastic", text: "Yeah, totally! I've actually been thinking about planning a trip soon, maybe to 中国 or 韩国." },
            { speaker: "AI", mood: "Encouraging", text: "Great! Let's start with this word: 旅行 (lǚxíng), meaning 'travel.' Repeat after me: 旅行 (lǚxíng)." },
            { speaker: "Student", mood: "Attempting", text: "lǔxing1." },
            { speaker: "AI", mood: "Supportive", text: "Almost! Pay attention to your pronunciation and tone. You said 'lǔxing1,' but it's actually 'lǚxíng.' Try again?" },
            { speaker: "Student", mood: "Retrying", text: "旅行 (lǚxíng)." },
            { speaker: "AI", mood: "Encouraging", text: "Perfect! Much better. Much better. Now, can you use it in a sentence now" },
            { speaker: "Student", mood: "Curious", text: "Actually, XiaoQiu, what's the difference between 旅游 (lǚyóu) and 旅行 (lǚxíng)?" },
            { speaker: "AI", mood: "Explaining", text: "Good question! 旅行 generally means any kind of travel or journey. 旅游, on the other hand, specifically refers to leisure travel, sightseeing, or vacation." },
            { speaker: "Student", mood: "Understanding", text: "Ah, that clears it up." },
            { speaker: "AI", mood: "Joking", text: "Exactly! So, a quick trip to your fridge for snacks wouldn't count as 旅游, that's just a short 旅行." },
            { speaker: "Student", mood: "Laughing", text: "Very funny, XiaoQiu." },
            { speaker: "AI", mood: "Teasing", text: "Remember last lesson when you struggled with 酒店 (jiǔdiàn), meaning hotel? Want to give it another shot?" },
            { speaker: "Student", mood: "Confident", text: "酒店 (jiǔdiàn)." },
            { speaker: "AI", mood: "Surprised and praising", text: "Excellent pronunciation! You've definitely improved since last time." },
            { speaker: "Student", mood: "Playful", text: "Yeah, I practiced a lot since last time." },
            { speaker: "AI", mood: "Laughing", text: "I can tell! Great job. Now, can you try making a sentence using 旅行 (lǚxíng)?" },
            { speaker: "Student", mood: "Thinking", text: "嗯...我想去中国旅行和朋友一起。(wǒ xiǎng qù zhōngguó lǚxíng hé péngyou yìqǐ)." },
            { speaker: "AI", mood: "Gently correcting", text: "Nice effort! Your idea is clear, but the word order needs a slight adjustment. It sounds more natural to say: 我想和朋友一起去中国旅行 (wǒ xiǎng hé péngyou yìqǐ qù zhōngguó lǚxíng)." },
            { speaker: "Student", mood: "Retrying", text: "我想和朋友一起去中国旅行。(wǒ xiǎng hé péngyou yìqǐ qù zhōngguó lǚxíng)." },
            { speaker: "AI", mood: "Praising", text: "Perfect! That sounds great. You're really improving!" },
            { speaker: "Student", mood: "Playful", text: "XiaoQiu, can you teach me something fun I can say to my friends?" },
            { speaker: "AI", mood: "Excited", text: "Of course! How about: 世界这么大，我想去看看。(shìjiè zhème dà, wǒ xiǎng qù kànkan) – 'The world is so big, I want to see it!' Pretty cool, huh?" },
            { speaker: "Student", mood: "Practicing", text: "世界这么大，我想去看看。(shìjiè zhème dà, wǒ xiǎng qù kànkan)" },
            { speaker: "AI", mood: "Praising", text: "Excellent! Now you're ready to impress your friends." },
            { speaker: "AI", mood: "Joking", text: "Just make sure you actually go somewhere interesting—beyond the kitchen!" },
            { speaker: "Student", mood: "Laughing", text: "Got it 谢谢 Xiaoqiu! " },
            { speaker: "AI", mood: "Playful", text: "不客气 tarin! great job today. 下次见 (xià cì jiàn)! See you next lesson, and don't forget to revise for the next leason" }
        ];

        const instructionScript = "Instruction for AI: You're XiaoQiu, a fun, energetic, patient Chinese tutor guiding Tarin (HSK Level 3). Strictly follow this demoScript during interaction. Provide pronunciation and grammar feedback exactly as scripted. Keep interactions playful, humorous, and engaging. Explicitly call the trackProgress function as scripted. \n\n"
        
        const scriptToString = demoScript.map(line => {
            const actionText = line.action ? ` [Action: ${line.action}]` : '';
            return `${line.speaker} (${line.mood}): ${line.text}${actionText}`;
        }).join('\n');

        const prompt = instructionScript + "\n\n" + scriptToString;
        

        // Send the appropriate prompt
        sendTextMessage(prompt);
    }, [dataChannel, missionData]) 
  }})

  // Function to focus on a specific phrase (for mission mode)
  const focusOnPhrase = (phrase) => {
    if (dataChannel && isSessionActive) {
      const promptText =
        `Let's practice this specific phrase: "${phrase.chinese}" (${phrase.pinyin}) which means "${phrase.english}".\n\n` +
        `Please provide specific guidance on the pronunciation and usage of this phrase. Give examples and ask me to repeat after you.`;

      sendTextMessage(promptText);
    }
  };

  async function startSession() {
    startRecording();

    try {
      const tokenResponse = await fetch("/api/token");
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
    focusOnPhrase, // Add the new function for phrase focusing
    sendTextMessage, // Expose sendTextMessage for direct interactions
  };
}
