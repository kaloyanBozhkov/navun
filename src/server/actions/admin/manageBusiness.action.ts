"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user?.id) return { error: "Not authenticated" } as const;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (!user || user.role !== "ADMIN") return { error: "Not authorized" } as const;

  return { userId: session.user.id };
}

export async function approveBusinessAction(businessId: string) {
  const auth = await requireAdmin();
  if ("error" in auth) return { success: false, error: auth.error } as const;

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

export async function rejectBusinessAction(businessId: string) {
  const auth = await requireAdmin();
  if ("error" in auth) return { success: false, error: auth.error } as const;

  const business = await db.user.findUnique({ where: { id: businessId } });
  if (!business || business.role !== "BUSINESS") {
    return { success: false, error: "Business not found" } as const;
  }

  // Reset to USER role on rejection
  await db.user.update({
    where: { id: businessId },
    data: { role: "USER", is_approved: false },
  });

  return { success: true } as const;
}
