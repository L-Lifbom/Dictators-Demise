import React, { useState, useEffect } from 'react';

function Text() {
    const [displayedText, setDisplayedText] = useState('');
    const fullText = "Welcome, Supreme Leader. The world waits on the precipice of annihilation, and only you have the power to push it over the edge. Your mission? Simple. Unleash havoc, destroy nations, collapse economies, and plunge humanity into an era of unprecedented chaos. How fast can you end it all?";
    
    const speed = 56;
    const audio0 = '/speech/0-TTS.mp3';

    useEffect(() => {
        const audio = new Audio(audio0);
        let index = 0;
        audio.play()
            .then(() => {
                const intervalId = setInterval(() => {
                    if (index < fullText.length) {
                        setDisplayedText((prev) => prev + fullText.charAt(index));
                        index++;
                    } else {
                        clearInterval(intervalId);
                    }
                }, speed);
            })
            .catch((error) => {
                console.error("Audio playback failed:", error);
            });

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    return (
        <div className="text-container">
            <h3>{displayedText}</h3>
        </div>
    );
}

export default Text;
