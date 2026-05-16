"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { Search, ArrowUpDown, Heart } from "lucide-react";
import Link from "next/link";
import { Input } from "@/app/_components/atoms";
import { Button } from "@/app/_components/atoms";
import { CategoryFilterBar } from "@/app/_components/molecules/CategoryFilterBar";
import { EventCard } from "@/app/_components/molecules/EventCard";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

const DATE_FILTERS = ["Всички", "Днес", "Тази седмица", "Този месец"] as const;

type SearchViewProps = {
  events: EventWithDetails[];
  initialParams: { q?: string; category?: string; from?: string; to?: string; date?: string };
};

function getDateRange(filter: string): { from: Date; to: Date } | null {
  const now = new Date();
  switch (filter) {
    case "Днес": {
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const to = new Date(from);
      to.setDate(to.getDate() + 1);
      return { from, to };
    }
    case "Тази седмица": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1; // Monday start
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
      const to = new Date(from);
      to.setDate(to.getDate() + 7);
      return { from, to };
    }
    case "Този месец": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { from, to };
    }
    default:
      return null;
  }
}

export function SearchView({ events, initialParams }: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialParams.q ?? "");
  const [category, setCategory] = useState(initialParams.category ?? "");
  const [activeDateFilter, setActiveDateFilter] = useState(initialParams.date ?? "Всички");
  const [sortAsc, setSortAsc] = useState(true);

  const updateSearch = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateSearch({ q: query });
  }

  function handleCategoryChange(cat: string) {
    setCategory(cat);
    updateSearch({ category: cat });
  }

  function handleDateFilterChange(filter: string) {
    setActiveDateFilter(filter);
    updateSearch({ date: filter === "Всички" ? "" : filter });
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = events;

    const range = getDateRange(activeDateFilter);
    if (range) {
      filtered = filtered.filter((event) => {
        const startsAt = new Date(event.starts_at);
        return startsAt >= range.from && startsAt < range.to;
      });
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.starts_at).getTime();
      const dateB = new Date(b.starts_at).getTime();
      return sortAsc ? dateA - dateB : dateB - dateA;
    });
  }, [events, activeDateFilter, sortAsc]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            type="text"
            className="pl-10"
            placeholder="Търсене на събития..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" className="hidden md:inline-flex">Търсене</Button>
      </form>

      <CategoryFilterBar selected={category} onSelect={handleCategoryChange} />

      {/* Date filter pills */}
      <div className="flex gap-2 overflow-x-auto py-2">
        {DATE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => handleDateFilterChange(f)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeDateFilter === f
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Result count + sort */}
      <div className="flex items-center justify-between py-2">
        <p className="text-sm text-muted-foreground">{filteredAndSorted.length} резултата</p>
        <button
          onClick={() => setSortAsc((prev) => !prev)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          По дата <ArrowUpDown size={14} />
        </button>
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Няма намерени събития. Опитайте с друго търсене или филтър.
        </p>
      ) : (
        <>
          {/* Mobile: vertical list */}
          <div className="flex flex-col gap-3 md:hidden">
            {filteredAndSorted.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="flex gap-3 rounded-xl border border-border bg-card p-3"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                    alt=""
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{event.title}</p>
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
                    <p className="truncate text-xs text-muted-foreground">{event.location}</p>
                  )}
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart size={10} /> {event._count?.interests ?? 0}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden gap-4 md:grid md:grid-cols-3">
            {filteredAndSorted.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
