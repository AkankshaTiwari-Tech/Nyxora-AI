import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

export async function generateAIResponse(message) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(
      "Gemini Error:",
      JSON.stringify(error.response?.data, null, 2)
    );

    return "❌ Unable to generate response.";
  }
}