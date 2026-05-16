import Link from "next/link";
import { Badge } from "@/app/_components/atoms";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

type HeroEventProps = {
  event: EventWithDetails;
};

export function HeroEvent({ event }: HeroEventProps) {
  return (
    <Link
      href={`/event/${event.id}`}
      className="group relative block overflow-hidden rounded-xl"
    >
      <div className="aspect-[16/7] bg-muted">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white md:p-6">
        <div className="flex items-center gap-2">
          {event.category && (
            <Badge category variant="secondary">
              {event.category}
            </Badge>
          )}
          <span className="text-sm opacity-80">
            {new Date(event.starts_at).toLocaleDateString("en-GB", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h2 className="mt-2 text-xl font-bold md:text-2xl">{event.title}</h2>
        {event.location && (
          <p className="mt-1 text-sm opacity-80">{event.location}</p>
        )}
      </div>
    </Link>
  );
}
