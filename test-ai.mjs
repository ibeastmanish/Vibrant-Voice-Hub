import { GoogleGenAI, Type } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("No API key found in .env!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function testTranscript(transcript) {
  console.log(`\n🎙️ SIMULATED VOICE INPUT: "${transcript}"\n`);
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `The user said: "${transcript}". Determine their intent and provide a conversational response.`,
        config: {
            systemInstruction: "You are the AI assistant for AntiGravity CX. Determine the user's intent to switch views or brands. Valid brands: 'AntiGravity', 'Lovable', 'Stitch'. Valid views: 'Events', 'Admin', 'Tickets'. If they ask a general question, the intent is 'GENERAL'.",
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    intent: {
                        type: Type.STRING,
                        enum: ['SWITCH_BRAND', 'VIEW_EVENTS', 'VIEW_TICKETS', 'ADMIN_INSIGHTS', 'GENERAL', 'UNKNOWN']
                    },
                    targetBrand: {
                        type: Type.STRING,
                        description: "The brand they want to switch to, if applicable (AntiGravity, Lovable, Stitch)"
                    },
                    responseText: {
                        type: Type.STRING,
                        description: "A natural, conversational response to speak back to the user."
                    }
                },
                required: ['intent', 'responseText']
            }
        }
    });

    const data = JSON.parse(response.text);
    console.log("🤖 GEMINI API RESPONSE:");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("Error calling Gemini:", error);
  }
}

async function runTests() {
  await testTranscript("Can you show me the performance telemetry for Stitch?");
  await testTranscript("I want to see what events are happening right now.");
  await testTranscript("Switch my workspace back to the main AntiGravity hub.");
}

runTests();
