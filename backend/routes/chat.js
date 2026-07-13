const express = require("express");

const authMiddleware = require("../middleware/authmiddleware");

const {
  startChat,
  sendMessage,
  getMessages,
} = require("../controller/chatController");

const router = express.Router();

// ==========================================
// Create Chat (First Time)
// ==========================================

router.post(
  "/start",
  authMiddleware,
  startChat
);

// ==========================================
// Save Conversation
// ==========================================

router.post(
  "/message",
  authMiddleware,
  sendMessage
);

// ==========================================
// Get Chat History
// ==========================================

router.get(
  "/history",
  authMiddleware,
  getMessages
);

module.exports = router;