import { NextResponse } from "next/server";
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

// Start a brand new challenge — only called when the user explicitly clicks "Start"
export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.challenge.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
  });
  if (existing) {
    // Defensive — shouldn't normally happen since dashboard hides Start button once active
    await prisma.challenge.update({
      where: { id: existing.id },
      data: { status: "FAILED", endDate: new Date() },
    });
  }

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const challenge = await prisma.challenge.create({
    data: { userId: session.userId, startDate },
  });

  return NextResponse.json({ challenge });
}

// Reset — ends the current active challenge without starting a new one.
// User has to explicitly click "Start" again on the dashboard afterward.
export async function DELETE() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const active = await prisma.challenge.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
  });
  if (!active) return NextResponse.json({ error: "No active challenge to reset" }, { status: 400 });

  await prisma.challenge.update({
    where: { id: active.id },
    data: { status: "FAILED", endDate: new Date() },
  });

  return NextResponse.json({ ok: true });
}
