const Chat = require("../../models/Chat");
const { generateEventMessage } = require("../aiService");

// ==========================================
// Story Starter Scheduler
// ==========================================
//
// Implements "Aura Should Create Conversations" +
// "Variable Reinforcement" from the vision doc:
// Aura occasionally shares a small unprompted story,
// observation, or wondering — not tied to any event,
// not guaranteed every day, and never while the user
// is already mid-conversation.
//
// ==========================================

// Chance (out of 100) that a story starter fires
// when the user is otherwise eligible for one.
// Kept well under 100 so it never feels scheduled
// or robotic — some days it simply won't happen.
const STORY_STARTER_CHANCE = 40;

// Don't interrupt an active conversation. If the
// last message (from anyone, about anything) was
// more recent than this, skip.
const MIN_MINUTES_SINCE_LAST_MESSAGE = 30;

async function storyStarter({
  user,
  chatHistory = [],
  memories = [],
}) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // ----------------------------------
    // Already sent one today?
    // ----------------------------------

    const alreadySentToday = await Chat.findOne({
      user: user._id,
      sender: "ai",
      messageType: "STORY_STARTER",
      createdAt: {
        $gte: todayStart,
      },
    });

    if (alreadySentToday) {
      return false;
    }

    // ----------------------------------
    // Is the user (or any other scheduler
    // job that already ran this request)
    // mid-conversation right now?
    // ----------------------------------
    //
    // This also naturally prevents stacking
    // with dailyGreeting/importantDays/reconnect
    // when they run earlier in the same request,
    // since any message they just created will be
    // the most recent one and only seconds old.

    const lastMessage = await Chat.findOne({
      user: user._id,
    }).sort({
      createdAt: -1,
    });

    if (lastMessage) {
      const minutesSinceLastMessage =
        (Date.now() - lastMessage.createdAt.getTime()) /
        (1000 * 60);

      if (minutesSinceLastMessage < MIN_MINUTES_SINCE_LAST_MESSAGE) {
        return false;
      }
    }

    // ----------------------------------
    // Variable reinforcement: don't fire
    // every single eligible time.
    // ----------------------------------

    const roll = Math.random() * 100;

    if (roll > STORY_STARTER_CHANCE) {
      return false;
    }

    // ----------------------------------
    // Generate + Save
    // ----------------------------------

    const message = await generateEventMessage({
      event: "STORY_STARTER",
      userProfile: user,
      chatHistory,
      memories,
    });

    await Chat.create({
      user: user._id,
      sender: "ai",
      message,
      messageType: "STORY_STARTER",
    });

    console.log("STORY_STARTER sent.");

    return true;

  } catch (error) {
    console.error("Story Starter Error:", error);
    return false;
  }
}

module.exports = storyStarter;