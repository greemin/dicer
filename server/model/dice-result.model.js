const diceResults = [];

async function create(newDiceResult) {
  diceResults.push(newDiceResult);
  return newDiceResult;
}

async function get() {
  return diceResults;
}

async function remove() {
  const deleteNumber = diceResults.length;
  diceResults.splice(0);
  return deleteNumber;
}

module.exports = { create, get, remove };
