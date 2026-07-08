import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const challenge = await prisma.challenge.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
    include: { dailyLogs: { orderBy: { date: "desc" }, take: 75 } },
  });

  const past = await prisma.challenge.findMany({
    where: { userId: session.userId, status: { not: "ACTIVE" } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ active: challenge, past });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.challenge.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
  });
  if (existing) {
    await prisma.challenge.update({
      where: { id: existing.id },
      data: { status: "FAILED", endDate: new Date() },
    });
  }

  const challenge = await prisma.challenge.create({
    data: { userId: session.userId, startDate: new Date() },
  });

  return NextResponse.json({ challenge });
}
