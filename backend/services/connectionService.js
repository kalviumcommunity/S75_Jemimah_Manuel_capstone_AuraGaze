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
  ROMANTIC: "ROMANTIC",
};

// ==========================================
// Keywords
// ==========================================

const dryReplies = [
  "ok", "okay", "k", "kk", "hmm", "hmmm", "fine", "idk", "nothing", "no", "yes", "cool", "nice",
];

const celebrationWords = [
  "won", "selected", "passed", "placed", "promotion", "promoted", "success",
  "successful", "finally", "cleared", "got it", "cracked", "achieved", "yay", "yaaay",
];

const comfortWords = [
  "sad", "cry", "crying", "hurt", "failed", "failure", "depressed", "alone",
  "lonely", "upset", "broken", "heartbroken", "pain",
];

const greetingWords = [
  "hi", "hello", "hey", "heyy", "good morning", "good afternoon", "good evening",
];

const goodbyeWords = [
  "bye", "good night", "gn", "ttyl", "see you",
];

const helpWords = [
  "help", "how", "why", "what", "where", "when", "code", "bug", "error",
];

// ==========================================
// Flirty / Romantic Detection
// ==========================================
//
// Covers explicit romantic language as well as
// common playful-flirting phrasing. Kept separate
// from greetingWords/helpWords so a flirty message
// doesn't accidentally get classified as something
// else first.
//
// ==========================================

const romanticWords = [
  "i love you", "ily", "miss you", "i miss you", "crush", "cute", "handsome",
  "beautiful", "gorgeous", "pretty", "kiss", "hug me", "date me", "my love",
  "babe", "baby", "boyfriend", "girlfriend", "flirt", "flirting",
  "you're mine", "ur mine", "romantic", "pickup line", "pick up line",
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
  //
  // Order matters: romantic/flirty detection runs
  // before greeting/help so phrases like "hii cutie"
  // or "u looking handsome today" aren't swallowed by
  // the more generic GREETING/HELP checks.

  if (romanticWords.some((word) => text.includes(word))) {
    state = STATES.ROMANTIC;
  } else if (greetingWords.some((word) => text.includes(word))) {
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

    case STATES.ROMANTIC:
      behaviour.energy = "MEDIUM";
      behaviour.mood = "PLAYFUL_ROMANTIC";
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