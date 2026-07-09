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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(challenge.startDate);
  startDate.setHours(0, 0, 0, 0);
  const dayNumber = Math.floor((today.getTime() - startDate.getTime()) / 86400000) + 1;

  const todayLog = challenge.dailyLogs.find((l) => {
    const ld = new Date(l.date);
    ld.setHours(0, 0, 0, 0);
    return ld.getTime() === today.getTime();
  });

  return (
    <DashboardClient
      user={user}
      challengeId={challenge.id}
      dayNumber={dayNumber}
      currentStreak={challenge.currentDay}
      todayLog={todayLog ? {
        workout1: todayLog.workout1,
        workout2: todayLog.workout2,
        outdoorWorkout: todayLog.outdoorWorkout,
        steps: todayLog.steps,
        waterOz: todayLog.waterOz,
        proteinG: todayLog.proteinG,
        fiberG: todayLog.fiberG,
        weightLbs: todayLog.weightLbs,
        readingDone: todayLog.readingDone,
        sleepHours: todayLog.sleepHours,
        mood: todayLog.mood,
        notes: todayLog.notes,
      } : null}
    />
  );
}
