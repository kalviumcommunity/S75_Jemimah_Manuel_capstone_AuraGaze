const express = require("express");

const {
  signup,
  login,
  googleAuth,
} = require("../controller/authController");

const router = express.Router();

// ==========================================
// Normal authentication
// ==========================================

router.post("/signup", signup);

router.post("/login", login);

// ==========================================
// Google authentication
// ==========================================

router.post("/google", googleAuth);

module.exports = router;