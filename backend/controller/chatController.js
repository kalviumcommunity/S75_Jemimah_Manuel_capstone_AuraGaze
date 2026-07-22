const Chat = require("../models/Chat");
const User = require("../models/user");

const { generateReply } = require("../services/aiService");
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

    const conversationState =
      detectConversationState(userMessage);

    const aiReply = await generateReply({
      userMessage,
      userProfile: user,
      chatHistory,
      memories,
      relationship,
      conversationState,
    });

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

    const extractionResult =
      await extractMemory({
        userMessage,
        chatHistory,
      });

    await processMemory({
      user: userId,
      extractionResult,
    });

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

module.exports = {
  sendMessage,
  getMessages,
  getFriend,
};