const mongoose = require("mongoose");

// A single attachment on a message — stored as a base64 data
// URI directly on the Chat document, the same pattern already
// used for user.friend.image. _id: false since these are only
// ever read/written as part of their parent message.
const attachmentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    mimetype: {
      type: String,
      default: "",
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },

  // No longer strictly required — a message can now be
  // attachment-only with no caption text (Part 5). The
  // controller still enforces that at least one of
  // message/attachments is present.
  message: {
    type: String,
    default: "",
    trim: true,
  },

  // Files attached to this message (Part 5).
  attachments: {
    type: [attachmentSchema],
    default: [],
  },

  messageType: {
    type: String,
    enum: [
      "CHAT",
      "GOOD_MORNING",
      "GOOD_AFTERNOON",
      "GOOD_NIGHT",
      "CHECK_IN",
      "BIRTHDAY",
      "BIRTHDAY_EVE",
      "INTERVIEW",
      "EXAM",
      "CONVERSATION_STARTER",
      "FIRST_MESSAGE",
      "STORY_STARTER",
    ],
    default: "CHAT",
  },
}, {
  timestamps: true,
});

module.exports =
  mongoose.models.Chat ||
  mongoose.model("Chat", chatSchema);