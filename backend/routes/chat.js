const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const upload = require("../middleware/upload");

const {
  sendMessage,
  getMessages,
  getFriend,
  getFriendProfile,
  updateFriendImage,
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
// Wraps multer's upload.single() manually so that file
// validation errors (wrong type, too large) return a clean
// 400 response instead of falling through to a generic
// 500 error.
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

module.exports = router;