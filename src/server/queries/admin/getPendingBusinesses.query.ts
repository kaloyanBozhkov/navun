import { db } from "@/lib/db";

export async function getPendingBusinesses() {
  return db.user.findMany({
    where: {
      role: "BUSINESS",
      is_approved: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      created_at: true,
    },
    orderBy: { created_at: "asc" },
  });
}

export type PendingBusiness = Awaited<ReturnType<typeof getPendingBusinesses>>[number];
