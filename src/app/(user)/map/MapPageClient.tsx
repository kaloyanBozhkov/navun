"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { EventMap } from "@/app/_components/organisms/EventMap";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

const CATEGORIES = ["Всички", "Нощен живот", "Концерти", "Изложби", "Спорт", "Храна & Напитки", "Уикенди"];

type MapPageClientProps = {
  events: EventWithDetails[];
};

export function MapPageClient({ events }: MapPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("Всички");

  const filteredEvents =
    activeCategory === "Всички"
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <main className="h-screen w-full flex flex-col">
      <div className="px-4 py-3 md:hidden">
        <h1 className="text-xl font-bold">Карта</h1>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-72 shrink-0 bg-card border-r border-border flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold mb-3">Карта</h1>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredEvents
              .filter((e) => e.lat && e.lng)
              .map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="flex gap-3 p-3 border-b border-border hover:bg-muted/50 transition-colors"
                >
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      className="w-[60px] h-[60px] rounded-lg object-cover shrink-0"
                      alt=""
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.starts_at).toLocaleDateString("bg-BG", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {event.location && (
                      <p className="text-xs text-muted-foreground truncate">
                        {event.location}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        </aside>

        {/* Map area */}
        <div className="relative flex-1">
          {/* Mobile search overlay */}
          <div className="absolute top-4 left-4 right-16 z-[1000] md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                placeholder="Търси събитие или място..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-card text-foreground border border-border text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile filters button */}
          <button className="absolute top-4 right-4 z-[1000] flex items-center gap-1 bg-card text-foreground border border-border rounded-full px-3 py-2 text-sm md:hidden">
            <SlidersHorizontal size={14} /> Филтри
          </button>

          <EventMap events={filteredEvents} />
        </div>
      </div>
    </main>
  );
}
