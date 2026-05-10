import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distServerDir = path.join(__dirname, '../dist/server');

const handlerCode = `import * as tanstackModule from "./index.js";
const tanstackHandler = tanstackModule.default;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle API routes before TanStack
    if (url.pathname === "/api/ai" && request.method === "POST") {
      try {
        const { prompt, context: resourceContext } = await request.json();

        const API_KEY = env.GROQ_API_KEY;

        console.log("[Groq API] API_KEY exists:", !!API_KEY);
        console.log("[Groq API] Prompt:", prompt?.substring(0, 50));

        if (!API_KEY) {
          return new Response(
            JSON.stringify({ error: "GROQ_API_KEY not configured" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        const API_URL = "https://api.groq.com/openai/v1/chat/completions";

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Authorization": \`Bearer \${API_KEY}\`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: \`You are a helpful assistant for community resources. Provide very short, concise, and accurate answers (1-2 sentences). Context: \${resourceContext}\`,
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
          return new Response(
            JSON.stringify({ error: data.error || "Groq API error" }),
            { status: response.status, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("[Groq API] Error:", error);
        return new Response(
          JSON.stringify({ error: \`Server error: \${String(error)}\` }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Pass all other requests to TanStack
    return tanstackHandler.fetch(request, env);
  },
};
`;

fs.writeFileSync(path.join(distServerDir, 'handler.js'), handlerCode);

const wranglerJsonPath = path.join(distServerDir, 'wrangler.json');
const wranglerConfig = JSON.parse(fs.readFileSync(wranglerJsonPath, 'utf-8'));
wranglerConfig.main = 'handler.js';
fs.writeFileSync(wranglerJsonPath, JSON.stringify(wranglerConfig));

console.log('✓ Post-build: Generated handler.js and updated wrangler.json');
