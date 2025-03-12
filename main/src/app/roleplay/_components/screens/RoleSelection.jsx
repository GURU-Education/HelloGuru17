"use client";

import Spline from "@splinetool/react-spline";

export default function RoleSelection({
  selectedLevel,
  selectedTopic,
  setSelectedRole,
  setSelectedTopic,
  selectedConversation
}) {

  const extractRoles = (conversation) => {
    const rolesSet = new Set();
    conversation?.forEach((line) => {
      const match = line.match(/^([^:]+):/);
      if (match) rolesSet.add(match[1]);
    });
    return Array.from(rolesSet);
  };

  const roles = extractRoles(selectedConversation);
  const role1 = roles[0]
  const role2 = roles[1]

  return (
    <div className="level-selection-container">
      {/* Left Panel: Spline Bubble + Text */}
      <div className="bubble-wrapper" style={{zIndex: 100, pointerEvents: "auto"}}>
          <Spline scene="https://prod.spline.design/Njxbejqx8MuiFCUy/scene.splinecode" />
        </div>
      <div className="left-panel">
        <div className="title-area">
          <h1 className="main-title">HSK {selectedLevel}</h1>
          <h2 className="subtitle">{selectedTopic}</h2>
        </div>
      </div>

      {/* Right Panel: Role Selection */}
      <div className="right-panel-role-selection">
        <h2 className="instruction-role">Select Your Role:</h2>
        <div className="role-container" style={{zIndex: 110}}>
          <button className="role-btn" onClick={() => setSelectedRole(1)}>
            {role1}
          </button>
          <button className="role-btn" onClick={() => setSelectedRole(2)}>
            {role2}
          </button>
        </div>
        <button
          className="back-btn"
          style={{ marginTop: 40, marginRight: 5 }}
          onClick={() => setSelectedTopic(null)}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
