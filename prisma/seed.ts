import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 12);

  // ─── Users ───
  const demo = await prisma.user.upsert({
    where: { email: "demo@75hard.app" },
    update: { xp: 4850, level: 15, title: "Warrior" },
    create: { email: "demo@75hard.app", password, username: "demo", displayName: "Alex Mercer", xp: 4850, level: 15, title: "Warrior" },
  });

  const friend1 = await prisma.user.upsert({
    where: { email: "sarah@75hard.app" },
    update: {},
    create: { email: "sarah@75hard.app", password, username: "sarahfitness", displayName: "Sarah K", xp: 7200, level: 22, title: "Veteran" },
  });

  const friend2 = await prisma.user.upsert({
    where: { email: "mike@75hard.app" },
    update: {},
    create: { email: "mike@75hard.app", password, username: "mikegrind", displayName: "Mike Chen", xp: 2100, level: 9, title: "Soldier" },
  });

  const friend3 = await prisma.user.upsert({
    where: { email: "priya@75hard.app" },
    update: {},
    create: { email: "priya@75hard.app", password, username: "priyastrong", displayName: "Priya Sharma", xp: 9500, level: 30, title: "Veteran" },
  });

  for (const user of [demo, friend1, friend2, friend3]) {
    await prisma.userSettings.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
  }

  // ─── Achievements ───
  const achievements = [
    { key: "first_day", name: "First Step", description: "Complete your first day", icon: "flag", xpReward: 50, category: "milestone", threshold: 1 },
    { key: "week_streak", name: "Week Warrior", description: "7-day streak", icon: "local_fire_department", xpReward: 250, category: "streak", threshold: 7 },
    { key: "fortnight", name: "Two Weeks Strong", description: "14-day streak", icon: "whatshot", xpReward: 500, category: "streak", threshold: 14 },
    { key: "month_streak", name: "Iron Will", description: "30-day streak", icon: "shield", xpReward: 1000, category: "streak", threshold: 30 },
    { key: "hydration_bronze", name: "Hydration Bronze", description: "Hit water goal 7 days", icon: "water_drop", xpReward: 100, category: "hydration", threshold: 7 },
    { key: "hydration_silver", name: "Hydration Silver", description: "Hit water goal 14 days", icon: "water_drop", xpReward: 200, category: "hydration", threshold: 14 },
    { key: "hydration_gold", name: "Hydration Gold", description: "Hit water goal 30 days", icon: "water_drop", xpReward: 400, category: "hydration", threshold: 30 },
    { key: "hydration_platinum", name: "Hydration Platinum", description: "Hit water goal 75 days", icon: "water_drop", xpReward: 1000, category: "hydration", threshold: 75 },
    { key: "reading_bronze", name: "Bookworm Bronze", description: "Read 7 days", icon: "menu_book", xpReward: 100, category: "reading", threshold: 7 },
    { key: "reading_silver", name: "Bookworm Silver", description: "Read 14 days", icon: "menu_book", xpReward: 200, category: "reading", threshold: 14 },
    { key: "reading_gold", name: "Bookworm Gold", description: "Read 30 days", icon: "menu_book", xpReward: 400, category: "reading", threshold: 30 },
    { key: "reading_platinum", name: "Bookworm Platinum", description: "Read 75 days", icon: "menu_book", xpReward: 1000, category: "reading", threshold: 75 },
    { key: "workout_bronze", name: "Grinder Bronze", description: "Both workouts 7 days", icon: "fitness_center", xpReward: 100, category: "workout", threshold: 7 },
    { key: "workout_silver", name: "Grinder Silver", description: "Both workouts 14 days", icon: "fitness_center", xpReward: 200, category: "workout", threshold: 14 },
    { key: "workout_gold", name: "Grinder Gold", description: "Both workouts 30 days", icon: "fitness_center", xpReward: 400, category: "workout", threshold: 30 },
    { key: "workout_platinum", name: "Grinder Platinum", description: "Both workouts 75 days", icon: "fitness_center", xpReward: 1000, category: "workout", threshold: 75 },
    { key: "early_bird", name: "Early Bird", description: "Log before 7am 5 times", icon: "wb_sunny", xpReward: 150, category: "consistency", threshold: 5 },
    { key: "step_master", name: "Step Master", description: "Hit 10k steps 7 days", icon: "directions_walk", xpReward: 150, category: "fitness", threshold: 7 },
    { key: "cold_warrior", name: "Cold Warrior", description: "Complete cold shower bonus 5 times", icon: "ac_unit", xpReward: 200, category: "bonus", threshold: 5 },
    { key: "spin_winner", name: "Lucky Spin", description: "Win streak shield from spin wheel", icon: "casino", xpReward: 100, category: "bonus", threshold: 1 },
    { key: "completed_75", name: "75 Hard Complete", description: "Finish the full challenge", icon: "emoji_events", xpReward: 5000, category: "milestone", threshold: 75 },
  ];

  const achievementRecords: Record<string, string> = {};
  for (const a of achievements) {
    const rec = await prisma.achievement.upsert({ where: { key: a.key }, update: {}, create: a });
    achievementRecords[a.key] = rec.id;
  }

  // ─── Demo achievements ───
  const demoAchievements = ["first_day", "week_streak", "fortnight", "hydration_bronze", "hydration_silver", "reading_bronze", "workout_bronze", "workout_silver", "step_master", "early_bird"];
  for (const key of demoAchievements) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: demo.id, achievementId: achievementRecords[key] } },
      update: {},
      create: { userId: demo.id, achievementId: achievementRecords[key] },
    });
  }

  // ─── Friend achievements ───
  for (const key of ["first_day", "week_streak", "fortnight", "month_streak", "hydration_bronze", "hydration_silver", "hydration_gold", "reading_bronze", "reading_silver"]) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: friend1.id, achievementId: achievementRecords[key] } },
      update: {},
      create: { userId: friend1.id, achievementId: achievementRecords[key] },
    });
  }

  // ─── Friendships ───
  for (const friendId of [friend1.id, friend2.id, friend3.id]) {
    await prisma.friendship.upsert({
      where: { userId_friendId: { userId: demo.id, friendId } },
      update: {},
      create: { userId: demo.id, friendId, status: "ACCEPTED" },
    });
  }

  // ─── Past failed challenge ───
  await prisma.challenge.create({
    data: { userId: demo.id, startDate: new Date("2026-03-01"), endDate: new Date("2026-04-14"), status: "FAILED", currentDay: 44, maxStreak: 44 },
  });

  // ─── Active challenge (30 days ago) ───
  const challengeStart = new Date();
  challengeStart.setDate(challengeStart.getDate() - 30);
  challengeStart.setHours(0, 0, 0, 0);

  const activeChallenge = await prisma.challenge.create({
    data: { userId: demo.id, startDate: challengeStart, status: "ACTIVE", currentDay: 30, maxStreak: 30 },
  });

  // ─── 30 days of logs ───
  const waterTargets = [120,128,115,128,128,100,128,128,128,110,128,128,128,128,95,128,128,128,128,128,108,128,128,128,128,128,128,128,128,128];
  const weights =     [185,184.5,184,183.8,183.5,183.2,183,182.8,182.5,182.3,182,181.8,181.5,181.3,181,180.8,180.5,180.3,180,179.8,179.5,179.3,179,178.8,178.5,178.3,178,177.8,177.5,177.2];
  const sleeps =      [7.5,8,6.5,7,8,7.5,8,7,6,8,7.5,8,7,7.5,8,6.5,7,8,7.5,7,8,7.5,8,7,7.5,8,7,8,7.5,8];
  const moods =       [4,5,3,4,5,4,5,4,3,4,5,5,4,4,3,4,5,4,5,4,5,4,5,5,4,5,4,5,5,5];
  const steps =       [10200,11500,9800,12000,10500,8900,11000,10800,9500,12500,11200,10900,11800,10300,9200,11500,12000,10700,11300,10600,12100,11400,10800,12300,11700,10500,11900,12400,11100,12800];
  const incompleteDays = [5, 13];

  for (let i = 0; i < 30; i++) {
    const date = new Date(challengeStart);
    date.setDate(date.getDate() + i);
    const incomplete = incompleteDays.includes(i);
    await prisma.dailyLog.create({
      data: {
        challengeId: activeChallenge.id, date, dayNumber: i + 1,
        workout1: true, workout2: !incomplete, outdoorWorkout: true,
        steps: steps[i], waterOz: waterTargets[i], proteinG: incomplete ? 80 : 150,
        fiberG: incomplete ? 10 : 30, weightLbs: weights[i],
        readingDone: !incomplete, sleepHours: sleeps[i], mood: moods[i],
        notes: i % 7 === 0 ? "Feeling strong. Getting into the groove." : i % 5 === 0 ? "Tough day but pushed through." : null,
        isComplete: !incomplete, xpEarned: incomplete ? 60 : 220,
        completedAt: incomplete ? null : date,
      },
    });
  }

  console.log("✅ Seed complete!");
  console.log("👤 Demo: demo@75hard.app / password123");
  console.log("👥 Friends: sarahfitness, mikegrind, priyastrong");
  console.log("🏆 10 achievements unlocked for demo user");
}

main().catch(console.error).finally(() => prisma.$disconnect());
