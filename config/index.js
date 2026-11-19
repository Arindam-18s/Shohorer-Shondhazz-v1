// Central configuration. Everything comes from environment variables.
// Local: put them in .env. Render: set them in the dashboard (Environment tab).
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

function required(name) {
  const value = (process.env[name] || "").trim();
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Set it in .env (local) or in the Render dashboard (deployed).`
    );
  }
  return value;
}

let jwtSecret = (process.env.JWT_SECRET || "").trim();
if (!jwtSecret) {
  if (isProd) throw new Error("JWT_SECRET must be set in production.");
  jwtSecret = "dev-only-insecure-secret";
  console.warn("[config] JWT_SECRET not set; using an insecure dev secret. Do not deploy like this.");
}

const geminiApiKey = (process.env.GEMINI_API_KEY || "").trim();
if (!geminiApiKey) {
  console.warn("[config] GEMINI_API_KEY not set; the chatbot will be unavailable.");
}

module.exports = {
  isProd,
  port: parseInt(process.env.PORT, 10) || 3005, // Render sets PORT automatically
  mongoUri: required("MONGODB_URI"),
  jwtSecret,
  gemini: {
    apiKey: geminiApiKey,
    // Comma-separated, tried in order. Override without a code change if a model is retired.
    models: (process.env.GEMINI_MODEL || "gemini-3.1-flash-lite,gemini-2.5-flash")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean),
  },
  llm: {
    apiKey: (process.env.LLM_API_KEY || "").trim(),
    baseUrl: (process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/$/, ""),
    model: (process.env.LLM_MODEL || "openai/gpt-oss-120b").trim(),
  },
  // Save places the AI mentions into the DB as unverified records. Off by default.
  autosaveAiPlaces: process.env.CHATBOT_AUTOSAVE === "true",
};