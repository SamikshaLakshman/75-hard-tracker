"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AdminUser {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  role: string;
  xp: number;
  level: number;
  title: string;
  createdAt: string;
  _count: { challenges: number; achievements: number; friendships: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function loadUsers(query = "") {
    setLoading(true);
    const res = await fetch(`/api/admin/users${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleDelete(userId: string) {
    setDeletingId(userId);
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
    setDeletingId(null);
    setConfirmId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-headline-md">User Management</h2>
        <Link href="/admin" className="text-muted-foreground hover:text-foreground text-stat-label flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Overview
        </Link>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadUsers(search)}
            placeholder="Search by email, username, or name"
            className="flex-1 bg-surface-container-high border border-border rounded-lg px-4 py-3 text-foreground focus:border-accent focus:outline-none"
          />
          <button
            onClick={() => loadUsers(search)}
            className="bg-warning text-black px-5 rounded-lg font-bold text-label-caps hover:brightness-110 transition-all"
          >
            SEARCH
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">No users found.</div>
      ) : (
        <div className="space-y-3">
          <p className="text-label-caps text-muted-foreground px-1">{users.length} USER{users.length !== 1 ? "S" : ""}</p>
          {users.map((u) => (
            <div key={u.id} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold">
                    {(u.displayName || u.username || u.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">{u.displayName || u.username || "—"}</p>
                      {u.role === "ADMIN" && (
                        <span className="text-[10px] font-bold bg-warning/20 text-warning px-1.5 py-0.5 rounded">ADMIN</span>
                      )}
                    </div>
                    <p className="text-stat-label text-muted-foreground">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-center">
                  <div>
                    <p className="text-sm font-bold text-accent">{u.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">XP · LVL {u.level}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{u._count.challenges}</p>
                    <p className="text-[10px] text-muted-foreground">ATTEMPTS</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{u._count.achievements}</p>
                    <p className="text-[10px] text-muted-foreground">BADGES</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{u._count.friendships}</p>
                    <p className="text-[10px] text-muted-foreground">FRIENDS</p>
                  </div>
                </div>

                {confirmId === u.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-stat-label text-muted-foreground px-3 py-1.5 rounded-lg glass-card"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={deletingId === u.id}
                      className="bg-danger text-white px-3 py-1.5 rounded-lg font-bold text-[11px] disabled:opacity-50"
                    >
                      {deletingId === u.id ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(u.id)}
                    className="text-muted-foreground hover:text-danger text-stat-label flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
