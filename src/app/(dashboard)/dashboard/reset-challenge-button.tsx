"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetChallengeButton({ hasActiveChallenge }: { hasActiveChallenge: boolean }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setLoading(true);
    await fetch("/api/challenge", { method: "DELETE" });
    setLoading(false);
    setConfirming(false);
    router.push("/dashboard");
    router.refresh();
  }

  if (!hasActiveChallenge) {
    return (
      <p className="text-stat-label text-muted-foreground text-center">
        No active challenge to reset. Go to the dashboard to start one.
      </p>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="w-full glass-card rounded-xl py-3 text-danger font-bold text-label-caps hover:bg-danger/10 transition-colors"
      >
        Reset My Challenge
      </button>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 border-2 border-danger/40 space-y-3">
      <p className="text-sm text-center">
        Are you sure? This ends your current streak and can&apos;t be undone. You&apos;ll need to start a new challenge from the dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setConfirming(false)}
          className="flex-1 py-2 rounded-lg glass-card text-stat-label"
        >
          Cancel
        </button>
        <button
          onClick={handleReset}
          disabled={loading}
          className="flex-1 py-2 rounded-lg bg-danger text-white font-bold text-stat-label disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Yes, Reset"}
        </button>
      </div>
    </div>
  );
}
