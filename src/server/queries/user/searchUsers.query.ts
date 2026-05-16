import { db } from "@/lib/db";

export async function searchUsers(query: string, currentUserId: string) {
  if (!query || query.length < 2) return [];

  return db.user.findMany({
    where: {
      NOT: { id: currentUserId },
      OR: [
        { username: { contains: query } },
        { name: { contains: query } },
      ],
    },
    select: { id: true, name: true, username: true, image: true },
    take: 20,
  });
}
