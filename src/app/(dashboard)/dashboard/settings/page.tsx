"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
  }, []);

  function toggleTheme(newTheme: string) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <h2 className="text-headline-md">Settings</h2>

      {/* Theme Toggle */}
      <section className="glass-card rounded-xl p-5">
        <h3 className="text-label-caps text-muted-foreground mb-4">THEME</h3>
        <div className="flex gap-3">
          {["dark", "light"].map((t) => (
            <button key={t} onClick={() => toggleTheme(t)}
              className={`flex-1 py-3 rounded-xl font-bold text-label-caps transition-all ${
                theme === t
                  ? "bg-accent text-black"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}>
              {t === "dark" ? "🌙 DARK" : "☀️ LIGHT"}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card rounded-xl divide-y divide-border">
        {[
          { icon: "notifications", label: "Notifications", value: "On" },
          { icon: "download", label: "Export CSV", value: "" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-muted-foreground">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
            <span className="text-stat-label text-muted-foreground">{item.value}</span>
          </div>
        ))}
      </section>

      <button onClick={handleLogout}
        className="w-full glass-card rounded-xl py-4 text-danger font-bold text-center hover:bg-danger/10 transition-colors">
        Sign Out
      </button>
    </div>
  );
}