# 75 Hard Tracker

A full-stack Progressive Web App for the 75 Hard Challenge — built with Next.js, MySQL, and a dark-mode OLED-optimized UI.

![75 Hard](public/logo.svg)

## Features

- **Daily Checklist** — Workouts, water, protein, fiber, steps, weight, reading, sleep, mood, notes
- **GitHub-Style Heatmap** — 75-day visual progress map
- **Monthly Calendar** — Color-coded days (green/yellow/red/gray/blue)
- **Progress Charts** — Weight trends, water intake, sleep analysis via Recharts
- **Gamification** — XP, levels, titles, achievement badges
- **Friends** — Search by username, compare stats
- **Streak Engine** — Auto-resets if any required task is missed
- **Responsive** — Single codebase: mobile bottom-nav, desktop sidebar
- **Dark Mode** — OLED-black (#000) with Electric Lime (#C3F400) accent
- **PWA** — Installable on home screen

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | MySQL + Prisma ORM |
| Auth | JWT (jose + bcryptjs) |
| Charts | Recharts |
| Animation | Framer Motion |

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/75-hard-tracker.git
cd 75-hard-tracker
npm install
cp .env.example .env.local   # edit with your MySQL credentials
npx prisma generate
npx prisma db push
npm run db:seed               # creates demo user + achievements
npm run dev                   # http://localhost:3000
```

**Demo login:** `demo@75hard.app` / `password123`

## License

MIT
