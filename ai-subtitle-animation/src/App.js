import React, { useState, useRef, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import Subtitle from "./subtitle";
import './App.css';


export default function App() {
  const [splineObj, setSplineObj] = useState(null);
  const currentEmotion = useRef("expression_1"); 
  const audioRef = useRef(null);
  const isMouthOpen = useRef(false);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);

  const expressions = {
    expression_1: { eyes: "eye_round", mouth: "mouth_smile" },
    expression_2: { eyes: "eye_squint", mouth: "mouth_open_vertical" },
    expression_3: { eyes: "eyes_smile", mouth: "mouth_open_vertical_2" },
    expression_4: { eyes: "eyes_wide", mouth: "mouth_open_wide" },
    expression_5: { eyes: "eyes_wink", mouth: "mouth_open_wide_2" }
  };
  
  function setEmotion(splineObject, emotion) {
    if (!splineObject || !expressions[emotion]) return;

    currentEmotion.current = emotion;
    // isMouthOpen.current = false;
    closeMouth(); 

    // Hide all expressions
    Object.keys(expressions).forEach(expressionKey => {
      const expressionObj = splineObject.findObjectByName(expressionKey);
      if (expressionObj) expressionObj.visible = false;
    });

    // Show the selected expression group
    const selectedExpression = splineObject.findObjectByName(emotion);
    if (selectedExpression) selectedExpression.visible = true;
  }
  
  function changeMouthMovement(volume) {
    // if (volume > 20) {
    //   setEmotion(splineObj, "expression_2"); // High volume → excited
    //   if (volume > 15 && !isMouthOpen.current) {
    //     openMouth();
    //   } else if (volume <= 15 && isMouthOpen.current) {
    //     closeMouth();
    //   }
    // // } else if (volume > 25) {
    // //   setEmotion(splineObj, "happy"); // Medium volume → happy
    // //   if (volume > 15 && !isMouthOpen.current) {
    // //     openMouth();
    // //   } else if (volume <= 15 && isMouthOpen.current) {
    // //     closeMouth();
    // //   }
    // } else {
    //   setEmotion(splineObj, "expression_3"); // Low volume → normal
    //   if (volume > 15 && !isMouthOpen.current) {
    //     openMouth();
    //   } else if (volume <= 15 && isMouthOpen.current) {
    //     closeMouth();
    //   }
    // }

    if (volume > 15 && !isMouthOpen.current) {
      openMouth();
    } else if (volume <= 15 && isMouthOpen.current) {
      closeMouth();
    }
  }

  function handleSplineLoad(spline) {
    console.log("Spline scene loaded:", spline);
    setSplineObj(spline);
    setEmotion(spline, "expression_1");
  }

  function openMouth() {
    if (!isMouthOpen.current && splineObj) {
      const currentEmotionValue = currentEmotion.current;
      const mouthName = expressions[currentEmotionValue]?.mouth;

      console.log(`Current Emotion: ${currentEmotionValue}`); 


      if (!mouthName) return;

      console.log(`Opening mouth: ${mouthName}`);
      splineObj.emitEvent("keyDown", mouthName);
      isMouthOpen.current = true;
    }
  }

  function closeMouth(closeAll = false) {
    if (splineObj) {
      if (closeAll) {
        // Close ALL mouths to ensure no lingering open mouths
        Object.values(expressions).forEach(({ mouth }) => {
          if (mouth) {
            console.log(`Closing mouth: ${mouth}`);
            splineObj.emitEvent("keyUp", mouth);
          }
        });
      } else {
        // Close ONLY the mouth of the current expression
        const currentMouth = expressions[currentEmotion.current]?.mouth;
        if (currentMouth) {
          console.log(`Closing current mouth: ${currentMouth}`);
          splineObj.emitEvent("keyUp", currentMouth);
        }
      }
      
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
    audioRef.current = audioElement;
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

      changeMouthMovement(volume);

      animationRef.current = requestAnimationFrame(checkVolume);
    }

    audio.onplay = () => {
      setEmotion(splineObj, "expression_2");
      audioContext.resume();
      checkVolume();
    };

    audio.onended = () => {
      closeMouth(true);
      setEmotion(splineObj, "expression_1");
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
          scene="https://prod.spline.design/VUXjo-50lVjP1ZN2/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </div>
      <div className="subtitle-container">
        <Subtitle text="This is an interactive subtitle. this hehe" email="user123@gmail.com" />
        <button style={{margin: "15px"}} onClick={playAudio}>Play Audio</button>
        <button onClick={() => setEmotion(splineObj, "expression_1")}>Expression 1</button>
        <button onClick={() => setEmotion(splineObj, "expression_2")}>Expression 2</button>
        <button onClick={() => setEmotion(splineObj, "expression_3")}>Expression 3</button>
        <button onClick={() => setEmotion(splineObj, "expression_4")}>Expression 4</button>
        <button onClick={() => setEmotion(splineObj, "expression_5")}>Expression 5</button>

      </div>
    </div>
  );
}
