import React, { useState } from 'react';

function Buttons() {



    // Initialize button configurations with default values
    const [buttons, setButtons] = useState([
        { text: 'Begin the Collapse', onClick: () => handleStart(0) },
        { text: '', onClick: () => handleStart(1) },
        { text: '', onClick: () => handleStart(2) },
        { text: '', onClick: () => handleStart(3) },
        { text: '', onClick: () => handleStart(4) },
        { text: '', onClick: () => handleStart(5) }
    ]);

    // Handler function for button clicks
    const handleStart = (index) => {
        console.log(`Button ${index + 1} clicked!`);
        // Dynamically update text or behavior based on index, conditions, etc.
        const newButtons = [...buttons];
        newButtons[index].text = `Button ${index + 1} clicked`;
        setButtons(newButtons);
    };

    // Optionally, you could have other logic that changes the button state
    const updateButtons = (index, newText) => {
        const newButtons = [...buttons];
        newButtons[index].text = newText;
        setButtons(newButtons);
    };

    return (
        <div className="btn-container">
            {buttons.map((button, index) => (
                <div key={index} className="btn-items">
                    <button className="btn-options" onClick={button.onClick}></button>
                    <div className="btn-text">
                        <p>{button.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Buttons;
