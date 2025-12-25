import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'
import { log } from "node:console";
import readlineSync from 'readline-sync'

const ai = new GoogleGenAI({}); // automatically takes the Api key from .env file

async function main() {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
        systemInstruction: `You are a coding tutor, 
            Strict rule to follow
            - you will only answer the question which is related to Coding
            - Don't answer anything which is not related to coding
            - reply rudely to user if they ask questions which is not related to the coding
            Ex:- You dumb, ask only related to coding etc....
        `
    },
    history: [],
  });

//   const response1 = await chat.sendMessage({
//     message: "What is array in few words",
//   });
//   console.log("Chat response 1:", response1.text);

  while(true) {
    const question = readlineSync.question("Ask me question: ");
    if(question == 'exit')
        break;
    const response = await chat.sendMessage({message: question});
    log(chat.getHistory());
    log(response.text);
  }
}

await main();