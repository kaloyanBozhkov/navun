"use client";

import { useState } from "react";
import { EventCard } from "@/app/_components/molecules/EventCard";
import { CategoryFilterBar } from "@/app/_components/molecules/CategoryFilterBar";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

type EventFeedProps = {
  events: EventWithDetails[];
};

export function EventFeed({ events }: EventFeedProps) {
  const [category, setCategory] = useState("");

  const filtered = category
    ? events.filter((e) => e.category === category)
    : events;

  return (
    <div className="space-y-4">
      <CategoryFilterBar selected={category} onSelect={setCategory} />

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No events found for this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
