const express = require("express");
const { authController } = require("../controllers");

const { authorize } = require("../helper/authToken");

const router = express.Router();

// Login
router.get("/login", authController.getUser);

// Session
router.get("/session", authorize, authController.getSession);

module.exports = router;
