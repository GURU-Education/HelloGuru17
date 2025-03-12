"use client";

import React, { useState, useRef } from "react";
import Spline from "@splinetool/react-spline";

export default function TopicSelectionScreen({
  selectedHSK,
  missions,
  onSelectTopic,
  onReset,
}) {
  const [splineKey, setSplineKey] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineLoadAttempts, setSplineLoadAttempts] = useState(0);
  const [splineFullyLoaded, setSplineFullyLoaded] = useState(false);
  const [splineObj, setSplineObj] = useState(null);
  const splineInitTimer = useRef(null);

  // Get topics for the selected HSK level
  const getTopics = () => {
    if (!missions || !selectedHSK) return [];

    // Find the mission object for this HSK level
    const missionForLevel = missions.find((mission) => {
      return Object.keys(mission).includes(selectedHSK);
    });

    if (!missionForLevel) return [];

    // Extract topics from the HSK level data
    const hskData = missionForLevel[selectedHSK];

    // Handle the case where topics is an array of objects (as in your JSON)
    if (hskData && hskData.topics && Array.isArray(hskData.topics)) {
      // Extract topic names from each object in the array
      return hskData.topics.map((topicObj) => Object.keys(topicObj)[0]);
    }

    // Handle the original case where topics is an object
    if (hskData && hskData.topics && typeof hskData.topics === "object") {
      // Return topic names as an array, excluding "_id"
      return Object.keys(hskData.topics).filter((topic) => topic !== "_id");
    }

    return [];
  };

  const topics = getTopics();

  // Handle Spline scene load
  function handleSplineLoad(spline) {
    console.log("Spline scene loaded:", spline);

    // Check if the scene is properly loaded by checking for objects
    const isProperlyLoaded =
      spline._proxyObjectCache && spline._proxyObjectCache.size > 0;

    if (!isProperlyLoaded) {
      // If not properly loaded and we haven't tried too many times, try reloading
      if (splineLoadAttempts < 3) {
        console.log(
          `Spline not properly loaded, attempt ${
            splineLoadAttempts + 1
          } - retrying...`
        );

        // Clear any existing timer
        if (splineInitTimer.current) {
          clearTimeout(splineInitTimer.current);
        }

        // Set a timer to reload the Spline component
        splineInitTimer.current = setTimeout(() => {
          setSplineKey((prevKey) => prevKey + 1);
          setSplineLoadAttempts((prevAttempts) => prevAttempts + 1);
        }, 100);

        return;
      } else {
        console.warn("Failed to properly load Spline after multiple attempts");
        // Still proceed with what we have
        setSplineFullyLoaded(true);
      }
    } else {
      // Mark as fully loaded after successful load
      setSplineFullyLoaded(true);
    }

    // Store the spline object in state
    setSplineObj(spline);
    setSplineLoaded(true);
  }

  return (
    <div className="level-selection-container">
      {/* Left Panel: Big Bubble + Title */}
      <div className="bubble-wrapper" style={{ zIndex: 100 }}>
        {/* {!splineFullyLoaded && (
          <div className="spline-loading-indicator">
            <div className="loading-spinner"></div>
            <p>Loading avatar...</p>
          </div>
        )} */}
        {/* <Spline
          key={splineKey}
          scene="https://prod.spline.design/Njxbejqx8MuiFCUy/scene.splinecode"
          // onLoad={handleSplineLoad}
          style={{
            opacity: splineFullyLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            zIndex: 100,
            pointerEvents: "auto",
          }}
        /> */}
        <div className="">
          <Spline scene="https://prod.spline.design/Njxbejqx8MuiFCUy/scene.splinecode" />
        </div>
      </div>
      <div className="left-panel">
        <div className="title-area">
          <h1 className="main-title">{selectedHSK}</h1>
          <p className="subtitle">Select a Topic</p>
        </div>
      </div>

      {/* Right Panel: Topic Grid */}
      <div className="right-panel">
        <h2 className="instruction-topic">Choose a topic:</h2>

        {topics.length === 0 ? (
          <p>No topics available for this HSK level</p>
        ) : (
          <div className="topic-grid" style={{ zIndex: 101 }}>
            {topics.map((topic, index) => (
              <div
                key={index}
                className="topic-btn"
                onClick={() => onSelectTopic(topic)}
              >
                {topic}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onReset}
          className="back-btn"
          style={{ marginTop: "30px", zIndex: 100 }}
        >
          ← Back to HSK Levels
        </button>
      </div>
    </div>
  );
}
