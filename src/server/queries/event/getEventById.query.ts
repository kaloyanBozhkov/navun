import { db } from "@/lib/db";

export async function getEventById(id: string) {
  return db.event.findUnique({
    where: { id },
    include: {
      business: { select: { id: true, name: true, username: true, image: true } },
      _count: { select: { interests: true } },
    },
  });
}

export async function getUserInterest(userId: string, eventId: string) {
  const interest = await db.event_interest.findUnique({
    where: { user_id_event_id: { user_id: userId, event_id: eventId } },
  });
  return !!interest;
}
