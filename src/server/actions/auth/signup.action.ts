"use server";

import { z } from "zod";
import { db } from "@/lib/db";

const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["USER", "BUSINESS"]),
});

type SignupResult =
  | { success: true; role: string }
  | { success: false; error: string };

export async function signupAction(input: {
  email: string;
  role: string;
}): Promise<SignupResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { email, role } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  await db.user.create({
    data: {
      email,
      role,
      is_approved: role === "USER",
    },
  });

  return { success: true, role };
}
