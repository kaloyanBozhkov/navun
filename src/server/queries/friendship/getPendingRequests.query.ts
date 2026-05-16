import { db } from "@/lib/db";

export async function getIncomingRequests(userId: string) {
  return db.friendship.findMany({
    where: { addressee_id: userId, status: "PENDING" },
    include: { requester: { select: { id: true, name: true, username: true, image: true } } },
  });
}

export async function getOutgoingRequests(userId: string) {
  return db.friendship.findMany({
    where: { requester_id: userId, status: "PENDING" },
    include: { addressee: { select: { id: true, name: true, username: true, image: true } } },
  });
}
