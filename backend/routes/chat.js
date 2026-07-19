const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const {
  sendMessage,
  getMessages,
  getFriend,
} = require("../controller/chatController");

// ==========================================
// Send Message
// ==========================================

router.post(
  "/send",
  authMiddleware,
  sendMessage
);

// ==========================================
// Get Chat History
// ==========================================

router.get(
  "/messages",
  authMiddleware,
  getMessages
);

// ==========================================
// Get AI Friend Details
// ==========================================

router.get(
  "/friend",
  authMiddleware,
  getFriend
);

module.exports = router;