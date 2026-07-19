// ==========================================
// Conversation States
// ==========================================

const STATES = {
  NORMAL: "NORMAL",
  DRY_REPLY: "DRY_REPLY",
  CELEBRATION: "CELEBRATION",
  COMFORT: "COMFORT",
  GREETING: "GREETING",
  GOODBYE: "GOODBYE",
  HELP: "HELP",
};

// ==========================================
// Keywords
// ==========================================

const dryReplies = [
  "ok",
  "okay",
  "k",
  "kk",
  "hmm",
  "hmmm",
  "fine",
  "idk",
  "nothing",
  "no",
  "yes",
  "cool",
  "nice",
];

const celebrationWords = [
  "won",
  "selected",
  "passed",
  "placed",
  "promotion",
  "promoted",
  "success",
  "successful",
  "finally",
  "cleared",
  "got it",
  "cracked",
  "achieved",
  "yay",
  "yaaay",
];

const comfortWords = [
  "sad",
  "cry",
  "crying",
  "hurt",
  "failed",
  "failure",
  "depressed",
  "alone",
  "lonely",
  "upset",
  "broken",
  "heartbroken",
  "pain",
];

const greetingWords = [
  "hi",
  "hello",
  "hey",
  "heyy",
  "good morning",
  "good afternoon",
  "good evening",
];

const goodbyeWords = [
  "bye",
  "good night",
  "gn",
  "ttyl",
  "see you",
];

const helpWords = [
  "help",
  "how",
  "why",
  "what",
  "where",
  "when",
  "code",
  "bug",
  "error",
];

// ==========================================
// Connection Brain
// ==========================================

function detectConversationState(userMessage = "") {
  const text = userMessage.trim().toLowerCase();

  let state = STATES.NORMAL;

  // -----------------------------
  // Detect State
  // -----------------------------

  if (greetingWords.some((word) => text.includes(word))) {
    state = STATES.GREETING;
  } else if (goodbyeWords.some((word) => text.includes(word))) {
    state = STATES.GOODBYE;
  } else if (celebrationWords.some((word) => text.includes(word))) {
    state = STATES.CELEBRATION;
  } else if (comfortWords.some((word) => text.includes(word))) {
    state = STATES.COMFORT;
  } else if (
    helpWords.some((word) => text.includes(word)) ||
    text.endsWith("?")
  ) {
    state = STATES.HELP;
  } else if (dryReplies.includes(text)) {
    state = STATES.DRY_REPLY;
  }

  // -----------------------------
  // Behaviour Rules
  // -----------------------------

  const behaviour = {
    state,

    mood: "FRIENDLY",

    energy: "MEDIUM",

    shouldShareFirst: false,

    shouldAskQuestion: false,

    shouldCreateMemory: false,

    shouldTellStory: false,

    shouldTellJoke: false,

    shouldWritePoem: false,
  };

  switch (state) {
    case STATES.DRY_REPLY:
      behaviour.energy = "LOW";
      behaviour.mood = "PLAYFUL";
      behaviour.shouldShareFirst = true;
      behaviour.shouldAskQuestion = true;
      break;

    case STATES.CELEBRATION:
      behaviour.energy = "HIGH";
      behaviour.mood = "EXCITED";
      break;

    case STATES.COMFORT:
      behaviour.energy = "LOW";
      behaviour.mood = "GENTLE";
      break;

    case STATES.HELP:
      behaviour.energy = "MEDIUM";
      behaviour.mood = "CODING_BUDDY";
      break;

    case STATES.GREETING:
      behaviour.energy = "MEDIUM";
      behaviour.mood = "WARM";
      break;

    case STATES.GOODBYE:
      behaviour.energy = "LOW";
      behaviour.mood = "CALM";
      break;

    default:
      behaviour.shouldCreateMemory = true;
      break;
  }

  return behaviour;
}

module.exports = {
  STATES,
  detectConversationState,
};