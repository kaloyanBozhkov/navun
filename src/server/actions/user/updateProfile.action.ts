"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(50),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
});

export async function updateProfileAction(input: { name: string; username: string }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" } as const;
  }

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message } as const;
  }

  const existing = await db.user.findFirst({
    where: { username: parsed.data.username, NOT: { id: session.user.id } },
  });
  if (existing) {
    return { success: false, error: "Username already taken" } as const;
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name, username: parsed.data.username },
  });

  return { success: true } as const;
}
