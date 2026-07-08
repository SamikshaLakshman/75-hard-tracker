import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProgressClient from "./progress-client";

export default async function ProgressPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const challenge = await prisma.challenge.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
    include: { dailyLogs: { orderBy: { date: "asc" } } },
  });

  const logs = challenge?.dailyLogs.map((l) => ({
    date: l.date.toISOString().split("T")[0],
    dayNumber: l.dayNumber,
    waterOz: l.waterOz,
    weightLbs: l.weightLbs,
    sleepHours: l.sleepHours,
    steps: l.steps,
    isComplete: l.isComplete,
    mood: l.mood,
  })) || [];

  return <ProgressClient logs={logs} />;
}
