"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-5 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <img src="/logo.svg" alt="Forge75" className="mx-auto w-14 h-14 rounded-2xl" />
          <h1 className="text-headline-lg text-accent">Reset Password</h1>
          <p className="text-stat-label text-muted-foreground">Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-5">
          {sent ? (
            <div className="text-center space-y-3">
              <span className="text-4xl">✉️</span>
              <p className="text-stat-label text-muted-foreground">
                If an account exists for <strong className="text-foreground">{email}</strong>, a reset link has been sent. Check your inbox — and your spam folder.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-label-caps text-muted-foreground block mb-2">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-high border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-black font-bold py-3 rounded-xl text-label-caps tracking-wider hover:brightness-110 active:scale-95 transition-all accent-glow disabled:opacity-50"
              >
                {loading ? "SENDING..." : "SEND RESET LINK"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-accent hover:underline">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
