import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-nav border-b border-border flex justify-between items-center px-4 md:px-8 h-14">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-warning">shield_person</span>
          <span className="text-lg font-bold tracking-tight text-warning">ADMIN PANEL</span>
        </div>
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground text-stat-label flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to App
        </Link>
      </header>
      <main className="px-4 md:px-8 py-6 max-w-[1100px] mx-auto">{children}</main>
    </div>
  );
}
