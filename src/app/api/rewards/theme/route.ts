import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { THEMES } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { themeId } = await req.json();
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return NextResponse.json({ error: "Invalid theme" }, { status: 400 });

  const challenge = await prisma.challenge.findFirst({ where: { userId: session.userId, status: "ACTIVE" } });
  const streak = challenge?.currentDay || 0;

  if (streak < theme.unlockAt) {
    return NextResponse.json({ error: `Reach day ${theme.unlockAt} to unlock this theme` }, { status: 400 });
  }

  await prisma.user.update({ where: { id: session.userId }, data: { activeTheme: themeId } });
  return NextResponse.json({ ok: true, activeTheme: themeId });
}
