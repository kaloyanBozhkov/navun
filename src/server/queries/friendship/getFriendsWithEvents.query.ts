import { db } from "@/lib/db";

export async function getFriendsWithEvents(userId: string) {
  const friendships = await db.friendship.findMany({
    where: {
      OR: [
        { requester_id: userId, status: "ACCEPTED" },
        { addressee_id: userId, status: "ACCEPTED" },
      ],
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          interests: {
            include: { event: true },
            take: 3,
            orderBy: { created_at: "desc" },
          },
        },
      },
      addressee: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          interests: {
            include: { event: true },
            take: 3,
            orderBy: { created_at: "desc" },
          },
        },
      },
    },
  });

  return friendships.map((f) =>
    f.requester_id === userId ? f.addressee : f.requester
  );
}

export type FriendWithEvents = Awaited<
  ReturnType<typeof getFriendsWithEvents>
>[number];
