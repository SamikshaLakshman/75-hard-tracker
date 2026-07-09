"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartChallenge({ displayName }: { displayName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    await fetch("/api/challenge", { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4">
      <span className="text-6xl">🔥</span>
      <div>
        <h2 className="text-headline-lg text-accent">Ready, {displayName}?</h2>
        <p className="text-stat-label text-muted-foreground mt-2 max-w-sm mx-auto">
          75 days. Zero excuses. Your streak starts the moment you hit the button below — not a second before.
        </p>
      </div>
      <button
        onClick={handleStart}
        disabled={loading}
        className="bg-accent text-black font-bold px-10 py-4 rounded-xl text-label-caps tracking-wider hover:brightness-110 active:scale-95 transition-all accent-glow disabled:opacity-50"
      >
        {loading ? "STARTING..." : "🔥 START 75 HARD"}
      </button>
    </div>
  );
}
