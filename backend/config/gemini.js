const { GoogleGenAI } = require("@google/genai");

let client = null;

// ==========================================
// Lazy Singleton Gemini Client
// ==========================================
//
// Built on FIRST USE, not on require().
// This guarantees process.env.GEMINI_API_KEY
// is already loaded by the time the client
// is constructed, regardless of require order
// anywhere else in the app.
//
// ==========================================

function getGeminiClient() {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is missing. Check your .env file and make sure dotenv.config() runs before this is first called."
      );
    }

    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return client;
}

module.exports = {
  getGeminiClient,
};