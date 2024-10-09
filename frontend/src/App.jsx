import React, { useState, useRef, useEffect } from "react";
import Text from "./components/Text";
import Button from "./components/Buttons";
import Map from "./components/Map";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed, faDoorOpen, faGear } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [age, setAge] = useState(20);
  const [showContent, setShowContent] = useState(false);
  const [isPlayingTheme, setIsPlayingTheme] = useState(false);
  const [volumeIcon, setVolumeIcon] = useState("./img/icons/mute.png");
  const [isExitHovered, setIsExitHovered] = useState(false);
  const [isGearHovered, setIsGearHovered] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const themeSong = "/music/theme-song.mp3";
  const laughAudio = "/audio/laughter.mp3";
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

  const playAudio = () => {
    const audio = new Audio(laughAudio);
    audio.play();
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
            <div
              className="exit-icon-container"
              onMouseEnter={() => setIsExitHovered(true)}
              onMouseLeave={() => setIsExitHovered(false)}
              onClick={handleExitClick}
            >
              {isExitHovered && <span className="exit-text">Exit</span>}
              <FontAwesomeIcon
                className="exit-icon"
                icon={isExitHovered ? faDoorOpen : faDoorClosed}
              />
            </div>
            <div
              className="setting-icon-container"
              onMouseEnter={() => setIsGearHovered(true)}
              onMouseLeave={() => setIsGearHovered(false)}
            >
              {isGearHovered && <span className="setting-text">Settings</span>}
              <FontAwesomeIcon className="setting-icon" icon={faGear} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
