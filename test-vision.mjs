import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

async function test() {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.VITE_GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.2-90b-vision-preview',
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: [
                    { type: "text", text: "What is in this image?" },
                    { type: "image_url", image_url: { url: base64Image } }
                ]}
            ]
        })
    });
    console.log(response.status);
    console.log(await response.json());
}
test();
