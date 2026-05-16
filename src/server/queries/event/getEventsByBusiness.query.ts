import { db } from "@/lib/db";

export async function getEventsByBusiness(businessId: string) {
  return db.event.findMany({
    where: { business_id: businessId },
    include: { _count: { select: { interests: true } } },
    orderBy: { created_at: "desc" },
  });
}
