"use client";

import { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import "./RoleplayComponent.css";

export default function RoleplayComponent() {
  // In real usage, you'll fetch or map your data. Here we use the mock:
  const [hskLevels, setHskLevels] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const chatBoxRef = useRef(null);

  // Identify selected HSK & Topic
  const selectedHSK = hskLevels && hskLevels.find((hsk) => hsk.level === selectedLevel);
  const selectedTopicData = selectedHSK?.topics.find(
    (t) => t.name === selectedTopic
  );

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);

  const [audioBlob, setAudioBlob] = useState([]);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [pronunciationAnalysisResult, setPronunciationAnalysisResult] = useState(null)

  useEffect(() => {
    const handlePronunciationResult = async () => {
      // console.log(pronunciationAnalysisResult)
      // console.log(dataChannel)
      if (pronunciationAnalysisResult) {
        startSession();
      }
    };
    handlePronunciationResult();
  }, [pronunciationAnalysisResult])

  useEffect(() => {
    if (pronunciationAnalysisResult && dataChannel) {
      // console.log("calling")

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
        "```json\n" + JSON.stringify(pronunciationAnalysisResult, null, 2) + "\n```";
      
      sendTextMessage(feedbackPrompt);
      
      });    
    }
  }, [pronunciationAnalysisResult, dataChannel])

  useEffect(() => {
    if (audioBlob && audioBlob.length !== 0) {
      saveRecordingToServer(`audio_output.wav`).then(() => {
        // console.log("Recording saved. Sending recognition request...");
        fetch("http://localhost:3000/recognize-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({filename: "audio_output.wav"}),
        })
        .then((response) => response.json())
        .then((data) => {
          setPronunciationAnalysisResult(data)
        })
        .catch((error) => {
          console.error("Error in speech recognition request:", error);
        });
      })
    }
  }, [audioBlob])
  
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
    if (!audioBlob || audioBlob.length === 0) {
      // console.log(audioBlob)
      // console.log("Audio Blob is empty")
      return
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const mergedBlob = new Blob(audioBlob, { type: "audio/webm" });
      reader.readAsDataURL(mergedBlob);

      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];
        try {
          const response = await fetch("http://localhost:3000/save-audio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ audioData: base64Data, filename }),
          });
          const data = await response.json();
          // console.log("Recording saved:", data);
          resolve(); // Resolve when saving is complete
        } catch (error) {
          console.error("Error saving recording:", error);
          reject(error);
        }
      };
    });
  };

  async function startSession() {
    startRecording();
    const tokenResponse = await fetch("api/token");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;

    const pc = new RTCPeerConnection();

    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    audioElement.current.muted = false;
    audioElement.current.play().catch(error => console.error("Autoplay blocked:", error));

    pc.ontrack = (e) => {
      // console.log("Receiving AI audio stream:", e.streams[0]);
      audioElement.current.srcObject = e.streams[0];
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
  }

  function stopSession() {
    stopRecording();
    if (dataChannel) {
      dataChannel.close();
    }

    peerConnection.current.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.stop();
      }
    });

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;
  }

  function sendClientEvent(message) {
    if (dataChannel) {
      message.event_id = message.event_id || crypto.randomUUID();
      dataChannel.send(JSON.stringify(message));
      setEvents((prev) => [message, ...prev]);
    } else {
      console.error(
        "Failed to send message - no data channel available",
        message,
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

  useEffect(() => {
    if (dataChannel && !pronunciationAnalysisResult) {
      // console.log("data channel opening")
      dataChannel.addEventListener("message", (e) => {
        setEvents((prev) => [JSON.parse(e.data), ...prev]);
      });

      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
        
        sendTextMessage(
          "We are role-playing. Your role is AA, the restaurant waiter (服务员), and I am BB, the customer (顾客). \n" + 
          "I  will read the customer’s lines aloud, and you will read the waiter’s lines aloud. Do not generate new text \n" +
          "outside of the given script below.\n\n" +
          "AA: 你好！欢迎光临，请问几位？\n" +
          "BB: 你好，就我一个人。请给我一个靠窗的座位。\n" +
          "AA: 好的，请这边坐。这是菜单，请慢慢看。\n" +
          "BB: 谢谢。我想点宫保鸡丁和一份米饭。\n" +
          "AA: 好的，请稍等，您的菜很快就好。\n" +
          "BB: 好的，谢谢。\n\n");
      });
    }
  }, [dataChannel]);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/conversation"); // API URL
        const data = await res.json();
        setConversations(data.conversationObjects);
      } catch (error) {
      } finally {
      }
    }

    fetchConversations();
  }, []);

  useEffect(() => {
    const mappedData = conversations.reduce((acc, doc) => {
      // Find if this HSK level already exists in the array
      let levelObj = acc.find((item) => item.level === doc.hskLevel);
      if (!levelObj) {
        levelObj = { level: doc.hskLevel, topics: [] };
        acc.push(levelObj);
      }
      // Check if the topic name already exists in `levelObj.topics`
      const hasTopic = levelObj.topics.some((t) => t.name === doc.topic);
      if (!hasTopic) {
        // Only push if the topic doesn't exist yet
        levelObj.topics.push({
          name: doc.topic,
          conversation: doc.conversation,
        });
      }
      return acc;
    }, []);
    setHskLevels(mappedData);
  }, [conversations]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [dialogueIndex]);

  // Reveal next line
  const handleNextLine = () => {
    if (
      selectedTopicData &&
      dialogueIndex < selectedTopicData.conversation.length - 1
    ) {
      setDialogueIndex((prev) => prev + 1);
    }
  };

  // Reset selections
  const handleReset = () => {
    setSelectedLevel(null);
    setSelectedTopic(null);
    setSelectedRole(null);
    setDialogueIndex(0);
  };

  /** ********************************************************************
   * 1) LEVEL SELECTION SCREEN
   ******************************************************************** */
  if (!selectedLevel) {
    return (
      <div className="background-container">
        {/* Smaller Spline Sprite in Top Left */}
        <div className="spline-wrapper">
          <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
        </div>

        <h1 className="main-title">
          HSK Roleplay
          <br />
          <span>With Xiao Qiu</span>
        </h1>
        <h2 className="subtitle">Select Your HSK Level:</h2>

        <div className="circle-row">
          {hskLevels && hskLevels.map((hsk) => (
            <div
              key={hsk.level}
              className="circle"
              onClick={() => setSelectedLevel(hsk.level)}
            >
              <p>HSK {hsk.level}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /** ********************************************************************
   * 2) TOPIC SELECTION SCREEN
   ******************************************************************** */
  if (selectedLevel && !selectedTopic) {
    return (
      <div className="background-container">
        <div className="spline-wrapper">
          <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
        </div>
        <h1 className="main-title">
          HSK Roleplay
          <br />
          <span>With Xiao Qiu</span>
        </h1>
        <h2 className="subtitle">
          Select a Conversation Topic for HSK {selectedLevel}:
        </h2>

        <div className="circle-row">
          {selectedHSK.topics.map((topic) => (
            <div
              key={topic.name}
              className="circle"
              onClick={() => setSelectedTopic(topic.name)}
            >
              <p>{topic.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /** ********************************************************************
   * 3) ROLE SELECTION SCREEN
   ******************************************************************** */
  if (selectedLevel && selectedTopic && !selectedRole) {
    return (
      <div className="background-container">
        <div className="spline-wrapper">
          <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
        </div>

        <h1 className="main-title">HSK {selectedLevel}</h1>
        <h2 className="subtitle">{selectedTopic}</h2>
        <h2 className="subtitle">Select Your Role:</h2>

        <div className="role-container">
          <button
            className="role-btn"
            onClick={() => setSelectedRole("Person 1")}
          >
            Person 1
          </button>
          <button
            className="role-btn"
            onClick={() => setSelectedRole("Person 2")}
          >
            Person 2
          </button>
          <button
            className="role-btn back-btn"
            onClick={() => setSelectedTopic(null)}
          >
            &larr; Back
          </button>
        </div>
      </div>
    );
  }

  /** ********************************************************************
   * 4) CONVERSATION SCREEN
   ******************************************************************** */
  return (
    <div className="background-container">
      <div className="spline-wrapper-chat">
        <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
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

          <button onClick={startSession} className="btn next-btn">
              Start Session
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
