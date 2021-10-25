const express = require('express');
const router = express.Router();
const { transactionController } = require('../controllers');
const { authorize } = require('../helper/authToken');

// Add Transaction
router.post('/', transactionController.addTransaction);

// add custom transaction
router.post('/customs', transactionController.addCustomTransaction);

// Add Custom Transaction Detail Item
router.post('/custom', transactionController.addTransactionDetailItem);

// Get Transaction
router.get('/', authorize, transactionController.getTransaction);

// Get Transaction Detail
router.get('/detail', transactionController.getTransDetail);

// Get Transaction History
router.get('/history', authorize, transactionController.getTransactionHistory);

// Update transaction

router.patch(
  '/update/:transaction_id',
  transactionController.uploadPaymentProof
);
module.exports = router;
