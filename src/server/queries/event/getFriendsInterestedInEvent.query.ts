import { db } from "@/lib/db";

export async function getFriendsInterestedInEvent(eventId: string, userId: string) {
  return db.event_interest.findMany({
    where: {
      event_id: eventId,
      user: {
        OR: [
          {
            friendships_received: {
              some: { requester_id: userId, status: "ACCEPTED" },
            },
          },
          {
            friendships_initiated: {
              some: { addressee_id: userId, status: "ACCEPTED" },
            },
          },
        ],
      },
    },
    include: { user: { select: { id: true, name: true, image: true } } },
    take: 5,
  });
}
