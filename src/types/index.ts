export interface DailyLogData {
  workout1: boolean;
  workout2: boolean;
  outdoorWorkout: boolean;
  steps: number | null;
  waterOz: number | null;
  proteinG: number | null;
  fiberG: number | null;
  weightLbs: number | null;
  readingDone: boolean;
  sleepHours: number | null;
  mood: number | null;
  notes: string | null;
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
}
