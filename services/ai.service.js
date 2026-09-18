const { GoogleGenAI } = require('@google/genai');
const { geminiApiKey } = require('../config/env');

async function generateText(prompt) {
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Add it to the .env file.');
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error('Gemini request failed:', error.message);
    throw new Error('The AI service could not generate a response.');
  }
}

module.exports = { generateText };
