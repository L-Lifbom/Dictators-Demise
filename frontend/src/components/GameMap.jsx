import React from 'react';

function GameMap({ round }) {
    return (
        <div className="map-container">
            <h1>World Map - Round {round}</h1>
            <img src={`/img/world-map-${round}.png`} alt={`World Map - Round ${round}`} />
        </div>
    );
};

export default GameMap;
