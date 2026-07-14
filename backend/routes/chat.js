const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");

const {
  sendMessage,
  getMessages,
  getFriend,
} = require("../controller/chatController");

// ==========================================
// Get Friend Details
// ==========================================

router.get(
  "/friend",
  authMiddleware,
  getFriend
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