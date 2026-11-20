import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const { prompt } = req.body;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt
      });

      return res.status(200).json({
        text: response.text
      });

    } catch (error) {
      console.error("Gemini API Error:", error);

      if (
        (error.status === 503 || error.status === 429) &&
        attempt === 1
      ) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      return res.status(error.status === 503 ? 503 : 500).json({
        error: "Gemini is temporarily unavailable. Please try again."
      });
    }
  }
}