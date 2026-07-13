const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =========================
    // Authentication
    // =========================
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
    },

    // =========================
    // Onboarding Status
    // =========================
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // =========================
    // User Profile
    // =========================
    profile: {
      nickname: {
        type: String,
        default: "",
      },

      dob: {
        type: Date,
      },
    },

    // =========================
    // AI Best Friend
    // =========================
    friend: {
      name: {
        type: String,
        default: "",
      },

      gender: {
        type: String,
        enum: ["male", "female"],
        default: "",
      },

      ageGroup: {
        type: String,
        enum: ["school", "young", "elder"],
        default: "",
      },

      image: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);