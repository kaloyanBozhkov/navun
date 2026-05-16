import Link from "next/link";
import { Badge } from "@/app/_components/atoms";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

type EventCardProps = {
  event: EventWithDetails;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/event/${event.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-muted">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        )}
        {event.category && (
          <Badge category className="absolute left-2 top-2">
            {event.category}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 font-medium group-hover:text-primary">
          {event.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {new Date(event.starts_at).toLocaleDateString("bg-BG", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {event.location && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {event.location}
          </p>
        )}
        <p className="mt-auto pt-1 text-xs text-muted-foreground">
          {event._count.interests} interested
        </p>
      </div>
    </Link>
  );
}
