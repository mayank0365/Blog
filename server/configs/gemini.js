import { GoogleGenerativeAI } from "@google/generative-ai";

async function main(prompt) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      throw new Error('Gemini API key is not configured');
    }

    console.log('Initializing Gemini with API key:', apiKey.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Content generated, length:', text.length);
    return text;
  } catch (error) {
    console.error('Gemini API error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw new Error(`Failed to generate content: ${error.message}`);
  }
}

export default main;