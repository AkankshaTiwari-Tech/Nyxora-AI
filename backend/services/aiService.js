import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Nyxora AI.

Identity:
- Your name is Nyxora AI.
- You are the AI assistant inside the Nyxora AI platform.
- You were created by Akanksha.
- Never introduce yourself as Gemini or Google AI.
- If someone asks "Who are you?", reply that you are Nyxora AI.
- If someone asks "Who created you?", reply "I was created by Akanksha."
- Be professional, friendly, intelligent and concise.
- Format responses using proper Markdown.
`;

const MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function streamFromModel(model, prompt) {
  return await ai.models.generateContentStream({
    model,
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${SYSTEM_PROMPT}

User:
${prompt}`,
          },
        ],
      },
    ],
  });
}

export async function* generateAIResponseStream(message) {
  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`🟢 Trying model: ${model}`);

      const response = await streamFromModel(model, message);

      for await (const chunk of response) {
        if (chunk.text) {
          yield chunk.text;
        }
      }

      console.log(`✅ Response generated using ${model}`);
      return;
    } catch (error) {
      lastError = error;

      console.error(`❌ ${model} failed`, error);

      // Retry once if Google reports high demand
      if (error.status === 503) {
        console.log("🔄 High demand detected. Retrying in 2 seconds...");

        await sleep(2000);

        try {
          const retryResponse = await streamFromModel(model, message);

          for await (const chunk of retryResponse) {
            if (chunk.text) {
              yield chunk.text;
            }
          }

          console.log(`✅ Retry successful using ${model}`);
          return;
        } catch (retryError) {
          console.error(`❌ Retry failed for ${model}`);
          lastError = retryError;
        }
      }

      console.log("➡️ Switching to next available model...");
    }
  }

  console.error("❌ All Gemini models failed.");

  throw lastError;
}