// ==========================================
// Aura Message Composer
// ==========================================
//
// Gemini writes ONE reply.
//
// The reply may contain:
//
// <msg>
//
// separators.
//
// This service converts that reply into
// multiple WhatsApp-style chat bubbles.
//
// ==========================================

function composeMessages(reply = "") {

  if (!reply || typeof reply !== "string") {
    return [];
  }

  // ----------------------------------
  // Split by <msg>
  // ----------------------------------

  let bubbles = reply
    .split("<msg>")
    .map((message) => message.trim())
    .filter((message) => message.length > 0);

  // ----------------------------------
  // Fallback
  // ----------------------------------

  if (bubbles.length === 0) {
    bubbles = [reply.trim()];
  }

  // ----------------------------------
  // Prevent Spam
  // ----------------------------------

  if (bubbles.length > 5) {
    bubbles = bubbles.slice(0, 5);
  }

  return bubbles;
}

// ==========================================

module.exports = {
  composeMessages,
};