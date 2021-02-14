export function rollDice(numberOfDice = 1, numberOfSides = 6, modifier = 0) {
  const result = { sum: 0, rolls: [], modifier };

  for (let i = 0; i < Math.ceil(numberOfDice); i++) {
    const diceValue = Math.ceil(Math.random() * Math.ceil(numberOfSides));
    result.rolls.push(diceValue);
    result.sum += diceValue;
  }

  result.sum += modifier;

  return result;
}
