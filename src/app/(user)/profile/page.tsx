import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import { db } from "@/lib/db";
import { getFriends } from "@/server/queries/friendship/getFriends.query";
import { getUserInterests } from "@/server/queries/event/getUserInterests.query";
import { EventCard } from "@/app/_components/molecules/EventCard";
import { ProfileEditor } from "@/app/_components/organisms/ProfileEditor";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/login");

  const [friends, interests] = await Promise.all([
    getFriends(session.user.id),
    getUserInterests(session.user.id),
  ]);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Profile Header */}
        <ProfileEditor
          initialName={user.name ?? ""}
          initialUsername={user.username ?? ""}
          email={user.email}
        />

        {/* My Interests */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            My Interests ({interests.length})
          </h2>
          {interests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No events marked as interested yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {interests.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* My Friends */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Friends ({friends.length})
            </h2>
            <Link href="/add-friend" className="text-sm text-primary hover:underline">
              Add Friend
            </Link>
          </div>
          {friends.length === 0 ? (
            <p className="text-sm text-muted-foreground">No friends yet.</p>
          ) : (
            <ul className="space-y-2">
              {friends.map((friend) => (
                <li key={friend.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    {friend.username && (
                      <p className="text-sm text-muted-foreground">@{friend.username}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
