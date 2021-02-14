const diceResults = [];
const DiceResultModel = require("../model/dice-result.model");

async function createDiceResult(req, res, next) {
  const { rolls, modifier, sum, userName } = req.body;

  if (
    Array.isArray(rolls) &&
    typeof modifier === "number" &&
    typeof sum === "number"
  ) {
    const newDiceResult = { rolls, modifier, sum, userName };
    try {
      const createdResult = await DiceResultModel.create(newDiceResult);
      res.status(201).json(createdResult);
    } catch (err) {
      res.status(500);
      next(err);
    }
  } else {
    res.status(400);
    next({ message: "Missing fields" });
  }
}

async function getDiceResults(req, res, next) {
  try {
    const results = await DiceResultModel.get();
    res.status(200).json(results);
  } catch (err) {
    res.status(500);
    next(err);
  }
}

async function deleteDiceResults(req, res, next) {
  try {
    await DiceResultModel.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500);
    next(err);
  }
}

module.exports = {
  createDiceResult,
  getDiceResults,
  deleteDiceResults,
};
