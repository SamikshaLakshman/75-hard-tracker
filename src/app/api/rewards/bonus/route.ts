import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { applyXP } from "@/lib/xp";
import { BONUS_CHALLENGES } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { challengeId } = await req.json();
  const challenge = BONUS_CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) return NextResponse.json({ error: "Invalid challenge" }, { status: 400 });

  const result = await applyXP(session.userId, challenge.xp);
  return NextResponse.json({ ok: true, xpEarned: challenge.xp, ...result });
}
