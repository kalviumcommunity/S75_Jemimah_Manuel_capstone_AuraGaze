const { Groq } = require("groq-sdk");

let client = null;

function getGroqClient() {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured.");
    }

    client = new Groq({
      apiKey,
      maxRetries: 0,
    });
  }

  return client;
}

module.exports = {
  getGroqClient,
};
