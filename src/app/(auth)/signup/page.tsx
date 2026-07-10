"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!agreed) { setError("You must agree to the Terms & Conditions to continue"); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters"); return; }

    setLoading(true);
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", ...form }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-5 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <img src="/logo.svg" alt="Forge75" className="mx-auto w-14 h-14 rounded-2xl" />
          <h1 className="text-headline-lg text-accent tracking-tighter">Start Your Journey</h1>
          <p className="text-stat-label text-muted-foreground">75 days. Zero excuses. Total transformation.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-5">
          {error && <p className="text-danger text-sm text-center bg-danger/10 rounded-lg py-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-label-caps text-muted-foreground block mb-2">USERNAME</label>
              <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-surface-container-high border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent focus:outline-none" required />
            </div>
            <div>
              <label className="text-label-caps text-muted-foreground block mb-2">EMAIL</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-surface-container-high border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent focus:outline-none" required />
            </div>
            <div>
              <label className="text-label-caps text-muted-foreground block mb-2">PASSWORD</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-surface-container-high border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent focus:outline-none" required />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-accent"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" target="_blank" className="text-accent hover:underline">
                  Terms & Conditions
                </Link>
                , including the policy on account suspension for misbehavior.
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full bg-accent text-black font-bold py-3 rounded-xl text-label-caps tracking-wider hover:brightness-110 active:scale-95 transition-all accent-glow disabled:opacity-50">
              {loading ? "CREATING..." : "BEGIN 75 HARD"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already started? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
