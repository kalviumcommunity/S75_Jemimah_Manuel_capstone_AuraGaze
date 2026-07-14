const Chat = require("../models/Chat");
const User = require("../models/user");

const { generateReply } = require("../services/aiService");

// ==========================================
// SEND MESSAGE
// ==========================================

const sendMessage = async (req, res) => {

  try {

    const userId = req.user.userId;

    const { userMessage } = req.body;

    if (!userMessage) {

      return res.status(400).json({

        message: "Message is required.",

      });

    }

    // -----------------------------
    // Save User Message
    // -----------------------------

    await Chat.create({

      user: userId,

      sender: "user",

      message: userMessage,

    });

    // -----------------------------
    // Ask Gemini
    // -----------------------------

    const aiReply = await generateReply(userMessage);

    // -----------------------------
    // Save AI Reply
    // -----------------------------

    await Chat.create({

      user: userId,

      sender: "ai",

      message: aiReply,

    });

    // -----------------------------
    // Return Reply
    // -----------------------------

    res.status(200).json({

      reply: aiReply,

    });

  }

  catch (error) {

    console.log(error);

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

    const messages = await Chat.find({

      user: userId,

    }).sort({

      createdAt: 1,

    });

    res.status(200).json(messages);

  }

  catch (error) {

    console.log(error);

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

  }

  catch (error) {

    console.log(error);

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