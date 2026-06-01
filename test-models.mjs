import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.VITE_GROQ_API_KEY}` }
    });
    const data = await response.json();
    console.log(data.data.map(m => m.id));
}
test();
