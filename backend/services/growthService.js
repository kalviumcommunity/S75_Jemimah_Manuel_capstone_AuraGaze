const Relationship = require("../models/Relationship");

// ==========================================
// Get or Create Relationship
// ==========================================

async function getRelationship(user) {
  try {
    let relationship = await Relationship.findOne({
      user,
    });

    if (!relationship) {
      relationship = await Relationship.create({
        user,
      });
    }

    return relationship;

  } catch (error) {
    console.error("Relationship Error:", error);
    return null;
  }
}

// ==========================================
// Update Relationship
// ==========================================

async function updateRelationship({
  user,
  userMessage = "",
}) {
  try {
    const relationship = await getRelationship(user);

    if (!relationship) {
      return null;
    }

    // -----------------------------
    // Conversation Statistics
    // -----------------------------

    relationship.conversationCount += 1;
    relationship.lastConversation = new Date();

    // -----------------------------
    // Friendship Growth
    // -----------------------------

    relationship.friendshipLevel += 1;

    // -----------------------------
    // Trust Detection
    // -----------------------------

    const trustKeywords = [
      "trust",
      "secret",
      "personal",
      "private",
      "only you",
      "don't tell",
    ];

    if (
      trustKeywords.some((word) =>
        userMessage.toLowerCase().includes(word)
      )
    ) {
      relationship.trustLevel = Math.min(
        relationship.trustLevel + 5,
        100
      );

      relationship.friendshipLevel += 5;
    }

    // -----------------------------
    // Comfort Detection
    // -----------------------------

    const comfortKeywords = [
      "sad",
      "cry",
      "lonely",
      "miss",
      "hurt",
      "depressed",
      "anxious",
      "stressed",
    ];

    if (
      comfortKeywords.some((word) =>
        userMessage.toLowerCase().includes(word)
      )
    ) {
      relationship.comfortLevel = Math.min(
        relationship.comfortLevel + 4,
        100
      );

      relationship.friendshipLevel += 3;
    }

    // -----------------------------
    // Humor Detection
    // -----------------------------

    if (
      userMessage.includes("😂") ||
      userMessage.includes("🤣") ||
      userMessage.includes("😆") ||
      userMessage.toLowerCase().includes("lol") ||
      userMessage.toLowerCase().includes("lmao")
    ) {
      relationship.humorLevel = Math.min(
        relationship.humorLevel + 3,
        100
      );

      relationship.friendshipLevel += 2;
    }

    // -----------------------------
    // Communication Style
    // -----------------------------

    if (userMessage.length < 30) {
      relationship.communicationStyle.prefersShortReplies = true;
      relationship.communicationStyle.prefersLongReplies = false;
    }

    if (userMessage.length > 120) {
      relationship.communicationStyle.prefersLongReplies = true;
      relationship.communicationStyle.prefersShortReplies = false;
    }

    relationship.communicationStyle.usesEmojis =
      /[\u{1F300}-\u{1FAFF}]/u.test(userMessage);

    // -----------------------------
    // Save
    // -----------------------------

    await relationship.save();

    return relationship;

  } catch (error) {
    console.error("Update Relationship Error:", error);
    return null;
  }
}

// ==========================================
// Add Inside Joke
// ==========================================

async function addInsideJoke({
  user,
  title,
  description,
}) {
  try {
    const relationship = await getRelationship(user);

    if (!relationship) {
      return null;
    }

    const exists = relationship.insideJokes.some(
      (joke) =>
        joke.title.toLowerCase() ===
        title.toLowerCase()
    );

    if (!exists) {
      relationship.insideJokes.push({
        title,
        description,
      });

      await relationship.save();
    }

    return relationship;

  } catch (error) {
    console.error("Inside Joke Error:", error);
    return null;
  }
}

// ==========================================
// Get Growth Stage
// ==========================================

function getGrowthStage(friendshipLevel) {
  if (friendshipLevel < 20) {
    return "NEW_FRIEND";
  }

  if (friendshipLevel < 50) {
    return "GOOD_FRIEND";
  }

  if (friendshipLevel < 100) {
    return "CLOSE_FRIEND";
  }

  if (friendshipLevel < 250) {
    return "BEST_FRIEND";
  }

  return "SOUL_FRIEND";
}

module.exports = {
  getRelationship,
  updateRelationship,
  addInsideJoke,
  getGrowthStage,
};