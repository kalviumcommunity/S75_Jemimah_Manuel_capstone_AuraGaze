const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const {
  saveOnboarding,
  getOnboarding,
} = require("../controller/onboardingController");

// Save onboarding
router.put("/save", authMiddleware, saveOnboarding);

// Get onboarding
router.get("/", authMiddleware, getOnboarding);

module.exports = router;