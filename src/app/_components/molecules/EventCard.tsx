import Link from "next/link";
import { Calendar, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, Button } from "@/app/_components/atoms";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

type EventCardProps = {
  event: EventWithDetails;
  className?: string;
};

export function EventCard({ event, className }: EventCardProps) {
  return (
    <Link
      href={`/event/${event.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-[16/9] bg-muted">
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

      <div className="flex flex-1 flex-col gap-1.5 bg-card p-3">
        <h3 className="line-clamp-1 text-sm font-bold text-white group-hover:text-primary">
          {event.title}
        </h3>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar size={12} />
          {new Date(event.starts_at).toLocaleDateString("bg-BG", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {event.location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground line-clamp-1">
            <MapPin size={12} />
            {event.location}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <Button size="sm" variant="outline">
            Отивам
          </Button>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart size={14} />
            {event._count.interests}
          </span>
        </div>
      </div>
    </Link>
  );
}
