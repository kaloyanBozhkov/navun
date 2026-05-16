import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import { getIncomingRequests, getOutgoingRequests } from "@/server/queries/friendship/getPendingRequests.query";
import { getSuggestedFriends } from "@/server/queries/friendship/getSuggestedFriends.query";
import { AddFriendView } from "@/app/_components/organisms/AddFriendView";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AddFriendPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const [incoming, outgoing, suggested] = await Promise.all([
    getIncomingRequests(session.user.id),
    getOutgoingRequests(session.user.id),
    getSuggestedFriends(session.user.id),
  ]);

  return (
    <main className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
        <Link href="/profile" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-semibold">Добави приятел</h1>
      </header>

      <div className="mx-auto max-w-lg p-4 md:p-8">
        {/* Desktop title */}
        <h1 className="mb-6 hidden text-2xl font-bold md:block">Добави приятел</h1>

        <div className="rounded-xl border border-border bg-card p-4 md:p-6">
          <AddFriendView incoming={incoming} outgoing={outgoing} suggested={suggested} />
        </div>
      </div>
    </main>
  );
}
