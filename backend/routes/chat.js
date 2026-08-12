const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const upload = require("../middleware/upload");
const chatUpload = require("../middleware/chatUpload");

const {
  sendMessage,
  getMessages,
  getFriend,
  getFriendProfile,
  updateFriendImage,
  clearChat,
  deleteMessages,
  editMessage,
} = require("../controller/chatController");

// ==========================================
// Send Message
// ==========================================

router.post(
  "/send",
  authMiddleware,
  (req, res, next) => {
    chatUpload.array("attachments", 4)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message || "Upload failed.",
        });
      }

      next();
    });
  },
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
// Get AI Friend Details (lightweight — chat header)
// ==========================================

router.get(
  "/friend",
  authMiddleware,
  getFriend
);

// ==========================================
// Get AI Friend Profile (full — profile modal)
// ==========================================

router.get(
  "/friend/profile",
  authMiddleware,
  getFriendProfile
);

// ==========================================
// Update Friend Profile Image
// ==========================================

router.put(
  "/friend/image",
  authMiddleware,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message || "Upload failed.",
        });
      }

      next();
    });
  },
  updateFriendImage
);

// ==========================================
// Clear Entire Chat
// ==========================================

router.delete(
  "/clear",
  authMiddleware,
  clearChat
);

// ==========================================
// Delete Selected Messages
// ==========================================

router.delete(
  "/messages",
  authMiddleware,
  deleteMessages
);

// ==========================================
// Edit a Single Message
// ==========================================

router.put(
  "/messages/:id",
  authMiddleware,
  editMessage
);

module.exports = router;