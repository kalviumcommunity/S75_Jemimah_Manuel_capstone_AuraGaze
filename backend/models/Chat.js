const mongoose = require("mongoose");

// ==============================
// Individual Message Schema
// ==============================

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ==============================
// Chat Schema
// ==============================

const chatSchema = new mongoose.Schema(
  {
    // Owner of this conversation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Companion information
    friend: {
      id: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        default: "",
      },

      gender: {
        type: String,
        enum: ["male", "female"],
        default: "",
      },

      image: {
        type: String,
        default: "",
      },
    },

    // Complete conversation
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);