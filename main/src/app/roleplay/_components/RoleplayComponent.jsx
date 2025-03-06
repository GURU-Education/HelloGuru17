"use client";

import { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import "./RoleplayComponent.css";

// Example data (Replace with your mapped data)
const mockHskLevels = [
  {
    level: 1,
    topics: [
      {
        name: "Self Introduction",
        conversation: ["Person 1: 你叫什么名字？", "Person 2: 我叫小张。"],
      },
      {
        name: "Ordering Food",
        conversation: ["Person 1: 我要点菜", "Person 2: 好的，请说"],
      },
    ],
  },
  {
    level: 2,
    topics: [
      {
        name: "Asking for Directions",
        conversation: ["Person 1: 请问...", "Person 2: 向前走"],
      },
      {
        name: "Numbers & Prices",
        conversation: ["Person 1: 多少钱？", "Person 2: 五十块"],
      },
    ],
  },
  {
    level: 3,
    topics: [
      {
        name: "Daily Activities",
        conversation: ["Person 1: 今天干什么？", "Person 2: 去上班"],
      },
    ],
  },
  {
    level: 4,
    topics: [
      {
        name: "Family & Friends",
        conversation: ["Person 1: 你有兄弟姐妹吗？", "Person 2: 有，一个妹妹"],
      },
    ],
  },
  {
    level: 5,
    topics: [
      {
        name: "Hobbies",
        conversation: ["Person 1: 你喜欢做什么？", "Person 2: 我喜欢跑步"],
      },
    ],
  },
  {
    level: 6,
    topics: [
      {
        name: "Travel",
        conversation: ["Person 1: 你去过哪里？", "Person 2: 我去过北京和上海"],
      },
    ],
  },
];

export default function RoleplayComponent() {
  // In real usage, you'll fetch or map your data. Here we use the mock:
  const [hskLevels, setHskLevels] = useState(mockHskLevels);
  const [conversations, setConversations] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const chatBoxRef = useRef(null);

  // Identify selected HSK & Topic
  const selectedHSK = hskLevels.find((hsk) => hsk.level === selectedLevel);
  const selectedTopicData = selectedHSK?.topics.find(
    (t) => t.name === selectedTopic
  );

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

    console.log("mappedData (no duplicates): ", mappedData);
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
          {hskLevels.map((hsk) => (
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
