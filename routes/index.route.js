const express = require("express");
const mainController = require("../controllers/index.controller");

const router = express.Router();

router.get("/script-streaming", mainController.pythonScriptStreaming);
router.post("/calculate-counter", mainController.calculateCounter);
router.post("/register-open-interest", mainController.registerOpenInterest);
router.get("/get-open-interest", mainController.getOpenInterest);
router.get("/get-net-notional-gamma", mainController.getNetNotionalGamma);

module.exports = router;
