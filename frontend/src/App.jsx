import React, { useState, useRef, useEffect } from "react";
import Game from "./components/Game";

function App() {
  const [showContent, setShowContent] = useState(false);
  const [isPlayingTheme, setIsPlayingTheme] = useState(false);
  const [volumeIcon, setVolumeIcon] = useState("./img/icons/mute.png");
  const [isExitHovered, setIsExitHovered] = useState(false);
  const [isGearHovered, setIsGearHovered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const themeSong = "/music/theme-song.mp3";
  const tickingClock = "/audio/ticking-clock.mp3";

  const themeSongRef = useRef(null);
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

  const fadeOutAudio = (audio, duration, callback) => {
    let fadeOutInterval = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        audio.pause();
        audio.volume = 1;
        clearInterval(fadeOutInterval);
        if (callback) callback();
      }
    }, duration / 20);
  };

  const toggleThemeSong = () => {
    if (!themeSongRef.current) {
      themeSongRef.current = new Audio(themeSong);
      themeSongRef.current.loop = true;
      themeSongRef.current.volume = 1;
    }

    if (isPlayingTheme) {
      themeSongRef.current.pause();
      setVolumeIcon("./img/icons/mute.png");
    } else {
      themeSongRef.current.play();
      setVolumeIcon("./img/icons/speaker.png");
    }
    setIsPlayingTheme(!isPlayingTheme);
  };

  const handlePlayClick = () => {
    setTransitioning(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setShowContent(true);
        setTransitioning(false);
        startTickingClock();

        if (themeSongRef.current && isPlayingTheme) {
          fadeOutAudio(themeSongRef.current, 600, () => {
            themeSongRef.current.currentTime = 0;
            setIsPlayingTheme(false);
            setVolumeIcon("./img/icons/mute.png");
          });
        }
      }, 1000);
    });
  };

  const handleExitClick = () => {
    setTransitioning(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        setShowContent(false);
        setTransitioning(false);
        stopTickingClock();
      }, 1000);
    });
  };

  return (
    <div className="main-container">
      <div className={`content ${transitioning ? "fade-out" : "fade-in"}`}>
        {!showContent ? (
          <div className="main-container-btn-layout">
            <img src="./img/logo.png" alt="Logo" className="logo-img" />
            <button className="play-btn" onClick={handlePlayClick}>Play</button>
            <img
              src={volumeIcon}
              alt="Volume Control"
              className="start-volume"
              onClick={toggleThemeSong}
            />
          </div>
        ) : (
          <>
            <Game handleExitClick={handleExitClick} isExitHovered={isExitHovered} setIsExitHovered={setIsExitHovered} isGearHovered={isGearHovered} setIsGearHovered={setIsGearHovered} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
