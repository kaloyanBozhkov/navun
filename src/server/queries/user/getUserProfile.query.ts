import { db } from "@/lib/db";

export async function getUserProfile(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          interests: true,
        },
      },
    },
  });

  if (!user) return null;

  const friendCount = await db.friendship.count({
    where: {
      status: "ACCEPTED",
      OR: [{ requester_id: userId }, { addressee_id: userId }],
    },
  });

  const visitedCount = await db.event_interest.count({
    where: {
      user_id: userId,
      event: {
        starts_at: { lt: new Date() },
      },
    },
  });

  return {
    ...user,
    interestCount: user._count.interests,
    friendCount,
    visitedCount,
  };
}

export type UserProfile = NonNullable<Awaited<ReturnType<typeof getUserProfile>>>;
