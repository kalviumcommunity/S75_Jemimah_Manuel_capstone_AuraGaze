const mongoose = require("mongoose");

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

  message: {
    type: String,
    required: true,
    trim: true,
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