"use server";

import { getSession } from "@/lib/auth-client";
import { searchUsers } from "@/server/queries/user/searchUsers.query";

export async function searchUsersAction(query: string) {
  const session = await getSession();
  const currentUserId = session?.user?.id ?? "";
  return searchUsers(query, currentUserId);
}
