import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import { getIncomingRequests, getOutgoingRequests } from "@/server/queries/friendship/getPendingRequests.query";
import { AddFriendView } from "@/app/_components/organisms/AddFriendView";

export default async function AddFriendPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const [incoming, outgoing] = await Promise.all([
    getIncomingRequests(session.user.id),
    getOutgoingRequests(session.user.id),
  ]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-2xl font-bold">Add Friend</h1>
        <AddFriendView incoming={incoming} outgoing={outgoing} />
      </div>
    </main>
  );
}
