const express = require("express");
const DiceResultController = require("../controllers/dice-result.controller");
const router = express.Router();

router.post("/", DiceResultController.createDiceResult);
router.get("/", DiceResultController.getDiceResults);
router.delete("/", DiceResultController.deleteDiceResults);

module.exports = router;
