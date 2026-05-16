"use client";

import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Music", "Art", "Food", "Sport", "Tech", "Party", "Other"];

type CategoryFilterBarProps = {
  selected: string;
  onSelect: (category: string) => void;
};

export function CategoryFilterBar({ selected, onSelect }: CategoryFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const isActive = cat === "All" ? !selected : selected === cat.toLowerCase();
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat === "All" ? "" : cat.toLowerCase())}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
