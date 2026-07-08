"use client";

import { useState, useCallback } from "react";
import ChecklistItem from "@/components/checklist/checklist-item";
import ProgressRing from "@/components/checklist/progress-ring";
import { DAILY_TASKS, getTodayQuote } from "@/lib/utils";
import type { DailyLogData, UserProfile } from "@/types";

interface Props {
  user: UserProfile;
  challengeId: string;
  dayNumber: number;
  currentStreak: number;
  todayLog: DailyLogData | null;
}

const EMPTY_LOG: DailyLogData = {
  workout1: false, workout2: false, outdoorWorkout: false,
  steps: null, waterOz: null, proteinG: null, fiberG: null,
  weightLbs: null, readingDone: false, sleepHours: null,
  mood: null, notes: null,
};

export default function DashboardClient({ user, challengeId, dayNumber, currentStreak, todayLog }: Props) {
  const [log, setLog] = useState<DailyLogData>(todayLog || EMPTY_LOG);
  const [saving, setSaving] = useState(false);
  const quote = getTodayQuote();

  const completedCount = DAILY_TASKS.filter((t) => {
    const v = log[t.key as keyof DailyLogData];
    return v === true || (typeof v === "number" && v > 0) || (typeof v === "string" && v.length > 0);
  }).length;
  const percentage = Math.round((completedCount / DAILY_TASKS.length) * 100);

  const handleChange = useCallback((key: string, value: string | number | boolean | null) => {
    setLog((prev) => ({ ...prev, [key]: value }));
  }, []);

  async function handleSave() {
    setSaving(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await fetch("/api/daily-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, date: today.toISOString(), dayNumber, ...log }),
    });
    setSaving(false);
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Profile + XP bar — mobile only, desktop shows in sidebar */}
      <section className="lg:hidden flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-accent flex items-center justify-center text-accent font-bold">
            {(user.displayName || user.email)[0].toUpperCase()}
          </div>
          <div>
            <p className="text-label-caps text-muted-foreground">{user.title.toUpperCase()}</p>
            <p className="text-headline-md leading-none">{user.displayName || user.username || "Athlete"}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-label-caps text-accent">LEVEL {user.level}</p>
          <p className="text-stat-label text-muted-foreground">{user.xp} XP</p>
        </div>
      </section>

      {/* Streak + Quote — responsive grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="glass-card rounded-xl p-6 flex items-center justify-between relative overflow-hidden">
          <div className="z-10">
            <p className="text-label-caps text-muted-foreground mb-1">CURRENT STREAK</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display-stat text-accent">{currentStreak || dayNumber}</span>
              <span className="text-headline-md text-foreground">DAYS</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-6xl md:text-7xl text-accent opacity-80 z-10"
            style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[140px] text-accent"
              style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          </div>
        </div>

        <div className="bg-accent rounded-xl p-5 flex flex-col justify-center">
          <span className="material-symbols-outlined text-black/70 mb-1">format_quote</span>
          <p className="text-body-lg text-black leading-tight italic">{quote}</p>
        </div>
      </section>

      {/* Progress Ring */}
      <section className="flex justify-center py-2">
        <ProgressRing percentage={percentage} size={220} strokeWidth={10} />
      </section>

      {/* Checklist */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-label-caps text-muted-foreground">DAILY PROTOCOL</h3>
          <span className="text-label-caps text-accent">{completedCount}/{DAILY_TASKS.length} COMPLETE</span>
        </div>

        <div className="space-y-2.5">
          {DAILY_TASKS.map((task) => (
            <ChecklistItem
              key={task.key}
              icon={task.icon}
              label={task.label}
              subtitle={task.subtitle}
              type={task.type}
              checked={
                log[task.key as keyof DailyLogData] === true ||
                (typeof log[task.key as keyof DailyLogData] === "number" && (log[task.key as keyof DailyLogData] as number) > 0)
              }
              value={log[task.key as keyof DailyLogData]}
              onChange={(val) => handleChange(task.key, val)}
            />
          ))}
        </div>
      </section>

      {/* Save Button */}
      <section className="pb-4">
        <button onClick={handleSave} disabled={saving}
          className="w-full bg-accent text-black font-bold py-4 rounded-xl text-label-caps tracking-wider hover:brightness-110 active:scale-[0.98] transition-all accent-glow disabled:opacity-50">
          {saving ? "SAVING..." : percentage === 100 ? "DAY COMPLETE — SAVE" : "SAVE PROGRESS"}
        </button>
      </section>
    </div>
  );
}
