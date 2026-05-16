"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

export async function toggleInterestAction(eventId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" } as const;
  }

  const userId = session.user.id;

  const existing = await db.event_interest.findUnique({
    where: { user_id_event_id: { user_id: userId, event_id: eventId } },
  });

  if (existing) {
    await db.event_interest.delete({
      where: { user_id_event_id: { user_id: userId, event_id: eventId } },
    });
    return { success: true, interested: false } as const;
  }

  await db.event_interest.create({
    data: { user_id: userId, event_id: eventId },
  });

  return { success: true, interested: true } as const;
}
