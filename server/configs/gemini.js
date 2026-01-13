import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate content with AI');
  }
}

export default main;