import React from "react";
import PropTypes from "prop-types";
import { rollDice } from "../dice";
import "./DiceGrid.css";

function GridButton(props) {
  const { number, type, userName, disableButtons, onDiceResult } = props;

  function handleButtonClick() {
    const diceRoll = rollDice(number.value, type.value, 0);
    onDiceResult({ ...diceRoll, userName });
  }

  return (
    <button
      className="griditem gridbutton"
      key={type.value + number.value}
      data-testid="dicegrid-button"
      disabled={disableButtons}
      onClick={handleButtonClick}
    >
      {number.label}
      {type.label}
    </button>
  );
}

GridButton.propTypes = {
  type: PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  number: PropTypes.shape({
    value: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  userName: PropTypes.string,
  disableButtons: PropTypes.bool,
  onDiceResult: PropTypes.func.isRequired,
};

function DiceGrid(props) {
  const { numbers, types, userName, disableButtons, onDiceResult } = props;

  return (
    <div className="grid">
      {types.map((type) => (
        <div className="gridrow" data-testid="dicegrid-row" key={type.value}>
          {numbers.map((number) => (
            <GridButton
              key={type.value + number.value}
              number={number}
              type={type}
              userName={userName}
              disableButtons={disableButtons}
              onDiceResult={onDiceResult}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

DiceGrid.propTypes = {
  types: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  numbers: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  userName: PropTypes.string,
  disableButtons: PropTypes.bool,
  onDiceResult: PropTypes.func.isRequired,
};

export default DiceGrid;
