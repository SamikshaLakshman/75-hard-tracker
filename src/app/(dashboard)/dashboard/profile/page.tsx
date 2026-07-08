import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { xpForNextLevel } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      achievements: { include: { achievement: true } },
      challenges: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) redirect("/login");

  const activeChallenge = user.challenges.find((c) => c.status === "ACTIVE");
  const pastChallenges = user.challenges.filter((c) => c.status !== "ACTIVE");
  const nextLevelXP = xpForNextLevel(user.level);
  const xpProgress = Math.min((user.xp / nextLevelXP) * 100, 100);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Profile Header */}
      <section className="glass-card rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center text-accent text-3xl font-extrabold bg-accent/10">
          {(user.displayName || user.email)[0].toUpperCase()}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-headline-lg">{user.displayName || user.username || "Athlete"}</h2>
          <p className="text-stat-label text-muted-foreground">@{user.username || "username"}</p>
          <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
            <span className="text-label-caps text-accent">{user.title.toUpperCase()}</span>
            <span className="text-label-caps text-muted-foreground">LEVEL {user.level}</span>
          </div>
        </div>
      </section>

      {/* XP Bar */}
      <section className="glass-card rounded-xl p-5">
        <div className="flex justify-between mb-2">
          <span className="text-label-caps text-muted-foreground">EXPERIENCE POINTS</span>
          <span className="text-label-caps text-accent">{user.xp} / {nextLevelXP} XP</span>
        </div>
        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${xpProgress}%`, boxShadow: "0 0 8px rgba(195,244,0,0.4)" }} />
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "TOTAL XP", value: user.xp.toLocaleString(), icon: "star" },
          { label: "LEVEL", value: user.level, icon: "military_tech" },
          { label: "ATTEMPTS", value: user.challenges.length, icon: "replay" },
          { label: "BADGES", value: user.achievements.length, icon: "emoji_events" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <span className="material-symbols-outlined text-accent block mb-2">{s.icon}</span>
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-label-caps text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <section className="glass-card rounded-xl p-5">
        <h3 className="text-label-caps text-muted-foreground mb-4">ACHIEVEMENTS</h3>
        {user.achievements.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {user.achievements.map((ua) => (
              <div key={ua.id} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20">
                <span className="material-symbols-outlined text-accent text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{ua.achievement.icon}</span>
                <span className="text-[10px] font-bold text-center text-muted-foreground">{ua.achievement.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">Complete tasks to unlock achievements</p>
        )}
      </section>

      {/* Past Attempts */}
      {pastChallenges.length > 0 && (
        <section className="glass-card rounded-xl p-5">
          <h3 className="text-label-caps text-muted-foreground mb-4">PAST ATTEMPTS</h3>
          <div className="space-y-2">
            {pastChallenges.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-bold">{new Date(c.startDate).toLocaleDateString()}</p>
                  <p className="text-label-caps text-muted-foreground">{c.maxStreak} DAY STREAK</p>
                </div>
                <span className={`text-label-caps ${c.status === "COMPLETED" ? "text-success" : "text-danger"}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
