import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const challengeId = searchParams.get("challengeId");

  if (!challengeId) return NextResponse.json({ error: "challengeId required" }, { status: 400 });

  if (date) {
    const log = await prisma.dailyLog.findUnique({
      where: { challengeId_date: { challengeId, date: new Date(date) } },
    });
    return NextResponse.json({ log });
  }

  const logs = await prisma.dailyLog.findMany({
    where: { challengeId },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ logs });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { challengeId, date, dayNumber, ...data } = body;

  const booleanTasks = [data.workout1, data.workout2, data.outdoorWorkout, data.readingDone];
  const numberTasks = [data.steps, data.waterOz, data.proteinG, data.fiberG, data.weightLbs, data.sleepHours];
  const isComplete = booleanTasks.every(Boolean) && numberTasks.every((v: number | null) => v !== null && v > 0);

  let xpEarned = 0;
  Object.values(data).forEach((v) => { if (v === true || (typeof v === "number" && v > 0)) xpEarned += 10; });
  if (isComplete) xpEarned += 100;

  const log = await prisma.dailyLog.upsert({
    where: { challengeId_date: { challengeId, date: new Date(date) } },
    update: { ...data, isComplete, xpEarned, completedAt: isComplete ? new Date() : null },
    create: { challengeId, date: new Date(date), dayNumber, ...data, isComplete, xpEarned, completedAt: isComplete ? new Date() : null },
  });

  if (isComplete) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { xp: { increment: xpEarned } },
    });
    await prisma.challenge.update({
      where: { id: challengeId },
      data: { currentDay: dayNumber, maxStreak: { increment: 0 } },
    });
  }

  return NextResponse.json({ log });
}
