"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "home", label: "HOME" },
  { href: "/dashboard/calendar", icon: "calendar_month", label: "CALENDAR" },
  { href: "/dashboard/progress", icon: "donut_large", label: "PROGRESS" },
  { href: "/dashboard/rewards", icon: "card_giftcard", label: "REWARDS" },
  { href: "/dashboard/friends", icon: "group", label: "FRIENDS" },
  { href: "/dashboard/profile", icon: "person", label: "PROFILE" },
  { href: "/dashboard/settings", icon: "settings", label: "SETTINGS" },
];

export default function Sidebar({ user }: { user: UserProfile }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 glass-card border-r border-border py-6 px-4 gap-6">
      <div className="flex items-center gap-3 px-3 mb-2">
        <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
        <span className="text-headline-md font-bold tracking-tighter text-accent">75 HARD</span>
      </div>

      <nav className="flex flex-col gap-1.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-label-caps",
                active ? "bg-accent text-black font-bold" : "text-muted-foreground hover:bg-surface-container"
              )}>
              <span className="material-symbols-outlined text-xl"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="glass-card p-4 rounded-xl border-accent/20">
        <p className="text-label-caps text-accent">{user.title.toUpperCase()}</p>
        <p className="text-stat-label text-muted-foreground mt-1">Level {user.level} · {user.xp} XP</p>
        <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-accent h-full rounded-full transition-all" style={{ width: `${Math.min((user.xp % 500) / 5, 100)}%` }} />
        </div>
      </div>
    </aside>
  );
}
