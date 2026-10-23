const identity = require("./identity");
const language = require("./language");
const conversation = require("./conversation");
const emotions = require("./emotions");
const relationships = require("./relationships");
const memory = require("./memory");
const proactive = require("./proactive");
const specialCases = require("./specialCases");
const conversationStarters = require("./conversationStarters");

function compactDecorativeDividers(prompt) {
  return prompt
    .split(/\r?\n/)
    .map((line) => {
      const characters = Array.from(line.trim());
      return characters.length >= 12 &&
        characters.every((character) => character.codePointAt(0) === 0x2550)
        ? "---"
        : line;
    })
    .join("\n");
}

function buildSystemPrompt() {
  return compactDecorativeDividers(`
${identity}

${language}

${conversation}

${conversationStarters}

${emotions}

${relationships}

${memory}

${proactive}

${specialCases}

`);
}

module.exports = {
  buildSystemPrompt,
};