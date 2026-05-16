import { db } from "@/lib/db";

export async function getFriends(userId: string) {
  const friendships = await db.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requester_id: userId }, { addressee_id: userId }],
    },
    include: {
      requester: { select: { id: true, name: true, username: true, image: true } },
      addressee: { select: { id: true, name: true, username: true, image: true } },
    },
  });

  return friendships.map((f) =>
    f.requester_id === userId ? f.addressee : f.requester
  );
}

export type Friend = Awaited<ReturnType<typeof getFriends>>[number];
