import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Star, LogOut } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — POPKID MD" },
      { name: "description", content: "Live community chat and user reviews for POPKID MD." },
    ],
  }),
  component: Community,
});

type Msg = { id: string; user_id: string; content: string; created_at: string; display_name?: string };
type Review = { id: string; user_id: string; rating: number; comment: string; created_at: string; display_name?: string };

function Community() {
  const [session, setSession] = useState<any>(null);
  const [tab, setTab] = useState<"chat" | "reviews">("chat");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Join the <span className="text-gradient">Community</span></h1>
        <p className="text-muted-foreground mt-2">Sign in to chat live and post reviews.</p>
        <Link to="/auth" className="mt-6 inline-block rounded-xl bg-gradient-neon px-7 py-3 font-bold text-primary-foreground shadow-neon">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-black">
          POPKID <span className="text-gradient">Community</span>
        </h1>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("chat")}
                className={`flex-1 rounded-xl py-3 font-semibold transition ${tab === "chat" ? "bg-gradient-neon text-primary-foreground shadow-neon" : "glass hover:border-primary"}`}>
          💬 Live Chat
        </button>
        <button onClick={() => setTab("reviews")}
                className={`flex-1 rounded-xl py-3 font-semibold transition ${tab === "reviews" ? "bg-gradient-neon text-primary-foreground shadow-neon" : "glass hover:border-primary"}`}>
          ⭐ Reviews
        </button>
      </div>

      {tab === "chat" ? <ChatRoom userId={session.user.id} /> : <ReviewsBoard userId={session.user.id} />}
    </div>
  );
}

function ChatRoom({ userId }: { userId: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("chat_messages").select("*").order("created_at", { ascending: true }).limit(200);
      if (data) {
        setMsgs(data);
        const ids = Array.from(new Set(data.map((m) => m.user_id)));
        const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", ids);
        if (profs) setProfiles(Object.fromEntries(profs.map((p) => [p.id, p.display_name])));
      }
    };
    load();
    const ch = supabase
      .channel("chat-room")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, async (payload) => {
        const m = payload.new as Msg;
        setMsgs((prev) => [...prev, m]);
        if (!profiles[m.user_id]) {
          const { data: p } = await supabase.from("profiles").select("display_name").eq("id", m.user_id).maybeSingle();
          if (p) setProfiles((prev) => ({ ...prev, [m.user_id]: p.display_name }));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText("");
    const { error } = await supabase.from("chat_messages").insert({ user_id: userId, content: t });
    if (error) toast.error(error.message);
  };

  return (
    <div className="glass rounded-2xl flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.length === 0 && <p className="text-center text-muted-foreground text-sm py-10">Be the first to say hi 👋</p>}
        {msgs.map((m) => {
          const mine = m.user_id === userId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${mine ? "bg-gradient-neon text-primary-foreground" : "bg-secondary"}`}>
                {!mine && <p className="text-[11px] font-bold text-accent mb-0.5">{profiles[m.user_id] || "User"}</p>}
                <p className="text-sm break-words whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="border-t border-border/50 p-3 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..."
               maxLength={1000}
               className="flex-1 rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
        <button className="rounded-xl bg-gradient-neon px-5 font-bold text-primary-foreground shadow-neon">
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

function ReviewsBoard({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(100);
      if (data) {
        setReviews(data);
        const ids = Array.from(new Set(data.map((r) => r.user_id)));
        const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", ids);
        if (profs) setProfiles(Object.fromEntries(profs.map((p) => [p.id, p.display_name])));
      }
    };
    load();
    const ch = supabase
      .channel("reviews-board")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reviews" }, async (payload) => {
        const r = payload.new as Review;
        setReviews((prev) => [r, ...prev]);
        if (!profiles[r.user_id]) {
          const { data: p } = await supabase.from("profiles").select("display_name").eq("id", r.user_id).maybeSingle();
          if (p) setProfiles((prev) => ({ ...prev, [r.user_id]: p.display_name }));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = comment.trim();
    if (!c) return;
    const { error } = await supabase.from("reviews").insert({ user_id: userId, rating, comment: c });
    if (error) return toast.error(error.message);
    setComment(""); setRating(5);
    toast.success("Thanks for your review! ⭐");
  };

  const avg = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : "—";

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Community rating</p>
          <p className="font-display text-4xl font-black text-gradient">{avg} <span className="text-base text-muted-foreground">/ 5</span></p>
        </div>
        <p className="text-sm text-muted-foreground">{reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
      </div>

      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold">Leave a review</h3>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((n) => (
            <button type="button" key={n} onClick={() => setRating(n)}>
              <Star className={`h-7 w-7 transition ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} rows={3}
                  placeholder="Share your experience with POPKID..."
                  className="w-full rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary resize-none" />
        <button className="rounded-xl bg-gradient-neon px-6 py-2.5 font-bold text-primary-foreground shadow-neon">Post Review</button>
      </form>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="font-bold text-accent">{profiles[r.user_id] || "User"}</p>
              <div className="flex">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-primary text-primary" />)}
              </div>
            </div>
            <p className="text-sm mt-2 whitespace-pre-wrap">{r.comment}</p>
            <p className="text-[11px] text-muted-foreground mt-2">{new Date(r.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
