"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

export async function approveBusinessAction(businessId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" } as const;
  }

  const admin = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!admin || admin.role !== "ADMIN") {
    return { success: false, error: "Not authorized" } as const;
  }

  const business = await db.user.findUnique({ where: { id: businessId } });
  if (!business || business.role !== "BUSINESS") {
    return { success: false, error: "Business not found" } as const;
  }

  await db.user.update({
    where: { id: businessId },
    data: { is_approved: true },
  });

  return { success: true } as const;
}
