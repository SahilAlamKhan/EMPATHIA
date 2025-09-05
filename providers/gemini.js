import "dotenv/config";  // ensure .env loads here too
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateSubScenariosWithGemini(prompt) {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  if (!GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY in .env");
  }

  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
