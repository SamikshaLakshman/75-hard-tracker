import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const friendships = await prisma.friendship.findMany({
    where: { userId: session.userId, status: "ACCEPTED" },
    include: {
      friend: {
        select: { id: true, username: true, displayName: true, xp: true, level: true, title: true },
      },
    },
  });

  return NextResponse.json({ friends: friendships.map((f) => f.friend) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username } = await req.json();
  if (!username || !username.trim()) {
    return NextResponse.json({ error: "Enter a username" }, { status: 400 });
  }

  const found = await prisma.user.findUnique({
    where: { username: username.trim() },
    select: { id: true, username: true, displayName: true, xp: true, level: true, title: true },
  });

  if (!found) return NextResponse.json({ error: "No user found with that username" }, { status: 404 });
  if (found.id === session.userId) return NextResponse.json({ error: "You can't add yourself" }, { status: 400 });

  const existing = await prisma.friendship.findUnique({
    where: { userId_friendId: { userId: session.userId, friendId: found.id } },
  });
  if (existing) return NextResponse.json({ error: "Already in your friends list" }, { status: 400 });

  await prisma.friendship.create({
    data: { userId: session.userId, friendId: found.id, status: "ACCEPTED" },
  });

  return NextResponse.json({ ok: true, user: found });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { friendId } = await req.json();
  if (!friendId) return NextResponse.json({ error: "friendId required" }, { status: 400 });

  await prisma.friendship.deleteMany({
    where: { userId: session.userId, friendId },
  });

  return NextResponse.json({ ok: true });
}
