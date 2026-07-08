import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { applyXP, isSameDay } from "@/lib/xp";
import { SPIN_PRIZES } from "@/lib/utils";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Already spun today?
  if (user.lastSpinAt && isSameDay(new Date(user.lastSpinAt), new Date())) {
    return NextResponse.json({ error: "Already spun today. Come back tomorrow!" }, { status: 400 });
  }

  // Must have completed all tasks today to spin
  const challenge = await prisma.challenge.findFirst({ where: { userId: session.userId, status: "ACTIVE" } });
  if (!challenge) return NextResponse.json({ error: "No active challenge" }, { status: 400 });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const log = await prisma.dailyLog.findUnique({
    where: { challengeId_date: { challengeId: challenge.id, date: today } },
  });
  if (!log?.isComplete) {
    return NextResponse.json({ error: "Complete all of today's tasks to earn a spin" }, { status: 400 });
  }

  // Pick a random prize (equal weight)
  const prize = SPIN_PRIZES[Math.floor(Math.random() * SPIN_PRIZES.length)];

  // Apply prize effect
  if (prize.xp > 0) {
    await applyXP(session.userId, prize.xp);
  }
  if (prize.label === "Streak Shield") {
    await prisma.user.update({ where: { id: session.userId }, data: { shields: { increment: 1 } } });
  }
  if (prize.label === "Skip 1 Task") {
    await prisma.user.update({ where: { id: session.userId }, data: { skipTokens: { increment: 1 } } });
  }
  if (prize.label === "Double XP") {
    await prisma.user.update({ where: { id: session.userId }, data: { doubleXpActive: true } });
  }
  if (prize.label === "Mystery Badge") {
    const unlockedIds = (await prisma.userAchievement.findMany({ where: { userId: session.userId } })).map((a) => a.achievementId);
    const available = await prisma.achievement.findMany({ where: { id: { notIn: unlockedIds } } });
    if (available.length > 0) {
      const random = available[Math.floor(Math.random() * available.length)];
      await prisma.userAchievement.create({ data: { userId: session.userId, achievementId: random.id } });
      await applyXP(session.userId, random.xpReward);
    }
  }

  // Record spin timestamp so they can't spin again today
  await prisma.user.update({
    where: { id: session.userId },
    data: { lastSpinAt: new Date(), lastSpinPrize: prize.label },
  });

  return NextResponse.json({ prize });
}
