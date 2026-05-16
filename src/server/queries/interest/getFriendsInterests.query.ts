import { db } from "@/lib/db";

export async function getFriendsInterests(friendIds: string[]) {
  if (friendIds.length === 0) return [];

  return db.event.findMany({
    where: {
      is_published: true,
      interests: { some: { user_id: { in: friendIds } } },
    },
    include: {
      business: { select: { name: true, username: true } },
      _count: { select: { interests: true } },
      interests: {
        where: { user_id: { in: friendIds } },
        include: { user: { select: { id: true, name: true, image: true } } },
      },
    },
    orderBy: { starts_at: "asc" },
  });
}

export type FriendInterestEvent = Awaited<ReturnType<typeof getFriendsInterests>>[number];
