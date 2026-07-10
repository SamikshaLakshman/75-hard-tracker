export interface DailyLogData {
  workout1: boolean;
  workout2: boolean;
  outdoorWorkout: boolean;
  steps: number | null;
  waterLiters: number | null;
  proteinG: number | null;
  fiberG: number | null;
  weightLbs: number | null;
  readingDone: boolean;
  sleepHours: number | null;
  mood: number | null;
  notes: string | null;
}

// A daily log entry that also carries its date — used when the client
// needs to pick out "today's" entry itself from a list (avoids server/client timezone mismatches)
export interface DailyLogWithDate extends DailyLogData {
  date: string; // ISO date string, e.g. "2026-07-10"
  dayNumber: number;
  isComplete: boolean;
}

export interface ChallengeData {
  id: string;
  startDate: string;
  status: "ACTIVE" | "COMPLETED" | "FAILED";
  currentDay: number;
  maxStreak: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  xp: number;
  level: number;
  title: string;
  role?: "USER" | "ADMIN";
}
