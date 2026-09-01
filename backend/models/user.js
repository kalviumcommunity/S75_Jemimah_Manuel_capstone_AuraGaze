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

      // Supports domains such as:
      // gmail.com
      // outlook.com
      // kalvium.community
      // university.ac.in
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Please enter a valid email address",
      },
    },

    // Password is required for normal email/password users,
    // but Google users don't have a password.
    password: {
      type: String,
      default: null,
    },

    // Google account ID
    googleId: {
      type: String,
      default: null,
      sparse: true,
    },

    // Authentication provider
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
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
        enum: ["male", "female", null],
        default: null,
      },

      ageGroup: {
        type: String,
        enum: ["school", "young", "elder", null],
        default: null,
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

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);