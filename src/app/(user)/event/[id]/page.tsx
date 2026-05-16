import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventById, getUserInterest } from "@/server/queries/event/getEventById.query";
import { getSession } from "@/lib/auth-client";
import { Badge } from "@/app/_components/atoms";
import { InterestButton } from "@/app/_components/molecules/InterestButton";

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

  return (
    <main className="min-h-screen">
      {/* Hero Image */}
      <div className="relative aspect-[16/9] max-h-80 w-full bg-muted md:aspect-[21/9]">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {event.category && <Badge category>{event.category}</Badge>}
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">{event.title}</h1>
          <p className="text-muted-foreground">
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
        </div>

        {/* Interest Button */}
        <InterestButton
          eventId={event.id}
          initialInterested={isInterested}
          initialCount={event._count.interests}
        />

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
            <h2 className="font-semibold">Location</h2>
            <p className="text-muted-foreground">{event.location}</p>
          </div>
        )}

        {/* Business */}
        <div className="space-y-2">
          <h2 className="font-semibold">Organized by</h2>
          <Link
            href={`/profile`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            {event.business.name ?? event.business.username}
          </Link>
        </div>
      </div>
    </main>
  );
}
