// ModeSelectionButton.jsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "./ModeSelectionButton.css";

const ModeSelectionButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = "auto";
  };

  const handleModeSelection = (route) => {
    closeModal();
    router.push(route);
  };

  return (
    <>
      {/* Animated Button with Framer Motion */}
      <motion.button
        className="xiaoqiu-button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0px 0px 12px rgba(95, 75, 139, 0.6)",
          transition: { duration: 0.2 },
        }}
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.1 },
        }}
        onClick={openModal}
      >
        Start a Conversation with XiaoQiu!
      </motion.button>

      {/* Modal - Only rendered when isModalOpen is true */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Select Learning Mode</h2>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="mode-cards">
                {/* HSK Mode Card */}
                <div
                  className="mode-card"
                  onClick={() => handleModeSelection("/hsk")}
                >
                  <div className="mode-card-inner">
                    <div className="mode-card-icon">📚</div>
                    <h3>HSK Mode</h3>
                    <p>
                      Learn with structured HSK curriculum and vocabulary lists
                    </p>
                    <button className="mode-button">Start Learning</button>
                  </div>
                </div>

                {/* Roleplay Mode Card */}
                <div
                  className="mode-card featured"
                  onClick={() => handleModeSelection("/roleplay")}
                >
                  <div className="mode-card-inner">
                    <div className="mode-card-icon">👥</div>
                    <h3>Roleplay Mode</h3>
                    <p>
                      Practice conversations through interactive role-playing
                      scenarios
                    </p>
                    <button className="mode-button">Start Roleplaying</button>
                    <div className="featured-badge">Featured</div>
                  </div>
                </div>

                {/* Missions Mode Card */}
                <div
                  className="mode-card"
                  onClick={() => handleModeSelection("/missions")}
                >
                  <div className="mode-card-inner">
                    <div className="mode-card-icon">🏆</div>
                    <h3>Missions Mode</h3>
                    <p>Complete language challenges and earn rewards</p>
                    <button className="mode-button">Start Missions</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModeSelectionButton;
