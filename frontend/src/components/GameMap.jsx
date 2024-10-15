import React, { useState, useEffect } from 'react';

function GameMap({ round }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const newImage = `/img/world-map-${round}.png`;
        setImages(prevImages => {
            if (prevImages.length === 0) {
                return [{ src: newImage, round, fadeIn: true }];
            }
            return [
                { ...prevImages[prevImages.length - 1], fadeIn: false },
                { src: newImage, round, fadeIn: true }
            ];
        });
    }, [round]);

    const handleImageLoad = (index) => {
        setImages(prevImages => 
            prevImages.map((img, i) => 
                i === index ? { ...img, loaded: true } : img
            )
        );
    };

    return (
        <div className="map-container">
            <h1>World Map - Round {round}</h1>
            {images.map((image, index) => (
                <img
                    key={`${image.round}-${index}`}
                    className={`map-image ${image.fadeIn && image.loaded ? 'fade-in' : ''} ${image.fadeIn ? 'new-image' : 'old-image'}`}
                    src={image.src}
                    alt={`World Map - Round ${image.round}`}
                    onLoad={() => handleImageLoad(index)}
                    style={{ zIndex: index }}
                />
            ))}
        </div>
    );
}

export default GameMap;