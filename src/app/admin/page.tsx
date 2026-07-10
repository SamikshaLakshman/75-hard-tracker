import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);

  const [
    totalUsers,
    activeChallenges,
    completedChallenges,
    failedChallenges,
    totalLogs,
    completeLogs,
    newToday,
    newThisWeek,
    topUsers,
    dauLogs,
    wauLogs,
    mauLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.challenge.count({ where: { status: "ACTIVE" } }),
    prisma.challenge.count({ where: { status: "COMPLETED" } }),
    prisma.challenge.count({ where: { status: "FAILED" } }),
    prisma.dailyLog.count(),
    prisma.dailyLog.count({ where: { isComplete: true } }),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.findMany({ orderBy: { xp: "desc" }, take: 10, select: { id: true, displayName: true, username: true, xp: true, level: true, title: true } }),
    prisma.dailyLog.findMany({ where: { date: { gte: todayStart } }, select: { challenge: { select: { userId: true } } } }),
    prisma.dailyLog.findMany({ where: { date: { gte: weekAgo } }, select: { challenge: { select: { userId: true } } } }),
    prisma.dailyLog.findMany({ where: { date: { gte: monthAgo } }, select: { challenge: { select: { userId: true } } } }),
  ]);

  const dau = new Set(dauLogs.map((l) => l.challenge.userId)).size;
  const wau = new Set(wauLogs.map((l) => l.challenge.userId)).size;
  const mau = new Set(mauLogs.map((l) => l.challenge.userId)).size;
  const completionRate = totalLogs > 0 ? Math.round((completeLogs / totalLogs) * 100) : 0;

  const stats = [
    { label: "TOTAL USERS", value: totalUsers, icon: "group" },
    { label: "ACTIVE CHALLENGES", value: activeChallenges, icon: "local_fire_department" },
    { label: "COMPLETED (75 DAYS)", value: completedChallenges, icon: "military_tech" },
    { label: "FAILED / RESET", value: failedChallenges, icon: "cancel" },
    { label: "COMPLETION RATE", value: `${completionRate}%`, icon: "percent" },
    { label: "NEW TODAY", value: newToday, icon: "person_add" },
    { label: "NEW THIS WEEK", value: newThisWeek, icon: "trending_up" },
    { label: "DAU", value: dau, icon: "today" },
    { label: "WAU", value: wau, icon: "date_range" },
    { label: "MAU", value: mau, icon: "calendar_month" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-headline-md">Overview</h2>
        <Link href="/admin/users"
          className="bg-warning text-black px-4 py-2 rounded-lg font-bold text-label-caps hover:brightness-110 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">manage_accounts</span>
          Manage Users
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <span className="material-symbols-outlined text-warning block mb-2">{s.icon}</span>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-label-caps text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="glass-card rounded-xl p-5">
        <h3 className="text-label-caps text-muted-foreground mb-4">TOP USERS BY XP</h3>
        <div className="space-y-2">
          {topUsers.map((u, i) => (
            <div key={u.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm w-5">{i + 1}</span>
                <span className="font-bold text-sm">{u.displayName || u.username}</span>
                <span className="text-label-caps text-muted-foreground">{u.title.toUpperCase()} · LVL {u.level}</span>
              </div>
              <span className="text-accent font-bold">{u.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
