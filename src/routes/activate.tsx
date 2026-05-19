import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/activate")({
  head: () => ({
    meta: [
      { title: "Activate Account — POPKID MD" },
      { name: "description", content: "Activate your POPKID MD account with a one-time KSh 200 M-Pesa payment." },
    ],
  }),
  component: ActivatePage,
});

type Step = "phone" | "pending" | "done";

function ActivatePage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<Step>("phone");
  const [loading, setLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("activated, phone_number")
        .eq("id", data.session.user.id)
        .maybeSingle();
      if (profile?.activated) {
        navigate({ to: "/community" });
      } else if (profile?.phone_number) {
        setPhone(profile.phone_number);
      }
    });
  }, [navigate]);

  const sendStk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("mpesa-activate", {
        body: { action: "stk", phone },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.message || "STK push failed");
      setCheckoutId(data.checkout_request_id ?? null);
      setStep("pending");
      toast.success("Check your phone and enter your M-Pesa PIN");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send STK push");
    } finally {
      setLoading(false);
    }
  };

  const confirmPaid = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("mpesa-activate", {
        body: { action: "confirm" },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.message || "Could not confirm");
      setStep("done");
      toast.success("Account activated! 🎉");
      setTimeout(() => navigate({ to: "/community" }), 800);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full glass rounded-3xl p-8 shadow-glow">
        <h1 className="font-display text-3xl font-black text-center">
          <span className="text-gradient">Activate Your Account</span>
        </h1>
        <p className="text-center text-muted-foreground text-sm mt-2">
          One-time KSh <span className="font-bold text-primary">200</span> via M-Pesa
        </p>

        {step === "phone" && (
          <form onSubmit={sendStk} className="mt-8 space-y-4">
            <label className="block text-sm font-medium">M-Pesa Phone Number</label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678"
              inputMode="tel"
              className="w-full rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-neon py-3 font-bold text-primary-foreground shadow-neon hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Pay KSh 200 with M-Pesa"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              You'll receive an STK push prompt on your phone.
            </p>
          </form>
        )}

        {step === "pending" && (
          <div className="mt-8 space-y-5 text-center">
            <div className="mx-auto h-16 w-16 animate-pulse rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl">📲</span>
            </div>
            <p className="text-sm">
              Enter your M-Pesa PIN on <span className="font-bold">{phone}</span> to complete the
              KSh 200 payment.
            </p>
            {checkoutId && (
              <p className="text-xs text-muted-foreground break-all">Ref: {checkoutId}</p>
            )}
            <button
              onClick={confirmPaid}
              disabled={loading}
              className="w-full rounded-xl bg-gradient-neon py-3 font-bold text-primary-foreground shadow-neon hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "I have completed payment"}
            </button>
            <button
              onClick={() => setStep("phone")}
              className="w-full text-sm text-muted-foreground hover:text-primary"
            >
              Use a different number
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="mt-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-3xl">✅</span>
            </div>
            <p className="mt-4 font-bold">Activated! Redirecting…</p>
          </div>
        )}
      </div>
    </div>
  );
}
