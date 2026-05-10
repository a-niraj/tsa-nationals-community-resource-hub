import express from 'express';
import { readFileSync, existsSync } from 'fs';

const envFile = ['.env', '.env.local'].find(f => existsSync(f));
if (!envFile) {
  console.error('[DEV API] No .env or .env.local file found');
  process.exit(1);
}
const envContent = readFileSync(envFile, 'utf-8');
const ENV = {};
envContent.split(/\r?\n/).forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      ENV[key.trim()] = value.trim();
      process.env[key.trim()] = value.trim();
    }
  }
});

const GROQ_API_KEY = ENV.GROQ_API_KEY;
console.log('[DEV API] GROQ_API_KEY loaded:', !!GROQ_API_KEY);

const apiApp = express();
apiApp.use(express.json());

// CORS middleware
apiApp.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

apiApp.post('/api/ai', async (req, res) => {
  try {
    const { prompt, context: resourceContext } = req.body;

    console.log("[Groq API] API_KEY exists:", !!GROQ_API_KEY);
    console.log("[Groq API] Prompt:", prompt?.substring(0, 50));
    console.log("[Groq API] Prompt:", prompt?.substring(0, 50));

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: "GROQ_API_KEY not configured" });
    }

    const API_URL = "https://api.groq.com/openai/v1/chat/completions";

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for community resources. Provide very short, concise, and accurate answers (1-2 sentences). Context: ${resourceContext}`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
    });

    console.log("[Groq API] Response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "Groq API error" });
    }

    res.json(data);
  } catch (error) {
    console.error("[Groq API] Error:", error);
    res.status(500).json({ error: `Server error: ${String(error)}` });
  }
});

const API_PORT = 3001;
apiApp.listen(API_PORT, () => {
  console.log(`✅ API server running at http://localhost:${API_PORT}`);
});

