"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Friend {
  id: string;
  username: string | null;
  displayName: string | null;
  xp: number;
  level: number;
  title: string;
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((d) => setFriends(d.friends || []))
      .finally(() => setFetching(false));
  }, []);

  async function handleAdd() {
    if (!search.trim()) return;
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: search.trim() }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error);
    setSuccess(`${data.user.displayName || data.user.username} added!`);
    setSearch("");
    setFriends((prev) => [...prev, data.user]);
  }

  async function handleRemove(friendId: string) {
    setRemovingId(friendId);
    const res = await fetch("/api/friends", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });
    if (res.ok) {
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
    }
    setRemovingId(null);
  }

  const sorted = [...friends].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6">
      <h2 className="text-headline-md">Friends & Leaderboard</h2>

      <div className="glass-card rounded-xl p-4 space-y-3">
        <p className="text-label-caps text-muted-foreground">ADD BY USERNAME</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. sarahfitness"
            className="flex-1 bg-surface-container-high border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent focus:outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-accent text-black px-5 rounded-lg font-bold text-label-caps hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "..." : "ADD"}
          </button>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        {success && <p className="text-success text-sm">✓ {success}</p>}
      </div>

      {fetching ? (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">Loading friends...</div>
      ) : sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((friend, i) => (
            <div key={friend.id} className="glass-card rounded-xl p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  i === 0 ? "bg-[#FFD700] text-black" : i === 1 ? "bg-[#C0C0C0] text-black" : i === 2 ? "bg-[#CD7F32] text-black" : "bg-surface-container-high text-muted-foreground"
                )}>
                  {i + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold">
                  {(friend.displayName || friend.username || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{friend.displayName || friend.username}</p>
                  <p className="text-label-caps text-muted-foreground">{friend.title.toUpperCase()} · LVL {friend.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-extrabold text-accent">{friend.xp.toLocaleString()}</p>
                  <p className="text-label-caps text-muted-foreground">XP</p>
                </div>
                <button
                  onClick={() => handleRemove(friend.id)}
                  disabled={removingId === friend.id}
                  title="Remove friend"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">
                    {removingId === friend.id ? "hourglass_empty" : "close"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4 block">group_add</span>
          <p className="text-headline-md text-muted-foreground">No friends yet</p>
          <p className="text-stat-label text-muted-foreground mt-2">Add a friend above by their username to compare progress.</p>
        </div>
      )}
    </div>
  );
}
