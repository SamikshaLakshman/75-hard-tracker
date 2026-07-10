"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface LogEntry {
  date: string; dayNumber: number; waterLiters: number | null;
  weightLbs: number | null; sleepHours: number | null;
  steps: number | null; isComplete: boolean; mood: number | null;
}

export default function ProgressClient({ logs }: { logs: LogEntry[] }) {
  const completedDays = logs.filter((l) => l.isComplete).length;
  const totalDays = logs.length;
  const avgWater = logs.filter((l) => l.waterLiters).reduce((s, l) => s + (l.waterLiters || 0), 0) / (logs.filter((l) => l.waterLiters).length || 1);
  const avgSleep = logs.filter((l) => l.sleepHours).reduce((s, l) => s + (l.sleepHours || 0), 0) / (logs.filter((l) => l.sleepHours).length || 1);

  const chartData = logs.map((l) => ({
    day: `D${l.dayNumber}`,
    weight: l.weightLbs,
    water: l.waterLiters,
    sleep: l.sleepHours,
    steps: l.steps,
    mood: l.mood,
  }));

  const stats = [
    { label: "DAYS COMPLETED", value: completedDays, icon: "check_circle" },
    { label: "COMPLETION RATE", value: totalDays ? `${Math.round((completedDays / totalDays) * 100)}%` : "0%", icon: "percent" },
    { label: "AVG WATER (L)", value: avgWater.toFixed(1), icon: "water_drop" },
    { label: "AVG SLEEP (HRS)", value: avgSleep.toFixed(1), icon: "bedtime" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-headline-md">Progress & Insights</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <span className="material-symbols-outlined text-accent mb-2 block">{s.icon}</span>
            <p className="text-2xl md:text-3xl font-extrabold text-foreground">{s.value}</p>
            <p className="text-label-caps text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weight Trend */}
      {chartData.some((d) => d.weight) && (
        <section className="glass-card rounded-xl p-5">
          <h3 className="text-label-caps text-muted-foreground mb-4">WEIGHT TREND</h3>
          <div className="h-52 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 11 }} />
                <YAxis tick={{ fill: "#888", fontSize: 11 }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "#121212", border: "1px solid #333", borderRadius: 8 }} />
                <Line type="monotone" dataKey="weight" stroke="#C3F400" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Water & Sleep */}
      {chartData.some((d) => d.water || d.sleep) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <section className="glass-card rounded-xl p-5">
            <h3 className="text-label-caps text-muted-foreground mb-4">WATER INTAKE (L)</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#121212", border: "1px solid #333", borderRadius: 8 }} />
                  <Bar dataKey="water" fill="#C3F400" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="glass-card rounded-xl p-5">
            <h3 className="text-label-caps text-muted-foreground mb-4">SLEEP HOURS</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#888", fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: "#121212", border: "1px solid #333", borderRadius: 8 }} />
                  <Bar dataKey="sleep" fill="#60A5FA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      )}

      {logs.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4 block">bar_chart</span>
          <p className="text-headline-md text-muted-foreground">No data yet</p>
          <p className="text-stat-label text-muted-foreground mt-2">Start logging your daily tasks to see insights here.</p>
        </div>
      )}
    </div>
  );
}
