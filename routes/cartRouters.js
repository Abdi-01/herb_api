const express = require("express");
const { cartController } = require("../controllers");
const { authorize } = require("../helper/authToken");
const router = express.Router();

// Get Carts
router.get("/", authorize, cartController.getCart);

// Update Qty Cart
router.patch("/update-cart", cartController.updateQty);

module.exports = router;
