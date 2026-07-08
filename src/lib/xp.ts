import prisma from "./prisma";
import { calculateLevel, getLevelTitle } from "./utils";

/**
 * Adds XP to a user and recalculates their level + title.
 * Use this everywhere XP is granted so level/title stay in sync.
 */
export async function applyXP(userId: string, amount: number) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  });

  const newLevel = calculateLevel(updated.xp);
  const newTitle = getLevelTitle(newLevel);

  if (newLevel !== updated.level || newTitle !== updated.title) {
    await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel, title: newTitle },
    });
  }

  return { xp: updated.xp, level: newLevel, title: newTitle };
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export { isSameDay };
