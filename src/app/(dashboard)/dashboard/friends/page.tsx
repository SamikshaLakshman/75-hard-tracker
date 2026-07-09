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
  const [incoming, setIncoming] = useState<Friend[]>([]);
  const [outgoing, setOutgoing] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadData() {
    const res = await fetch("/api/friends");
    const d = await res.json();
    setFriends(d.friends || []);
    setIncoming(d.incomingRequests || []);
    setOutgoing(d.outgoingRequests || []);
    setFetching(false);
  }

  useEffect(() => {
    loadData();
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
    setSuccess(`Request sent to ${data.user.displayName || data.user.username}`);
    setSearch("");
    setOutgoing((prev) => [...prev, data.user]);
  }

  async function respondToRequest(requesterId: string, action: "accept" | "decline") {
    setBusyId(requesterId);
    const res = await fetch("/api/friends", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requesterId, action }),
    });
    if (res.ok) await loadData();
    setBusyId(null);
  }

  async function cancelOrRemove(id: string) {
    setBusyId(id);
    const res = await fetch("/api/friends", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId: id }),
    });
    if (res.ok) await loadData();
    setBusyId(null);
  }

  const sorted = [...friends].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6">
      <h2 className="text-headline-md">Friends & Leaderboard</h2>

      {/* Add Friend */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <p className="text-label-caps text-muted-foreground">SEND FRIEND REQUEST</p>
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
            {loading ? "..." : "SEND"}
          </button>
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        {success && <p className="text-success text-sm">✓ {success}</p>}
      </div>

      {/* Incoming Requests */}
      {incoming.length > 0 && (
        <div className="glass-card rounded-xl p-4 space-y-3 border border-accent/30">
          <p className="text-label-caps text-accent">FRIEND REQUESTS ({incoming.length})</p>
          <div className="space-y-2">
            {incoming.map((req) => (
              <div key={req.id} className="flex items-center justify-between bg-surface-container-high rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-sm">
                    {(req.displayName || req.username || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{req.displayName || req.username}</p>
                    <p className="text-label-caps text-muted-foreground">{req.title.toUpperCase()} · LVL {req.level}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondToRequest(req.id, "accept")}
                    disabled={busyId === req.id}
                    className="bg-accent text-black px-3 py-1.5 rounded-lg font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    ACCEPT
                  </button>
                  <button
                    onClick={() => respondToRequest(req.id, "decline")}
                    disabled={busyId === req.id}
                    className="bg-surface-container-highest text-muted-foreground px-3 py-1.5 rounded-lg font-bold text-[11px] hover:text-danger transition-all disabled:opacity-50"
                  >
                    DECLINE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outgoing (Sent) Requests */}
      {outgoing.length > 0 && (
        <div className="glass-card rounded-xl p-4 space-y-3">
          <p className="text-label-caps text-muted-foreground">SENT — AWAITING RESPONSE ({outgoing.length})</p>
          <div className="space-y-2">
            {outgoing.map((req) => (
              <div key={req.id} className="flex items-center justify-between bg-surface-container-high rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground font-bold text-sm">
                    {(req.displayName || req.username || "?")[0].toUpperCase()}
                  </div>
                  <p className="font-bold text-sm">{req.displayName || req.username}</p>
                </div>
                <button
                  onClick={() => cancelOrRemove(req.id)}
                  disabled={busyId === req.id}
                  className="text-muted-foreground hover:text-danger text-[11px] font-bold transition-colors disabled:opacity-50"
                >
                  CANCEL
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends Leaderboard */}
      {fetching ? (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">Loading friends...</div>
      ) : sorted.length > 0 ? (
        <div className="space-y-3">
          <p className="text-label-caps text-muted-foreground px-1">YOUR FRIENDS</p>
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
                  onClick={() => cancelOrRemove(friend.id)}
                  disabled={busyId === friend.id}
                  title="Remove friend"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">
                    {busyId === friend.id ? "hourglass_empty" : "close"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : incoming.length === 0 && outgoing.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4 block">group_add</span>
          <p className="text-headline-md text-muted-foreground">No friends yet</p>
          <p className="text-stat-label text-muted-foreground mt-2">Send a request above by their username.</p>
        </div>
      ) : null}
    </div>
  );
}
