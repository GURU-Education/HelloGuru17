// ModeSelectionButton.jsx
"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "./ModeSelectionButton.css";

const ModeSelectionButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Mouse position state for 3D effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update mouse position for hover effects
  const handleMouseMove = (e, index) => {
    if (hoveredCard === index) {
      const card = e.currentTarget.getBoundingClientRect();
      const centerX = card.left + card.width / 2;
      const centerY = card.top + card.height / 2;
      const posX = (e.clientX - centerX) / 10;
      const posY = (e.clientY - centerY) / 10;

      setMousePosition({ x: posX, y: posY });
    }
  };

  // 3D tilt data for cards
  const cardStyles = (index) => {
    if (hoveredCard === index) {
      return {
        transform: `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${
          mousePosition.x
        }deg) translateZ(30px)`,
        transition: "transform 0.1s ease",
      };
    }
    return {};
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
          <motion.div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 2 }}
            transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
          >
            <div className="modal-header">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                Select Learning Mode
              </motion.h2>
              <motion.button
                className="close-button"
                onClick={closeModal}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                ×
              </motion.button>
            </div>

            <div className="modal-body">
              <div className="mode-cards">
                {/* HSK Mode Card */}
                <motion.div
                  className="mode-card"
                  onClick={() => handleModeSelection("/hsk")}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={cardStyles(0)}
                  onMouseMove={(e) => handleMouseMove(e, 0)}
                  onMouseEnter={() => setHoveredCard(0)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="mode-card-inner">
                    <motion.div
                      className="mode-card-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.6,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      📚
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      HSK Mode
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                    >
                      Learn with structured HSK curriculum and vocabulary lists.
                      Master Chinese characters systematically through
                      interactive sessions.
                    </motion.p>
                    <motion.button
                      className="mode-button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.4 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      Start Learning
                    </motion.button>
                  </div>
                </motion.div>

                {/* Roleplay Mode Card */}
                <motion.div
                  className="mode-card featured"
                  onClick={() => handleModeSelection("/roleplay")}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={cardStyles(1)}
                  onMouseMove={(e) => handleMouseMove(e, 1)}
                  onMouseEnter={() => setHoveredCard(1)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="mode-card-inner">
                    <motion.div
                      className="mode-card-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.7,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      👥
                    </motion.div>
                    <motion.div
                      className="featured-badge"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0, duration: 0.4 }}
                    >
                      Featured
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                    >
                      Roleplay Mode
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.4 }}
                    >
                      Practice conversations through interactive role-playing
                      scenarios. Enhance your speaking skills in real-world
                      situations and get feedback.
                    </motion.p>
                    <motion.button
                      className="mode-button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.0, duration: 0.4 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      Start Roleplaying
                    </motion.button>
                  </div>
                </motion.div>

                {/* Missions Mode Card */}
                <motion.div
                  className="mode-card"
                  onClick={() => handleModeSelection("/missions")}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  style={cardStyles(2)}
                  onMouseMove={(e) => handleMouseMove(e, 2)}
                  onMouseEnter={() => setHoveredCard(2)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="mode-card-inner">
                    <motion.div
                      className="mode-card-icon"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.8,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      🏆
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.4 }}
                    >
                      Missions Mode
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0, duration: 0.4 }}
                    >
                      Complete language challenges and earn rewards. Tackle
                      progressive missions designed to build your confidence in
                      everyday Chinese.
                    </motion.p>
                    <motion.button
                      className="mode-button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1, duration: 0.4 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      Start Missions
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="modal-footer">
              <motion.button
                className="cancel-button"
                onClick={closeModal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ModeSelectionButton;
