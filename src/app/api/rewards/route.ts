import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isSameDay } from "@/lib/xp";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const challenge = await prisma.challenge.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
  });

  const streak = challenge?.currentDay || 0;

  // Check if today's log is complete (required to spin)
  let todayComplete = false;
  if (challenge) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const log = await prisma.dailyLog.findUnique({
      where: { challengeId_date: { challengeId: challenge.id, date: today } },
    });
    todayComplete = log?.isComplete || false;
  }

  const alreadySpunToday = user.lastSpinAt ? isSameDay(new Date(user.lastSpinAt), new Date()) : false;
  const canSpin = todayComplete && !alreadySpunToday;

  return NextResponse.json({
    streak,
    xp: user.xp,
    level: user.level,
    title: user.title,
    shields: user.shields,
    skipTokens: user.skipTokens,
    doubleXpActive: user.doubleXpActive,
    activeTheme: user.activeTheme,
    canSpin,
    alreadySpunToday,
    lastSpinPrize: alreadySpunToday ? user.lastSpinPrize : null,
  });
}
