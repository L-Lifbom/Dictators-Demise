import React, { useState } from "react";
import Text from "./components/Text";
import Button from "./components/Buttons";
import Map from "./components/Map";

function App() {
  const [age, setAge] = useState(20);
  const [showContent, setShowContent] = useState(false);

  const handlePlayClick = () => {
    setShowContent(true);
  };

  return (
    <div className="main-container">
      {!showContent ? (
        <div className="main-container-btn-layout">
          <button className="play-btn" onClick={handlePlayClick}>Play</button>
        </div>
      ) : (
        <>
          <div className="dictator-profile">
            <img
              className="dictator-img"
              src="../public/img/Dictator.webp"
              alt="Dictator"
            />
            <div className="dictator-info">
              <p>Dictator</p>
              <p>Age: {age}</p>
            </div>
          </div>
          <Text />
          <Button />
          <Map />
        </>
      )}
    </div>
  );
}

export default App;
