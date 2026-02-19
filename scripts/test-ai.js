import fs from 'fs';
import path from 'path';

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

async function testAI() {
  const envPath = path.resolve(process.cwd(), '.env');
  let apiKey = '';
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/VITE_GEMINI_API_KEY=([^\s]+)/);
    if (match) apiKey = match[1];
  } catch (err) {}

  if (!apiKey) {
    console.error('❌ API Key not found');
    return;
  }

  console.log(`🧪 Testing models for key: ${apiKey.slice(0, 5)}...`);

  for (const model of MODELS) {
    console.log(`\n--- Trying ${model} ---`);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Hello, identify yourself." }] }] })
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`✅ ${model} is WORKING!`);
        console.log(`Response: ${data.candidates?.[0]?.content?.parts?.[0]?.text?.slice(0, 100)}...`);
        return; // Success!
      } else {
        console.log(`❌ ${model} failed (${res.status}): ${data.error?.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.log(`❌ ${model} failed: ${err.message}`);
    }
  }

  console.log('\n🚨 ALL MODELS FAILED. The application will use randomized fallback responses.');
}

testAI();
