// screens/TopicSelection.jsx
import Spline from "@splinetool/react-spline";

export default function TopicSelection({ selectedLevel, selectedHSK, setSelectedTopic }) {
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