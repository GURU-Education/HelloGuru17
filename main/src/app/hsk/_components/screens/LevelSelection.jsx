// screens/LevelSelection.jsx
"use client";

import React, { useState, useRef } from "react";
import Spline from "@splinetool/react-spline";
import "../RoleplayComponent.css";

export default function LevelSelection({ setSelectedLevel }) {
  const [splineKey, setSplineKey] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineLoadAttempts, setSplineLoadAttempts] = useState(0);
  const [splineFullyLoaded, setSplineFullyLoaded] = useState(false);
  const [splineObj, setSplineObj] = useState(null);
  const splineInitTimer = useRef(null);

  // Example HSK levels - these could be passed as props instead
  const hskLevels = [
    { level: 1 },
    { level: 2 },
    { level: 3 },
    { level: 4 },
    { level: 5 },
    { level: 6 },
  ];

  // Handle Spline scene load
  function handleSplineLoad(spline) {
    console.log("Spline scene loaded:", spline);

    // Check if the scene is properly loaded by checking for objects
    const isProperlyLoaded =
      spline._proxyObjectCache && spline._proxyObjectCache.size > 0;

    console.log(
      `Spline properly loaded: ${isProperlyLoaded} (${
        spline._proxyObjectCache?.size || 0
      } objects)`
    );

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
      <div className="bubble-wrapper" style={{ zIndex: 0 }}>
        {!splineFullyLoaded && (
          <div className="spline-loading-indicator">
            <div className="loading-spinner"></div>
            <p>Loading avatar...</p>
          </div>
        )}
        <Spline
          key={splineKey} // Force re-render when key changes
          scene="https://prod.spline.design/Njxbejqx8MuiFCUy/scene.splinecode"
          onLoad={handleSplineLoad}
          style={{
            opacity: splineFullyLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
            zIndex: 100,
            pointerEvents: "auto",
          }}
        />
      </div>
      <div className="left-panel">
        <div className="title-area">
          <h1 className="main-title">HSK Mode</h1>
          <p className="subtitle">With Xiao Qiu</p>
        </div>
      </div>

      {/* Right Panel: Stacked Rounded Rectangles for Level Selection */}
      <div className="right-panel">
        <h2 className="instruction">Select Your HSK Level:</h2>
        <div className="levels-container" style={{ zIndex: 101 }}>
          {hskLevels.map((hsk) => (
            <div
              key={hsk.level}
              className="level-rectangle"
              style={{ zIndex: 100 }}
              onClick={() => setSelectedLevel(hsk.level)}
            >
              <p>HSK {hsk.level}</p>
            </div>
          ))}
          {/* <button className="back-btn">← Back</button> */}
        </div>
      </div>
    </div>
  );
}
