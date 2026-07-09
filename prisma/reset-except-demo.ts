import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// These accounts are kept — everything else gets deleted
const DEMO_EMAILS = [
  "demo@75hard.app",
  "demotest@75hard.app",
  "sarah@75hard.app",
  "mike@75hard.app",
  "priya@75hard.app",
];

async function main() {
  console.log("⚠️  Removing all accounts except demo data...\n");

  const allUsers = await prisma.user.findMany({ select: { id: true, email: true } });
  const toDelete = allUsers.filter((u) => !DEMO_EMAILS.includes(u.email));

  if (toDelete.length === 0) {
    console.log("✅ No extra accounts found — database already clean.");
    return;
  }

  console.log(`Found ${toDelete.length} non-demo account(s) to remove:`);
  toDelete.forEach((u) => console.log(`  - ${u.email}`));
  console.log("");

  // Cascading deletes (via schema's onDelete: Cascade) automatically clean up
  // each user's challenges, daily logs, friendships, achievements, and settings.
  const result = await prisma.user.deleteMany({
    where: { id: { in: toDelete.map((u) => u.id) } },
  });

  console.log(`✓ Deleted ${result.count} account(s) and all their related data`);

  const remaining = await prisma.user.findMany({ select: { email: true } });
  console.log(`\n✅ Done. Remaining accounts:`);
  remaining.forEach((u) => console.log(`  - ${u.email}`));
}

main()
  .catch((e) => {
    console.error("Reset failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
