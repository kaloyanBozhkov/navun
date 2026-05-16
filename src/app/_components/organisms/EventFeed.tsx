"use client";

import { useState } from "react";
import Link from "next/link";
import { EventCard } from "@/app/_components/molecules/EventCard";
import { CategoryFilterBar } from "@/app/_components/molecules/CategoryFilterBar";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

type EventFeedProps = {
  events: EventWithDetails[];
  className?: string;
};

export function EventFeed({ events, className }: EventFeedProps) {
  const [category, setCategory] = useState("");

  const filtered = category
    ? events.filter((e) => e.category === category)
    : events;

  return (
    <div className={className}>
      <CategoryFilterBar selected={category} onSelect={setCategory} />

      <div className="mt-4 flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Предстоящи събития</h2>
        <Link href="/search" className="text-sm text-primary hover:underline">
          Виж всички &rarr;
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No events found for this category.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
