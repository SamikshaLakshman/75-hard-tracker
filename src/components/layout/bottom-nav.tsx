"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "home", label: "Home" },
  { href: "/dashboard/calendar", icon: "calendar_month", label: "Calendar" },
  { href: "/dashboard/progress", icon: "donut_large", label: "Progress" },
  { href: "/dashboard/rewards", icon: "card_giftcard", label: "Rewards" },
  { href: "/dashboard/profile", icon: "person", label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface/80 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-[600px] mx-auto px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[48px] py-1 transition-colors active:scale-110",
                active ? "text-accent" : "text-muted-foreground"
              )}>
              <span className="material-symbols-outlined text-xl"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}>{item.icon}</span>
              <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
