import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateResetToken } from "@/lib/auth";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });

  // Same response whether or not the account exists — avoids leaking which emails are registered
  const genericResponse = { ok: true, message: "If that email exists, a reset link has been sent." };
  if (!user) return NextResponse.json(genericResponse);

  const token = generateResetToken();
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  if (resend) {
    try {
      await resend.emails.send({
        from: "Forge75 <onboarding@resend.dev>",
        to: email,
        subject: "Reset your Forge75 password",
        html: `
          <p>Someone requested a password reset for your Forge75 account.</p>
          <p><a href="${resetUrl}">Click here to reset your password</a> — this link expires in 1 hour.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    } catch (err) {
      console.error("Resend email failed:", err);
    }
  }

  // Always log server-side too — lets you test the flow before email is fully configured
  console.log(`[Password Reset] Link for ${email}: ${resetUrl}`);

  return NextResponse.json(genericResponse);
}
