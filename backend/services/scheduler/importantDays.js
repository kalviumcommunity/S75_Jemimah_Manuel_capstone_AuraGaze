const Chat = require("../../models/Chat");
const { generateEventMessage } = require("../aiService");

// ==========================================
// Helpers
// ==========================================

function isBirthdayToday(dob) {
  if (!dob) return false;

  const today = new Date();
  const birthday = new Date(dob);

  return (
    today.getDate() === birthday.getDate() &&
    today.getMonth() === birthday.getMonth()
  );
}

function isBirthdayTomorrow(dob) {
  if (!dob) return false;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const birthday = new Date(dob);

  return (
    tomorrow.getDate() === birthday.getDate() &&
    tomorrow.getMonth() === birthday.getMonth()
  );
}

// ==========================================
// Important Days Scheduler
// ==========================================

async function importantDays({
  user,
  chatHistory = [],
  memories = [],
}) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    let eventType = null;

    // ----------------------------------
    // Decide today's event
    // ----------------------------------

    if (isBirthdayToday(user.profile?.dob)) {
      eventType = "BIRTHDAY";
    } else if (isBirthdayTomorrow(user.profile?.dob)) {
      eventType = "BIRTHDAY_EVE";
    }

    if (!eventType) return;

    // ----------------------------------
    // Already sent today?
    // ----------------------------------

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

    // ----------------------------------
    // Generate Event Message
    // ----------------------------------

    const message = await generateEventMessage({
      eventType,
      userProfile: user,
      chatHistory,
      memories,
    });

    // ----------------------------------
    // Save Message
    // ----------------------------------

    await Chat.create({
      user: user._id,
      sender: "ai",
      message,
      messageType: eventType,
    });

    console.log(`${eventType} sent.`);
  } catch (error) {
    console.error("Important Days Scheduler:", error);
  }
}

module.exports = importantDays;