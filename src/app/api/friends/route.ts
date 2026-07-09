import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET — returns accepted friends, incoming requests, and outgoing (sent) requests
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [sentAccepted, receivedAccepted, incoming, outgoing] = await Promise.all([
    prisma.friendship.findMany({
      where: { userId: session.userId, status: "ACCEPTED" },
      include: { friend: { select: { id: true, username: true, displayName: true, xp: true, level: true, title: true } } },
    }),
    prisma.friendship.findMany({
      where: { friendId: session.userId, status: "ACCEPTED" },
      include: { user: { select: { id: true, username: true, displayName: true, xp: true, level: true, title: true } } },
    }),
    prisma.friendship.findMany({
      where: { friendId: session.userId, status: "PENDING" },
      include: { user: { select: { id: true, username: true, displayName: true, xp: true, level: true, title: true } } },
    }),
    prisma.friendship.findMany({
      where: { userId: session.userId, status: "PENDING" },
      include: { friend: { select: { id: true, username: true, displayName: true, xp: true, level: true, title: true } } },
    }),
  ]);

  const friends = [
    ...sentAccepted.map((f) => f.friend),
    ...receivedAccepted.map((f) => f.user),
  ];

  return NextResponse.json({
    friends,
    incomingRequests: incoming.map((r) => r.user),
    outgoingRequests: outgoing.map((r) => r.friend),
  });
}

// POST — send a friend request (status PENDING, not instantly accepted)
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

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { userId: session.userId, friendId: found.id },
        { userId: found.id, friendId: session.userId },
      ],
    },
  });

  if (existing) {
    if (existing.status === "ACCEPTED") return NextResponse.json({ error: "Already friends" }, { status: 400 });
    if (existing.userId === session.userId) return NextResponse.json({ error: "Request already sent" }, { status: 400 });
    return NextResponse.json({ error: "This user already sent you a request — check your requests" }, { status: 400 });
  }

  await prisma.friendship.create({
    data: { userId: session.userId, friendId: found.id, status: "PENDING" },
  });

  return NextResponse.json({ ok: true, user: found });
}

// PATCH — accept or decline an incoming request
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { requesterId, action } = await req.json();
  if (!requesterId || !["accept", "decline"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const request = await prisma.friendship.findUnique({
    where: { userId_friendId: { userId: requesterId, friendId: session.userId } },
  });
  if (!request || request.status !== "PENDING") {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (action === "accept") {
    await prisma.friendship.update({
      where: { userId_friendId: { userId: requesterId, friendId: session.userId } },
      data: { status: "ACCEPTED" },
    });
  } else {
    await prisma.friendship.delete({
      where: { userId_friendId: { userId: requesterId, friendId: session.userId } },
    });
  }

  return NextResponse.json({ ok: true });
}

// DELETE — remove a friend, or cancel a request you sent
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { friendId } = await req.json();
  if (!friendId) return NextResponse.json({ error: "friendId required" }, { status: 400 });

  await prisma.friendship.deleteMany({
    where: {
      OR: [
        { userId: session.userId, friendId },
        { userId: friendId, friendId: session.userId },
      ],
    },
  });

  return NextResponse.json({ ok: true });
}
