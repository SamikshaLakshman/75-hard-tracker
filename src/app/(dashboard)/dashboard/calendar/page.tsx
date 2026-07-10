import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import CalendarClient from "./calendar-client";

export default async function CalendarPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const challenge = await prisma.challenge.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
    include: { dailyLogs: { orderBy: { date: "asc" } } },
  });

  const logs = challenge?.dailyLogs.map((l) => ({
    date: l.date.toISOString().split("T")[0],
    isComplete: l.isComplete,
    completedCount: [l.workout1, l.workout2, l.outdoorWorkout, l.readingDone].filter(Boolean).length +
      [l.steps, l.waterLiters, l.proteinG, l.fiberG, l.weightLbs, l.sleepHours].filter((v) => v && v > 0).length,
  })) || [];

  return <CalendarClient logs={logs} startDate={challenge?.startDate?.toISOString() || new Date().toISOString()} />;
}
