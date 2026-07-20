const { getGeminiClient } = require("../config/gemini");
const memoryExtraction = require("../personality/memoryExtraction");

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

    // --------------------------------------
    // Ask Gemini
    // --------------------------------------

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
          ],
        },
      ],
    });

    let text = response.text || "";

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("Memory JSON Parse Error:", parseError);
      console.error("Gemini Response:");
      console.error(text);
      return { shouldRemember: false };
    }

  } catch (error) {
    console.error("Memory Extraction Error:", error);
    return { shouldRemember: false };
  }
}

module.exports = {
  extractMemory,
};