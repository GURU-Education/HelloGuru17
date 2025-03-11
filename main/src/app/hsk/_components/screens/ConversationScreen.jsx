// screens/ConversationScreen.jsx
import Spline from "@splinetool/react-spline";

export default function ConversationScreen({
  selectedLevel,
  selectedTopic,
  selectedTopicData,
  dialogueIndex,
  chatBoxRef,
  handleNextLine,
  handleReset,
  startSession,
  stopSession,
  completedPhrases,
  missionPhrases,
}) {

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
          <button onClick={stopSession} className="btn next-btn">
            Stop Session
          </button>
          <h3>Progress</h3>
          <p>
              Completed: {completedPhrases.length} / {missionPhrases.length} phrases
          </p>
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