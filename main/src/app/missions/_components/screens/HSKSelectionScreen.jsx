import { useEffect } from "react";

export default function HSKSelectionScreen({
  missions,
  setMissions,
  onSelectHSK,
}) {
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

  return (
    <div className="background-container">
      <h1 className="main-title">
        Free Practice
        <br />
        <span>Select HSK Level</span>
      </h1>

      {!missions ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="circle-row">
          {hskLevels.map((level, index) => (
            <div
              key={index}
              className="circle"
              onClick={() => onSelectHSK(level)}
            >
              <p>{level}</p>
            </div>
          ))}
        </div>
      )}

      <p className="subtitle">
        Choose your proficiency level to start free practice
      </p>
    </div>
  );
}
