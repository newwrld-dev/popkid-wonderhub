import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — POPKID MD" },
      { name: "description", content: "Cash out your earned tokens to M-Pesa. 2000 tokens = KSh 1000." },
    ],
  }),
  component: WalletPage,
});

interface Withdrawal {
  id: string;
  tokens_amount: number;
  ksh_amount: number;
  phone_number: string;
  status: string;
  created_at: string;
}

const MIN_TOKENS = 2000;

function WalletPage() {
  const navigate = useNavigate();
  const [me, setMe] = useState<{ id: string; tokens: number; phone: string | null } | null>(null);
  const [amount, setAmount] = useState<number>(MIN_TOKENS);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Withdrawal[]>([]);

  const load = async () => {
    const { data: sess } = await supabase.auth.getSession();
    if (!sess.session) { navigate({ to: "/auth" }); return; }
    const uid = sess.session.user.id;
    const { data: prof } = await supabase
      .from("profiles").select("id, tokens, phone_number, activated").eq("id", uid).maybeSingle();
    if (!prof?.activated) { navigate({ to: "/activate" }); return; }
    setMe({ id: uid, tokens: prof.tokens ?? 0, phone: prof.phone_number });
    if (prof.phone_number) setPhone(prof.phone_number);

    const { data: wd } = await supabase
      .from("withdrawals").select("*").eq("user_id", uid)
      .order("created_at", { ascending: false }).limit(20);
    setHistory(wd ?? []);
  };

  useEffect(() => { load(); }, []);

  const withdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("request_withdrawal", {
        _tokens: amount, _phone: phone,
      });
      if (error) throw error;
      const res = data as { ksh_amount: number };
      toast.success(`Withdrawal queued! KSh ${res.ksh_amount} → ${phone}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  if (!me) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading…</div>;

  const ksh = Math.floor(me.tokens / 2);
  const canWithdraw = me.tokens >= MIN_TOKENS;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Balance hero */}
      <div className="glass rounded-3xl p-8 text-center shadow-glow">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Your Balance</p>
        <p className="font-display text-6xl font-black text-gradient mt-2">{me.tokens}</p>
        <p className="text-muted-foreground mt-1">tokens</p>
        <div className="mt-4 inline-block rounded-full bg-primary/15 px-4 py-1.5 text-sm font-bold text-primary">
          ≈ KSh {ksh}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Rate: <span className="font-bold">2 tokens = KSh 1</span> · Min withdrawal: 2000 tokens (KSh 1000)
        </p>
      </div>

      {/* How to earn */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-bold mb-3">📈 How to earn</h2>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li>💬 Chat with up to <span className="text-foreground font-bold">4 new people per day</span></li>
          <li>💰 Earn <span className="text-foreground font-bold">+20 tokens</span> per new partner</li>
          <li>🚀 Max <span className="text-foreground font-bold">80 tokens/day</span> = KSh 40/day</li>
        </ul>
        <Link to="/chat" className="mt-4 inline-block rounded-xl bg-gradient-neon px-5 py-2.5 font-bold text-primary-foreground text-sm shadow-neon">
          Start chatting →
        </Link>
      </div>

      {/* Withdraw */}
      <form onSubmit={withdraw} className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-bold">💸 Withdraw to M-Pesa</h2>

        <div>
          <label className="text-xs text-muted-foreground">Tokens to withdraw (min 2000, even)</label>
          <input
            type="number" min={MIN_TOKENS} step={2} max={me.tokens}
            value={amount}
            onChange={(e) => setAmount(Math.max(MIN_TOKENS, parseInt(e.target.value || "0", 10)))}
            className="mt-1 w-full rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">
            You'll receive <span className="font-bold text-primary">KSh {Math.floor(amount / 2)}</span>
          </p>
        </div>

        <div>
          <label className="text-xs text-muted-foreground">M-Pesa phone number</label>
          <input
            required value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="0712345678" inputMode="tel"
            className="mt-1 w-full rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          disabled={loading || !canWithdraw}
          className="w-full rounded-xl bg-gradient-neon py-3 font-bold text-primary-foreground shadow-neon disabled:opacity-50"
        >
          {loading ? "Submitting…" : canWithdraw ? `Withdraw KSh ${Math.floor(amount / 2)}` : `Need ${MIN_TOKENS - me.tokens} more tokens`}
        </button>
        <p className="text-[11px] text-muted-foreground text-center">
          Withdrawals are processed within 24 hours to your M-Pesa number.
        </p>
      </form>

      {/* History */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-bold mb-3">📜 Withdrawal history</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No withdrawals yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3 text-sm">
                <div>
                  <p className="font-bold">KSh {w.ksh_amount}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {new Date(w.created_at).toLocaleString()} · {w.phone_number}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                  ${w.status === "paid" ? "bg-primary/20 text-primary"
                    : w.status === "rejected" ? "bg-destructive/20 text-destructive"
                    : "bg-yellow-500/20 text-yellow-500"}`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
