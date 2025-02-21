const express = require("express");

const { getTradingPairs } = require('../controllers/dexController');

const router = express.Router();

router.get("/dex/pairs", getTradingPairs);

module.exports = router;