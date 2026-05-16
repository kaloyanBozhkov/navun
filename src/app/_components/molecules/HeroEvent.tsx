import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/app/_components/atoms";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

type HeroEventProps = {
  event: EventWithDetails;
  className?: string;
};

export function HeroEvent({ event, className }: HeroEventProps) {
  return (
    <div className={className}>
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

        <span className="absolute left-4 top-4 rounded-full bg-blue-500/80 px-3 py-1 text-xs text-white">
          Препоръчано
        </span>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 space-y-2 p-4 text-white md:p-6">
          {event.location && (
            <p className="flex items-center gap-1 text-sm opacity-80">
              <MapPin size={14} />
              {event.location}
            </p>
          )}
          <h2 className="text-xl font-bold md:text-2xl">{event.title}</h2>
          <p className="text-sm opacity-80">
            {new Date(event.starts_at).toLocaleDateString("bg-BG", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button size="sm" className="bg-primary text-white">
              Отивам
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Научи повече
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
