// Buttons.jsx
import React from 'react';

function Buttons({ buttons }) {
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
