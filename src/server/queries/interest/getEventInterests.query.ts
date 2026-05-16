import { db } from "@/lib/db";

export async function getEventInterests(eventId: string) {
  const interests = await db.event_interest.findMany({
    where: { event_id: eventId },
    include: {
      user: { select: { id: true, name: true, username: true, image: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return {
    count: interests.length,
    users: interests.map((i) => i.user),
  };
}
