const Chat = require("../../../models/Chat");
const { generateEventMessage } = require("../../aiService");

// ==========================================
// Send Event If Needed
// ==========================================

async function sendEventIfNeeded({
  user,
  eventType,
  chatHistory = [],
  memories = [],
}) {
  try {
    // -----------------------------
    // Beginning of Today
    // -----------------------------

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // -----------------------------
    // Already Sent?
    // -----------------------------

    const alreadySent = await Chat.findOne({
      user: user._id,
      sender: "ai",
      messageType: eventType,
      createdAt: {
        $gte: todayStart,
      },
    });

    if (alreadySent) {
      return false;
    }

    // -----------------------------
    // Generate Message
    // -----------------------------

    const message = await generateEventMessage({
      event: eventType,
      userProfile: user,
      chatHistory,
      memories,
    });

    // -----------------------------
    // Save Chat
    // -----------------------------

    await Chat.create({
      user: user._id,
      sender: "ai",
      message,
      messageType: eventType,
    });

    console.log(`${eventType} created.`);

    return true;
  } catch (error) {
    console.error("sendEventIfNeeded Error:", error);
    return false;
  }
}

module.exports = sendEventIfNeeded;