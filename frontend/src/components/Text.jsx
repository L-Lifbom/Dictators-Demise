import React, { useEffect, useState } from 'react';

function Text({ fullText }) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        let isCancelled = false;
        let currentText = '';
        setDisplayedText('');

        const typingAudio = "/audio/typing-sound.wav";
        const typingAudioInstance = new Audio(typingAudio);
        typingAudioInstance.loop = true;
        typingAudioInstance.volume = 0.3;

        const typeNextChar = () => {
            if (isCancelled) return;
            if (index < fullText.length) {
                currentText += fullText.charAt(index);
                setDisplayedText(currentText);
                index++;
                setTimeout(typeNextChar, 20);
            } else {
                typingAudioInstance.pause();
                typingAudioInstance.currentTime = 0;
            }
        };

        typingAudioInstance.play();
        typeNextChar();

        return () => {
            isCancelled = true;
            typingAudioInstance.pause();
            typingAudioInstance.currentTime = 0;
        };
    }, [fullText]);

    return (
        <div className="text-container">
            <h3>{displayedText}</h3>
        </div>
    );
}

export default Text;
