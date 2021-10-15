const express = require("express");
const { cartController } = require("../controllers");
const { authorize } = require("../helper/authToken");
const router = express.Router();

// Get Carts
router.get("/", authorize, cartController.getCart);

// Update Qty Cart
router.patch("/:id", cartController.updateQty);

// Delete Specific Cart
router.delete("/:id", cartController.deleteCart);

module.exports = router;
