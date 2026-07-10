import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { DAILY_TASKS, xpForNextLevel } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function FriendProfilePage({ params }: Props) {
  const { id: friendId } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  // Must be an accepted friend (or viewing your own profile) to see this page
  if (friendId !== session.userId) {
    const friendship = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { userId: session.userId, friendId },
          { userId: friendId, friendId: session.userId },
        ],
      },
    });
    if (!friendship) notFound();
  }

  const friend = await prisma.user.findUnique({
    where: { id: friendId },
    include: {
      achievements: { include: { achievement: true } },
      challenges: {
        where: { status: "ACTIVE" },
        include: { dailyLogs: { orderBy: { date: "desc" }, take: 3 } },
      },
    },
  });
  if (!friend) notFound();

  const activeChallenge = friend.challenges[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLog = activeChallenge?.dailyLogs.find((l) => {
    const ld = new Date(l.date);
    ld.setHours(0, 0, 0, 0);
    return ld.getTime() === today.getTime();
  });

  const nextLevelXP = xpForNextLevel(friend.level);
  const xpProgress = Math.min((friend.xp / nextLevelXP) * 100, 100);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/friends" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-stat-label transition-colors">
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Friends
      </Link>

      <section className="glass-card rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center text-accent text-3xl font-extrabold bg-accent/10">
          {(friend.displayName || friend.username || friend.email)[0].toUpperCase()}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-headline-lg">{friend.displayName || friend.username}</h2>
          <p className="text-stat-label text-muted-foreground">@{friend.username}</p>
          <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
            <span className="text-label-caps text-accent">{friend.title.toUpperCase()}</span>
            <span className="text-label-caps text-muted-foreground">LEVEL {friend.level}</span>
          </div>
        </div>
      </section>

      {/* XP */}
      <section className="glass-card rounded-xl p-5">
        <div className="flex justify-between mb-2">
          <span className="text-label-caps text-muted-foreground">EXPERIENCE POINTS</span>
          <span className="text-label-caps text-accent">{friend.xp.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
        </div>
        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${xpProgress}%`, boxShadow: "0 0 8px rgba(195,244,0,0.4)" }} />
        </div>
      </section>

      {/* Streak */}
      {activeChallenge && (
        <section className="glass-card rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="text-label-caps text-muted-foreground mb-1">CURRENT STREAK</p>
            <div className="flex items-baseline gap-2">
              <span className="text-display-stat text-accent">{activeChallenge.currentDay}</span>
              <span className="text-headline-md">DAYS</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-6xl text-accent opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
        </section>
      )}

      {/* Today's checklist status */}
      <section className="glass-card rounded-xl p-5">
        <h3 className="text-label-caps text-muted-foreground mb-4">TODAY&apos;S PROGRESS</h3>
        {!activeChallenge ? (
          <p className="text-muted-foreground text-center py-6">No active challenge right now.</p>
        ) : !todayLog ? (
          <p className="text-muted-foreground text-center py-6">Hasn&apos;t logged anything today yet.</p>
        ) : (
          <div className="space-y-1">
            {DAILY_TASKS.map((task) => {
              const value = (todayLog as unknown as Record<string, unknown>)[task.key];
              const done = value === true || (typeof value === "number" && value > 0) || (typeof value === "string" && value.length > 0);
              return (
                <div key={task.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg" style={{ color: done ? "#C3F400" : "#666" }}>{task.icon}</span>
                    <span className="text-sm">{task.label}</span>
                  </div>
                  <span className={done ? "text-success text-lg" : "text-muted-foreground text-lg"}>{done ? "✓" : "—"}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Achievements */}
      <section className="glass-card rounded-xl p-5">
        <h3 className="text-label-caps text-muted-foreground mb-4">ACHIEVEMENTS ({friend.achievements.length})</h3>
        {friend.achievements.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {friend.achievements.map((ua) => (
              <div key={ua.id} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
                <span className="material-symbols-outlined text-accent text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{ua.achievement.icon}</span>
                <span className="text-[10px] font-bold text-center text-muted-foreground">{ua.achievement.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">No achievements unlocked yet</p>
        )}
      </section>
    </div>
  );
}
