import React, { useState, useEffect, useRef } from 'react';
import Text from './Text';
import Buttons from './Buttons';
import GameMap from "./GameMap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed, faDoorOpen, faGear } from '@fortawesome/free-solid-svg-icons';

function Game({ handleExitClick, isExitHovered, setIsExitHovered, isGearHovered, setIsGearHovered }) {
    const [gameOver, setGameOver] = useState(false);
    const [outcome, setOutcome] = useState('');
    const [clockRunning, setClockRunning] = useState(true);

    const initialFullText = "Welcome, Supreme Leader. The world waits on the precipice of annihilation, and only you have the power to push it over the edge. Your mission? Simple. Unleash havoc, destroy nations, collapse economies, and plunge humanity into an era of unprecedented chaos. How fast can you end it all?";

    const getInitialButtons = () => ([
        { text: 'Unleash a Virus', onClick: () => handleStart('Unleash a Virus') },
        { text: 'Crash the Global Economy', onClick: () => handleStart('Crash the Global Economy') },
        { text: 'Use Military Aggression to Provoke Conflict', onClick: () => handleStart('Use Military Aggression to Provoke Conflict') },
        { text: 'Launch Global Cyberattacks', onClick: () => handleStart('Launch Global Cyberattacks') },
        { text: 'Sabotage Global Resources and Supply Chains', onClick: () => handleStart('Sabotage Global Resources and Supply Chains') },
        { text: 'Launch Nukes', onClick: () => handleStart('Launch Nukes') }
    ]);

    const [buttons, setButtons] = useState(getInitialButtons());

    const [fullText, setFullText] = useState(initialFullText);
    const fullTextRef = useRef(fullText);

    const [previousChoices, setPreviousChoices] = useState([]);
    const previousChoicesRef = useRef(previousChoices);

    const [introPlayed, setIntroPlayed] = useState(false);
    const audioRef = useRef(null);
    const sovietAudioRef = useRef(null);

    const laughAudio = "/audio/laughter.mp3";
    const introAudio = "/speech/0-TTS.mp3";

    const playAudio = () => {
        const audio = new Audio(laughAudio);
        audio.play();
    };

    useEffect(() => {
        if (!introPlayed) {
            const audio = new Audio(introAudio);
            audio.volume = 0.4;
            audioRef.current = audio;
            audio.play();
            setIntroPlayed(true);
        }
    }, [introPlayed]);

    const roundRef = useRef(1);

    const handleStart = async (choiceText) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        setClockRunning(false);

        if (!sovietAudioRef.current) {
            const soviet = new Audio("/music/soviet.mp3");
            soviet.loop = true;
            sovietAudioRef.current = soviet;
            soviet.play();
        }

        const updatedPreviousChoices = [...previousChoicesRef.current, choiceText];

        const currentRound = roundRef.current;

        const payload = {
            choice: choiceText,
            previousChoices: updatedPreviousChoices,
            previousText: fullTextRef.current,
            round: currentRound,
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

            let storyText = data.story;

            if (data.outcome) {
                setOutcome(data.outcome);
                setGameOver(true);
                setButtons([]);
            } else if (data.newOptions && data.newOptions.length > 0) {
                const newButtons = data.newOptions.map((option) => ({
                    text: option,
                    onClick: () => handleStart(option),
                }));
                setButtons(newButtons);
            } else {
                console.error('No new options received from the server');
                alert('No new options were provided. The game cannot continue.');
                setButtons([]);
            }

            setFullText(storyText);
            setPreviousChoices((prevChoices) => [...prevChoices, choiceText]);
            previousChoicesRef.current = [...previousChoicesRef.current, choiceText];
            fullTextRef.current = storyText;
            roundRef.current += 1;

            if (roundRef.current > 6 && !gameOver) {
                setGameOver(true);
                setOutcome('lose');
                setButtons([]);
            }

        } catch (error) {
            console.error('Error making API call:', error);
            alert('There was an error generating the story or options. Please try again.');
        }
    };

    const resetGame = () => {
        setButtons(getInitialButtons());
        setFullText(initialFullText);
        setPreviousChoices([]);
        previousChoicesRef.current = [];
        roundRef.current = 1;
        setIntroPlayed(false);
        setGameOver(false);
        setOutcome('');
        setClockRunning(true);

        if (sovietAudioRef.current) {
            sovietAudioRef.current.pause();
            sovietAudioRef.current.currentTime = 0;
            sovietAudioRef.current = null;
        }
    };

    const handlePlayAgain = () => {
        resetGame();
    };

    const handleQuit = () => {
        handleExitClick();

        if (sovietAudioRef.current) {
            sovietAudioRef.current.pause();
            sovietAudioRef.current.currentTime = 0;
            sovietAudioRef.current = null;
        }
    };

    const handleExit = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    
        if (sovietAudioRef.current) {
            sovietAudioRef.current.pause();
            sovietAudioRef.current.currentTime = 0;
            sovietAudioRef.current = null;
        }
    
        handleExitClick();
    };

    return (
        <>
            {gameOver ? (
                <div className="game-over-modal">
                    <h1 className="game-over-text">
                        {outcome === 'win' ? 'Winner, You successfully eradicated humanity' : 'Game Over, Humanity won'}
                    </h1>
                    <Text fullText={fullText} />
                    <button className="play-again-button" onClick={handlePlayAgain}>Play Again</button>
                    <button className="quit-button" onClick={handleQuit}>Quit</button>
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
                        </div>
                    </div>
                    <Text fullText={fullText} />
                    <Buttons buttons={buttons} />
                    <GameMap round={roundRef.current} />
                    <div
                      className="exit-icon-container"
                      onMouseEnter={() => setIsExitHovered(true)}
                      onMouseLeave={() => setIsExitHovered(false)}
                      onClick={handleExit}
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
        </>
    );
}

export default Game;
