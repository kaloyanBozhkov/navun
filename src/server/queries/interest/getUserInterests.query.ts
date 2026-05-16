import { db } from "@/lib/db";

export async function getUserInterests(userId: string) {
  const interests = await db.event_interest.findMany({
    where: { user_id: userId },
    include: {
      event: {
        include: {
          business: { select: { name: true, username: true } },
          _count: { select: { interests: true } },
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  return interests.map((i) => i.event);
}
