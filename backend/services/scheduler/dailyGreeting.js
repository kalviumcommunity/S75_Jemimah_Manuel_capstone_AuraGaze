const Chat = require("../../models/Chat");
const { generateEventMessage } = require("../aiService");

// ==========================================
// Daily Greeting Scheduler
// ==========================================

async function dailyGreeting({
  user,
  chatHistory = [],
  memories = [],
}) {
  try {
    const now = new Date();

    let eventType = null;

    const hour = now.getHours();

    if (hour >= 5 && hour < 12) {
      eventType = "GOOD_MORNING";
    } else if (hour >= 12 && hour < 18) {
      eventType = "GOOD_AFTERNOON";
    } else if (hour >= 18 && hour <= 23) {
      eventType = "GOOD_NIGHT";
    } else {
      return;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const alreadySent = await Chat.findOne({
      user: user._id,
      sender: "ai",
      messageType: eventType,
      createdAt: {
        $gte: todayStart,
      },
    });

    if (alreadySent) {
      return;
    }

    const userTalkedToday = await Chat.findOne({
      user: user._id,
      sender: "user",
      createdAt: {
        $gte: todayStart,
      },
    });

    if (userTalkedToday) {
      return;
    }

    const greeting = await generateEventMessage({
      event: eventType,
      userProfile: user,
      chatHistory,
      memories,
    });

    await Chat.create({
      user: user._id,
      sender: "ai",
      message: greeting,
      messageType: eventType,
    });

    console.log(`${eventType} sent.`);
  } catch (error) {
    console.error("Daily Greeting Error:", error);
  }
}

module.exports = dailyGreeting;