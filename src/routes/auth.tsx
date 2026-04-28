import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — POPKID MD" },
      { name: "description", content: "Sign in or create your POPKID MD account to chat and post reviews." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/community" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/community`;
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: redirectUrl, data: { display_name: name || email.split("@")[0] } },
        });
        if (error) throw error;
        toast.success("Welcome to POPKID! 🎉");
        navigate({ to: "/community" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/community" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full glass rounded-3xl p-8 shadow-glow">
        <h1 className="font-display text-3xl font-black text-center">
          <span className="text-gradient">{mode === "signin" ? "Welcome Back" : "Join POPKID"}</span>
        </h1>
        <p className="text-center text-muted-foreground text-sm mt-2">
          {mode === "signin" ? "Sign in to chat & review" : "Create your free account"}
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name"
                   className="w-full rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          )}
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                 className="w-full rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6)"
                 className="w-full rounded-xl bg-input px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          <button disabled={loading}
                  className="w-full rounded-xl bg-gradient-neon py-3 font-bold text-primary-foreground shadow-neon hover:opacity-90 disabled:opacity-50">
            {loading ? "..." : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="mt-6 w-full text-sm text-muted-foreground hover:text-primary">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
