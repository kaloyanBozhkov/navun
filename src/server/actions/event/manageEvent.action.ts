"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

export async function togglePublishAction(eventId: string) {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" } as const;

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event || event.business_id !== session.user.id) {
    return { success: false, error: "Not authorized" } as const;
  }

  await db.event.update({
    where: { id: eventId },
    data: { is_published: !event.is_published },
  });

  return { success: true, isPublished: !event.is_published } as const;
}

export async function deleteEventAction(eventId: string) {
  const session = await getSession();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" } as const;

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event || event.business_id !== session.user.id) {
    return { success: false, error: "Not authorized" } as const;
  }

  await db.event_interest.deleteMany({ where: { event_id: eventId } });
  await db.event.delete({ where: { id: eventId } });

  return { success: true } as const;
}
