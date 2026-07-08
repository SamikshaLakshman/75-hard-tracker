"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { THEMES, SPIN_PRIZES, BONUS_CHALLENGES, TITLE_PROGRESSION } from "@/lib/utils";

interface RewardsData {
  streak: number;
  xp: number;
  level: number;
  title: string;
  shields: number;
  skipTokens: number;
  doubleXpActive: boolean;
  activeTheme: string;
  canSpin: boolean;
  alreadySpunToday: boolean;
  lastSpinPrize: string | null;
}

function todaysBonusDoneKey(id: number) {
  const today = new Date().toISOString().split("T")[0];
  return `bonus-${id}-${today}`;
}

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<"themes" | "spin" | "shields" | "bonus" | "achievements" | "titles">("themes");
  const [data, setData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<typeof SPIN_PRIZES[number] | null>(null);
  const [spinAngle, setSpinAngle] = useState(0);
  const [doneBonusIds, setDoneBonusIds] = useState<number[]>([]);

  async function loadData() {
    const res = await fetch("/api/rewards");
    const d = await res.json();
    setData(d);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // Load which bonus challenges were already done today (client-side tracked)
    const done = BONUS_CHALLENGES.filter((c) => localStorage.getItem(todaysBonusDoneKey(c.id))).map((c) => c.id);
    setDoneBonusIds(done);
  }, []);

  async function applyTheme(theme: typeof THEMES[number]) {
    if (!data || data.streak < theme.unlockAt) return;
    const res = await fetch("/api/rewards/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeId: theme.id }),
    });
    if (res.ok) {
      setData((prev) => (prev ? { ...prev, activeTheme: theme.id } : prev));
      document.documentElement.style.setProperty("--theme-accent", theme.accent);
    }
  }

  async function spinWheel() {
    if (!data?.canSpin || spinning) return;
    setSpinning(true);
    setSpinResult(null);

    const res = await fetch("/api/rewards/spin", { method: "POST" });
    const result = await res.json();

    if (!res.ok) {
      setSpinning(false);
      alert(result.error);
      return;
    }

    const prizeIndex = SPIN_PRIZES.findIndex((p) => p.label === result.prize.label);
    const baseAngle = 360 * 5;
    const prizeAngle = (prizeIndex / SPIN_PRIZES.length) * 360;
    const finalAngle = spinAngle + baseAngle + (360 - prizeAngle);
    setSpinAngle(finalAngle);

    setTimeout(() => {
      setSpinning(false);
      setSpinResult(result.prize);
      loadData(); // refresh streak/xp/shields/etc
    }, 3500);
  }

  async function completeBonus(id: number, xp: number) {
    if (doneBonusIds.includes(id)) return;
    const res = await fetch("/api/rewards/bonus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId: id }),
    });
    if (res.ok) {
      localStorage.setItem(todaysBonusDoneKey(id), "1");
      setDoneBonusIds((prev) => [...prev, id]);
      loadData();
    }
  }

  const TABS = [
    { id: "themes", label: "Themes", icon: "🎨" },
    { id: "spin", label: "Spin", icon: "🎰" },
    { id: "shields", label: "Shields", icon: "🛡️" },
    { id: "bonus", label: "Bonus", icon: "💪" },
    { id: "achievements", label: "Tiers", icon: "🎖️" },
    { id: "titles", label: "Titles", icon: "👑" },
  ] as const;

  if (loading || !data) {
    return <div className="text-center py-20 text-muted-foreground">Loading rewards...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-md">Rewards</h2>
        <p className="text-stat-label text-muted-foreground mt-1">Day {data.streak} streak · Level {data.level} · {data.title}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-label-caps whitespace-nowrap transition-all",
              activeTab === tab.id ? "bg-accent text-black font-bold" : "glass-card text-muted-foreground hover:text-foreground"
            )}>
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── THEMES ─── */}
      {activeTab === "themes" && (
        <div className="space-y-4">
          <p className="text-stat-label text-muted-foreground">Unlock themes by reaching streak milestones. Click to apply.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {THEMES.map((theme) => {
              const unlocked = data.streak >= theme.unlockAt;
              const active = data.activeTheme === theme.id;
              return (
                <div key={theme.id}
                  onClick={() => applyTheme(theme)}
                  className={cn(
                    "relative rounded-2xl p-5 cursor-pointer transition-all border-2 overflow-hidden",
                    active ? "border-accent scale-[1.02]" : "border-border hover:border-white/30",
                    !unlocked && "opacity-50 cursor-not-allowed"
                  )}>
                  <div className="absolute inset-0 opacity-40"
                    style={{ background: `linear-gradient(135deg, ${theme.preview[0]}, ${theme.preview[1]})` }} />
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full mb-3 border-2 border-white/20"
                      style={{ background: theme.accent, boxShadow: `0 0 15px ${theme.accent}44` }} />
                    <p className="font-bold text-white">{theme.name}</p>
                    <p className="text-stat-label text-white/60 mt-1">{theme.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-label-caps text-white/50">
                        {theme.unlockAt === 0 ? "DEFAULT" : `DAY ${theme.unlockAt}`}
                      </span>
                      {!unlocked ? (
                        <span className="text-label-caps text-white/40">🔒 LOCKED</span>
                      ) : active ? (
                        <span className="text-label-caps font-bold" style={{ color: theme.accent }}>✓ ACTIVE</span>
                      ) : (
                        <span className="text-label-caps text-white/60">TAP TO APPLY</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SPIN WHEEL ─── */}
      {activeTab === "spin" && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5 text-center">
            <p className="text-label-caps text-muted-foreground mb-1">DAILY SPIN</p>
            <p className="text-stat-label text-muted-foreground">
              {data.alreadySpunToday
                ? "You already spun today — come back tomorrow"
                : "Complete all of today's tasks to earn a spin"}
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 text-2xl">▼</div>
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl"
                style={{ transform: `rotate(${spinAngle}deg)`, transition: spinning ? "transform 3.5s cubic-bezier(0.17,0.67,0.12,0.99)" : "none" }}>
                {SPIN_PRIZES.map((prize, i) => {
                  const angle = 360 / SPIN_PRIZES.length;
                  const startAngle = i * angle;
                  const endAngle = startAngle + angle;
                  const start = { x: 100 + 100 * Math.cos((startAngle - 90) * Math.PI / 180), y: 100 + 100 * Math.sin((startAngle - 90) * Math.PI / 180) };
                  const end = { x: 100 + 100 * Math.cos((endAngle - 90) * Math.PI / 180), y: 100 + 100 * Math.sin((endAngle - 90) * Math.PI / 180) };
                  const midAngle = startAngle + angle / 2 - 90;
                  const textX = 100 + 65 * Math.cos(midAngle * Math.PI / 180);
                  const textY = 100 + 65 * Math.sin(midAngle * Math.PI / 180);
                  return (
                    <g key={i}>
                      <path d={`M 100 100 L ${start.x} ${start.y} A 100 100 0 0 1 ${end.x} ${end.y} Z`}
                        fill={prize.color} stroke="#000" strokeWidth="1" opacity="0.9" />
                      <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle"
                        fontSize="14" transform={`rotate(${startAngle + angle / 2}, ${textX}, ${textY})`}>
                        {prize.icon}
                      </text>
                    </g>
                  );
                })}
                <circle cx="100" cy="100" r="12" fill="#000" stroke="#C3F400" strokeWidth="2" />
              </svg>
            </div>

            {spinResult && !spinning && (
              <div className="glass-card rounded-2xl p-6 text-center w-full max-w-sm border-2 border-accent">
                <p className="text-4xl mb-2">{spinResult.icon}</p>
                <p className="text-headline-md text-accent">{spinResult.label}</p>
                <p className="text-stat-label text-muted-foreground mt-1">Added to your account!</p>
              </div>
            )}

            {!spinResult && data.alreadySpunToday && data.lastSpinPrize && (
              <div className="glass-card rounded-2xl p-6 text-center w-full max-w-sm">
                <p className="text-stat-label text-muted-foreground">Today&apos;s spin result:</p>
                <p className="text-headline-md text-accent mt-1">{data.lastSpinPrize}</p>
              </div>
            )}

            <button onClick={spinWheel} disabled={spinning || !data.canSpin}
              className={cn(
                "px-10 py-4 rounded-xl font-bold text-label-caps tracking-wider transition-all",
                data.canSpin && !spinning
                  ? "bg-accent text-black hover:brightness-110 active:scale-95 accent-glow"
                  : "bg-surface-container text-muted-foreground cursor-not-allowed"
              )}>
              {spinning ? "SPINNING..." : data.alreadySpunToday ? "COME BACK TOMORROW" : data.canSpin ? "🎰 SPIN NOW" : "COMPLETE TODAY'S TASKS TO SPIN"}
            </button>

            <div className="glass-card rounded-xl p-4 w-full">
              <h4 className="text-label-caps text-muted-foreground mb-3">PRIZES</h4>
              <div className="grid grid-cols-2 gap-2">
                {SPIN_PRIZES.map((p) => (
                  <div key={p.label} className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <span className="text-stat-label">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SHIELDS ─── */}
      {activeTab === "shields" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 text-center border-2 border-info/40">
            <p className="text-6xl mb-3">🛡️</p>
            <p className="text-display-stat text-info">{data.shields}</p>
            <p className="text-label-caps text-muted-foreground mt-1">SHIELDS AVAILABLE</p>
            <p className="text-stat-label text-muted-foreground mt-3 max-w-xs mx-auto">
              If you miss a day, a shield automatically activates and saves your streak.
            </p>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-label-caps text-muted-foreground mb-4">HOW TO EARN SHIELDS</h3>
            <div className="space-y-3">
              {[
                { icon: "🎰", text: "Win one from the Daily Spin Wheel" },
                { icon: "📅", text: "Complete 7 days in a row (1 shield)" },
                { icon: "🏆", text: "Reach a new level milestone" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-stat-label">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-label-caps text-muted-foreground mb-3">YOUR SHIELDS</h3>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: data.shields }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-xl bg-info/20 border border-info/40 flex items-center justify-center text-2xl">🛡️</div>
              ))}
              {data.shields === 0 && <p className="text-muted-foreground text-stat-label">No shields yet. Spin the wheel to earn one!</p>}
            </div>
          </div>

          {data.skipTokens > 0 && (
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-label-caps text-muted-foreground mb-3">SKIP TOKENS ({data.skipTokens})</h3>
              <p className="text-stat-label text-muted-foreground">Use these to skip one task on a hard day.</p>
            </div>
          )}
        </div>
      )}

      {/* ─── BONUS CHALLENGES ─── */}
      {activeTab === "bonus" && (
        <div className="space-y-4">
          <p className="text-stat-label text-muted-foreground">Pick any bonus challenges you want to complete today. Optional — for extra XP.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BONUS_CHALLENGES.map((c) => {
              const done = doneBonusIds.includes(c.id);
              return (
                <div key={c.id} className={cn("glass-card rounded-xl p-4 transition-all", done && "border-accent/50 bg-accent/5")}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{c.title}</p>
                      <span className={cn("text-[10px] font-bold",
                        c.difficulty === "EASY" ? "text-success" :
                        c.difficulty === "MEDIUM" ? "text-warning" : "text-danger"
                      )}>{c.difficulty}</span>
                    </div>
                  </div>
                  <p className="text-stat-label text-muted-foreground mb-3">{c.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-label-caps text-accent">+{c.xp} XP</span>
                    {done ? (
                      <span className="text-label-caps text-success font-bold">✓ DONE</span>
                    ) : (
                      <button onClick={() => completeBonus(c.id, c.xp)}
                        className="bg-accent text-black px-4 py-1.5 rounded-lg font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all">
                        MARK DONE
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── ACHIEVEMENT TIERS ─── */}
      {activeTab === "achievements" && (
        <div className="glass-card rounded-xl p-8 text-center">
          <p className="text-headline-md text-muted-foreground mb-2">See your unlocked badges</p>
          <p className="text-stat-label text-muted-foreground">Head to your Profile page to view all earned achievements and tiers.</p>
        </div>
      )}

      {/* ─── TITLES ─── */}
      {activeTab === "titles" && (
        <div className="space-y-4">
          <p className="text-stat-label text-muted-foreground">Your title updates automatically as you level up. Current level: {data.level}</p>
          <div className="space-y-3">
            {TITLE_PROGRESSION.map((t, i) => {
              const unlocked = data.level >= t.level;
              const current = data.level >= t.level && (i === TITLE_PROGRESSION.length - 1 || data.level < TITLE_PROGRESSION[i + 1].level);
              return (
                <div key={t.title}
                  className={cn(
                    "glass-card rounded-xl p-4 flex items-center gap-5 border-2 transition-all",
                    current ? "border-accent" : unlocked ? "border-success/30" : "border-border opacity-40"
                  )}>
                  <span className="text-3xl">{t.icon}</span>
                  <div className="flex-1">
                    <p className={cn("text-headline-md", current && "text-accent")}>{t.title}</p>
                    <p className="text-label-caps text-muted-foreground">LEVEL {t.level}+</p>
                  </div>
                  {current && <span className="text-label-caps text-accent font-bold">← YOU</span>}
                  {unlocked && !current && <span className="text-success text-xl">✓</span>}
                  {!unlocked && <span className="text-muted-foreground text-xl">🔒</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
