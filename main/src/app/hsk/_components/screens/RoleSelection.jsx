// screens/RoleSelection.jsx
import Spline from "@splinetool/react-spline";

export default function RoleSelection({ selectedLevel, selectedTopic, setSelectedRole, setSelectedTopic }) {
  return (
    <div className="background-container">
      <div className="spline-wrapper">
        <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
      </div>
      <h1 className="main-title">HSK {selectedLevel}</h1>
      <h2 className="subtitle">{selectedTopic}</h2>
      <h2 className="subtitle">Select Your Role:</h2>
      <div className="role-container">
        <button className="role-btn" onClick={() => setSelectedRole("Person 1")}>
          Person 1
        </button>
        <button className="role-btn" onClick={() => setSelectedRole("Person 2")}>
          Person 2
        </button>
        <button className="role-btn back-btn" onClick={() => setSelectedTopic(null)}>
          ← Back
        </button>
      </div>
    </div>
  );
}