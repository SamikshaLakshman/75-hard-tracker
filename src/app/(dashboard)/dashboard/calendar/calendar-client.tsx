"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface LogEntry { date: string; isComplete: boolean; completedCount: number; }

export default function CalendarClient({ logs, startDate }: { logs: LogEntry[]; startDate: string }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const logMap = useMemo(() => new Map(logs.map((l) => [l.date, l])), [logs]);
  const today = new Date().toISOString().split("T")[0];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  function getColor(dateStr: string) {
    if (dateStr === today) return "bg-info text-white";
    const log = logMap.get(dateStr);
    if (!log) return "bg-surface-container";
    if (log.isComplete) return "bg-accent text-black";
    if (log.completedCount >= 6) return "bg-accent/60 text-black";
    if (log.completedCount >= 1) return "bg-warning/60 text-black";
    return "bg-danger/40";
  }

  // Heatmap — last 75 days
  const heatmapDays = useMemo(() => {
    const days = [];
    const start = new Date(startDate);
    for (let i = 0; i < 75; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().split("T")[0];
      const log = logMap.get(ds);
      let intensity = 0;
      if (log) intensity = log.isComplete ? 4 : Math.min(Math.ceil(log.completedCount / 3), 3);
      days.push({ date: ds, intensity });
    }
    return days;
  }, [startDate, logMap]);

  const heatColors = ["bg-surface-container", "bg-accent/20", "bg-accent/40", "bg-accent/70", "bg-accent"];

  return (
    <div className="space-y-8">
      <h2 className="text-headline-md">Calendar & History</h2>

      {/* Heatmap */}
      <section className="glass-card rounded-xl p-5">
        <h3 className="text-label-caps text-muted-foreground mb-4">75-DAY HEATMAP</h3>
        <div className="flex flex-wrap gap-1.5">
          {heatmapDays.map((d) => (
            <div key={d.date} title={d.date}
              className={cn("w-5 h-5 md:w-6 md:h-6 rounded-sm transition-colors", heatColors[d.intensity],
                d.date === today && "ring-2 ring-info")} />
          ))}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-label-caps text-muted-foreground text-[10px]">LESS</span>
          {heatColors.map((c, i) => <div key={i} className={cn("w-4 h-4 rounded-sm", c)} />)}
          <span className="text-label-caps text-muted-foreground text-[10px]">MORE</span>
        </div>
      </section>

      {/* Monthly Calendar */}
      <section className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1))}
            className="text-muted-foreground hover:text-foreground transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h3 className="text-headline-md">{monthName}</h3>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1))}
            className="text-muted-foreground hover:text-foreground transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-label-caps text-muted-foreground py-2 text-[10px]">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            return (
              <div key={day} className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-all hover:scale-105",
                getColor(dateStr)
              )}>
                {day}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 mt-4 text-[11px]">
          {[
            { color: "bg-accent", label: "Complete" },
            { color: "bg-warning/60", label: "Partial" },
            { color: "bg-danger/40", label: "Failed" },
            { color: "bg-surface-container", label: "Not Started" },
            { color: "bg-info", label: "Today" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-sm", s.color)} />
              <span className="text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
