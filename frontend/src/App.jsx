import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Text from "./components/Text";
import Button from "./components/Buttons";
import Map from "./components/Map";

function App() {
  const [age, setAge] = useState(20);

  return (
      <div className="main-container">

        <div className="dictator-profile">
          <img className="dictator-img" src="../public/img/Dictator.webp" alt="Dictator" />
          <div className="dictator-info">
            <p>Dictator</p>
            <p>Age: {age}</p>
          </div>
        </div>
        <Text />
        <Button />
        <Map />

      </div>
  );
}

export default App;
