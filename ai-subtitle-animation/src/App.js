import React, { useState, useRef } from "react";
import Spline from "@splinetool/react-spline";
import Subtitle from "./subtitle";
import './App.css';


export default function App() {
  const [splineObj, setSplineObj] = useState(null);
  const audioRef = useRef(null); // Keep track of audio element
  const isMouthOpen = useRef(false);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);

  function handleSplineLoad(spline) {
    console.log("Spline scene loaded:", spline);
    setSplineObj(spline);
  }

  function openMouth() {
    if (!isMouthOpen.current) {
      console.log("Opening mouth!");
      splineObj?.emitEvent("keyDown", "Mouth");
      isMouthOpen.current = true;
    }
  }

  function closeMouth() {
    if (isMouthOpen.current) {
      console.log("Closing mouth!");
      splineObj?.emitEvent("keyUp", "Mouth");
      isMouthOpen.current = false;
    }
  }

  function playAudio() {
    // Stop previous audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audioElement = new Audio("/three-random-tunes-girl-200030.mp3");
    audioRef.current = audioElement; // Store in ref
    console.log("Play audio");

    audioElement.play();
    setupAudioProcessing(audioElement);
  }

  function setupAudioProcessing(audio) {
    // Stop previous animation loop if running
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    function checkVolume() {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      if (volume > 15 && !isMouthOpen.current) {
        openMouth();
      } else if (volume <= 15 && isMouthOpen.current) {
        closeMouth();
      }

      animationRef.current = requestAnimationFrame(checkVolume);
    }

    audio.onplay = () => {
      audioContext.resume();
      checkVolume();
    };

    audio.onended = () => {
      closeMouth();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (audioContext.state !== "closed") {
        console.log("Closing audio context...");
        audioContext.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }

  return (
    <div className="App">
      <div className="spline-container">
        <Spline 
          scene="https://prod.spline.design/Njxbejqx8MuiFCUy/scene.splinecode" 
          onLoad={handleSplineLoad}
        />
      </div>
      <div className="subtitle-container">
        <Subtitle text="This is an interactive subtitle. this hehe" email="user123@gmail.com" />
        <button style={{margin: "15px"}} onClick={playAudio}>Play Audio</button>
      </div>
    </div>
  );
}
