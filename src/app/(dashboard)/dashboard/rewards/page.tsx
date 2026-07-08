"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: "obsidian", name: "Obsidian", description: "OLED black + Electric Lime", unlockAt: 0, accent: "#C3F400", preview: ["#000000", "#111111"] },
  { id: "inferno", name: "Inferno", description: "Black + Orange flame", unlockAt: 7, accent: "#FF6B00", preview: ["#0D0000", "#1a0500"] },
  { id: "cryo", name: "Cryo", description: "Black + Ice blue", unlockAt: 14, accent: "#00D4FF", preview: ["#000D0F", "#001a1f"] },
  { id: "phantom", name: "Phantom", description: "Black + Neon purple", unlockAt: 21, accent: "#BF5FFF", preview: ["#08000D", "#12001a"] },
  { id: "champion", name: "Champion", description: "Black + Gold prestige", unlockAt: 30, accent: "#FFD700", preview: ["#0D0A00", "#1a1400"] },
  { id: "bloodline", name: "Bloodline", description: "Black + Crimson red", unlockAt: 45, accent: "#FF2244", preview: ["#0D0003", "#1a0008"] },
  { id: "legend", name: "Legend", description: "Animated rainbow — 75 days only", unlockAt: 75, accent: "#ffffff", preview: ["#ff0080", "#7928ca"] },
];

const SPIN_PRIZES = [
  { label: "100 XP", icon: "⚡", color: "#C3F400" },
  { label: "200 XP", icon: "💥", color: "#FFD700" },
  { label: "Double XP", icon: "🔥", color: "#FF6B00" },
  { label: "Streak Shield", icon: "🛡️", color: "#00D4FF" },
  { label: "Mystery Badge", icon: "🎖️", color: "#BF5FFF" },
  { label: "Skip 1 Task", icon: "⏭️", color: "#FF2244" },
  { label: "50 XP", icon: "✨", color: "#888888" },
  { label: "500 XP", icon: "👑", color: "#FFD700" },
];

const BONUS_CHALLENGES = [
  { id: 1, icon: "🧊", title: "Cold Shower", description: "End your shower with 60 seconds of cold water", xp: 50, difficulty: "HARD" },
  { id: 2, icon: "📵", title: "No Phone Morning", description: "No phone for the first hour after waking up", xp: 30, difficulty: "MEDIUM" },
  { id: 3, icon: "💧", title: "Water First", description: "Drink a full glass of water before your first coffee", xp: 20, difficulty: "EASY" },
  { id: 4, icon: "✍️", title: "Gratitude Journal", description: "Write 3 things you are grateful for today", xp: 25, difficulty: "EASY" },
  { id: 5, icon: "🚫", title: "Zero Sugar", description: "No added sugar in any meal today", xp: 60, difficulty: "HARD" },
  { id: 6, icon: "🌅", title: "Sunrise Witness", description: "Wake up and watch the sunrise", xp: 45, difficulty: "HARD" },
  { id: 7, icon: "🧘", title: "5 Min Meditation", description: "Sit in silence for 5 minutes before bed", xp: 25, difficulty: "EASY" },
  { id: 8, icon: "📞", title: "Accountability Call", description: "Call someone who motivates you", xp: 35, difficulty: "MEDIUM" },
];

const TIERED_ACHIEVEMENTS = [
  {
    category: "Hydration",
    icon: "💧",
    tiers: [
      { name: "Bronze", days: 7, color: "#CD7F32", unlocked: true },
      { name: "Silver", days: 14, color: "#C0C0C0", unlocked: true },
      { name: "Gold", days: 30, color: "#FFD700", unlocked: false },
      { name: "Platinum", days: 75, color: "#E5E4E2", unlocked: false },
    ],
  },
  {
    category: "Reading",
    icon: "📚",
    tiers: [
      { name: "Bronze", days: 7, color: "#CD7F32", unlocked: true },
      { name: "Silver", days: 14, color: "#C0C0C0", unlocked: false },
      { name: "Gold", days: 30, color: "#FFD700", unlocked: false },
      { name: "Platinum", days: 75, color: "#E5E4E2", unlocked: false },
    ],
  },
  {
    category: "Workouts",
    icon: "💪",
    tiers: [
      { name: "Bronze", days: 7, color: "#CD7F32", unlocked: true },
      { name: "Silver", days: 14, color: "#C0C0C0", unlocked: true },
      { name: "Gold", days: 30, color: "#FFD700", unlocked: false },
      { name: "Platinum", days: 75, color: "#E5E4E2", unlocked: false },
    ],
  },
  {
    category: "Consistency",
    icon: "🔥",
    tiers: [
      { name: "Bronze", days: 7, color: "#CD7F32", unlocked: true },
      { name: "Silver", days: 14, color: "#C0C0C0", unlocked: true },
      { name: "Gold", days: 30, color: "#FFD700", unlocked: false },
      { name: "Platinum", days: 75, color: "#E5E4E2", unlocked: false },
    ],
  },
];

const TITLE_PROGRESSION = [
  { level: 1, title: "Recruit", icon: "🪖" },
  { level: 5, title: "Soldier", icon: "⚔️" },
  { level: 10, title: "Specialist", icon: "🎯" },
  { level: 15, title: "Operator", icon: "🔱" },
  { level: 20, title: "Warrior", icon: "🛡️" },
  { level: 30, title: "Veteran", icon: "🏅" },
  { level: 40, title: "Elite", icon: "💎" },
  { level: 50, title: "Legend", icon: "👑" },
];

// Today's bonus challenge (rotates daily)
function getTodayBonus() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return BONUS_CHALLENGES[dayOfYear % BONUS_CHALLENGES.length];
}

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState<"themes" | "spin" | "shields" | "bonus" | "achievements" | "titles">("themes");
  const [currentTheme, setCurrentTheme] = useState("obsidian");
  const [currentStreak] = useState(30); // from props in real app
  const [currentLevel] = useState(15);
  const [shields, setShields] = useState(2);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<typeof SPIN_PRIZES[0] | null>(null);
  const [spinAngle, setSpinAngle] = useState(0);
  const [canSpin] = useState(true); // true if all tasks done today
  const [bonusDone, setBonusDone] = useState(false);
  const [bonusXP, setBonusXP] = useState(0);
  const todayBonus = getTodayBonus();

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("75hard-theme") || "obsidian";
    setCurrentTheme(saved);
  }, []);

  function applyTheme(theme: typeof THEMES[0]) {
    if (theme.unlockAt > currentStreak) return;
    setCurrentTheme(theme.id);
    localStorage.setItem("75hard-theme", theme.id);

    // Apply CSS variables
    document.documentElement.style.setProperty("--theme-accent", theme.accent);
    document.documentElement.style.setProperty("--background", theme.preview[0]);

    // Special legend animation
    if (theme.id === "legend") {
      document.documentElement.classList.add("theme-legend");
    } else {
      document.documentElement.classList.remove("theme-legend");
    }
  }

  function spinWheel() {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setSpinResult(null);

    const totalWeight = SPIN_PRIZES.reduce((s, p) => s + 12, 0);
    let rand = Math.random() * totalWeight;
    let chosen = SPIN_PRIZES[0];
    for (const prize of SPIN_PRIZES) {
      rand -= 12;
      if (rand <= 0) { chosen = prize; break; }
    }

    const baseAngle = 360 * 5; // 5 full spins
    const prizeIndex = SPIN_PRIZES.indexOf(chosen);
    const prizeAngle = (prizeIndex / SPIN_PRIZES.length) * 360;
    const finalAngle = spinAngle + baseAngle + (360 - prizeAngle);

    setSpinAngle(finalAngle);
    setTimeout(() => {
      setSpinning(false);
      setSpinResult(chosen);
      if (chosen.label === "Streak Shield") setShields((s) => s + 1);
    }, 3500);
  }

  function completeBonus() {
    setBonusDone(true);
    setBonusXP(todayBonus.xp);
  }

  const TABS = [
    { id: "themes", label: "Themes", icon: "🎨" },
    { id: "spin", label: "Spin", icon: "🎰" },
    { id: "shields", label: "Shields", icon: "🛡️" },
    { id: "bonus", label: "Bonus", icon: "💪" },
    { id: "achievements", label: "Tiers", icon: "🎖️" },
    { id: "titles", label: "Titles", icon: "👑" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-headline-md">Rewards</h2>
        <p className="text-stat-label text-muted-foreground mt-1">Day {currentStreak} streak · Level {currentLevel}</p>
      </div>

      {/* Tabs */}
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
              const unlocked = currentStreak >= theme.unlockAt;
              const active = currentTheme === theme.id;
              return (
                <div key={theme.id}
                  onClick={() => applyTheme(theme)}
                  className={cn(
                    "relative rounded-2xl p-5 cursor-pointer transition-all border-2 overflow-hidden",
                    active ? "border-accent scale-[1.02]" : "border-border hover:border-white/30",
                    !unlocked && "opacity-50 cursor-not-allowed"
                  )}>
                  {/* BG preview */}
                  <div className="absolute inset-0 opacity-40"
                    style={{ background: `linear-gradient(135deg, ${theme.preview[0]}, ${theme.preview[1]})` }} />

                  {/* Legend rainbow animation */}
                  {theme.id === "legend" && unlocked && (
                    <div className="absolute inset-0 opacity-30 animate-pulse"
                      style={{ background: "linear-gradient(90deg, #ff0080, #ff8c00, #ffe000, #00ff80, #00cfff, #7928ca, #ff0080)", backgroundSize: "200% 100%" }} />
                  )}

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
            <p className="text-stat-label text-muted-foreground">Complete all tasks today to earn a spin</p>
          </div>

          {/* Wheel */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 text-2xl">▼</div>

              {/* Wheel SVG */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl"
                style={{ transform: `rotate(${spinAngle}deg)`, transition: spinning ? "transform 3.5s cubic-bezier(0.17,0.67,0.12,0.99)" : "none" }}>
                {SPIN_PRIZES.map((prize, i) => {
                  const angle = (360 / SPIN_PRIZES.length);
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

            <button onClick={spinWheel} disabled={spinning || !canSpin}
              className={cn(
                "px-10 py-4 rounded-xl font-bold text-label-caps tracking-wider transition-all",
                canSpin && !spinning
                  ? "bg-accent text-black hover:brightness-110 active:scale-95 accent-glow"
                  : "bg-surface-container text-muted-foreground cursor-not-allowed"
              )}>
              {spinning ? "SPINNING..." : spinResult ? "SPIN AGAIN TOMORROW" : canSpin ? "🎰 SPIN NOW" : "COMPLETE ALL TASKS TO SPIN"}
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

      {/* ─── STREAK SHIELDS ─── */}
      {activeTab === "shields" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 text-center border-2 border-info/40">
            <p className="text-6xl mb-3">🛡️</p>
            <p className="text-display-stat text-info">{shields}</p>
            <p className="text-label-caps text-muted-foreground mt-1">SHIELDS AVAILABLE</p>
            <p className="text-stat-label text-muted-foreground mt-3 max-w-xs mx-auto">
              If you miss a day, a shield automatically activates and saves your streak. No restart needed.
            </p>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-label-caps text-muted-foreground mb-4">HOW TO EARN SHIELDS</h3>
            <div className="space-y-3">
              {[
                { icon: "🎰", text: "Win one from the Daily Spin Wheel" },
                { icon: "📅", text: "Complete 7 days in a row (1 shield)" },
                { icon: "🏆", text: "Reach a new level milestone" },
                { icon: "💎", text: "Complete a bonus challenge 5 days straight" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-stat-label">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="text-label-caps text-muted-foreground mb-3">SHIELD HISTORY</h3>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: shields }).map((_, i) => (
                <div key={i} className="w-12 h-12 rounded-xl bg-info/20 border border-info/40 flex items-center justify-center text-2xl">🛡️</div>
              ))}
              {shields === 0 && <p className="text-muted-foreground text-stat-label">No shields yet. Spin the wheel to earn one!</p>}
            </div>
          </div>
        </div>
      )}

      {/* ─── BONUS CHALLENGES ─── */}
      {activeTab === "bonus" && (
        <div className="space-y-4">
          {/* Today's challenge */}
          <div className={cn("rounded-2xl p-6 border-2 transition-all", bonusDone ? "border-accent bg-accent/10" : "glass-card border-accent/40")}>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-label-caps text-accent">TODAY&apos;S BONUS</span>
              <span className={cn("text-label-caps px-2 py-0.5 rounded-full text-xs",
                todayBonus.difficulty === "EASY" ? "bg-success/20 text-success" :
                todayBonus.difficulty === "MEDIUM" ? "bg-warning/20 text-warning" : "bg-danger/20 text-danger"
              )}>{todayBonus.difficulty}</span>
            </div>
            <p className="text-4xl my-3">{todayBonus.icon}</p>
            <h3 className="text-headline-md">{todayBonus.title}</h3>
            <p className="text-stat-label text-muted-foreground mt-1">{todayBonus.description}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-label-caps text-accent">+{todayBonus.xp} XP</span>
              {bonusDone ? (
                <span className="text-label-caps text-success font-bold">✓ COMPLETED +{bonusXP} XP</span>
              ) : (
                <button onClick={completeBonus}
                  className="bg-accent text-black px-5 py-2 rounded-xl font-bold text-label-caps hover:brightness-110 active:scale-95 transition-all">
                  MARK DONE
                </button>
              )}
            </div>
          </div>

          {/* All bonus challenges */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-label-caps text-muted-foreground mb-4">ALL BONUS CHALLENGES</h3>
            <div className="space-y-2">
              {BONUS_CHALLENGES.map((c) => (
                <div key={c.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <span className="text-2xl w-8 text-center">{c.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{c.title}</p>
                    <p className="text-stat-label text-muted-foreground">{c.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-label-caps text-accent">+{c.xp} XP</p>
                    <span className={cn("text-[10px] font-bold",
                      c.difficulty === "EASY" ? "text-success" :
                      c.difficulty === "MEDIUM" ? "text-warning" : "text-danger"
                    )}>{c.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TIERED ACHIEVEMENTS ─── */}
      {activeTab === "achievements" && (
        <div className="space-y-4">
          <p className="text-stat-label text-muted-foreground">Each category has 4 tiers. Unlock higher tiers by maintaining consistency longer.</p>
          {TIERED_ACHIEVEMENTS.map((cat) => (
            <div key={cat.category} className="glass-card rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-headline-md">{cat.category}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cat.tiers.map((tier) => (
                  <div key={tier.name}
                    className={cn("rounded-xl p-4 text-center border-2 transition-all",
                      tier.unlocked ? "border-transparent" : "border-border opacity-40"
                    )}
                    style={tier.unlocked ? { background: `${tier.color}15`, borderColor: `${tier.color}40` } : {}}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-xl border-2"
                      style={tier.unlocked ? { background: `${tier.color}30`, borderColor: tier.color } : { borderColor: "#333" }}>
                      {tier.unlocked ? "✓" : "🔒"}
                    </div>
                    <p className="font-bold text-sm" style={tier.unlocked ? { color: tier.color } : {}}>{tier.name}</p>
                    <p className="text-label-caps text-muted-foreground mt-1">{tier.days} DAYS</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── TITLE PROGRESSION ─── */}
      {activeTab === "titles" && (
        <div className="space-y-4">
          <p className="text-stat-label text-muted-foreground">Your title updates automatically as you level up. Current level: {currentLevel}</p>
          <div className="space-y-3">
            {TITLE_PROGRESSION.map((t, i) => {
              const unlocked = currentLevel >= t.level;
              const current = currentLevel >= t.level && (i === TITLE_PROGRESSION.length - 1 || currentLevel < TITLE_PROGRESSION[i + 1].level);
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
