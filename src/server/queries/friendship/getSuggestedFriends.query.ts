import { db } from "@/lib/db";

export async function getSuggestedFriends(userId: string, limit = 5) {
  // Get IDs of current friends and pending requests
  const friendships = await db.friendship.findMany({
    where: { OR: [{ requester_id: userId }, { addressee_id: userId }] },
    select: { requester_id: true, addressee_id: true },
  });
  const excludeIds = friendships
    .flatMap((f) => [f.requester_id, f.addressee_id])
    .filter((id) => id !== userId);

  return db.user.findMany({
    where: { id: { notIn: [userId, ...excludeIds] }, role: "USER" },
    select: { id: true, name: true, username: true, image: true },
    take: limit,
  });
}
