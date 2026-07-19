const Chat = require("../../models/Chat");
const sendEventIfNeeded = require("./helpers/sendEventIfNeeded");

// ==========================================
// Reconnect Scheduler
// ==========================================

async function reconnect({
  user,
  chatHistory = [],
  memories = [],
}) {
  try {
    // ----------------------------------
    // Find User's Last Message
    // ----------------------------------

    const lastUserMessage = await Chat.findOne({
      user: user._id,
      sender: "user",
    }).sort({
      createdAt: -1,
    });

    // User never chatted before
    if (!lastUserMessage) {
      return;
    }

    // ----------------------------------
    // Days Since Last User Message
    // ----------------------------------

    const now = new Date();

    const diffInMilliseconds =
      now.getTime() - lastUserMessage.createdAt.getTime();

    const daysSinceLastMessage = Math.floor(
      diffInMilliseconds / (1000 * 60 * 60 * 24)
    );

    // ----------------------------------
    // Reconnect after 3 days
    // ----------------------------------

    if (daysSinceLastMessage >= 3) {
      await sendEventIfNeeded({
        user,
        eventType: "CHECK_IN",
        chatHistory,
        memories,
      });
    }
  } catch (error) {
    console.error("Reconnect Scheduler Error:", error);
  }
}

module.exports = reconnect;