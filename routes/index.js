const authRouters = require("./authRouters");
const productRouters = require("./productRouters");
const transactionRouters = require("./transactionRouters");
const cartRouters = require("./cartRouters");
const transactionRouter = require("./transactionsRouter");
const userRouter = require("./userRouter");
const adminRouter = require("./adminRouter");

module.exports = {
  authRouters,
  productRouters,
  transactionRouters,
  cartRouters,
  transactionRouter,
  userRouter,
  adminRouter
};
