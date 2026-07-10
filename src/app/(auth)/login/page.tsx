"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", identifier, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-5 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[150px]" />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        <div className="text-center space-y-4">
          <img src="/logo.svg" alt="Forge75" className="mx-auto w-16 h-16 rounded-2xl" />
          <h1 className="text-headline-lg text-accent tracking-tighter">FORGE75</h1>
          <p className="text-label-caps tracking-[0.3em] text-muted-foreground uppercase">Discipline Over Motivation</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-headline-md text-center">Sign In</h2>

          {error && <p className="text-danger text-sm text-center bg-danger/10 rounded-lg py-2">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-label-caps text-muted-foreground block mb-2">EMAIL OR USERNAME</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-surface-container-high border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-label-caps text-muted-foreground">PASSWORD</label>
                <Link href="/forgot-password" className="text-label-caps text-accent hover:underline">
                  FORGOT?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-high border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent focus:outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-black font-bold py-3 rounded-xl text-label-caps tracking-wider hover:brightness-110 active:scale-95 transition-all accent-glow disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/signup" className="text-accent hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
