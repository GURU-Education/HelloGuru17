// screens/LevelSelection.jsx
import Spline from "@splinetool/react-spline";

export default function LevelSelection({ hskLevels, setSelectedLevel }) {
  return (
    <div className="background-container">
      <div className="spline-wrapper">
        <Spline scene="https://prod.spline.design/ZCLA7cXZ95aBo0pU/scene.splinecode" />
      </div>
      <h1 className="main-title">
        HSK Mode
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
