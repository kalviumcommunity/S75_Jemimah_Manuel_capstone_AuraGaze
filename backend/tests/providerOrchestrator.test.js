const assert = require("node:assert/strict");
const { mock, test } = require("node:test");

const providerOrchestrator = require("../services/providerOrchestrator");
const { buildSystemPrompt } = require("../personality/personality");
const {
  classifyProviderError,
  createGeminiProvider,
  createGroqProvider,
  extractGeminiText,
  extractGroqText,
  generateWithFallback,
  getAiRequestTimeoutMs,
  getProviderTimeoutMs,
  runWithTimeout,
} = providerOrchestrator;
const {
  buildContext,
  generateEventMessage,
  generateReplyWithStatus,
} = require("../services/aiService");

const quietLogger = () => {};

function groqProvider(models, generate, configured = true) {
  return { groq: { configured, models, generate } };
}

function generate(options) {
  return generateWithFallback({
    requestTimeoutMs: 500,
    logger: quietLogger,
    ...options,
  });
}

test("uses a useful default provider timeout and allows bounded configuration", () => {
  const originalProviderTimeout = process.env.AI_PROVIDER_TIMEOUT_MS;
  const originalRequestTimeout = process.env.AI_REQUEST_TIMEOUT_MS;
  delete process.env.AI_PROVIDER_TIMEOUT_MS;
  delete process.env.AI_REQUEST_TIMEOUT_MS;
  assert.equal(getProviderTimeoutMs(), 12000);
  assert.equal(getAiRequestTimeoutMs(), 45000);
  process.env.AI_PROVIDER_TIMEOUT_MS = "24000";
  process.env.AI_REQUEST_TIMEOUT_MS = "30000";
  assert.equal(getProviderTimeoutMs(), 24000);
  assert.equal(getAiRequestTimeoutMs(), 30000);
  process.env.AI_PROVIDER_TIMEOUT_MS = "1";
  process.env.AI_REQUEST_TIMEOUT_MS = "90000";
  assert.equal(getProviderTimeoutMs(), 500);
  assert.equal(getAiRequestTimeoutMs(), 60000);
  if (originalProviderTimeout === undefined) {
    delete process.env.AI_PROVIDER_TIMEOUT_MS;
  } else {
    process.env.AI_PROVIDER_TIMEOUT_MS = originalProviderTimeout;
  }
  if (originalRequestTimeout === undefined) {
    delete process.env.AI_REQUEST_TIMEOUT_MS;
  } else {
    process.env.AI_REQUEST_TIMEOUT_MS = originalRequestTimeout;
  }
});

test("calls the Groq SDK with the selected model and extracts generated text", async () => {
  const requests = [];
  const signal = new AbortController().signal;
  const provider = createGroqProvider({
    getClient: () => ({
      chat: {
        completions: {
          create: async (...args) => {
            requests.push(args);
            return {
              choices: [{ message: { content: "  A real answer.  " } }],
            };
          },
        },
      },
    }),
  });

  const text = await provider.generate({
    model: "openai/gpt-oss-20b",
    prompt: "preserve all supplied chat context",
    signal,
    timeoutMs: 3000,
  });

  assert.equal(text, "A real answer.");
  assert.deepEqual(requests[0][0], {
    model: "openai/gpt-oss-20b",
    messages: [
      { role: "user", content: "preserve all supplied chat context" },
    ],
    reasoning_effort: "low",
    max_completion_tokens: 1024,
  });
  assert.equal(requests[0][1].signal, signal);
  assert.equal(requests[0][1].timeout, 3000);
});

test("extracts string and text-part Groq response content", () => {
  assert.equal(
    extractGroqText({
      choices: [{ message: { content: " generated " } }],
    }),
    "generated"
  );
  assert.equal(
    extractGroqText({
      choices: [
        {
          message: {
            content: [
              { type: "text", text: "hello " },
              { type: "image", image_url: "ignored" },
              { type: "text", text: "there" },
            ],
          },
        },
      ],
    }),
    "hello there"
  );
});

test("calls the Gemini SDK with the prompt and extracts generated text", async () => {
  const requests = [];
  const signal = new AbortController().signal;
  const originalApiKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = "test-key";
  const provider = createGeminiProvider({
    getClient: () => ({
      models: {
        generateContent: async (request) => {
          requests.push(request);
          return { text: "  Gemini answer.  " };
        },
      },
    }),
  });

  try {
    const text = await provider.generate({
      model: "gemini-test-model",
      prompt: "preserve all supplied chat context",
      signal,
      timeoutMs: 3000,
    });

    assert.equal(text, "Gemini answer.");
    assert.deepEqual(requests[0], {
      model: "gemini-test-model",
      contents: "preserve all supplied chat context",
      abortSignal: signal,
    });
    assert.equal(extractGeminiText({ text: " response " }), "response");
    assert.equal(extractGeminiText({ text: undefined }), "");
  } finally {
    if (originalApiKey === undefined) {
      delete process.env.GEMINI_API_KEY;
    } else {
      process.env.GEMINI_API_KEY = originalApiKey;
    }
  }
});

test("uses Gemini after Groq models fail", async () => {
  const tried = [];
  const result = await generate({
    prompt: "prompt",
    recoveryText: "recovery",
    requestTimeoutMs: 500,
    attemptTimeoutMs: 250,
    providers: {
      groq: {
        configured: true,
        models: ["groq-model"],
        generate: async () => {
          tried.push("groq");
          throw Object.assign(new Error("rate limited"), { status: 429 });
        },
      },
      gemini: {
        configured: true,
        models: ["gemini-model"],
        generate: async () => {
          tried.push("gemini");
          return "Gemini fallback answer";
        },
      },
    },
  });

  assert.deepEqual(tried, ["groq", "gemini"]);
  assert.equal(result.text, "Gemini fallback answer");
  assert.equal(result.provider, "gemini");
  assert.equal(result.model, "gemini-model");
  assert.equal(result.recovered, false);
});

test("returns a safe missing-key recovery without calling the SDK", async () => {
  const original = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  const logEntries = [];
  const provider = createGroqProvider({
    getClient: () => {
      throw new Error("SDK must not be called without a key");
    },
  });

  try {
    const result = await generateWithFallback({
      prompt: "private prompt",
      recoveryText: "friendly recovery",
      providers: { groq: provider },
      logger: (entry) => logEntries.push(JSON.parse(entry)),
    });
    assert.equal(result.text, "friendly recovery");
    assert.equal(result.failureCategory, "missing_api_key");
    assert.equal(logEntries[0].category, "missing_api_key");
    assert.equal(JSON.stringify(logEntries).includes("private prompt"), false);
  } finally {
    if (original === undefined) {
      delete process.env.GROQ_API_KEY;
    } else {
      process.env.GROQ_API_KEY = original;
    }
  }
});

test("tries the next configured Groq model after an invalid-model error", async () => {
  const tried = [];
  const result = await generate({
    prompt: "prompt",
    recoveryText: "recovery",
    providers: groqProvider(["invalid-model", "supported-model"], async ({ model }) => {
      tried.push(model);
      if (model === "invalid-model") {
        throw Object.assign(new Error("model does not exist"), {
          status: 400,
          error: { code: "model_not_found" },
        });
      }
      return "generated with fallback model";
    }),
  });

  assert.deepEqual(tried, ["invalid-model", "supported-model"]);
  assert.equal(result.text, "generated with fallback model");
  assert.equal(result.model, "supported-model");
  assert.equal(classifyProviderError({
    status: 400,
    error: { code: "model_not_found" },
  }), "model_unavailable");
});

test("classifies HTTP 413 as an oversized request", () => {
  assert.equal(
    classifyProviderError(Object.assign(new Error("request rejected"), {
      status: 413,
    })),
    "request_too_large"
  );
});

test("does not repeat an oversized prompt against another model", async () => {
  const tried = [];
  const result = await generate({
    prompt: "oversized prompt",
    recoveryText: "friendly recovery",
    providers: groqProvider(["model-a", "model-b"], async ({ model }) => {
      tried.push(model);
      throw Object.assign(new Error("request too large"), { status: 413 });
    }),
  });

  assert.deepEqual(tried, ["model-a"]);
  assert.equal(result.recovered, true);
  assert.equal(result.failureCategory, "request_too_large");
});

test("logs safe status and error code without provider error content", async () => {
  const logEntries = [];
  await generate({
    prompt: "private conversation",
    recoveryText: "recovery",
    providers: groqProvider(["groq-model"], async () => {
      throw Object.assign(new Error("private provider response body"), {
        status: 503,
        code: "SERVICE_UNAVAILABLE",
      });
    }),
    logger: (entry) => logEntries.push(JSON.parse(entry)),
  });

  const attempt = logEntries.find((entry) => entry.event === "ai_provider_attempt");
  assert.equal(attempt.provider, "groq");
  assert.equal(attempt.model, "groq-model");
  assert.equal(attempt.status, 503);
  assert.equal(attempt.providerErrorCode, "SERVICE_UNAVAILABLE");
  assert.equal(attempt.category, "provider_unavailable");
  assert.equal(JSON.stringify(logEntries).includes("private"), false);
});

test("falls back to the next Groq model after a genuine provider failure", async () => {
  const tried = [];
  const result = await generate({
    prompt: "prompt",
    recoveryText: "recovery",
    providers: groqProvider(["unavailable", "available"], async ({ model }) => {
      tried.push(model);
      if (model === "unavailable") {
        throw Object.assign(new Error("service unavailable"), { status: 503 });
      }
      return "fallback response";
    }),
  });

  assert.deepEqual(tried, ["unavailable", "available"]);
  assert.equal(result.text, "fallback response");
});

test("returns recovery after all Groq models fail", async () => {
  const result = await generate({
    prompt: "prompt",
    recoveryText: "friendly recovery",
    providers: groqProvider(["first", "second"], async () => {
      throw Object.assign(new Error("service unavailable"), { status: 503 });
    }),
  });

  assert.equal(result.text, "friendly recovery");
  assert.equal(result.recovered, true);
  assert.equal(result.failureCategory, "provider_unavailable");
});

test("does not invoke a provider for an already-aborted request", async () => {
  const controller = new AbortController();
  controller.abort();
  let calls = 0;

  await assert.rejects(
    runWithTimeout(
      async () => {
        calls += 1;
        return "must not run";
      },
      100,
      { signal: controller.signal }
    ),
    { code: "REQUEST_ABORTED" }
  );
  assert.equal(calls, 0);
});

test("returns a response just before timeout and cleans timer and abort listener", async () => {
  const cleared = [];
  let abortListener;
  let removedAbortListener;
  const signal = {
    aborted: false,
    addEventListener: (event, listener) => {
      assert.equal(event, "abort");
      abortListener = listener;
    },
    removeEventListener: (event, listener) => {
      assert.equal(event, "abort");
      removedAbortListener = listener;
    },
  };
  const response = await runWithTimeout(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
      return "on time";
    },
    100,
    {
      signal,
      clearTimeoutFn: (timer) => {
        cleared.push(timer);
        clearTimeout(timer);
      },
    }
  );

  assert.equal(response, "on time");
  assert.equal(cleared.length, 1);
  assert.equal(removedAbortListener, abortListener);
});

test("times out a Groq attempt and tries the next configured model", async () => {
  const tried = [];
  const result = await generate({
    prompt: "prompt",
    recoveryText: "recovery",
    requestTimeoutMs: 300,
    attemptTimeoutMs: 40,
    providers: groqProvider(["slow", "fast"], async ({ model }) => {
      tried.push(model);
      if (model === "slow") {
        return new Promise(() => {});
      }
      return "fallback answer";
    }),
  });

  assert.deepEqual(tried, ["slow", "fast"]);
  assert.equal(result.text, "fallback answer");
});

test("returns recovery when the overall request deadline is exceeded", async () => {
  const result = await generate({
    prompt: "prompt",
    recoveryText: "deadline recovery",
    requestTimeoutMs: 25,
    attemptTimeoutMs: 100,
    providers: groqProvider(["slow"], () => new Promise(() => {})),
  });

  assert.equal(result.text, "deadline recovery");
  assert.equal(result.recovered, true);
  assert.equal(result.failureCategory, "deadline_exceeded");
});

test("returns only one reply when a timed-out provider completes late", async () => {
  let lateCompletion;
  const result = await generate({
    prompt: "prompt",
    recoveryText: "recovery",
    requestTimeoutMs: 300,
    attemptTimeoutMs: 30,
    providers: groqProvider(["slow", "fast"], ({ model }) => {
      if (model === "slow") {
        return new Promise((resolve) => {
          lateCompletion = resolve;
        });
      }
      return "single generated reply";
    }),
  });

  lateCompletion("late reply");
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(result.text, "single generated reply");
});

test("retains profile, memory, relationship, and conversation context", () => {
  const context = buildContext({
    userProfile: {
      profile: { nickname: "Mimi" },
      friend: { name: "Aura", gender: "female", ageGroup: "young" },
    },
    chatHistory: [{ sender: "user", message: "I love stargazing." }],
    memories: [{ title: "Favorite hobby", memory: "stargazing" }],
    relationship: {
      friendshipLevel: 4,
      insideJokes: [{ title: "Moon", description: "our moon joke" }],
    },
  });

  assert.match(context, /Mimi/);
  assert.match(context, /stargazing/);
  assert.match(context, /Friendship Level:\s+4/);
  assert.match(context, /our moon joke/);
  assert.match(context, /I love stargazing/);
});

test("compacts only decorative personality dividers while retaining full guidance", () => {
  const prompt = buildSystemPrompt({});

  assert.ok(Buffer.byteLength(prompt, "utf8") < 30000);
  assert.match(prompt, /AURA GAZE/);
  assert.match(prompt, /You are Aura Gaze/);
  assert.match(prompt, /Never say:/);
  assert.match(prompt, /As an AI/);
  assert.match(prompt, /Never become controlling/);
  assert.doesNotMatch(prompt, /═{12,}/u);
});

test("bounds oversized history and memory while retaining the newest user message", async (t) => {
  let capturedPrompt = "";
  const generateStub = mock.method(
    providerOrchestrator,
    "generateWithFallback",
    async ({ prompt }) => {
      capturedPrompt = prompt;
      return { text: "ok", recovered: false };
    }
  );
  t.after(() => generateStub.mock.restore());

  await generateReplyWithStatus({
    userMessage: `${"a".repeat(15000)}CURRENT END`,
    userProfile: { profile: { nickname: "Mimi" } },
    chatHistory: Array.from({ length: 80 }, (_, index) => ({
      sender: index % 2 ? "ai" : "user",
      message: `${index}:${"history ".repeat(500)}`,
    })),
    memories: Array.from({ length: 80 }, (_, index) => ({
      title: `Memory ${index}`,
      memory: "remembered ".repeat(300),
    })),
    relationship: {},
  });

  assert.ok(Buffer.byteLength(capturedPrompt, "utf8") < 50000);
  assert.match(capturedPrompt, /CURRENT END/);
  assert.match(capturedPrompt, /Memory 0/);
  assert.match(capturedPrompt, /Aura: 79:/);
});

test("routes chat and event prompts through the shared provider service", async (t) => {
  const seenPrompts = [];
  const generateStub = mock.method(
    providerOrchestrator,
    "generateWithFallback",
    async ({ prompt, recoveryText }) => {
      seenPrompts.push(prompt);
      return { text: `test response: ${recoveryText}`, recovered: false };
    }
  );
  t.after(() => generateStub.mock.restore());

  const chatResult = await generateReplyWithStatus({
    userMessage: "My exam went well",
    userProfile: { profile: { nickname: "Mimi" } },
    memories: [{ title: "Exam", memory: "Mimi prepared carefully" }],
  });
  const eventResult = await generateEventMessage({
    event: "BIRTHDAY",
    userProfile: { profile: { nickname: "Mimi" } },
    memories: [{ title: "Birthday plan", memory: "a quiet celebration" }],
  });

  assert.equal(chatResult.text.includes("test response:"), true);
  assert.equal(eventResult.includes("test response:"), true);
  assert.match(seenPrompts[0], /My exam went well/);
  assert.match(seenPrompts[1], /BIRTHDAY/);
  assert.match(seenPrompts[1], /quiet celebration/);
});
