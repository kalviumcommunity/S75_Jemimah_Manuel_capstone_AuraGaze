const Chat = require("../models/Chat");
const User = require("../models/user");

const { generateReply } = require("../services/aiService");
const runScheduler = require("../services/scheduler");

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

    // ----------------------------------
    // Load User
    // ----------------------------------

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // ----------------------------------
    // Save User Message
    // ----------------------------------

    await Chat.create({
      user: userId,
      sender: "user",
      message: userMessage,
      messageType: "CHAT",
    });

    // ----------------------------------
    // Load Chat History
    // ----------------------------------

    let chatHistory = await Chat.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    // ----------------------------------
    // Load Memories
    // ----------------------------------

    const memories = await getMemories(userId);

    // ----------------------------------
    // Load Relationship
    // ----------------------------------

    const relationship = await getRelationship(userId);

    // ----------------------------------
    // Connection Brain
    // ----------------------------------

    const conversationState =
      detectConversationState(userMessage);

    // ----------------------------------
    // Generate Aura Reply
    // ----------------------------------

    const aiReply = await generateReply({
      userMessage,
      userProfile: user,
      chatHistory,
      memories,
      relationship,
      conversationState,
    });

    // ----------------------------------
    // Split Into WhatsApp Messages
    // ----------------------------------

    const aiReplies = composeMessages(aiReply);

    // ----------------------------------
    // Save Every Bubble
    // ----------------------------------

    for (const reply of aiReplies) {

      await Chat.create({
        user: userId,
        sender: "ai",
        message: reply,
        messageType: "CHAT",
      });

    }

    // ----------------------------------
    // Reload Chat History
    // ----------------------------------

    chatHistory = await Chat.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    // ----------------------------------
    // Learning Brain
    // ----------------------------------

    const extractionResult =
      await extractMemory({
        userMessage,
        chatHistory,
      });

    await processMemory({
      user: userId,
      extractionResult,
    });

    // ----------------------------------
    // Relationship Brain
    // ----------------------------------

    await updateRelationship({
      user: userId,
      userMessage,
    });

    // ----------------------------------
    // Return Reply
    // ----------------------------------

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

    await runScheduler({
      user,
      chatHistory,
      memories,
    });

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