import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Calendar, MapPin } from "lucide-react";
import { getEventById, getUserInterest } from "@/server/queries/event/getEventById.query";
import { getFriendsInterestedInEvent } from "@/server/queries/event/getFriendsInterestedInEvent.query";
import { getSession } from "@/lib/auth-client";
import { Button } from "@/app/_components/atoms";
import { InterestButton } from "@/app/_components/molecules/InterestButton";
import { MiniMap } from "@/app/_components/molecules/MiniMap";

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  const session = await getSession();
  const isInterested = session?.user?.id
    ? await getUserInterest(session.user.id, event.id)
    : false;

  const friendsInterested = session?.user?.id
    ? await getFriendsInterestedInEvent(event.id, session.user.id)
    : [];

  return (
    <main className="min-h-screen">
      {/* Hero Image */}
      <div className="relative w-full" style={{ height: "50vh" }}>
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        {/* Back arrow overlay */}
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white"
        >
          <ChevronLeft size={20} />
        </Link>
        {/* Category pill overlay */}
        {event.category && (
          <span className="absolute top-4 right-4 z-10 rounded-full bg-primary/80 px-3 py-1 text-xs text-white font-medium">
            {event.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="md:grid md:grid-cols-[1fr,380px] md:gap-8">
          {/* Left column: description + location */}
          <div className="space-y-6 py-6">
            {/* Description */}
            {event.description && (
              <div className="space-y-2">
                <h2 className="font-semibold">За събитието</h2>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {event.description}
                </p>
              </div>
            )}

            {/* Location */}
            {event.location && (
              <div className="space-y-2">
                <h2 className="font-semibold">Локация</h2>
                <p className="text-muted-foreground">
                  <MapPin size={14} className="inline mr-1 text-muted-foreground" />
                  {event.location}
                </p>
                {event.lat && event.lng && (
                  <div className="mt-2 h-40 rounded-lg overflow-hidden">
                    <MiniMap lat={event.lat} lng={event.lng} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column: sticky info card */}
          <div className="md:sticky md:top-20 md:self-start py-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h1 className="text-xl font-bold mb-2">{event.title}</h1>

              {/* Date with Calendar icon */}
              <p className="text-muted-foreground mb-2">
                <Calendar size={14} className="inline mr-1 text-muted-foreground" />
                {new Date(event.starts_at).toLocaleDateString("bg-BG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {event.ends_at && (
                  <>
                    {" — "}
                    {new Date(event.ends_at).toLocaleTimeString("bg-BG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </>
                )}
              </p>

              {/* Location with MapPin icon */}
              {event.location && (
                <p className="text-muted-foreground mb-4">
                  <MapPin size={14} className="inline mr-1 text-muted-foreground" />
                  {event.location}
                </p>
              )}

              {/* Organizer */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Организатор</p>
                <Link
                  href={`/business/profile/${event.business_id}`}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  {event.business.name ?? event.business.username}
                </Link>
              </div>

              {/* Interest button */}
              <InterestButton
                eventId={event.id}
                initialInterested={isInterested}
                initialCount={event._count.interests}
              />

              {/* Friends interested */}
              {friendsInterested.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Приятели с интерес:</p>
                  <div className="flex items-center gap-2">
                    {friendsInterested.slice(0, 3).map((fi) => (
                      <div
                        key={fi.user.id}
                        className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold"
                      >
                        {fi.user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    ))}
                    {friendsInterested.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{friendsInterested.length - 3} още
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Share button */}
              <Button variant="outline" className="w-full mt-3">
                Сподели събитие
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
