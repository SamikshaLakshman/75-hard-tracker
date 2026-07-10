import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping all data for final deployment...\n");

  const dailyLogs = await prisma.dailyLog.deleteMany();
  console.log(`Deleted ${dailyLogs.count} daily logs`);

  const challenges = await prisma.challenge.deleteMany();
  console.log(`Deleted ${challenges.count} challenges`);

  const userAchievements = await prisma.userAchievement.deleteMany();
  console.log(`Deleted ${userAchievements.count} user achievements`);

  const friendships = await prisma.friendship.deleteMany();
  console.log(`Deleted ${friendships.count} friendships`);

  const userSettings = await prisma.userSettings.deleteMany();
  console.log(`Deleted ${userSettings.count} user settings`);

  const users = await prisma.user.deleteMany();
  console.log(`Deleted ${users.count} users`);

  const achievementCount = await prisma.achievement.count();
  console.log(`Kept ${achievementCount} achievement definitions (catalog, not user data)`);

  console.log("\nDatabase is clean. Ready for real users.");
}

main()
  .catch((e) => {
    console.error("Reset failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
