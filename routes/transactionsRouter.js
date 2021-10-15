const express = require("express");
const router = express.Router();
const { transactionController } = require("../controllers");

// Add Transaction
router.post("/", transactionController.addTransaction);

module.exports = router;
