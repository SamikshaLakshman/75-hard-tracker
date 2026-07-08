import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Sidebar from "@/components/layout/sidebar";
import BottomNav from "@/components/layout/bottom-nav";
import Header from "@/components/layout/header";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, username: true, displayName: true, avatarUrl: true, xp: true, level: true, title: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto hide-scrollbar px-4 md:px-8 py-6 pb-safe-bottom md:pb-6">
          <div className="max-w-[900px] mx-auto">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
