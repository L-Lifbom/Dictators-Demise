import React, { useState, useEffect, useRef } from 'react';
import Text from './Text';
import Buttons from './Buttons';
import GameMap from "./GameMap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed, faDoorOpen, faGear } from '@fortawesome/free-solid-svg-icons';

function Game({ handleExitClick, isExitHovered, setIsExitHovered, isGearHovered, setIsGearHovered }) {
    const [buttons, setButtons] = useState([
        { text: 'Unleash a Virus', onClick: () => handleStart(0) },
        { text: 'Crash the Global Economy', onClick: () => handleStart(1) },
        { text: 'Use Military Aggression to Provoke Conflict', onClick: () => handleStart(2) },
        { text: 'Launch Global Cyberattacks', onClick: () => handleStart(3) },
        { text: 'Sabotage Global Resources and Supply Chains', onClick: () => handleStart(4) },
        { text: 'Launch Nukes', onClick: () => handleStart(5) }
    ]);

    const [displayedText, setDisplayedText] = useState('');
    const [fullText, setFullText] = useState("Welcome, Supreme Leader. The world waits on the precipice of annihilation, and only you have the power to push it over the edge. Your mission? Simple. Unleash havoc, destroy nations, collapse economies, and plunge humanity into an era of unprecedented chaos. How fast can you end it all?");
    const [previousChoices, setPreviousChoices] = useState([]);
    const [round, setRound] = useState(1);
    const [age, setAge] = useState(20);

    const [introPlayed, setIntroPlayed] = useState(false);
    const audioRef = useRef(null);

    const speed = 56;
    const laughAudio = "/audio/laughter.mp3";
    const introAudio = "/speech/0-TTS.mp3";

    const playAudio = () => {
        const audio = new Audio(laughAudio);
        audio.play();
    };

    useEffect(() => {
        if (!introPlayed) {
            const audio = new Audio(introAudio);
            audioRef.current = audio;
            audio.play();
            setIntroPlayed(true);
        }

        let index = 0;
        const intervalId = setInterval(() => {
            if (index < fullText.length) {
                setDisplayedText((prev) => prev + fullText.charAt(index));
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, speed);

        return () => {
            clearInterval(intervalId);
        };
    }, [fullText, introPlayed]);

    const handleStart = async (index) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    
        const payload = {
            choice: buttons[index].text,
            previousChoices: previousChoices,
            round: round,
        };
    
        try {
            const response = await fetch('http://localhost:5001/api/options', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
    
            const data = await response.json();
            setFullText(data.story);
            setDisplayedText('');
    
            const newButtons = data.newOptions.map((option, newIndex) => ({
                text: option,
                onClick: () => handleStart(newIndex), // Use newIndex for new options
            }));
            setButtons(newButtons);
    
            setPreviousChoices([...previousChoices, buttons[index].text]);
            setRound(round + 1);
    
        } catch (error) {
            console.error('Error making API call:', error);
            alert('There was an error generating the story or options. Please try again.');
        }
    };

    return (
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
            <Text displayedText={displayedText} />
            <Buttons buttons={buttons} />
            <GameMap />
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
    );
}

export default Game;
