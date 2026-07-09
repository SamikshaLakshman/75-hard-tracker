<div align="center">

<img src="public/logo.svg" alt="Forge75 Logo" width="120" height="120" />

# Forge75

**Forge discipline. Track every day. Never break the streak.**

A full-stack Progressive Web App for completing the 75 Hard Challenge — built with Next.js, MySQL, and a dark-mode OLED-optimized UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Demo Accounts & Resetting Data](#demo-accounts--resetting-data)
- [Environment Variables](#environment-variables)
- [Database Schema Overview](#database-schema-overview)
- [Deployment](#deployment)
- [Credits](#credits)
- [License](#license)

---

## About

**75 Hard** is a mental-toughness program: 75 consecutive days, zero compromises. Two workouts a day (one outdoors), a strict diet, a gallon of water, 10 pages of reading, and a daily progress photo — miss one requirement on any day, and the counter resets to zero.

**Forge75** turns those rules into a full accountability system: daily checklists, streak tracking, a GitHub-style progress heatmap, XP and leveling, unlockable themes, a daily spin wheel, streak-saving shields, bonus challenges, and a friends leaderboard — all wrapped in a fast, installable, responsive web app.

---

## Features

### 🗓️ Daily Tracking
- Checklist for Workout 1 (indoor), Workout 2 (outdoor), steps, water, protein, fiber, weight, reading, sleep, mood, and notes
- Progress auto-saves throughout the day
- Yesterday's entry stays editable until midnight

### 📊 Calendar & Insights
- GitHub-style 75-day contribution heatmap
- Monthly calendar with color-coded status (complete / partial / failed / today)
- Weight, water, and sleep trend charts (Recharts)

### 🎮 Gamification
- XP and leveling system with auto-calculated titles (Recruit → Legend)
- **Unlockable themes** — new color palettes unlock at streak milestones (Day 7, 14, 21, 30, 45, 75)
- **Daily Spin Wheel** — earn one spin per day after completing all tasks; win XP, streak shields, skip tokens, or double-XP
- **Streak Shields** — protect your streak from a missed day
- **Bonus Challenges** — optional daily mini-challenges (cold showers, gratitude journaling, etc.) for extra XP
- Achievement badges across hydration, reading, workouts, and consistency

### 👥 Social
- Add friends by username
- Leaderboard sorted by XP with rank badges

### ⚙️ Platform
- Fully responsive — one codebase, mobile bottom-nav + desktop sidebar
- Installable PWA (add to home screen)
- Dark-mode OLED-optimized UI, Electric Lime (#C3F400) accent
- JWT-based authentication with hashed passwords

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Database | MySQL |
| ORM | [Prisma](https://prisma.io) |
| Auth | JWT (`jose`) + `bcryptjs` password hashing |
| Charts | [Recharts](https://recharts.org) |
| Animation | [Framer Motion](https://www.framer.com/motion) |
| Hosting | [Vercel](https://vercel.com) |

---

## Screenshots

> Add your own screenshots here once deployed — drop image files into a `docs/screenshots/` folder and reference them like below.

```markdown
<img src="docs/screenshots/dashboard.png" width="280" />
<img src="docs/screenshots/calendar.png" width="280" />
<img src="docs/screenshots/rewards.png" width="280" />
```

---

## Project Structure

```
forge75/
│
├── prisma/
│   ├── schema.prisma              # Database models (User, Challenge, DailyLog, Achievement, etc.)
│   ├── seed.ts                    # Demo data — users, friends, achievements, 30 days of logs
│   ├── reset-except-demo.ts       # Keeps demo accounts, deletes everything/everyone else
│   └── reset-all.ts               # Full wipe — clears all users and their data
│
├── public/
│   ├── logo.svg                   # App icon — flame mark (favicon, manifest, header)
│   ├── logo-full.svg              # Flame + "FORGE75" wordmark (splash/login screens)
│   └── manifest.json              # PWA manifest (installable app config)
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx             # Login screen
│   │   │   └── signup/page.tsx            # Signup screen
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                 # Shell: sidebar (desktop) + bottom nav (mobile)
│   │   │   └── dashboard/
│   │   │       ├── page.tsx               # Home — daily checklist
│   │   │       ├── dashboard-client.tsx   # Client-side checklist logic
│   │   │       ├── calendar/              # Heatmap + monthly calendar
│   │   │       ├── progress/              # Weight/water/sleep charts
│   │   │       ├── rewards/               # Themes, spin wheel, shields, bonus challenges
│   │   │       ├── friends/               # Add friends, leaderboard
│   │   │       ├── profile/               # XP, level, achievements, rewards wallet
│   │   │       └── settings/              # Theme toggle, sign out
│   │   │
│   │   ├── api/
│   │   │   ├── auth/route.ts              # Login / signup / logout
│   │   │   ├── daily-log/route.ts         # Save & fetch daily checklist entries
│   │   │   ├── challenge/route.ts         # Start / manage a 75-day challenge
│   │   │   ├── friends/route.ts           # Add friend, fetch friend list
│   │   │   └── rewards/
│   │   │       ├── route.ts               # Rewards summary (streak, shields, theme, XP)
│   │   │       ├── spin/route.ts          # Daily spin wheel logic (server-locked per day)
│   │   │       ├── theme/route.ts         # Unlock/apply a theme
│   │   │       └── bonus/route.ts         # Complete a bonus challenge
│   │   │
│   │   ├── layout.tsx              # Root layout — fonts, favicon, theme script
│   │   └── page.tsx                 # Redirects to /dashboard or /login
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx          # Desktop nav
│   │   │   ├── bottom-nav.tsx       # Mobile nav
│   │   │   └── header.tsx           # Top bar
│   │   └── checklist/
│   │       ├── checklist-item.tsx   # Individual task row (boolean/number/mood/text)
│   │       └── progress-ring.tsx    # Circular daily progress indicator
│   │
│   ├── lib/
│   │   ├── prisma.ts                # Prisma client singleton
│   │   ├── auth.ts                  # JWT session helpers, password hashing
│   │   ├── xp.ts                    # XP → level → title calculation, applied on every reward
│   │   └── utils.ts                 # Shared constants — daily tasks, themes, spin prizes, quotes
│   │
│   ├── types/index.ts               # Shared TypeScript interfaces
│   ├── middleware.ts                # Route protection (redirects unauthenticated users)
│   └── styles/globals.css           # Design tokens, dark/light theme variables
│
├── designs/reference/               # Original Stitch HTML prototypes (visual reference only)
├── .env.example                     # Environment variable template
├── package.json
└── README.md
```

---

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/forge75.git
cd forge75
npm install
cp .env.example .env.local   # edit with your MySQL credentials
npx prisma generate
npx prisma db push
npm run db:seed               # creates demo user + achievements
npm run dev                   # http://localhost:3000
```

**Demo login:** `demo@75hard.app` / `password123`

---

## Demo Accounts & Resetting Data

The seed script (`prisma/seed.ts`) creates a set of demo accounts pre-loaded with realistic data — useful for presentations, screenshots, or testing without manually filling in 75 days of logs. All demo accounts share the password `password123`.

| Email | Username | What's included |
|---|---|---|
| `demo@75hard.app` | `demo` | Main showcase account — 30 days of logged data, 10 unlocked achievements, an active streak, and a past failed attempt |
| `demotest@75hard.app` | `demotest` | Pre-added friend, used to demo the friend request/accept flow |
| `sarah@75hard.app` | `sarahfitness` | Friend with a higher XP/level, for leaderboard variety |
| `mike@75hard.app` | `mikegrind` | Friend with a lower XP/level |
| `priya@75hard.app` | `priyastrong` | Friend with the highest XP/level |

### Re-seeding demo data

```bash
npx tsx prisma/seed.ts
```

Safe to run multiple times — it uses `upsert`, so it won't create duplicates.

### Cleaning up test accounts before going live

While building, you'll likely create your own personal test accounts by signing up through the app. Before a real launch or presentation, remove everything except the demo accounts with:

```bash
npx tsx prisma/reset-except-demo.ts
```

This deletes every account **except** the five demo emails above, along with all of their challenges, daily logs, friendships, and achievements (cascading deletes handle cleanup automatically). The demo accounts and their data are left untouched.

To run this against your **live/hosted** database instead of local, set `DATABASE_URL` to your hosted connection string first:

```bash
# PowerShell example
$env:DATABASE_URL="your-hosted-mysql-connection-string"
npx tsx prisma/reset-except-demo.ts
```

### Wiping everything (full reset)

To start completely fresh — no demo accounts either — use:

```bash
npx tsx prisma/reset-all.ts
```

This clears all users, challenges, daily logs, friendships, and achievements. Achievement *definitions* (the catalog itself) are preserved since they're app configuration, not user data. Run `npx tsx prisma/seed.ts` afterward if you want the demo accounts back.

---

## Environment Variables

Create a `.env.local` file (see `.env.example`):

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
AUTH_SECRET="a-long-random-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Database Schema Overview

| Model | Purpose |
|---|---|
| `User` | Account info, XP/level/title, rewards wallet (shields, skip tokens, active theme, spin state) |
| `Challenge` | One 75-day attempt — tracks start date, current streak, status |
| `DailyLog` | A single day's checklist entry, tied to a challenge |
| `Achievement` / `UserAchievement` | Badge definitions and which ones a user has unlocked |
| `Friendship` | Friend connections between users |
| `UserSettings` | Theme/notification preferences |
| `FeatureFlag` | Admin-controlled feature toggles |

Run `npx prisma studio` to browse your database visually at `http://localhost:5555`.

---

## Deployment

Deployed on **Vercel** with a hosted MySQL database (e.g. Clever Cloud, PlanetScale, or Railway).

1. Push this repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` as environment variables
4. Deploy — Vercel auto-detects Next.js
5. Run `npx prisma db push` once against your hosted database to sync the schema

> **Note:** `package.json` includes a `"postinstall": "prisma generate"` script so the Prisma Client regenerates automatically on every Vercel build.

---

## Credits

Built by **Samiksha Lakshman**, with huge thanks to **Prajwal** for his help throughout the build — from debugging to design decisions, this project wouldn't be where it is without him. 🙌

UI prototypes originally generated with Google Stitch, then hand-built into a full Next.js application.

---

## License

MIT
