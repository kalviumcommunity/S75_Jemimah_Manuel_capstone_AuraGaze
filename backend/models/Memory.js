const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    // ============================
    // Owner
    // ============================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ============================
    // Memory Title
    // ============================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================
    // Actual Memory
    // ============================

    memory: {
      type: String,
      required: true,
      trim: true,
    },

    // ============================
    // Category
    // ============================

    category: {
      type: String,
      default: "General",
      trim: true,
    },

    // ============================
    // Importance
    // 1 = Forgettable
    // 5 = Very Important
    // ============================

    importance: {
      type: Number,
      default: 3,
      min: 1,
      max: 5,
    },

    // ============================
    // Who Created It
    // ============================

    source: {
      type: String,
      enum: [
        "conversation",
        "onboarding",
        "manual",
      ],
      default: "conversation",
    },

    // ============================
    // Active Memory
    // ============================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Memory ||
  mongoose.model("Memory", memorySchema);