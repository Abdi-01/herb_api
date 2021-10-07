const express = require("express");
const { authController } = require("../controllers");

const { authorize, auth } = require("../helper/authToken");

const router = express.Router();

// Login
router.get("/login", authController.getUser);

// Session
router.get("/session", authorize, authController.getSession);

// Register
router.post("/register", authController.addUser);

// Verify Account
router.patch("/verify", auth, authController.verification);

// Forgot Password
router.get("/forgot-password", authController.forgotPassword);

// Verify Reset Password
router.patch("/reset-password", auth, authController.resetPassword);

// Change Password based user
router.patch("/change-password", authController.changePassword);

module.exports = router;
