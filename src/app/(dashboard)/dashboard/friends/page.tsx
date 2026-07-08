import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function FriendsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const friendships = await prisma.friendship.findMany({
    where: { userId: session.userId, status: "ACCEPTED" },
    include: {
      friend: {
        select: { id: true, username: true, displayName: true, xp: true, level: true, title: true },
      },
    },
  });

  const friends = friendships.map((f) => f.friend);

  return (
    <div className="space-y-6">
      <h2 className="text-headline-md">Friends & Leaderboard</h2>

      {/* Search */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-surface-container-high rounded-lg px-4 py-3">
            <span className="material-symbols-outlined text-muted-foreground">search</span>
            <input type="text" placeholder="Search by username"
              className="bg-transparent text-foreground w-full focus:outline-none" />
          </div>
          <button className="bg-accent text-black px-5 rounded-lg font-bold text-label-caps hover:brightness-110 transition-all">
            ADD
          </button>
        </div>
      </div>

      {/* Friends List */}
      {friends.length > 0 ? (
        <div className="space-y-3">
          {friends.map((friend, i) => (
            <div key={friend.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold">
                  {(friend.displayName || friend.username || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{friend.displayName || friend.username}</p>
                  <p className="text-label-caps text-muted-foreground">{friend.title.toUpperCase()} · LVL {friend.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-accent">{friend.xp.toLocaleString()}</p>
                <p className="text-label-caps text-muted-foreground">XP</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4 block">group_add</span>
          <p className="text-headline-md text-muted-foreground">No friends yet</p>
          <p className="text-stat-label text-muted-foreground mt-2">Search for friends by username to compare progress.</p>
        </div>
      )}
    </div>
  );
}
