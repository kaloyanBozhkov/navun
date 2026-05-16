import { db } from "@/lib/db";

export async function searchUsersByUsername(query: string, currentUserId: string) {
  if (!query || query.length < 1) return [];

  const users = await db.user.findMany({
    where: {
      NOT: { id: currentUserId },
      OR: [
        { username: { contains: query } },
        { name: { contains: query } },
      ],
    },
    select: { id: true, name: true, username: true, image: true },
    take: 20,
  });

  // Fetch friendship status for each user
  const friendships = await db.friendship.findMany({
    where: {
      OR: [
        { requester_id: currentUserId, addressee_id: { in: users.map((u) => u.id) } },
        { addressee_id: currentUserId, requester_id: { in: users.map((u) => u.id) } },
      ],
    },
  });

  return users.map((user) => {
    const friendship = friendships.find(
      (f) =>
        (f.requester_id === currentUserId && f.addressee_id === user.id) ||
        (f.addressee_id === currentUserId && f.requester_id === user.id)
    );

    return {
      ...user,
      friendshipStatus: friendship?.status ?? null,
    };
  });
}

export type SearchedUser = Awaited<ReturnType<typeof searchUsersByUsername>>[number];
