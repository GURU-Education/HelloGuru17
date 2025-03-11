// screens/LevelSelection.jsx
import Spline from "@splinetool/react-spline";
import { useState, useRef } from "react";

// Example HSK levels – you can pass these as a prop or fetch from an API
const hskLevels = [
  { level: 1 },
  { level: 2 },
  { level: 3 },
  { level: 4 },
  { level: 5 },
  { level: 6 },
];

export default function LevelSelection({ setSelectedLevel }) {
  const [splineKey, setSplineKey] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineLoadAttempts, setSplineLoadAttempts] = useState(0);
  const [splineFullyLoaded, setSplineFullyLoaded] = useState(false);
  const [splineObj, setSplineObj] = useState(null);
  const splineInitTimer = useRef(null);

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

    // Debug: list available events if the method exists
    if (typeof spline.getAvailableEvents === "function") {
      try {
        const events = spline.getAvailableEvents();
        console.log("Available Spline events:", events);
      } catch (err) {
        console.warn("Could not get available events:", err);
      }
    }

    // Debug: list available objects if the method exists
    if (typeof spline.getAllObjects === "function") {
      try {
        const objects = spline.getAllObjects();
        console.log("Available Spline objects:", objects);

        // Try to identify objects that might be the mouth or head
        const potentialMouthObjects = objects.filter((obj) => {
          const name = obj.name.toLowerCase();
          return (
            name.includes("mouth") ||
            name.includes("head") ||
            name.includes("face") ||
            name.includes("talk")
          );
        });

        if (potentialMouthObjects.length > 0) {
          console.log("Potential mouth objects:", potentialMouthObjects);
        }
      } catch (err) {
        console.warn("Could not get available objects:", err);
      }
    }

    // Store the spline object in parent component
    setSplineObj(spline);
    setSplineLoaded(true);

    // Test mouth animation if spline is loaded
    try {
      console.log("Testing mouth animation with various methods...");

      // Try standard event
      try {
        spline.emitEvent("keyDown", "Mouth");
        console.log("Emitted keyDown Mouth event");
      } catch (err) {
        console.warn("Failed standard Mouth event", err);
      }

      // Try alternative event names
      const testEventNames = [
        "mouth",
        "talk",
        "Talk",
        "speak",
        "Speak",
        "open",
        "Open",
      ];
      testEventNames.forEach((eventName) => {
        try {
          spline.emitEvent("keyDown", eventName);
          console.log(`Tested alternative event: ${eventName}`);
        } catch (err) {
          // Silently fail for alternative events
        }
      });

      // Close mouth after 1 second
      setTimeout(() => {
        try {
          spline.emitEvent("keyUp", "Mouth");

          // Try alternative event names for keyUp
          testEventNames.forEach((eventName) => {
            try {
              spline.emitEvent("keyUp", eventName);
            } catch (err) {
              // Silently fail
            }
          });
        } catch (err) {
          console.warn("Error closing mouth", err);
        }
      }, 1000);
    } catch (err) {
      console.warn("Error testing mouth animation:", err);
    }
  }
  return (
    <div className="level-selection-container">
      {/* Left Panel: Big Bubble + Title (unchanged) */}
      <div className="bubble-wrapper">
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
          }}
        />
      </div>
      <div className="left-panel">
        <div className="title-area">
          <h1 className="main-title">HSK Roleplay</h1>
          <p className="subtitle">With Xiao Qiu</p>
        </div>
      </div>
      <h1 className="main-title">
        HSK Roleplay
        <br />
        <span>With Xiao Qiu</span>
      </h1>
      <h2 className="subtitle">Select Your HSK Level:</h2>
      <div className="circle-row">
        {hskLevels &&
          hskLevels.map((hsk) => (
            <div
              key={hsk.level}
              className="circle"
              onClick={() => setSelectedLevel(hsk.level)}
            >
              <p>HSK {hsk.level}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
