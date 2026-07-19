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
// Learn Communication Style
// ==========================================

function updateCommunicationStyle(
  relationship,
  userMessage
) {
  const style = relationship.communicationStyle;

  // -----------------------------
  // Message Length
  // -----------------------------

  if (userMessage.length < 30) {
    style.shortMessageCount += 1;
  } else {
    style.longMessageCount += 1;
  }

  style.prefersShortReplies =
    style.shortMessageCount >
    style.longMessageCount;

  style.prefersLongReplies =
    style.longMessageCount >=
    style.shortMessageCount;

  // -----------------------------
  // Emoji Usage
  // -----------------------------

  if (
    /[\u{1F300}-\u{1FAFF}]/u.test(userMessage)
  ) {
    style.emojiMessageCount += 1;
    style.usesEmojis = true;
  }

  // -----------------------------
  // Interests
  // -----------------------------

  if (userMessage.includes("?")) {
    style.likesQuestions = true;
  }

  if (
    userMessage.toLowerCase().includes("story")
  ) {
    style.likesStories = true;
  }

  if (
    userMessage.toLowerCase().includes("poem")
  ) {
    style.likesPoems = true;
  }

  if (
    userMessage.toLowerCase().includes("song")
  ) {
    style.likesSongs = true;
  }
}

// ==========================================
// Learn Favorite Topics
// ==========================================

function updateFavoriteTopics(
  relationship,
  userMessage
) {
  const topicKeywords = {
    Programming: [
      "code",
      "coding",
      "javascript",
      "python",
      "react",
      "node",
      "mongodb",
      "express",
      "java",
      "bug",
      "backend",
      "frontend",
    ],

    Movies: [
      "movie",
      "film",
      "cinema",
    ],

    Music: [
      "song",
      "music",
      "singer",
    ],

    Poetry: [
      "poem",
      "poetry",
      "shayari",
    ],

    Travel: [
      "travel",
      "trip",
      "vacation",
    ],

    Food: [
      "food",
      "eat",
      "restaurant",
      "pizza",
      "burger",
    ],

    College: [
      "college",
      "exam",
      "assignment",
      "class",
      "semester",
    ],
  };

  const message =
    userMessage.toLowerCase();

  for (const topic in topicKeywords) {
    const matched =
      topicKeywords[topic].some((word) =>
        message.includes(word)
      );

    if (!matched) continue;

    relationship.lastTopic = topic;

    const existing =
      relationship.favoriteTopics.find(
        (item) => item.topic === topic
      );

    if (existing) {
      existing.count += 1;
    } else {
      relationship.favoriteTopics.push({
        topic,
        count: 1,
      });
    }
  }
}

// ==========================================
// Shared History
// ==========================================

function addSharedHistory({
  relationship,
  title,
  description,
}) {
  const exists =
    relationship.sharedHistory.some(
      (item) =>
        item.title.toLowerCase() ===
        title.toLowerCase()
    );

  if (exists) return;

  relationship.sharedHistory.push({
    title,
    description,
  });
}

// ==========================================
// Milestones
// ==========================================

function unlockMilestone(
  relationship,
  milestone
) {
  const exists =
    relationship.milestones.some(
      (item) =>
        item.milestone === milestone
    );

  if (exists) return;

  relationship.milestones.push({
    milestone,
    completed: true,
    completedAt: new Date(),
  });
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

    const message = userMessage.toLowerCase();

    // ----------------------------------
    // Conversation Statistics
    // ----------------------------------

    relationship.conversationCount += 1;
    relationship.lastConversation = new Date();

    // ----------------------------------
    // Base Friendship
    // ----------------------------------

    let friendshipGain = 0;

    if (userMessage.trim().length > 5) {
      friendshipGain += 1;
    }

    // ----------------------------------
    // Trust Detection
    // ----------------------------------

    const trustKeywords = [
      "trust",
      "secret",
      "promise",
      "private",
      "don't tell",
      "between us",
      "only you",
      "confession",
    ];

    if (
      trustKeywords.some((word) =>
        message.includes(word)
      )
    ) {
      relationship.trustLevel = Math.min(
        relationship.trustLevel + 5,
        100
      );

      friendshipGain += 5;

      relationship.lastInteractionType =
        "TRUST";
    }

    // ----------------------------------
    // Comfort Detection
    // ----------------------------------

    const comfortKeywords = [
      "sad",
      "cry",
      "crying",
      "hurt",
      "lonely",
      "stressed",
      "stress",
      "anxious",
      "worried",
      "depressed",
      "upset",
    ];

    if (
      comfortKeywords.some((word) =>
        message.includes(word)
      )
    ) {
      relationship.comfortLevel = Math.min(
        relationship.comfortLevel + 4,
        100
      );

      friendshipGain += 3;

      relationship.lastEmotion = "SAD";

      relationship.lastInteractionType =
        "COMFORT";
    }

    // ----------------------------------
    // Humor Detection
    // ----------------------------------

    const humorIndicators = [
      "😂",
      "🤣",
      "😆",
      "lol",
      "lmao",
      "rofl",
      "haha",
      "hehe",
    ];

    if (
      humorIndicators.some((item) =>
        userMessage.includes(item)
      )
    ) {
      relationship.humorLevel = Math.min(
        relationship.humorLevel + 3,
        100
      );

      friendshipGain += 2;

      relationship.lastInteractionType =
        "HUMOR";
    }

    // ----------------------------------
    // Learn Communication
    // ----------------------------------

    updateCommunicationStyle(
      relationship,
      userMessage
    );

    // ----------------------------------
    // Learn Favourite Topics
    // ----------------------------------

    updateFavoriteTopics(
      relationship,
      userMessage
    );

    // ----------------------------------
    // Conversation Milestones
    // ----------------------------------

    if (
      relationship.conversationCount === 10
    ) {
      unlockMilestone(
        relationship,
        "10_CONVERSATIONS"
      );

      addSharedHistory({
        relationship,
        title:
          "First Conversation Milestone",
        description:
          "Aura and the user completed ten conversations together.",
      });
    }

    if (
      relationship.conversationCount === 50
    ) {
      unlockMilestone(
        relationship,
        "50_CONVERSATIONS"
      );

      addSharedHistory({
        relationship,
        title:
          "Growing Friendship",
        description:
          "Aura and the user have now completed fifty conversations.",
      });
    }

    if (
      relationship.conversationCount === 100
    ) {
      unlockMilestone(
        relationship,
        "100_CONVERSATIONS"
      );

      addSharedHistory({
        relationship,
        title:
          "Close Friends",
        description:
          "Aura and the user reached one hundred conversations.",
      });
    }

    // ----------------------------------
    // Inside Joke Detection
    // ----------------------------------

    if (
      message.includes("😂") &&
      message.length > 40
    ) {
      const title =
        userMessage
          .split(" ")
          .slice(0, 4)
          .join(" ");

      const exists =
        relationship.insideJokes.some(
          (joke) =>
            joke.title === title
        );

      if (!exists) {
        relationship.insideJokes.push({
          title,
          description: userMessage,
        });
      }
    }

    // ----------------------------------
    // Friendship Growth
    // ----------------------------------

    relationship.friendshipLevel +=
      friendshipGain;

    // ----------------------------------
    // Safety
    // ----------------------------------

    relationship.friendshipLevel =
      Math.max(
        0,
        relationship.friendshipLevel
      );

    // ----------------------------------
    // Save
    // ----------------------------------

    await relationship.save();

    return relationship;

  } catch (error) {
    console.error(
      "Relationship Update Error:",
      error
    );

    return null;
  }
}

// ==========================================
// Growth Stage
// ==========================================

function getGrowthStage(friendshipLevel) {
  if (friendshipLevel < 20)
    return "NEW_FRIEND";

  if (friendshipLevel < 50)
    return "GOOD_FRIEND";

  if (friendshipLevel < 100)
    return "CLOSE_FRIEND";

  if (friendshipLevel < 250)
    return "BEST_FRIEND";

  return "SOUL_FRIEND";
}

// ==========================================
// Exports
// ==========================================

module.exports = {
  getRelationship,
  updateRelationship,
  updateCommunicationStyle,
  updateFavoriteTopics,
  addSharedHistory,
  unlockMilestone,
  getGrowthStage,
};