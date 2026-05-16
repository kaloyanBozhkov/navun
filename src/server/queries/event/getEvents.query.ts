import { db } from "@/lib/db";

export async function getEvents(category?: string) {
  return db.event.findMany({
    where: {
      is_published: true,
      ...(category ? { category } : {}),
      starts_at: { gte: new Date() },
    },
    include: {
      business: { select: { name: true, username: true } },
      _count: { select: { interests: true } },
    },
    orderBy: { starts_at: "asc" },
  });
}

export type EventWithDetails = Awaited<ReturnType<typeof getEvents>>[number];
