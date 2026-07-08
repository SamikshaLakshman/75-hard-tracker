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

export const DAILY_TASKS = [
  { key: "workout1", label: "Workout 1", icon: "fitness_center", subtitle: "45 Minutes", type: "boolean" },
  { key: "workout2", label: "Workout 2", icon: "exercise", subtitle: "45 Minutes", type: "boolean" },
  { key: "outdoorWorkout", label: "Outdoor Workout", icon: "forest", subtitle: "One workout must be outdoor", type: "boolean" },
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
