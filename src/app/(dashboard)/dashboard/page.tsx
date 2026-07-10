import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import DashboardClient from "./dashboard-client";
import StartChallenge from "./start-challenge";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, username: true, displayName: true, avatarUrl: true, xp: true, level: true, title: true },
  });
  if (!user) redirect("/login");

  const challenge = await prisma.challenge.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
    include: { dailyLogs: { orderBy: { date: "desc" } } },
  });

  // No active challenge — show the explicit Start screen instead of auto-creating one
  if (!challenge) {
    return <StartChallenge displayName={user.displayName || user.username || "Athlete"} />;
  }

  // IMPORTANT: we deliberately do NOT compute "today" or pick out today's log here on the
  // server. Vercel's server clock runs in UTC, which doesn't match the user's local day —
  // that mismatch was causing tasks to appear to reset mid-day. Instead we hand the client
  // every logged day, and the client (browser) determines "today" using its own local clock,
  // the same clock it uses when saving. That keeps save and display always in sync.
  const logs = challenge.dailyLogs.map((l) => ({
    date: l.date.toISOString().split("T")[0],
    dayNumber: l.dayNumber,
    isComplete: l.isComplete,
    workout1: l.workout1,
    workout2: l.workout2,
    outdoorWorkout: l.outdoorWorkout,
    steps: l.steps,
    waterLiters: l.waterLiters,
    proteinG: l.proteinG,
    fiberG: l.fiberG,
    weightLbs: l.weightLbs,
    readingDone: l.readingDone,
    sleepHours: l.sleepHours,
    mood: l.mood,
    notes: l.notes,
  }));

  return (
    <DashboardClient
      user={user}
      challengeId={challenge.id}
      challengeStartDate={challenge.startDate.toISOString()}
      currentStreak={challenge.currentDay}
      logs={logs}
    />
  );
}
