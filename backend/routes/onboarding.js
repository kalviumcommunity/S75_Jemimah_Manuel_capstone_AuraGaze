const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const {
  saveOnboarding,
  getOnboarding,
} = require("../controller/onboardingController");

router.put("/save", authMiddleware, saveOnboarding);

router.get("/", authMiddleware, getOnboarding);

module.exports = router;
