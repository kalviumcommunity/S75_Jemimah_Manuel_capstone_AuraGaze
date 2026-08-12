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

    const text = (userMessage || "").trim();

    const files = req.files || [];

    if (!text && files.length === 0) {
      return res.status(400).json({
        message: "Message or attachment is required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const attachments = files.map((file) => ({
      url: `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    // Kept as a variable now (not a bare await) so we can return
    // its real _id to the frontend — needed for edit/delete to
    // work on a message during the same session it was sent in.
    const savedUserMessage = await Chat.create({
      user: userId,
      sender: "user",
      message: text,
      attachments,
      messageType: "CHAT",
    });

    let chatHistory = await Chat.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    const memories = await getMemories(userId);

    const relationship = await getRelationship(userId);

    const textForAI = text || "[The user sent an attachment]";

    const conversationState = detectConversationState(textForAI);

    const aiReply = await generateReply({
      userMessage: textForAI,
      userProfile: user,
      chatHistory,
      memories,
      relationship,
      conversationState,
    });

    const replyFailed = aiReply === FALLBACK_REPLY;
    const aiReplies = composeMessages(aiReply);

    // Same reasoning as above — collect the saved docs so their
    // real _ids can be returned to the frontend.
    const savedAiMessages = [];

    for (const reply of aiReplies) {
      const savedReply = await Chat.create({
        user: userId,
        sender: "ai",
        message: reply,
        messageType: "CHAT",
      });

      savedAiMessages.push(savedReply);
    }

    chatHistory = await Chat.find({
      user: userId,
    }).sort({
      createdAt: 1,
    });

    if (!replyFailed) {
      try {
        const extractionResult = await extractMemory({
          userMessage: textForAI,
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
      userMessage: textForAI,
    });

    res.status(200).json({
      reply: aiReplies,
      conversationState,
      userMessageId: savedUserMessage._id,
      aiMessageIds: savedAiMessages.map((m) => m._id),
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

// ==========================================
// CLEAR CHAT
// ==========================================
// Deletes every message belonging to this user only — scoped
// by `user: userId`, so there is no way for this to touch any
// other user's conversation.
// ==========================================

const clearChat = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Chat.deleteMany({ user: userId });

    res.status(200).json({
      message: "Chat cleared.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to clear chat.",
    });
  }
};

// ==========================================
// DELETE SELECTED MESSAGES
// ==========================================
// Accepts an array of message IDs in the request body and
// deletes only those, scoped to the requesting user so a
// message ID from another user's chat can never be deleted
// through this endpoint even if somehow guessed/supplied.
// ==========================================

const deleteMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        message: "No message IDs provided.",
      });
    }

    const result = await Chat.deleteMany({
      _id: { $in: messageIds },
      user: userId,
    });

    res.status(200).json({
      message: "Selected messages deleted.",
      deletedCount: result.deletedCount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to delete messages.",
    });
  }
};

// ==========================================
// EDIT MESSAGE
// ==========================================
// Only ever updates a message where sender === "user" — this
// is a hard restriction at the query level, not just a UI-side
// convention, so an AI-authored message can never be edited
// through this endpoint even if a request is crafted by hand.
// ==========================================

const editMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { message } = req.body;

    const trimmed = (message || "").trim();

    if (!trimmed) {
      return res.status(400).json({
        message: "Message text is required.",
      });
    }

    const updated = await Chat.findOneAndUpdate(
      {
        _id: id,
        user: userId,
        sender: "user",
      },
      {
        message: trimmed,
      },
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Message not found or cannot be edited.",
      });
    }

    res.status(200).json({
      message: "Message updated.",
      chat: updated,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to edit message.",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getFriend,
  getFriendProfile,
  updateFriendImage,
  clearChat,
  deleteMessages,
  editMessage,
};