"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Input } from "@/app/_components/atoms";
import { Button } from "@/app/_components/atoms";
import { CategoryFilterBar } from "@/app/_components/molecules/CategoryFilterBar";
import { EventCard } from "@/app/_components/molecules/EventCard";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

type SearchViewProps = {
  events: EventWithDetails[];
  initialParams: { q?: string; category?: string; from?: string; to?: string };
};

export function SearchView({ events, initialParams }: SearchViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialParams.q ?? "");
  const [category, setCategory] = useState(initialParams.category ?? "");

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

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Input
            id="search"
            type="text"
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <CategoryFilterBar selected={category} onSelect={handleCategoryChange} />

      {events.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No events found. Try a different search or filter.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
