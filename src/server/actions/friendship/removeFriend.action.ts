"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth-client";

export async function removeFriendAction(friendId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" } as const;
  }

  const userId = session.user.id;

  const friendship = await db.friendship.findFirst({
    where: {
      OR: [
        { requester_id: userId, addressee_id: friendId },
        { requester_id: friendId, addressee_id: userId },
      ],
    },
  });

  if (!friendship) {
    return { success: false, error: "Friendship not found" } as const;
  }

  await db.friendship.delete({
    where: {
      requester_id_addressee_id: {
        requester_id: friendship.requester_id,
        addressee_id: friendship.addressee_id,
      },
    },
  });

  return { success: true } as const;
}
