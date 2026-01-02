import { GoogleGenAI, Type } from "@google/genai";
import 'dotenv/config'
import readlineSync from "readline-sync"


const ai = new GoogleGenAI({});

// Define Tools
async function cryptoCurrency({coin}:{coin:String}) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=${coin}`);
    const data = await response.json();
    return data;
}

async function weatherInformation({city}:{city: String}) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=ce1a8f7b57b64046a33154426250201&q=${city}&aqi=no`);
    const data = await response.json();
    return data;
}

// define the information
const cryptoInfo = {
    name: "cryptoCurrency",
    description: "We can give you the current price or other information related to cryptocurrency like bitcoin, ehthereum etc",
    parameters: {
        type: Type.OBJECT,
        properties: {
            coin: {
                type: Type.STRING,
                description: "It will be the name of the cryptocurrency like bitcoin, ethereuem etc"
            }
        },
        required: ["coin"]
    }
}

const weatherInfo = {
    name: "weatherInformation",
    description: "you can get the current weather information of any city like london, goa etc",
    parameters: {
        type: Type.OBJECT,
        properties: {
            city: {
                type: Type.STRING,
                description: "Name of the city for which i have to fetch weather information like london, goa etc"
            }
        },
        required: ["city"]
    }
}


const tools = [{functionDeclarations: [cryptoInfo, weatherInfo]}]
const toolFunctions:Record<string,(args: any) => Promise<any>> = {
    "cryptoCurrency" : cryptoCurrency,
    "weatherInformation": weatherInformation
}

const History: any[] = [];

async function runAgent() {
    while(true) {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: History,
            config: {tools}
        });

        if(result.functionCalls && result.functionCalls.length > 0) {
            console.log("My function is called");
            const functionCall = result.functionCalls?.[0];
            if (!functionCall) {
                return;
            }
            const {name, args} = functionCall;
            if(!name)
                return;

            const toolFn = toolFunctions[name];
            if(!toolFn)
                return;
            const response = await toolFn(args);
            
            const functionResponsePart = {
                name: functionCall?.name,
                response: {
                    result: response
                }   
            }

            // send the function response back to the model,, push it in history to maintain the context
            History.push({
                role: 'model',
                parts: [{functionCall: functionCall}]
            })

            History.push({
                role: 'user',
                parts: [{functionResponse: functionResponsePart}]
            })
        } else {
            History.push({
                role: 'model',
                parts: [{text: result.text}]
            })
            console.log(result.text);
            break;
        }
    }
}


while(true) {
    const question = readlineSync.question('Ask me anything: ');

    if(question == 'exit'){
        break;
    }

    History.push({
        role:'user',
        parts:[{text:question}]
    });
    await runAgent();
}

