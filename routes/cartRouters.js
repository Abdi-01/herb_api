const express = require("express");
const { cartController } = require("../controllers");
const { authorize } = require("../helper/authToken");
const router = express.Router();

// Get All Carts
router.get("/", authorize, cartController.getAllCart);

// Get Specific Carts
router.get("/:id", cartController.getCart);

router.post("/", cartController.addCart);

// Update Qty Cart
router.patch("/:id", cartController.updateQty);

// Delete Specific Cart
router.delete("/:id", cartController.deleteSpecificCart);

// Delete all Cart by userId
router.delete("/all/:id", cartController.deleteCarts);

module.exports = router;
