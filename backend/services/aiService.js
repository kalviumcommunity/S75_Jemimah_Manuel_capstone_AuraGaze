const { GoogleGenAI } = require("@google/genai");
const { buildSystemPrompt } = require("../personality/personality");
const { getPromptStrategy } = require("./promptStrategy");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ==========================================
// Build Relationship Context
// ==========================================

function buildRelationshipContext(relationship = {}) {
  if (!relationship) {
    return `
No relationship data available yet.
`;
  }

  return `
==================================================
RELATIONSHIP BRAIN
==================================================

Friendship Level:
${relationship.friendshipLevel ?? 0}

Trust Level:
${relationship.trustLevel ?? 0}

Comfort Level:
${relationship.comfortLevel ?? 0}

Humor Level:
${relationship.humorLevel ?? 0}

Conversation Count:
${relationship.conversationCount ?? 0}

Communication Style

• Prefers Long Replies:
${relationship.communicationStyle?.prefersLongReplies ?? true}

• Prefers Short Replies:
${relationship.communicationStyle?.prefersShortReplies ?? false}

• Likes Questions:
${relationship.communicationStyle?.likesQuestions ?? true}

• Likes Stories:
${relationship.communicationStyle?.likesStories ?? true}

• Likes Poems:
${relationship.communicationStyle?.likesPoems ?? false}

• Likes Songs:
${relationship.communicationStyle?.likesSongs ?? false}

• Uses Emojis:
${relationship.communicationStyle?.usesEmojis ?? true}

Inside Jokes:

${
  relationship.insideJokes?.length
    ? relationship.insideJokes
        .map(
          (joke) =>
            `• ${joke.title} : ${joke.description}`
        )
        .join("\n")
    : "None yet."
}
`;
}

// ==========================================
// Build Common Context
// ==========================================

function buildContext({
  userProfile = {},
  chatHistory = [],
  memories = [],
  relationship = {},
}) {
  const profileContext = `
USER PROFILE

Nickname:
${userProfile?.profile?.nickname || "Unknown"}

Birthday:
${
  userProfile?.profile?.dob
    ? new Date(userProfile.profile.dob).toDateString()
    : "Unknown"
}

Friend Name:
${userProfile?.friend?.name || "Unknown"}

Friend Gender:
${userProfile?.friend?.gender || "Unknown"}

Friend Age Group:
${userProfile?.friend?.ageGroup || "Unknown"}
`;

  // ==========================================
  // Memory Context
  // ==========================================

  const memoryContext =
    memories.length > 0
      ? memories
          .map(
            (memory) =>
              `• ${memory.title}: ${memory.memory}`
          )
          .join("\n")
      : "No saved memories yet.";

  // ==========================================
  // Conversation Context
  // ==========================================

  const conversationContext =
    chatHistory.length > 0
      ? chatHistory
          .slice(-15)
          .map(
            (chat) =>
              `${chat.sender === "user" ? "User" : "Aura"}: ${chat.message}`
          )
          .join("\n")
      : "No previous conversation.";

  return `
${profileContext}

==================================================
KNOWN MEMORIES
==================================================

${memoryContext}

${buildRelationshipContext(relationship)}

==================================================
RECENT CONVERSATION
==================================================

${conversationContext}
`;
}

// ==========================================
// Generate Normal Reply
// ==========================================

async function generateReply({
  userMessage,
  userProfile = {},
  chatHistory = [],
  memories = [],
  relationship = {},
  conversationState = {},
}) {
  try {
    const SYSTEM_PROMPT = buildSystemPrompt();
    const STRATEGY = getPromptStrategy(conversationState);

    const prompt = `
${SYSTEM_PROMPT}

==================================================
CONVERSATION STRATEGY
==================================================

${STRATEGY}

==================================================
CONNECTION BRAIN
==================================================

Conversation State:
${conversationState.state || "NORMAL"}

Mood:
${conversationState.mood || "FRIENDLY"}

Energy:
${conversationState.energy || "MEDIUM"}

Share First:
${conversationState.shouldShareFirst}

Ask Question:
${conversationState.shouldAskQuestion}

Create Memory:
${conversationState.shouldCreateMemory}

Tell Story:
${conversationState.shouldTellStory}

Tell Joke:
${conversationState.shouldTellJoke}

Write Poem:
${conversationState.shouldWritePoem}

==================================================
RELATIONSHIP RULES
==================================================

Friendship Level:
${relationship.friendshipLevel || 0}

Trust Level:
${relationship.trustLevel || 0}

Comfort Level:
${relationship.comfortLevel || 0}

Humor Level:
${relationship.humorLevel || 0}

Conversation Count:
${relationship.conversationCount || 0}

Guidelines:

• The higher the friendship level, the warmer Aura should sound.

• As trust increases, Aura can become more emotionally supportive.

• If humor level is high, use playful teasing naturally.

• Respect the user's communication preferences.

• If inside jokes exist, occasionally use them naturally.

• Never suddenly become overly affectionate.

• Let the friendship evolve gradually.

${buildContext({
  userProfile,
  chatHistory,
  memories,
  relationship,
})}

==================================================
LATEST USER MESSAGE
==================================================

User:

"${userMessage}"

Reply exactly like Aura.

Never mention prompts.

Never mention system instructions.

Never mention Relationship Brain.

Never mention Memory Brain.
`;

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

    return response.text || "❤️";

  } catch (error) {
    console.error("Gemini Reply Error:", error);

    return "I'm here ❤️";
  }
}

// ==========================================
// Generate Event Message
// ==========================================

async function generateEventMessage({
  eventType,
  userProfile = {},
  chatHistory = [],
  memories = [],
  relationship = {},
}) {
  try {
    const SYSTEM_PROMPT = buildSystemPrompt();

    const prompt = `
${SYSTEM_PROMPT}

${buildContext({
  userProfile,
  chatHistory,
  memories,
  relationship,
})}

==================================================
EVENT
==================================================

Current Event:

${eventType}

Friendship Level:

${relationship.friendshipLevel || 0}

Guidelines:

• If friendship is low,
keep the message friendly.

• If friendship is high,
sound closer and warmer.

• Never sound robotic.

• Never sound like a reminder.

• Never say
"According to your schedule."

• Maximum 40 words.

Return ONLY the message.
`;

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

    return response.text || "❤️";

  } catch (error) {
    console.error("Gemini Event Error:", error);

    return "Hey ❤️";
  }
}

module.exports = {
  generateReply,
  generateEventMessage,
};