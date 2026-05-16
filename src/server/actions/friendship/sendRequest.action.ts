"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

export async function sendFriendRequestAction(addresseeId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" } as const;
  }

  const userId = session.user.id;
  if (userId === addresseeId) {
    return { success: false, error: "Cannot add yourself" } as const;
  }

  // Check if friendship already exists in either direction
  const existing = await db.friendship.findFirst({
    where: {
      OR: [
        { requester_id: userId, addressee_id: addresseeId },
        { requester_id: addresseeId, addressee_id: userId },
      ],
    },
  });

  if (existing) {
    return { success: false, error: "Request already exists" } as const;
  }

  await db.friendship.create({
    data: { requester_id: userId, addressee_id: addresseeId, status: "PENDING" },
  });

  return { success: true } as const;
}

export async function respondFriendRequestAction(
  requesterId: string,
  action: "accept" | "reject"
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" } as const;
  }

  const status = action === "accept" ? "ACCEPTED" : "REJECTED";

  await db.friendship.update({
    where: {
      requester_id_addressee_id: {
        requester_id: requesterId,
        addressee_id: session.user.id,
      },
    },
    data: { status },
  });

  return { success: true } as const;
}
