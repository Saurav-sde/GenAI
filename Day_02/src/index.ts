
/*
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "Give the Gemini API KEY"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain Array in details like i am beginner",
  });
  console.log(response.text);
}

await main();
*/
// Here it doesn't have any context so everytime it sees as a fresh chat...
// so, i have to provide the context everytime as LLM doesn't store any information about us
// when we chat in chatGPT then current msg is not send alone to the gpt server , previous chat is also sent for the context
// so now more token is used ,, in further classes we will see optimization technique of this
// so now more token is used ,, in further classes we will see optimization technique of this



// now lets give history also, so that the model gets some context
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "GEMINI API KEY"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
        {
            role: 'user',
            parts: [{text: "what is my name"}]
        },
        {
            role: 'model',
            parts: [{text: "As an AI, I don't have access to your personal information"}]
        },
        {
            role: 'user',
            parts: [{text: "My name is Saurav Joshi"}]
        },
        {
            role: 'model',
            parts: [{text: "Thank You, Saurav. It's nice to meet you"}]
        },
        {
            role: 'user',
            parts: [{text: "What is my name"}]
        },
    ]
  });
  console.log(response.text);
}

await main();