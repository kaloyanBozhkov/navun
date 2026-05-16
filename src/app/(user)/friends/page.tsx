import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import { getFriendsWithEvents } from "@/server/queries/friendship/getFriendsWithEvents.query";
import { getAvatarColor } from "@/utils/avatarColor";
import Link from "next/link";
import { UserPlus, ChevronRight } from "lucide-react";

export default async function FriendsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const friendsWithEvents = await getFriendsWithEvents(session.user.id);

  return (
    <main className="min-h-screen">
      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <h1 className="text-xl font-bold">Приятели</h1>
        <Link
          href="/add-friend"
          className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white"
        >
          <UserPlus size={14} /> Добави
        </Link>
      </div>

      <div className="flex">
        {/* Main feed */}
        <div className="mx-auto max-w-2xl flex-1 space-y-6 px-4 py-4">
          {/* Desktop title row */}
          <div className="hidden items-center justify-between md:flex">
            <h1 className="text-2xl font-bold">Приятели</h1>
            <Link
              href="/add-friend"
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              <UserPlus size={16} /> Добави приятели
            </Link>
          </div>

          {friendsWithEvents.map((friend) => (
            <div key={friend.id} className="space-y-3">
              {/* Friend header row */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: getAvatarColor(friend.id) }}
                >
                  {friend.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{friend.username}
                  </p>
                </div>
              </div>

              {/* Event sub-cards */}
              {friend.interests.length > 0 ? (
                <div className="ml-[52px] space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Има интерес към:
                  </p>
                  {friend.interests.map((interest) => (
                    <Link
                      key={interest.event.id}
                      href={`/event/${interest.event.id}`}
                      className="flex gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                    >
                      {interest.event.image_url && (
                        <img
                          src={interest.event.image_url}
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                          alt=""
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {interest.event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            interest.event.starts_at
                          ).toLocaleDateString("bg-BG", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {interest.event.location && (
                          <p className="truncate text-xs text-muted-foreground">
                            {interest.event.location}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        size={16}
                        className="shrink-0 self-center text-muted-foreground"
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="ml-[52px] text-xs text-muted-foreground">
                  Няма нови интереси
                </p>
              )}
            </div>
          ))}

          {friendsWithEvents.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              Нямаш приятели все още. Добави нови!
            </p>
          )}
        </div>

        {/* Desktop right sidebar: Online friends */}
        <aside className="hidden w-64 shrink-0 px-4 py-4 lg:block">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold">Онлайн приятели</h3>
            <div className="space-y-3">
              {friendsWithEvents.slice(0, 5).map((friend) => (
                <div key={friend.id} className="flex items-center gap-2">
                  <div className="relative">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: getAvatarColor(friend.id) }}
                    >
                      {friend.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{friend.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
