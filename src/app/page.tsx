import { redirect } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function Home() {
  const session = await getSession();
  if (session) {
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (user) redirect("/dashboard");
    await clearSession();
  }
  redirect("/login");
}
