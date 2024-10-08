import React, { useState, useRef, useEffect } from "react";
import Text from "./components/Text";
import Button from "./components/Buttons";
import Map from "./components/Map";

function App() {
  const [age, setAge] = useState(20);
  const [showContent, setShowContent] = useState(false);

  const laughAudio = "/audio/laughter.mp3";
  const tickingClock = "/audio/ticking-clock.mp3";

  const tickingClockRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/img/Dictator.webp";
  }, []);

  const startTickingClock = () => {
    tickingClockRef.current = new Audio(tickingClock);
    tickingClockRef.current.loop = true;
    tickingClockRef.current.play();
  };

  const stopTickingClock = () => {
    if (tickingClockRef.current) {
      tickingClockRef.current.pause();
      tickingClockRef.current.currentTime = 0;
    }
  };


  const playAudio = () => {
    const audio = new Audio(laughAudio);
    audio.play();
  };

  const handlePlayClick = () => {
    setShowContent(true);
    startTickingClock();
  };

  return (
    <div className="main-container">
      {!showContent ? (
        <div className="main-container-btn-layout">
          <img src="./img/logo.png" alt="Logo" />
          <button className="play-btn" onClick={handlePlayClick}>Play</button>
        </div>
      ) : (
        <>
          <div className="dictator-profile">
            <img
              className="dictator-img"
              src="./img/Dictator.webp"
              alt="Dictator"
              onClick={playAudio}
            />
            <div className="dictator-info">
              <p>Dictator</p>
              <p>Age: {age}</p>
            </div>
          </div>
          <Text />
          <Button />
          <Map />
        </>
      )}
    </div>
  );
}

export default App;
