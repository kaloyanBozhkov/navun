"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

const updateEventSchema = z.object({
  eventId: z.string().min(1),
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function updateEventAction(input: z.input<typeof updateEventSchema>) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" } as const;
  }

  const parsed = updateEventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message } as const;
  }

  const { eventId, startsAt, endsAt, imageUrl, isPublished, ...rest } = parsed.data;

  const event = await db.event.findUnique({ where: { id: eventId } });
  if (!event || event.business_id !== session.user.id) {
    return { success: false, error: "Not authorized" } as const;
  }

  await db.event.update({
    where: { id: eventId },
    data: {
      ...rest,
      ...(startsAt !== undefined && { starts_at: new Date(startsAt) }),
      ...(endsAt !== undefined && { ends_at: endsAt ? new Date(endsAt) : null }),
      ...(imageUrl !== undefined && { image_url: imageUrl || null }),
      ...(isPublished !== undefined && { is_published: isPublished }),
    },
  });

  return { success: true } as const;
}
