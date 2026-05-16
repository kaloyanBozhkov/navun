"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  location: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export async function createEventAction(input: z.input<typeof createEventSchema>) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" } as const;
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || (user.role !== "BUSINESS" && user.role !== "ADMIN")) {
    return { success: false, error: "Only business accounts can create events" } as const;
  }

  if (user.role === "BUSINESS" && !user.is_approved) {
    return { success: false, error: "Your business account is pending approval" } as const;
  }

  const parsed = createEventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message } as const;
  }

  const { startsAt, endsAt, imageUrl, isPublished, ...rest } = parsed.data;

  const event = await db.event.create({
    data: {
      ...rest,
      starts_at: new Date(startsAt),
      ends_at: endsAt ? new Date(endsAt) : null,
      image_url: imageUrl ?? null,
      is_published: isPublished,
      business_id: session.user.id,
    },
  });

  return { success: true, eventId: event.id } as const;
}
