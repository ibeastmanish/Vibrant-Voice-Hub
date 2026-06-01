import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GROK_API_KEY;

if (!apiKey) {
  console.error("No GROK_API_KEY found in .env!");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function testTranscript(transcript) {
  console.log(`\n🎙️ SIMULATED VOICE INPUT: "${transcript}"\n`);
  
  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are the AI assistant for AntiGravity CX. Determine the user's intent to switch views or brands. Valid brands: 'AntiGravity', 'Lovable', 'Stitch'. Valid views: 'Events', 'Admin', 'Tickets'. If they ask a general question, the intent is 'GENERAL'. Provide your response in strict JSON format matching this schema: { \"intent\": \"SWITCH_BRAND|VIEW_EVENTS|VIEW_TICKETS|ADMIN_INSIGHTS|GENERAL|UNKNOWN\", \"targetBrand\": \"AntiGravity|Lovable|Stitch|null\", \"responseText\": \"A conversational response\" }"
        },
        {
          role: "user",
          content: `The user said: "${transcript}". Determine their intent and provide a conversational response in JSON.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const data = JSON.parse(response.choices[0].message.content);
    console.log("🤖 GROQ API RESPONSE:");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("Error calling Groq:", error);
  }
}

async function runTests() {
  await testTranscript("Can you show me the performance telemetry for Stitch?");
  await testTranscript("I want to see what events are happening right now.");
  await testTranscript("Switch my workspace back to the main AntiGravity hub.");
}

runTests();
