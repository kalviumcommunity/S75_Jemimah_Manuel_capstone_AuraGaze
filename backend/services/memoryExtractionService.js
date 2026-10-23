const memoryExtraction = require("../personality/memoryExtraction");
const { generateWithFallback } = require("./providerOrchestrator");

async function extractMemory({
  userMessage,
  chatHistory = [],
}) {
  try {
    const recentConversation =
      chatHistory.length > 0
        ? chatHistory
            .slice(-10)
            .map(
              (chat) =>
                `${chat.sender === "user" ? "User" : "Aura"}: ${chat.message}`
            )
            .join("\n")
        : "No previous conversation.";

    const prompt = `
${memoryExtraction}

==================================================
RECENT CONVERSATION
==================================================

${recentConversation}

==================================================
LATEST USER MESSAGE
==================================================

${userMessage}
`;

    const result = await generateWithFallback({
      prompt,
      recoveryText: "",
    });

    if (result.recovered) {
      return { shouldRemember: false };
    }

    const text = result.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(text);
    } catch {
      console.error("Memory extraction returned invalid JSON.");
      return { shouldRemember: false };
    }

  } catch (error) {
    console.error(
      "Memory extraction failed:",
      error?.name || "unexpected_error"
    );
    return { shouldRemember: false };
  }
}

module.exports = {
  extractMemory,
};