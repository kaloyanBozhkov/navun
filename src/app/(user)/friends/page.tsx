import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import { getFriends } from "@/server/queries/friendship/getFriends.query";
import { getFriendsEvents } from "@/server/queries/event/getFriendsEvents.query";
import { EventCard } from "@/app/_components/molecules/EventCard";
import Link from "next/link";

export default async function FriendsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const friends = await getFriends(session.user.id);
  const friendIds = friends.map((f) => f.id);
  const events = await getFriendsEvents(friendIds);

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Friends Sidebar */}
          <aside className="w-full shrink-0 space-y-3 md:w-64">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Приятели ({friends.length})</h2>
              <Link href="/add-friend" className="text-sm text-primary hover:underline">
                Добави
              </Link>
            </div>
            {friends.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Все още нямаш приятели.{" "}
                <Link href="/add-friend" className="text-primary underline">
                  Добави!
                </Link>
              </p>
            ) : (
              <ul className="space-y-2">
                {friends.map((friend) => (
                  <li key={friend.id} className="flex items-center gap-2">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-muted" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{friend.name}</p>
                      {friend.username && (
                        <p className="truncate text-xs text-muted-foreground">
                          @{friend.username}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Friends Event Feed */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold">Приятели</h1>
            {events.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                Все още няма събития от приятели. Събитията, които интересуват приятелите ти, ще се появят тук.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
