import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function* generateAIResponseStream(message) {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: message,
  });

  for await (const chunk of response) {
    const text = chunk.text;

    if (text) {
      yield text;
    }
  }
}