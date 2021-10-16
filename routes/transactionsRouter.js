const express = require("express");
const router = express.Router();
const { transactionController } = require("../controllers");
const { authorize } = require("../helper/authToken");

// Add Transaction
router.post("/", transactionController.addTransaction);

// Get Transaction
router.get("/", authorize, transactionController.getTransaction);

module.exports = router;
