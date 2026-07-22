// services/scheduler/firstMessage.js
const Chat = require("../../models/Chat");
const { generateEventMessage } = require("../aiService");

async function sendFirstMessageIfNeeded({ user, memories = [] }) {
  const anyMessageExists = await Chat.findOne({ user: user._id });

  if (anyMessageExists) {
    return false; // not their first time, let normal scheduler handle it
  }

  const message = await generateEventMessage({
    event: "FIRST_MESSAGE",
    userProfile: user,
    memories,
  });

  await Chat.create({
    user: user._id,
    sender: "ai",
    message,
    messageType: "FIRST_MESSAGE",
  });

  return true;
}

module.exports = sendFirstMessageIfNeeded;