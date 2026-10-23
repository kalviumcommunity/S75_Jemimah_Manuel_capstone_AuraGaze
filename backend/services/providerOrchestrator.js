const { randomUUID } = require("node:crypto");

const { getGroqClient } = require("../config/groq");
const { getGeminiClient } = require("../config/gemini");

const DEFAULT_MODELS = {
  groq: ["openai/gpt-oss-20b", "openai/gpt-oss-120b"],
  gemini: ["gemini-2.5-flash"],
};

const MAX_MODELS_PER_PROVIDER = 2;

function getConfiguredTimeout(name, defaultValue, maximum) {
  const configured = Number.parseInt(process.env[name], 10);

  return Number.isFinite(configured)
    ? Math.max(500, Math.min(configured, maximum))
    : defaultValue;
}

function parseModelList(value, defaults) {
  const models = (value || defaults.join(","))
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return [...new Set(models)].slice(0, MAX_MODELS_PER_PROVIDER);
}

function getProviderTimeoutMs() {
  return getConfiguredTimeout("AI_PROVIDER_TIMEOUT_MS", 12000, 30000);
}

function getAiRequestTimeoutMs() {
  return getConfiguredTimeout("AI_REQUEST_TIMEOUT_MS", 45000, 60000);
}

function extractGroqText(response) {
  const content = response?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .filter((part) => part?.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("")
      .trim();
  }

  return "";
}

function extractGeminiText(response) {
  return typeof response?.text === "string" ? response.text.trim() : "";
}

function createGroqProvider({ getClient = getGroqClient } = {}) {
  return {
    configured: Boolean(process.env.GROQ_API_KEY),
    models: parseModelList(
      process.env.GROQ_MODEL_FALLBACKS,
      DEFAULT_MODELS.groq
    ),
    async generate({ model, prompt, signal, timeoutMs }) {
      const client = getClient();
      const response = await client.chat.completions.create(
        {
          model,
          messages: [{ role: "user", content: prompt }],
          reasoning_effort: "low",
          max_completion_tokens: 1024,
        },
        {
          signal,
          timeout: timeoutMs,
        }
      );

      return extractGroqText(response);
    },
  };
}

function createGeminiProvider({ getClient = getGeminiClient } = {}) {
  return {
    configured: Boolean(process.env.GEMINI_API_KEY),
    models: parseModelList(
      process.env.GEMINI_MODEL_FALLBACKS,
      DEFAULT_MODELS.gemini
    ),
    async generate({ model, prompt, signal }) {
      const client = getClient();
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        abortSignal: signal,
      });

      return extractGeminiText(response);
    },
  };
}

function createProviders() {
  return {
    groq: createGroqProvider(),
    gemini: createGeminiProvider(),
  };
}

function classifyProviderError(error) {
  const rawStatus = error?.status || error?.statusCode || error?.response?.status;
  const status = Number(rawStatus);
  const statusName = String(rawStatus || "").toUpperCase();
  const code = `${String(error?.error?.code || error?.code || "").toUpperCase()} ${statusName}`;
  const message = `${String(error?.error?.message || "")} ${String(error?.message || "")}`;

  if (
    status === 401 ||
    status === 403 ||
    /API.?KEY.?INVALID|INVALID.?API.?KEY|UNAUTHENTICATED|PERMISSION_DENIED/.test(code) ||
    /invalid api key|api key is invalid/i.test(message) ||
    code.includes("UNAUTHENTICATED") ||
    code.includes("PERMISSION_DENIED")
  ) {
    return "provider_auth";
  }

  if (
    status === 404 ||
    /MODEL.{0,60}(NOT_FOUND|DECOMMISSIONED|UNSUPPORTED|UNAVAILABLE|INVALID)/.test(code) ||
    code.includes("NOT_FOUND") ||
    /model.{0,60}(not found|does not exist|decommissioned|unsupported|unavailable|invalid)|(?:not found|unsupported|unavailable).{0,40}model/i.test(
      message
    )
  ) {
    return "model_unavailable";
  }

  if (
    status === 413 ||
    /PAYLOAD_TOO_LARGE|REQUEST_TOO_LARGE|CONTENT_TOO_LARGE/.test(code) ||
    /request (?:body|payload).{0,40}too large|payload too large|context length.{0,40}(?:exceed|too long)/i.test(
      message
    )
  ) {
    return "request_too_large";
  }

  if (status === 429 || /RESOURCE_EXHAUSTED|RATE_LIMIT/.test(code)) {
    return "rate_limited";
  }

  if (
    (status >= 500 && status <= 599) ||
    /UNAVAILABLE|INTERNAL|BAD_GATEWAY|SERVICE_UNAVAILABLE/.test(code)
  ) {
    return "provider_unavailable";
  }

  if (
    status === 408 ||
    error?.code === "REQUEST_ABORTED" ||
    /DEADLINE_EXCEEDED|TIMEOUT/.test(code) ||
    code.includes("TIMEOUT") ||
    code === "ABORT_ERR" ||
    error?.name === "AbortError" ||
    error?.name === "TimeoutError"
  ) {
    return "timeout";
  }

  if (
    /ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ENETUNREACH/.test(
      code
    ) ||
    /fetch failed|network error/i.test(message)
  ) {
    return "network";
  }

  if (status >= 400 && status <= 499) {
    return "provider_configuration";
  }

  return "provider_error";
}

function logAttempt(logger, fields) {
  logger(
    JSON.stringify({
      event: "ai_provider_attempt",
      ...fields,
    })
  );
}

function getSafeErrorDetails(error) {
  const rawStatus = error?.status || error?.statusCode || error?.response?.status;
  const status = Number(rawStatus);
  const rawCode =
    error?.error?.code ||
    error?.code ||
    error?.error?.type ||
    error?.type;
  const code =
    typeof rawCode === "string" && /^[A-Za-z0-9_.-]{1,64}$/.test(rawCode)
      ? rawCode
      : null;

  return {
    status: Number.isInteger(status) && status >= 100 && status <= 599
      ? status
      : null,
    providerErrorCode: code,
  };
}

function createAbortError(reason) {
  const error = new Error("Provider request was cancelled.", {
    cause: reason,
  });
  error.name = "AbortError";
  error.code = "REQUEST_ABORTED";
  return error;
}

function runWithTimeout(
  generate,
  timeoutMs,
  {
    signal,
    setTimeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
  } = {}
) {
  const controller = new AbortController();
  let timeout;
  let timeoutReject;
  let timedOut = false;

  if (signal?.aborted) {
    return Promise.reject(createAbortError(signal.reason));
  }

  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutReject = reject;
    timeout = setTimeoutFn(() => {
      timedOut = true;
      const error = new Error("Provider request timed out.");
      error.name = "TimeoutError";
      controller.abort(error);
      reject(error);
    }, timeoutMs);
  });

  const abortAttempt = () => {
    const error = createAbortError(signal.reason);
    controller.abort(error);
    timeoutReject(error);
  };

  signal?.addEventListener("abort", abortAttempt, { once: true });

  return Promise.race([
    Promise.resolve().then(() => {
      if (controller.signal.aborted) {
        throw createAbortError(controller.signal.reason);
      }
      return generate(controller.signal);
    }),
    timeoutPromise,
  ]).finally(() => {
    if (timeout !== undefined) {
      clearTimeoutFn(timeout);
    }

    signal?.removeEventListener("abort", abortAttempt);

    if (!timedOut && !controller.signal.aborted) {
      controller.abort();
    }
  });
}

async function generateWithFallback({
  prompt,
  recoveryText,
  providers = createProviders(),
  requestTimeoutMs = getAiRequestTimeoutMs(),
  attemptTimeoutMs = getProviderTimeoutMs(),
  signal: requestSignal,
  logger = (message) => console.info(message),
}) {
  const requestId = randomUUID();
  const startedAt = Date.now();
  const deadline = startedAt + requestTimeoutMs;
  const providerOrder = ["groq", "gemini"];
  let attemptNumber = 0;
  let lastFailure = "providers_unavailable";

  for (let providerIndex = 0; providerIndex < providerOrder.length; providerIndex += 1) {
    if (requestSignal?.aborted) {
      lastFailure = "cancelled";
      break;
    }

    const providerName = providerOrder[providerIndex];
    const provider = providers[providerName];

    if (!provider?.configured || !provider.models?.length) {
      if (attemptNumber === 0) {
        lastFailure = provider?.configured
          ? "no_models_configured"
          : "missing_api_key";
      }
      logAttempt(logger, {
        requestId,
        provider: providerName,
        model: null,
        attempt: attemptNumber,
        durationMs: Date.now() - startedAt,
        category: lastFailure,
        fallbackTriggered: providerIndex < providerOrder.length - 1,
      });
      continue;
    }

    for (let modelIndex = 0; modelIndex < provider.models.length; modelIndex += 1) {
      if (requestSignal?.aborted) {
        lastFailure = "cancelled";
        break;
      }

      const remainingMs = deadline - Date.now();

      if (remainingMs <= 0) {
        lastFailure = "deadline_exceeded";
        break;
      }

      const model = provider.models[modelIndex];
      const timeoutMs = Math.min(attemptTimeoutMs, remainingMs);
      const attemptStartedAt = Date.now();
      attemptNumber += 1;
      const fallbackTriggered =
        modelIndex < provider.models.length - 1 ||
        providerIndex < providerOrder.length - 1;

      try {
        const text = await runWithTimeout(
          (attemptSignal) =>
            provider.generate({
              model,
              prompt,
              signal: attemptSignal,
              timeoutMs,
            }),
          timeoutMs,
          { signal: requestSignal }
        );

        if (typeof text !== "string" || !text.trim()) {
          const error = new Error("Provider returned an empty response.");
          error.code = "EMPTY_RESPONSE";
          throw error;
        }

        logAttempt(logger, {
          requestId,
          provider: providerName,
          model,
          attempt: attemptNumber,
          durationMs: Date.now() - attemptStartedAt,
          promptBytes: Buffer.byteLength(prompt, "utf8"),
          category: "success",
          fallbackTriggered: attemptNumber > 1,
        });

        return {
          text: text.trim(),
          recovered: false,
          requestId,
          provider: providerName,
          model,
        };
      } catch (error) {
        const attemptCategory =
          error?.code === "EMPTY_RESPONSE" ||
          error?.code === "EMPTY_PROVIDER_RESPONSE"
            ? "empty_response"
            : error?.code === "REQUEST_ABORTED"
            ? "cancelled"
            : classifyProviderError(error);
        lastFailure =
          Date.now() >= deadline && attemptCategory !== "cancelled"
            ? "deadline_exceeded"
            : attemptCategory;

        logAttempt(logger, {
          requestId,
          provider: providerName,
          model,
          attempt: attemptNumber,
          durationMs: Date.now() - attemptStartedAt,
          promptBytes: Buffer.byteLength(prompt, "utf8"),
          category: attemptCategory,
          ...getSafeErrorDetails(error),
          fallbackTriggered,
        });

        if (
          attemptCategory === "provider_auth" ||
          attemptCategory === "request_too_large" ||
          attemptCategory === "cancelled" ||
          lastFailure === "deadline_exceeded"
        ) {
          break;
        }
      }
    }
  }

  logAttempt(logger, {
    requestId,
    provider: null,
    model: null,
    attempt: attemptNumber,
    durationMs: Date.now() - startedAt,
    category:
      lastFailure === "deadline_exceeded" || lastFailure === "cancelled"
        ? lastFailure
        : "recovery",
    fallbackTriggered: false,
  });

  return {
    text: recoveryText,
    recovered: true,
    requestId,
    provider: null,
    model: null,
    failureCategory: lastFailure,
  };
}

module.exports = {
  DEFAULT_MODELS,
  classifyProviderError,
  createGeminiProvider,
  createGroqProvider,
  extractGeminiText,
  extractGroqText,
  generateWithFallback,
  getAiRequestTimeoutMs,
  getProviderTimeoutMs,
  parseModelList,
  runWithTimeout,
};
