"use client";

import Link from "next/link";
import type { UserProfile } from "@/types";

export default function Header({ user }: { user: UserProfile }) {
  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-border flex justify-between items-center px-4 md:px-8 h-14">
      <div className="flex items-center gap-3 lg:hidden">
        <img src="/logo.svg" alt="Forge75" className="w-7 h-7 rounded-lg" />
        <span className="text-xl font-bold tracking-tighter text-accent">FORGE75</span>
      </div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-sm font-bold">
          {(user.displayName || user.email)[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
