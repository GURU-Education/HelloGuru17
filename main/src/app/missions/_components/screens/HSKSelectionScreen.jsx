"use client";

import React, { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";

export default function HSKSelectionScreen({
  missions,
  setMissions,
  onSelectHSK,
}) {
  const [splineKey, setSplineKey] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineLoadAttempts, setSplineLoadAttempts] = useState(0);
  const [splineFullyLoaded, setSplineFullyLoaded] = useState(false);
  const [splineObj, setSplineObj] = useState(null);
  const splineInitTimer = useRef(null);

  // Fetch missions data if not already loaded
  useEffect(() => {
    if (!missions) {
      const fetchMissions = async () => {
        try {
          const response = await fetch("/api/mission");
          const data = await response.json();

          if (data.success) {
            setMissions(data.missions);
          } else {
            console.error("Failed to fetch missions");
          }
        } catch (error) {
          console.error("Error fetching missions:", error);
        }
      };

      fetchMissions();
    }
  }, [missions, setMissions]);

  // Extract HSK levels from missions data
  const getHSKLevels = () => {
    if (!missions) return [];

    const hskLevels = missions.map((mission) => {
      // Each mission has a structure like { "_id": "...", "HSK1": { ... } }
      // Get the key that starts with "HSK"
      const hskKey = Object.keys(mission).find((key) => key.startsWith("HSK"));
      return hskKey;
    });

    // Filter out undefined values and sort numerically
    return hskLevels
      .filter((level) => level)
      .sort((a, b) => {
        // Extract numeric part and compare
        const numA = parseInt(a.replace("HSK", ""));
        const numB = parseInt(b.replace("HSK", ""));
        return numA - numB;
      });
  };

  const hskLevels = getHSKLevels();

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
      <div className="bubble-wrapper" style={{ zIndex: 100 }}>
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
          <h1 className="main-title">Free Practice</h1>
          <p className="subtitle">With Xiao Qiu</p>
        </div>
      </div>

      {/* Right Panel: Stacked Rounded Rectangles for Level Selection */}
      <div className="right-panel">
        <h2 className="instruction">Select Your HSK Level:</h2>
        {!missions ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="levels-container" style={{ zIndex: 101 }}>
            {hskLevels.map((level, index) => (
              <div
                key={index}
                className="level-rectangle"
                style={{ zIndex: 100 }}
                onClick={() => onSelectHSK(level)}
              >
                <p>{level}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
