const {
  transactionControllers,
  transactionController,
} = require('../controllers');

const routers = require('express').Router();

// get particular data
routers.get(
  '/get/:transactiondetail_id',
  transactionControllers.getTransactionData
);
// get all data
routers.get('/get', transactionControllers.getAllTransactionData);

// add new custom order transaction data
// routers.post('/post', transactionControllers.addNewTransactionData);
// update transaction data
routers.patch(
  '/update/:transactiondetail_id',
  transactionControllers.updateTransactionData
);
// delete transaction data
routers.delete(
  '/delete/:transactiondetail_id',
  transactionControllers.deleteTransactionData
);

module.exports = routers;
