import React from "react";
import PropTypes from "prop-types";
import { rollDice } from "../dice";
import "./DiceSelects.css";

function DiceSelects(props) {
  const { numbers, types, userName, disableButtons, onDiceResult } = props;
  const [diceNumber, setDiceNumber] = React.useState(numbers[0].value);
  const [diceType, setDiceType] = React.useState(types[0].value);
  const [modifier, setModifier] = React.useState(0);

  function rollTheDice() {
    const diceRoll = rollDice(diceNumber, diceType, Number(modifier));
    onDiceResult({ ...diceRoll, userName });
  }

  function handleNumberChange(event) {
    setDiceNumber(event.target.value);
  }

  function handleTypeChange(event) {
    setDiceType(event.target.value);
  }

  function handleModifierChange(event) {
    setModifier(event.target.value);
  }

  return (
    <div className="selects">
      <select onChange={handleNumberChange}>
        {numbers.map((number) => (
          <option key={number.value} value={number.value}>
            {number.label}
          </option>
        ))}
      </select>
      <select onChange={handleTypeChange}>
        {types.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      <input value={modifier} type="number" onChange={handleModifierChange} />
      <button disabled={disableButtons} onClick={rollTheDice}>
        Roll!
      </button>
    </div>
  );
}

DiceSelects.propTypes = {
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

export default DiceSelects;
