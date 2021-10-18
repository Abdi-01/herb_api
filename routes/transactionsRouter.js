const express = require("express");
const router = express.Router();
const { transactionController } = require("../controllers");
const { authorize } = require("../helper/authToken");

// Add Transaction
router.post("/", transactionController.addTransaction);

// Get Transaction
router.get("/", authorize, transactionController.getTransaction);

// Get Transaction History
router.get("/history", authorize, transactionController.getTransactionHistory);

// Update transaction

router.patch(
  "/update/:transaction_id",
  transactionController.updateTransactionProof
);

module.exports = router;
