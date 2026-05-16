import { db } from "@/lib/db";

type SearchParams = {
  query?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
};

export async function searchEvents({ query, category, startDate, endDate }: SearchParams) {
  return db.event.findMany({
    where: {
      is_published: true,
      ...(query ? { title: { contains: query } } : {}),
      ...(category ? { category } : {}),
      ...(startDate || endDate
        ? {
            starts_at: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(endDate) } : {}),
            },
          }
        : {}),
    },
    include: {
      business: { select: { name: true, username: true } },
      _count: { select: { interests: true } },
    },
    orderBy: { starts_at: "asc" },
    take: 50,
  });
}
