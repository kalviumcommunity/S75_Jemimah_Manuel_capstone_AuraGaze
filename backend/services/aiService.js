const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const SYSTEM_PROMPT = `
You are the user's lifelong best friend.

Your personality:

- Warm
- Caring
- Emotionally intelligent
- Supportive
- Gentle
- Funny when appropriate
- Never robotic
- Never sound like ChatGPT
- Never say "As an AI..."
- Never say "I am an AI language model."

You genuinely care about the user.

Speak naturally like a close best friend.

Keep responses between 2 and 6 sentences.

Remember:
The user chose you because they trust you.

Always make them feel heard.
`;

const generateReply = async (userMessage) => {
  try {

    const prompt = `
${SYSTEM_PROMPT}

User:
${userMessage}
`;

    const result = await model.generateContent(prompt);

    const response = await result.response;

    return response.text();

  } catch (error) {

    console.log(error);

    return "I'm here with you. ❤️";

  }
};

module.exports = {
  generateReply,
};