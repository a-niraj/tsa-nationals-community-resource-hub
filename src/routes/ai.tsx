import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useState } from "react";
import { getResources } from "@/api/public";
import { motion, AnimatePresence } from "framer-motion";


export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Assistance — Redmond Together" },
      { name: "description", content: "Ask our AI for help finding resources in Redmond." },
    ],
  }),
  loader: () => getResources(),
  component: AIPage,
});

function AIPage() {
  const allResources = Route.useLoaderData();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const apiUrl = 'http://localhost:3001/api/ai';

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          context: JSON.stringify(allResources).slice(0, 2000),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.error || res.statusText;
        console.error("API Error:", errorMsg);
        setResponse(`Error: ${errorMsg}`);
        return;
      }

      const data = await res.json();
      console.log("API Response:", data);

      if (data.error) {
        console.error("Groq API Error:", data.error);
        setResponse(`System Error: ${data.error}`);
      } else {
        const text = data?.choices?.[0]?.message?.content || "No response received.";
        setResponse(text);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("Fetch error:", error);
      console.error("API URL was:", 'http://localhost:3001/api/ai');
      setResponse(`Connection failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      eyebrow="Community Helper"
      title="How can we help today?"
      intro="Get instant guidance on local food banks, shelters, and community events."
    >
      <div className="max-w-2xl mx-auto pb-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-md border border-border/50 rounded-3xl p-6 shadow-xl"
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Search for local resources..."
            className="w-full h-32 p-4 rounded-2xl bg-background/50 text-foreground border-none focus:ring-2 focus:ring-primary/20 resize-none transition-all placeholder:text-muted-foreground/60"
          />
          
          <button
            onClick={handleAsk}
            disabled={loading}
            className="mt-4 w-full bg-primary text-primary-foreground font-medium py-4 rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex gap-1"><span className="animate-bounce">.</span><span className="animate-bounce [animation-delay:0.2s]">.</span><span className="animate-bounce [animation-delay:0.4s]">.</span></span>
            ) : "Find Resources"}
          </button>

          <AnimatePresence>
            {response && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <p className="text-foreground leading-relaxed italic">"{response}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageShell>
  );
}