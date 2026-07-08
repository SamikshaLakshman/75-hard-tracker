import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword, createToken, setSession, clearSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, email, password, username } = body;

  if (action === "signup") {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    if (username) {
      const usernameTaken = await prisma.user.findUnique({ where: { username } });
      if (usernameTaken) return NextResponse.json({ error: "Username already taken" }, { status: 400 });
}

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed, username, displayName: username },
    });
    await prisma.userSettings.create({ data: { userId: user.id } });

    const token = await createToken(user.id, user.role);
    await setSession(token);
    return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username } });
  }

  if (action === "login") {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await createToken(user.id, user.role);
    await setSession(token);
    return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username } });
  }

  if (action === "logout") {
    await clearSession();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
