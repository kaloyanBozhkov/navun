import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings, ChevronRight } from "lucide-react";
import { getSession } from "@/lib/auth-client";
import { getFriends } from "@/server/queries/friendship/getFriends.query";
import { getUserInterests } from "@/server/queries/event/getUserInterests.query";
import { getUserProfile } from "@/server/queries/user/getUserProfile.query";
import { EventCard } from "@/app/_components/molecules/EventCard";
import { ProfileEditor } from "@/app/_components/organisms/ProfileEditor";
import { getAvatarColor } from "@/utils/avatarColor";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const [profile, friends, interests] = await Promise.all([
    getUserProfile(session.user.id),
    getFriends(session.user.id),
    getUserInterests(session.user.id),
  ]);

  if (!profile) redirect("/login");

  return (
    <main className="min-h-screen">
      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 py-3 md:hidden">
        <h1 className="text-xl font-bold">Профил</h1>
        <Link href="/profile/settings" className="text-muted-foreground">
          <Settings size={20} />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Profile header - full width */}
        <div className="py-6">
          <ProfileEditor
            userId={profile.id}
            initialName={profile.name ?? ""}
            initialUsername={profile.username ?? ""}
            email={profile.email}
            image={profile.image}
            interestCount={profile.interestCount}
            friendCount={profile.friendCount}
            visitedCount={profile.visitedCount}
          />
        </div>

        {/* Content columns */}
        <div className="md:grid md:grid-cols-[1fr,300px] md:gap-8">
          {/* Left: Моите интереси */}
          <section className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Моите интереси</h2>
              <Link
                href="/search"
                className="text-sm text-primary hover:underline"
              >
                Виж всички →
              </Link>
            </div>

            {interests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Все още няма отбелязани събития.
              </p>
            ) : (
              <>
                {/* Mobile: horizontal list */}
                <div className="flex flex-col gap-3 md:hidden">
                  {interests.map((interest) => (
                    <Link
                      key={interest.event.id}
                      href={`/event/${interest.event.id}`}
                      className="flex gap-3 rounded-xl border border-border bg-card p-3"
                    >
                      {interest.event.image_url && (
                        <img
                          src={interest.event.image_url}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                          alt=""
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {interest.event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(interest.event.starts_at).toLocaleDateString(
                            "bg-BG",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        {interest.event.location && (
                          <p className="text-xs text-muted-foreground truncate">
                            {interest.event.location}
                          </p>
                        )}
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-muted-foreground self-center shrink-0"
                      />
                    </Link>
                  ))}
                </div>
                {/* Desktop: EventCard grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-4">
                  {interests.map((interest) => (
                    <EventCard key={interest.event.id} event={interest.event} />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Right: Приятели */}
          <section className="mt-8 md:mt-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Приятели</h2>
              <Link
                href="/add-friend"
                className="text-sm text-primary hover:underline"
              >
                Виж всички →
              </Link>
            </div>

            {friends.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Все още нямаш приятели.
              </p>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {friends.slice(0, 8).map((friend) => (
                  <div
                    key={friend.id}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: getAvatarColor(friend.id) }}
                    >
                      {friend.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="text-xs text-muted-foreground truncate max-w-[40px]">
                      {friend.name?.split(" ")[0]}
                    </span>
                  </div>
                ))}
                {friends.length > 8 && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      +{friends.length - 8}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
