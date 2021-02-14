import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import DiceSelects from "./DiceSelects";
import DiceGrid from "./DiceGrid";
import DiceResult from "./DiceResult";
import { rollDice } from "../dice";
import "./Dicer.css";

export const diceNumbers = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];
export const diceTypes = [
  { value: 4, label: "D4" },
  { value: 6, label: "D6" },
  { value: 8, label: "D8" },
  { value: 10, label: "D10" },
  { value: 12, label: "D12" },
  { value: 20, label: "D20" },
  { value: 100, label: "D100" },
];

function Dicer(props) {
  const { url } = props;
  const [diceNumber, setDiceNumber] = React.useState(diceNumbers[0].value);
  const [diceType, setDiceType] = React.useState(diceTypes[0].value);
  const [modifier, setModifier] = React.useState(0);
  const [diceResults, setDiceResults] = React.useState([]);
  const [disableButtons, setDisableButtons] = React.useState(false);
  const [userName, setUserName] = React.useState("Anon");

  function handleUserNameChange(evt) {
    setUserName(evt.target.value);
  }

  function handleDiceResult(newDiceResult) {
    if (url) {
      setDisableButtons(true);
      axios
        .post(url, newDiceResult)
        .then((response) => setDisableButtons(false))
        .catch((error) => {
          console.log("POST ERROR:", error);
          setDisableButtons(false);
        });
    } else {
      setDiceResults([...diceResults, newDiceResult]);
    }
  }

  const renderDiceResult =
    url || (Array.isArray(diceResults) && diceResults.length > 0);

  return (
    <div className="app">
      <div className="toolbox">
        <h1>Dicer</h1>
        <h5>A lightweight tool for all your dicing needs</h5>
        <input value={userName} onChange={handleUserNameChange} />
        <DiceSelects
          numbers={diceNumbers}
          types={diceTypes}
          userName={userName}
          disableButtons={disableButtons}
          onDiceResult={handleDiceResult}
        />
        <DiceGrid
          numbers={diceNumbers}
          types={diceTypes}
          userName={userName}
          disableButtons={disableButtons}
          onDiceResult={handleDiceResult}
        />
      </div>
      {renderDiceResult && <DiceResult results={diceResults} url={url} />}
    </div>
  );
}

Dicer.propTypes = {
  url: PropTypes.string,
};

export default Dicer;
