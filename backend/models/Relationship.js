const mongoose = require("mongoose");

const relationshipSchema = new mongoose.Schema(
  {
    // ============================
    // Owner
    // ============================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ============================
    // Relationship Progress
    // ============================

    friendshipLevel: {
      type: Number,
      default: 0,
      min: 0,
    },

    trustLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    comfortLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    humorLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ============================
    // Conversation Statistics
    // ============================

    conversationCount: {
      type: Number,
      default: 0,
    },

    firstConversation: {
      type: Date,
      default: Date.now,
    },

    lastConversation: {
      type: Date,
      default: Date.now,
    },

    // ============================
    // Favorite Topics
    // ============================

    favoriteTopics: [
      {
        topic: {
          type: String,
          trim: true,
        },

        count: {
          type: Number,
          default: 1,
        },
      },
    ],

    // ============================
    // Shared History
    // ============================

    sharedHistory: [
      {
        title: {
          type: String,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============================
    // Conversation Milestones
    // ============================

    milestones: [
      {
        milestone: {
          type: String,
          trim: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
        },
      },
    ],

    // ============================
    // Inside Jokes
    // ============================

    insideJokes: [
      {
        title: {
          type: String,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ============================
    // Communication Style
    // ============================

    communicationStyle: {
      prefersLongReplies: {
        type: Boolean,
        default: true,
      },

      prefersShortReplies: {
        type: Boolean,
        default: false,
      },

      likesQuestions: {
        type: Boolean,
        default: true,
      },

      likesStories: {
        type: Boolean,
        default: true,
      },

      likesPoems: {
        type: Boolean,
        default: false,
      },

      likesSongs: {
        type: Boolean,
        default: false,
      },

      usesEmojis: {
        type: Boolean,
        default: true,
      },

      // Statistics

      shortMessageCount: {
        type: Number,
        default: 0,
      },

      longMessageCount: {
        type: Number,
        default: 0,
      },

      emojiMessageCount: {
        type: Number,
        default: 0,
      },
    },

    // ============================
    // Relationship Metadata
    // ============================

    lastTopic: {
      type: String,
      default: "",
    },

    lastEmotion: {
      type: String,
      default: "",
    },

    lastInteractionType: {
      type: String,
      default: "CHAT",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Relationship ||
  mongoose.model("Relationship", relationshipSchema);