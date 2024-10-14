// Text.jsx
import React from 'react';

function Text({ displayedText }) {
    return (
        <div className="text-container">
            <h3>{displayedText}</h3>
        </div>
    );
}

export default Text;
