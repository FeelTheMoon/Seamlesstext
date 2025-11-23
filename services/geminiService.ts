import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCreativePhrases = async (topic: string, mood: string): Promise<string[]> => {
  try {
    const prompt = `Generate 5 short, punchy, and catchy phrases (max 5 words each) suitable for an infinite scrolling text loop about the topic: "${topic}". The mood should be: "${mood}". Return ONLY a JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Error generating phrases:", error);
    return ["Error generating text", "Try again later", "Check API Key"];
  }
};
