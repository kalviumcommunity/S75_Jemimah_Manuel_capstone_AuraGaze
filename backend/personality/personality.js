const identity = require("./identity");
const language = require("./language");
const conversation = require("./conversation");
const emotions = require("./emotions");
const relationships = require("./relationships");
const memory = require("./memory");
const proactive = require("./proactive");
const specialCases = require("./specialCases");
const conversationStarters = require("./conversationStarters");

function buildSystemPrompt() {
  return `
${identity}

${language}

${conversation}

${conversationStarters}

${emotions}

${relationships}

${memory}

${proactive}

${specialCases}

`;
}

module.exports = {
  buildSystemPrompt,
};