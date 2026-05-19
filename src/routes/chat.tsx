import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Earn by Chatting — POPKID MD" },
      { name: "description", content: "Chat with up to 4 people per day and earn 20 tokens for each new conversation. 2000 tokens = KSh 1000." },
    ],
  }),
  component: ChatPage,
});

interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
}
interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

function ChatPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ id: string; tokens: number; activated: boolean } | null>(null);
  const [people, setPeople] = useState<Profile[]>([]);
  const [creditedToday, setCreditedToday] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Boot
  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { navigate({ to: "/auth" }); return; }
      const uid = sess.session.user.id;
      const { data: prof } = await supabase
        .from("profiles").select("id, tokens, activated").eq("id", uid).maybeSingle();
      if (!prof?.activated) { navigate({ to: "/activate" }); return; }
      setMe({ id: uid, tokens: prof.tokens ?? 0, activated: true });

      const [{ data: others }, { data: credits }] = await Promise.all([
        supabase.from("profiles").select("id, display_name, avatar_url").neq("id", uid).limit(100),
        supabase.from("daily_chat_credits").select("partner_id").eq("user_id", uid)
          .eq("credit_date", new Date().toISOString().slice(0, 10)),
      ]);
      setPeople(others ?? []);
      setCreditedToday(new Set((credits ?? []).map((c) => c.partner_id)));
    })();
  }, [navigate]);

  // Load thread + realtime
  useEffect(() => {
    if (!me || !active) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("direct_messages").select("*")
        .or(`and(sender_id.eq.${me.id},recipient_id.eq.${active.id}),and(sender_id.eq.${active.id},recipient_id.eq.${me.id})`)
        .order("created_at", { ascending: true }).limit(200);
      if (!cancelled) setMessages(data ?? []);
    })();

    const channel = supabase
      .channel(`dm-${me.id}-${active.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "direct_messages" }, (payload) => {
        const m = payload.new as Message;
        const inThread =
          (m.sender_id === me.id && m.recipient_id === active.id) ||
          (m.sender_id === active.id && m.recipient_id === me.id);
        if (inThread) setMessages((prev) => [...prev, m]);
      })
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [me, active]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const todayCount = creditedToday.size;
  const dailyCap = 4;
  const tokensTodayEarned = todayCount * 20;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me || !active || !input.trim() || sending) return;
    setSending(true);
    const content = input.trim();
    setInput("");
    try {
      const { error } = await supabase
        .from("direct_messages")
        .insert({ sender_id: me.id, recipient_id: active.id, content });
      if (error) throw error;

      if (!creditedToday.has(active.id)) {
        const { data: award } = await supabase.rpc("award_chat_credit", { _partner_id: active.id });
        if ((award as { awarded?: boolean })?.awarded) {
          const newBal = (award as { balance: number }).balance;
          setMe((prev) => prev ? { ...prev, tokens: newBal } : prev);
          setCreditedToday((prev) => new Set(prev).add(active.id));
          toast.success(`+20 tokens earned! Balance: ${newBal}`);
        } else {
          const reason = (award as { reason?: string })?.reason;
          if (reason === "daily_limit") toast.info("Daily limit reached (4 people)");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const sortedPeople = useMemo(() => {
    return [...people].sort((a, b) => {
      const ac = creditedToday.has(a.id) ? 1 : 0;
      const bc = creditedToday.has(b.id) ? 1 : 0;
      return ac - bc;
    });
  }, [people, creditedToday]);

  if (!me) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-3 py-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="font-display text-2xl font-black text-gradient">{me.tokens}</p>
          <p className="text-[10px] text-muted-foreground">≈ KSh {Math.floor(me.tokens / 2)}</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="font-display text-2xl font-black">{tokensTodayEarned}</p>
          <p className="text-[10px] text-muted-foreground">{todayCount}/{dailyCap} chats</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-xs text-muted-foreground">Per chat</p>
          <p className="font-display text-2xl font-black text-primary">+20</p>
          <p className="text-[10px] text-muted-foreground">new partner/day</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 min-h-[60vh]">
        {/* People list */}
        <aside className={`glass rounded-2xl p-3 ${active ? "hidden md:block" : ""}`}>
          <h2 className="font-bold px-2 py-2 text-sm uppercase tracking-wider text-muted-foreground">People ({sortedPeople.length})</h2>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {sortedPeople.length === 0 && (
              <p className="text-xs text-muted-foreground p-3">No other users yet. Invite friends!</p>
            )}
            {sortedPeople.map((p) => {
              const earned = creditedToday.has(p.id);
              const isActive = active?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition
                    ${isActive ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-accent/50"}`}
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-neon flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                    {p.display_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">{p.display_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {earned ? "✅ +20 earned today" : "💰 +20 on first message"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Conversation */}
        <section className={`glass rounded-2xl flex flex-col ${active ? "" : "hidden md:flex"}`}>
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <div className="text-4xl mb-2">👈</div>
                <p className="font-bold">Pick someone to chat with</p>
                <p className="text-sm text-muted-foreground mt-1">Earn 20 tokens per new person (4/day max)</p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-border/50 p-3 flex items-center gap-3">
                <button onClick={() => setActive(null)} className="md:hidden text-sm">← Back</button>
                <div className="h-9 w-9 rounded-full bg-gradient-neon flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {active.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{active.display_name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {creditedToday.has(active.id) ? "Tokens already earned today" : "Send first message to earn +20"}
                  </p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[40vh] max-h-[55vh]">
                {messages.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-8">Say hi 👋</p>
                )}
                {messages.map((m) => {
                  const mine = m.sender_id === me.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm
                        ${mine ? "bg-gradient-neon text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"}`}>
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={send} className="border-t border-border/50 p-3 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-xl bg-input px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button
                  disabled={sending || !input.trim()}
                  className="rounded-xl bg-gradient-neon px-5 py-2.5 font-bold text-primary-foreground text-sm shadow-neon disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
