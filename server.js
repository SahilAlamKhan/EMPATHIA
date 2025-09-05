import "dotenv/config";   // load .env first
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { buildSubScenarioPrompt } from "./prompts.js";
import { validateSubScenarios } from "./schema.js";
import { generateSubScenariosWithGemini } from "./providers/gemini.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

// Simple rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Health endpoint
app.get("/health", (_req, res) => res.json({ ok: true }));

// Generate subscenarios
app.get("/api/subscenarios", async (req, res) => {
  try {
    const {
      majorScenarioId,
      majorScenarioTitle,
      n = "2",
      difficulty = "medium",
      used = "",
    } = req.query;

    if (!majorScenarioId || !majorScenarioTitle) {
      return res.status(400).json({
        error: "majorScenarioId and majorScenarioTitle are required",
      });
    }

    const count = Math.min(Math.max(parseInt(n, 10) || 2, 1), 6);
    const alreadyUsedCodes = used
      ? String(used).split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const prompt = buildSubScenarioPrompt({
      majorScenarioId: String(majorScenarioId),
      majorScenarioTitle: String(majorScenarioTitle),
      difficulty: String(difficulty),
      n: count,
      alreadyUsedCodes,
    });

    const raw = await generateSubScenariosWithGemini(prompt);

    let json;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      return res.status(502).json({ error: "Gemini returned invalid JSON", raw });
    }

    const valid = validateSubScenarios(json);
    if (!valid) {
      return res.status(502).json({
        error: "Gemini JSON failed schema validation",
        details: validateSubScenarios.errors,
        raw: json,
      });
    }

    return res.json(json);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Empathia AI API (Gemini) running at http://localhost:${PORT}`);
});
