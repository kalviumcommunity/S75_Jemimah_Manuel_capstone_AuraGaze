const { GoogleGenAI } = require("@google/genai");
const memoryExtraction = require("../personality/memoryExtraction");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ==========================================
// Extract Memory From Conversation
// ==========================================

async function extractMemory({
  userMessage,
  chatHistory = [],
}) {
  try {
    // --------------------------------------
    // Recent Conversation
    // --------------------------------------

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

    // --------------------------------------
    // Build Prompt
    // --------------------------------------

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

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    // --------------------------------------
    // Response
    // --------------------------------------

    let text = response.text || "";

    // Remove markdown if Gemini wraps JSON
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // --------------------------------------
    // Parse JSON
    // --------------------------------------

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error(
        "Memory JSON Parse Error:",
        parseError
      );

      console.error("Gemini Response:");
      console.error(text);

      return {
        shouldRemember: false,
      };
    }

  } catch (error) {
    console.error("Memory Extraction Error:", error);

    return {
      shouldRemember: false,
    };
  }
}

module.exports = {
  extractMemory,
};