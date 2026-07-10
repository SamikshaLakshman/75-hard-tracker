import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(level: number): number {
  return level * level * 100;
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return "Legend";
  if (level >= 40) return "Elite";
  if (level >= 30) return "Veteran";
  if (level >= 20) return "Warrior";
  if (level >= 15) return "Operator";
  if (level >= 10) return "Specialist";
  if (level >= 5) return "Soldier";
  return "Recruit";
}

// Workout 2 is always the outdoor workout per official 75 Hard rules —
// one indoor, one outdoor, no separate "outdoor confirmation" checkbox.
export const DAILY_TASKS = [
  { key: "workout1", label: "Workout 1 — Indoor", icon: "fitness_center", subtitle: "45 Minutes · Any exercise", type: "boolean" },
  { key: "workout2", label: "Workout 2 — Outdoor", icon: "forest", subtitle: "45 Minutes · Must be outside", type: "boolean" },
  { key: "steps", label: "Steps", icon: "directions_walk", subtitle: "Daily step count", type: "number" },
  { key: "waterOz", label: "Water Intake", icon: "water_drop", subtitle: "Target: 128 oz (1 gallon)", type: "number" },
  { key: "proteinG", label: "Protein", icon: "egg_alt", subtitle: "Grams consumed", type: "number" },
  { key: "fiberG", label: "Fiber", icon: "nutrition", subtitle: "Grams consumed", type: "number" },
  { key: "weightLbs", label: "Weight", icon: "monitor_weight", subtitle: "Daily weigh-in", type: "number" },
  { key: "readingDone", label: "10 Pages Reading", icon: "menu_book", subtitle: "Non-fiction only", type: "boolean" },
  { key: "sleepHours", label: "Sleep", icon: "bedtime", subtitle: "Hours slept", type: "number" },
  { key: "mood", label: "Mood", icon: "sentiment_satisfied", subtitle: "Rate 1-5", type: "mood" },
  { key: "notes", label: "Notes", icon: "edit_note", subtitle: "Daily reflection", type: "text" },
] as const;

export const MOTIVATIONAL_QUOTES = [
  "Discipline is doing what needs to be done, even if you don't want to do it.",
  "The only easy day was yesterday.",
  "Hard choices, easy life. Easy choices, hard life.",
  "You don't have to be extreme, just consistent.",
  "Mental toughness is not about the absence of struggle — it's the mastery of it.",
  "Day by day, what you choose, what you think and what you do is who you become.",
  "Suffer the pain of discipline or suffer the pain of regret.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "The difference between who you are and who you want to be is what you do.",
  "Stop wishing. Start doing.",
];

export function getTodayQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

// ─── Rewards data (shared between rewards page + API) ───
export const THEMES = [
  { id: "obsidian", name: "Obsidian", description: "OLED black + Electric Lime", unlockAt: 0, accent: "#C3F400", preview: ["#000000", "#111111"] },
  { id: "inferno", name: "Inferno", description: "Black + Orange flame", unlockAt: 7, accent: "#FF6B00", preview: ["#0D0000", "#1a0500"] },
  { id: "cryo", name: "Cryo", description: "Black + Ice blue", unlockAt: 14, accent: "#00D4FF", preview: ["#000D0F", "#001a1f"] },
  { id: "phantom", name: "Phantom", description: "Black + Neon purple", unlockAt: 21, accent: "#BF5FFF", preview: ["#08000D", "#12001a"] },
  { id: "champion", name: "Champion", description: "Black + Gold prestige", unlockAt: 30, accent: "#FFD700", preview: ["#0D0A00", "#1a1400"] },
  { id: "bloodline", name: "Bloodline", description: "Black + Crimson red", unlockAt: 45, accent: "#FF2244", preview: ["#0D0003", "#1a0008"] },
  { id: "legend", name: "Legend", description: "Animated rainbow — 75 days only", unlockAt: 75, accent: "#ffffff", preview: ["#ff0080", "#7928ca"] },
] as const;

export const SPIN_PRIZES = [
  { label: "50 XP", icon: "✨", color: "#888888", xp: 50 },
  { label: "100 XP", icon: "⚡", color: "#C3F400", xp: 100 },
  { label: "200 XP", icon: "💥", color: "#FFD700", xp: 200 },
  { label: "Double XP", icon: "🔥", color: "#FF6B00", xp: 0 },
  { label: "Streak Shield", icon: "🛡️", color: "#00D4FF", xp: 0 },
  { label: "Mystery Badge", icon: "🎖️", color: "#BF5FFF", xp: 0 },
  { label: "Skip 1 Task", icon: "⏭️", color: "#FF2244", xp: 0 },
  { label: "500 XP", icon: "👑", color: "#FFD700", xp: 500 },
] as const;

export const BONUS_CHALLENGES = [
  { id: 1, icon: "🧊", title: "Cold Shower", description: "End your shower with 60 seconds of cold water", xp: 50, difficulty: "HARD" },
  { id: 2, icon: "📵", title: "No Phone Morning", description: "No phone for the first hour after waking up", xp: 30, difficulty: "MEDIUM" },
  { id: 3, icon: "💧", title: "Water First", description: "Drink a full glass of water before your first coffee", xp: 20, difficulty: "EASY" },
  { id: 4, icon: "✍️", title: "Gratitude Journal", description: "Write 3 things you are grateful for today", xp: 25, difficulty: "EASY" },
  { id: 5, icon: "🚫", title: "Zero Sugar", description: "No added sugar in any meal today", xp: 60, difficulty: "HARD" },
  { id: 6, icon: "🌅", title: "Sunrise Witness", description: "Wake up and watch the sunrise", xp: 45, difficulty: "HARD" },
  { id: 7, icon: "🧘", title: "5 Min Meditation", description: "Sit in silence for 5 minutes before bed", xp: 25, difficulty: "EASY" },
  { id: 8, icon: "📞", title: "Accountability Call", description: "Call someone who motivates you", xp: 35, difficulty: "MEDIUM" },
  { id: 9, icon: "🍱", title: "Meal Prep Tomorrow", description: "Prep your meals for tomorrow tonight so nothing derails your diet", xp: 35, difficulty: "MEDIUM" },
] as const;

export const TITLE_PROGRESSION = [
  { level: 1, title: "Recruit", icon: "🪖" },
  { level: 5, title: "Soldier", icon: "⚔️" },
  { level: 10, title: "Specialist", icon: "🎯" },
  { level: 15, title: "Operator", icon: "🔱" },
  { level: 20, title: "Warrior", icon: "🛡️" },
  { level: 30, title: "Veteran", icon: "🏅" },
  { level: 40, title: "Elite", icon: "💎" },
  { level: 50, title: "Legend", icon: "👑" },
] as const;
