import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY as string});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: `current user name is Saurav Kumar, His age is 20 years. Today is ${new Date()}`
    },
    contents: "What is current time in india"
  });
  console.log(response.text);
}

await main();