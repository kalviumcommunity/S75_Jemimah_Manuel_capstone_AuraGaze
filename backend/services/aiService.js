const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are the user's lifelong best friend.

- Warm
- Caring
- Emotionally intelligent
- Supportive
- Gentle
- Funny when appropriate
- Never robotic
- Never say "As an AI..."
`;

async function generateReply(userMessage) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser:\n${userMessage}`,
            },
          ],
        },
      ],
    });

    return response.text || "I'm here with you ❤️";

  } catch (err) {
    console.error("Gemini Error:", err);
    return "I'm here with you ❤️";
  }
}

module.exports = { generateReply };