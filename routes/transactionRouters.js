const { transactionControllers } = require("../controllers");

const routers = require("express").Router();

// get particular data
routers.get("/get/:transaction_id", transactionControllers.getTransactionData);
// get all data
routers.get("/get", transactionControllers.getAllTransactionData);
// add new transaction data
routers.post("/post", transactionControllers.addNewTransactionData);
// update transaction data
routers.patch(
  "/update/:transaction_id",
  transactionControllers.updateTransactionData
);
// delete transaction data
routers.delete(
  "/delete/:transaction_id",
  transactionControllers.deleteTransactionData
);

module.exports = routers;
