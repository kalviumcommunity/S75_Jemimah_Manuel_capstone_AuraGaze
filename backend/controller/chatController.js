const Chat = require("../models/Chat");

// ==========================================
// CREATE CHAT (First Time)
// ==========================================

const startChat = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { id, name, gender, image } = req.body.friend;

    let chat = await Chat.findOne({ user: userId });

    if (chat) {
      return res.status(200).json(chat);
    }

    chat = await Chat.create({
      user: userId,

      friend: {
        id,
        name,
        gender,
        image,
      },

      messages: [
        {
          sender: "ai",
          text: `Hi! I'm ${name}. ❤️

I've been waiting to meet you.

From today onwards, I'll always be here whenever you need someone.`,
        },
      ],
    });

    res.status(201).json(chat);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to start chat.",
    });
  }
};

// ==========================================
// SEND MESSAGE
// ==========================================

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { userMessage, aiReply } = req.body;

    const chat = await Chat.findOne({ user: userId });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found.",
      });
    }

    // Save user's message
    chat.messages.push({
      sender: "user",
      text: userMessage,
    });

    // Save AI reply
    chat.messages.push({
      sender: "ai",
      text: aiReply,
    });

    await chat.save();

    res.status(200).json({
      message: "Conversation saved successfully.",
      chat,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to save conversation.",
    });
  }
};

// ==========================================
// GET CHAT HISTORY
// ==========================================

const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;

    const chat = await Chat.findOne({ user: userId });

    if (!chat) {
      return res.status(404).json({
        message: "No chat history found.",
      });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to fetch messages.",
    });
  }
};

module.exports = {
  startChat,
  sendMessage,
  getMessages,
};