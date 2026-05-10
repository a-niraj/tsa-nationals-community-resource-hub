export async function onRequest(
  { request, env }: { request: Request; env: any }
) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { prompt, context: resourceContext } = await request.json() as {
      prompt: string;
      context: string;
    };

    const API_KEY = env.GROQ_API_KEY;

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
        "Authorization": `Bearer ${API_KEY}`,
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
    return new Response(
      JSON.stringify({ error: `Server error: ${String(error)}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
