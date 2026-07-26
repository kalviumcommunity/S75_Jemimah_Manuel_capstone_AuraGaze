const Chat = require("../models/Chat");
const User = require("../models/user");

const { generateReply, FALLBACK_REPLY } = require("../services/aiService");
const runScheduler = require("../services/scheduler");
const sendFirstMessageIfNeeded = require("../services/scheduler/firstMessage");

const {
  getMemories,
  processMemory,
} = require("../services/memoryService");

const {
  extractMemory,
} = require("../services/memoryExtractionService");

const {
  getRelationship,
  updateRelationship,
  getGrowthStage,
} = require("../services/relationshipService");

const {
  detectConversationState,
} = require("../services/connectionService");

const {
  composeMessages,
} = require("../services/messageComposer");

// ==========================================
// SEND MESSAGE
// ==========================================

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { userMessage } = req.body;

    if (!userMessage || !userMessage.trim()) {
      return res.status(400).json({
        message: "Message is required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await Chat.create({
      user: userId,
      sender: "user",
      message: userMessage,
      messageType: "CHAT",
    });

    let chatHistory = await Chat.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    const memories = await getMemories(userId);

    const relationship = await getRelationship(userId);

    const conversationState = detectConversationState(userMessage);

    const aiReply = await generateReply({
      userMessage,
      userProfile: user,
      chatHistory,
      memories,
      relationship,
      conversationState,
    });

    const replyFailed = aiReply === FALLBACK_REPLY;
    const aiReplies = composeMessages(aiReply);

    for (const reply of aiReplies) {
      await Chat.create({
        user: userId,
        sender: "ai",
        message: reply,
        messageType: "CHAT",
      });
    }

    chatHistory = await Chat.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    // Only spend a second Gemini call on memory extraction if the
    // first call actually succeeded — no point burning quota
    // extracting "memory" from a conversation that never happened.
    if (!replyFailed) {
      try {
  const extractionResult = await extractMemory({
    userMessage,
    chatHistory,
  });

  await processMemory({
    user: userId,
    extractionResult,
  });
} catch (err) {
  console.error("Memory extraction skipped:", err.message);
}
    }

    await updateRelationship({
      user: userId,
      userMessage,
    });

    res.status(200).json({
      reply: aiReplies,
      conversationState,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to generate reply.",
    });
  }
};

// ==========================================
// GET CHAT HISTORY
// ==========================================

const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    let chatHistory = await Chat.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    const memories = await getMemories(userId);

    // ----------------------------------
    // First Ever Message (before scheduler)
    // ----------------------------------
    // If this user has never had ANY chat message,
    // send a dedicated "we're meeting for the first time"
    // message instead of letting the daily greeting /
    // reconnect scheduler treat it like a returning user.

    const firstMessageSent = await sendFirstMessageIfNeeded({
      user,
      memories,
    });

    if (!firstMessageSent) {
      await runScheduler({
        user,
        chatHistory,
        memories,
      });
    }

    chatHistory = await Chat.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json(chatHistory);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch messages.",
    });
  }
};

// ==========================================
// GET FRIEND DETAILS
// ==========================================

const getFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.status(200).json({
      nickname: user.profile.nickname,
      friend: user.friend,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch friend.",
    });
  }
};

// ==========================================
// GET FRIEND PROFILE (for Profile Modal)
// ==========================================
// Powers the new profile page: friend info, friendship
// tier label, and the four stat counters. Deliberately
// separate from getFriend (used by the lightweight chat
// header load) so that heavier stat computation only runs
// when the user actually opens the profile modal.
// ==========================================

const FRIENDSHIP_LABELS = {
  NEW_FRIEND: "New Friends",
  GOOD_FRIEND: "Good Friends",
  CLOSE_FRIEND: "Close Friends",
  BEST_FRIEND: "Best Friends",
  SOUL_FRIEND: "Soul Companions",
};

const getFriendProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const relationship = await getRelationship(userId);
    const memories = await getMemories(userId);

    const messagesExchanged = await Chat.countDocuments({
      user: userId,
    });

    // Days Together is measured from the first real conversation
    // (already tracked on Relationship), not account creation —
    // more accurate if a user ever re-picks their AI friend later.
    const firstConversation =
      relationship?.firstConversation || user.createdAt;

    const daysTogether = Math.max(
      1,
      Math.ceil(
        (Date.now() - new Date(firstConversation).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const growthStage = relationship
      ? getGrowthStage(relationship.friendshipLevel)
      : "NEW_FRIEND";

    res.status(200).json({
      nickname: user.profile.nickname,
      friend: user.friend,
      friendshipStartDate: firstConversation,
      friendshipLevel: growthStage,
      friendshipLevelLabel:
        FRIENDSHIP_LABELS[growthStage] || "New Friends",
      stats: {
        messagesExchanged,
        daysTogether,
        memoriesCreated: memories.length,
        conversations: relationship?.conversationCount || 0,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch friend profile.",
    });
  }
};

// ==========================================
// UPDATE FRIEND PROFILE IMAGE
// ==========================================
// Accepts a single uploaded image (via multer memory
// storage), converts it to a base64 data URI, and saves
// it directly on user.friend.image — the same field already
// used for onboarding-selected images, so no schema change
// or migration is needed.
// ==========================================

const updateFriendImage = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        message: "No image file provided.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    user.friend.image = base64Image;

    await user.save();

    res.status(200).json({
      message: "Profile picture updated.",
      image: base64Image,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to update profile picture.",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getFriend,
  getFriendProfile,
  updateFriendImage,
};