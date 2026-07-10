"use client";

import { cn } from "@/lib/utils";

interface ChecklistItemProps {
  icon: string;
  label: string;
  subtitle: string;
  type: "boolean" | "number" | "mood" | "text";
  checked: boolean;
  value: string | number | boolean | null;
  onChange: (value: string | number | boolean | null) => void;
  step?: number;
}

export default function ChecklistItem({ icon, label, subtitle, type, checked, value, onChange, step }: ChecklistItemProps) {
  if (type === "boolean") {
    return (
      <div className={cn("glass-card rounded-xl p-4 flex items-center justify-between transition-all cursor-pointer", checked && "active-glow")}
        onClick={() => onChange(!checked)}>
        <div className="flex items-center gap-4">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", checked ? "bg-accent/20 text-accent" : "bg-surface-container-high text-muted-foreground")}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <p className="font-bold text-foreground">{label}</p>
            <p className="text-stat-label text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
          checked ? "bg-accent border-accent" : "border-border hover:border-accent/50")}>
          {checked && <span className="material-symbols-outlined text-black text-lg font-bold">check</span>}
        </div>
      </div>
    );
  }

  if (type === "mood") {
    const moods = [1, 2, 3, 4, 5];
    const moodEmojis = ["😫", "😔", "😐", "🙂", "🔥"];
    return (
      <div className={cn("glass-card rounded-xl p-4 transition-all", value && "active-glow")}>
        <div className="flex items-center gap-4 mb-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", value ? "bg-accent/20 text-accent" : "bg-surface-container-high text-muted-foreground")}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <p className="font-bold text-foreground">{label}</p>
            <p className="text-stat-label text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-center">
          {moods.map((m, i) => (
            <button key={m} onClick={() => onChange(m)}
              className={cn("w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-all",
                value === m ? "bg-accent text-black scale-110" : "bg-surface-container-high hover:bg-surface-bright")}>
              {moodEmojis[i]}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className={cn("glass-card rounded-xl p-4 transition-all", value && "active-glow")}>
        <div className="flex items-center gap-4 mb-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", value ? "bg-accent/20 text-accent" : "bg-surface-container-high text-muted-foreground")}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <p className="font-bold text-foreground">{label}</p>
            <p className="text-stat-label text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <textarea value={value?.toString() || ""} onChange={(e) => onChange(e.target.value || null)}
          className="w-full bg-surface-container-high border border-border rounded-lg px-3 py-2 text-foreground text-sm resize-none h-20 focus:border-accent focus:outline-none"
          placeholder="How was your day?" />
      </div>
    );
  }

  // number type
  return (
    <div className={cn("glass-card rounded-xl p-4 flex items-center justify-between transition-all", value && "active-glow")}>
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", value ? "bg-accent/20 text-accent" : "bg-surface-container-high text-muted-foreground")}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className="font-bold text-foreground">{label}</p>
          <p className="text-stat-label text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <input type="number" step={step ?? 1} value={value?.toString() || ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="w-24 bg-surface-container-high border border-border rounded-lg px-3 py-2 text-right text-foreground font-bold focus:border-accent focus:outline-none"
        placeholder="0" />
    </div>
  );
}
