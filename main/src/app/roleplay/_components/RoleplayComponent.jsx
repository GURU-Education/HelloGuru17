"use client";

import { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import "./RoleplayComponent.css";
import { set } from "lodash";

export default function RoleplayComponent() {
  const [hskLevels, setHskLevels] = useState([]);

  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [conversations, setConversations] = useState([]);

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
      let levelObj = acc.find((item) => item.level === doc.hskLevel);
      if (!levelObj) {
        levelObj = { level: doc.hskLevel, topics: [] };
        acc.push(levelObj);
      }
      levelObj.topics.push({
        name: doc.topic,
        conversation: doc.conversation,
      });
      return acc;
    }, []);

    console.log("mappedData: ", mappedData);
    setHskLevels(mappedData);
  }, [conversations]);

  const chatBoxRef = useRef(null);

  const selectedHSK = hskLevels.find((hsk) => hsk.level === selectedLevel);
  const selectedTopicData = selectedHSK?.topics.find(
    (topic) => topic.name === selectedTopic
  );

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [dialogueIndex]);

  const handleNextLine = () => {
    if (
      selectedTopicData &&
      dialogueIndex < selectedTopicData.conversation.length - 1
    ) {
      setDialogueIndex((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setSelectedLevel(null);
    setSelectedTopic(null);
    setSelectedRole(null);
    setDialogueIndex(0);
  };

  return (
    <div className="split-screen">
      {/* Left Side - Spline 3D Scene */}
      <div className="left-section">
        <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
      </div>

      {/* Right Side - HSK Roleplay UI */}
      <div className="right-section">
        <h1 className="title">HSK Roleplay</h1>

        {/* STEP 1: Select Level */}
        {!selectedLevel ? (
          <div className="step">
            <h2>Select Your HSK Level:</h2>
            <div className="button-column">
              {hskLevels.map((hsk) => (
                <button
                  key={hsk.level}
                  onClick={() => setSelectedLevel(hsk.level)}
                  className="btn level-btn"
                >
                  HSK {hsk.level}
                </button>
              ))}
            </div>
          </div>
        ) : /* STEP 2: Select Topic */
        !selectedTopic ? (
          <div className="step">
            <h2 style={{ marginBottom: 35 }}>
              Select a Conversation Topic for HSK {selectedLevel}:
            </h2>
            <div className="button-grid">
              {selectedHSK.topics.map((topic) => (
                <button
                  key={topic.name}
                  onClick={() => setSelectedTopic(topic.name)}
                  className="btn topic-btn"
                >
                  {topic.name}
                </button>
              ))}
            </div>
          </div>
        ) : /* STEP 3: Select Role */
        !selectedRole ? (
          <div className="step">
            <h2>Select Your Role:</h2>
            <div className="button-column">
              <button
                onClick={() => setSelectedRole("Person 1")}
                className="btn role-btn"
              >
                Person 1
              </button>
              <button
                onClick={() => setSelectedRole("Person 2")}
                className="btn role-btn"
              >
                Person 2
              </button>
            </div>
          </div>
        ) : (
          /* STEP 4: Chat UI */
          <div className="chat-container">
            <h2 className="chat-title">Roleplay as {selectedRole}</h2>

            {/* Attach the ref to this container */}
            <div className="chat-box" ref={chatBoxRef}>
              {selectedTopicData.conversation
                .slice(0, dialogueIndex + 1)
                .map((line, index) => {
                  const isPerson1 = line.startsWith("Person 1");
                  return (
                    <div
                      key={index}
                      className={`chat-bubble ${isPerson1 ? "right" : "left"}`}
                    >
                      {line.replace("Person 1: ", "").replace("Person 2: ", "")}
                    </div>
                  );
                })}
            </div>

            <div className="button-row">
              <button
                onClick={handleNextLine}
                className="btn next-btn"
                disabled={
                  !selectedTopicData ||
                  dialogueIndex >= selectedTopicData.conversation.length - 1
                }
              >
                {dialogueIndex >=
                (selectedTopicData?.conversation.length || 0) - 1
                  ? "No More Lines"
                  : "Next"}
              </button>

              <button onClick={handleReset} className="btn reset-btn">
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
