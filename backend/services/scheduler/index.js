const dailyGreeting = require("./dailyGreeting");
const importantDays = require("./importantDays");
const reconnect = require("./reconnect");

// ==========================================
// Run All Scheduler Modules
// ==========================================

async function runScheduler({
  user,
  chatHistory = [],
  memories = [],
}) {
  try {
    // Morning / Afternoon / Night
    await dailyGreeting({
      user,
      chatHistory,
      memories,
    });

    // Birthday / Interview / Exam / etc.
    await importantDays({
      user,
      chatHistory,
      memories,
    });

    // User inactive
    await reconnect({
      user,
      chatHistory,
      memories,
    });

  } catch (error) {
    console.error("Scheduler Error:", error);
  }
}

module.exports = runScheduler;