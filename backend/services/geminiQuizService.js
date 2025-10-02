import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const prompt = `
  You are an expert quiz creator for an e-learning platform for engineering students.
  Your task is to generate a JSON array of 10 high-quality multiple-choice questions based on the provided video transcript.

  RULES:
  1. The output MUST be a valid JSON array. Do not include any text, explanations, or markdown formatting before or after the JSON array.
  2. The array must contain exactly 10 question objects.
  3. Each question object must have this exact structure: { "question": "string", "options": ["string", "string", "string", "string"], "correctAnswer": number }.
  4. 'correctAnswer' must be a number from 0 to 3, representing the index of the correct option in the 'options' array.
  5. The questions should be clear, relevant to the main topics of the transcript, and suitable for testing a student's understanding.
  
  Here is the transcript:
`;

export async function generateQuizFromTranscript(transcript) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[GEMINI] Attempt ${attempt} of ${maxRetries}`);
      
      const fullPrompt = prompt + transcript;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const jsonText = response.text();
      
      // Clean the response to ensure it's valid JSON
      const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();

      const questions = JSON.parse(cleanJson);
      console.log(`[GEMINI] Successfully generated ${questions.length} questions`);
      
      return questions;
    } catch (error) {
      lastError = error;
      console.error(`[GEMINI] Attempt ${attempt} failed:`, error.message);
      
      // If it's a 503 (overloaded), wait before retrying
      if (error.status === 503 && attempt < maxRetries) {
        const waitTime = attempt * 2000; // 2s, 4s, 6s
        console.log(`[GEMINI] Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If it's another error or last attempt, throw
      if (attempt === maxRetries) {
        throw new Error("Failed to generate quiz due to an AI service error.");
      }
    }
  }
  
  throw lastError;
}