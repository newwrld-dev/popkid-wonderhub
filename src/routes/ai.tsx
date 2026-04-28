import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "POPKID AI Chat" },
      { name: "description", content: "Talk to POPKID AI assistant about bots, hosting, web dev and more." },
    ],
  }),
  component: AIChat,
});

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

function AIChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hey! 👋 I'm POPKID AI. Ask me about bots, hosting (100/=), web dev (3000/=), or anything POPKID-related." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const scroll = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    scroll();

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next }),
      });
      if (resp.status === 429) { toast.error("Rate limit reached. Try again shortly."); setLoading(false); return; }
      if (resp.status === 402) { toast.error("AI credits exhausted."); setLoading(false); return; }
      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let acc = "";
      let started = false;
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(j);
            const c = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (c) {
              acc += c;
              if (!started) {
                started = true;
                setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
              } else {
                setMessages((prev) => prev.map((m, i) => i === prev.length - 1 ? { ...m, content: acc } : m));
              }
              scroll();
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Powered by Lovable AI
        </span>
        <h1 className="mt-3 font-display text-4xl font-black">
          Talk to <span className="text-gradient">POPKID AI</span>
        </h1>
      </div>

      <div className="glass rounded-2xl flex flex-col h-[72vh]">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-gradient-neon text-primary-foreground" : "bg-secondary"}`}>
                <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start"><div className="bg-secondary rounded-2xl px-4 py-3 text-sm text-muted-foreground">POPKID AI is thinking...</div></div>
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={send} className="border-t border-border/50 p-3 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask POPKID AI anything..."
                 disabled={loading}
                 className="flex-1 rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          <button disabled={loading} className="rounded-xl bg-gradient-neon px-5 font-bold text-primary-foreground shadow-neon disabled:opacity-50">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
