# 75 Hard Tracker — Setup Instructions

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **MySQL** — running locally (you said you have this installed)
- **npm** (comes with Node.js)

## Step 1: Create the MySQL Database

Open your MySQL CLI or GUI (MySQL Workbench, phpMyAdmin, etc.) and run:

```sql
CREATE DATABASE hard75;
```

If you use a custom MySQL user/password, note them for the next step.

## Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/hard75"
AUTH_SECRET="any-random-string-here-make-it-long"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password. If you use a different user, adjust accordingly.

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Set Up the Database

```bash
npx prisma generate    # generates the Prisma client
npx prisma db push     # creates all tables in your MySQL database
npm run db:seed        # seeds demo user + achievements
```

To visually browse your database:
```bash
npx prisma studio     # opens at http://localhost:5555
```

## Step 5: Run the Dev Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

**Demo login:**
- Email: `demo@75hard.app`
- Password: `password123`

Or create your own account via the Sign Up page.

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (auth)/signup/         # Signup page
│   ├── (dashboard)/           # Main app (requires auth)
│   │   ├── page.tsx           # Dashboard + daily checklist
│   │   ├── calendar/          # Heatmap + monthly calendar
│   │   ├── progress/          # Charts & insights
│   │   ├── profile/           # Gamification, XP, badges
│   │   ├── friends/           # Friend search & leaderboard
│   │   └── settings/          # Preferences & logout
│   └── api/                   # Backend API routes
│       ├── auth/              # Login/signup/logout
│       ├── daily-log/         # Save & fetch daily logs
│       └── challenge/         # Start/manage challenges
├── components/
│   ├── layout/                # Sidebar, bottom nav, header
│   └── checklist/             # Checklist items, progress ring
├── lib/                       # Prisma, auth, utilities
└── styles/globals.css         # Design tokens, glass effects
```

## How the App Works

1. **Sign up** → a Challenge is automatically created (Day 1 starts)
2. **Dashboard** → check off tasks, enter numbers, save progress
3. **Calendar** → see your 75-day heatmap and monthly view
4. **Progress** → charts for weight, water, sleep over time
5. **Profile** → XP, level, title, achievement badges
6. **Friends** → search users, compare stats

The streak resets to Day 0 if any required task is missed (enforced server-side).

## Building for Production

```bash
npm run build
npm start          # runs production server on port 3000
```

## Hosting Options

### Option A: Vercel (Easiest)

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new), import the repo
3. Add environment variables (DATABASE_URL, AUTH_SECRET)
4. Deploy

Note: Your MySQL must be accessible from the internet. Use a hosted MySQL service like [PlanetScale](https://planetscale.com), [Railway](https://railway.app), or [Aiven](https://aiven.io) (all have free tiers).

### Option B: VPS (DigitalOcean, AWS, etc.)

```bash
# On your server
git clone your-repo
npm install
npm run build

# Use PM2 to keep it running
npm install -g pm2
pm2 start npm --name "75hard" -- start
```

### Option C: Railway / Render

Both support Next.js + MySQL out of the box. Push your repo, add env vars, done.

## Design Reference

The `designs/reference/` folder contains the original Stitch HTML prototypes. Open any `.html` file in a browser to see the original design each page was based on.

## Common Issues

**"Can't reach database server"**
→ Make sure MySQL is running. Check `DATABASE_URL` in `.env.local`.

**"Table doesn't exist"**
→ Run `npx prisma db push` again.

**Styles not loading**
→ Make sure the Google Fonts CDN is accessible (check `globals.css` imports).
