"use client";

import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "", label: "Всички" },
  { value: "music", label: "Концерти" },
  { value: "art", label: "Изложби" },
  { value: "food", label: "Храна & Напитки" },
  { value: "sport", label: "Спорт" },
  { value: "tech", label: "Технологии" },
  { value: "party", label: "Партита" },
  { value: "nightlife", label: "Нощен живот" },
  { value: "weekend", label: "Уикенди" },
  { value: "other", label: "Друго" },
];

type CategoryFilterBarProps = {
  selected: string;
  onSelect: (category: string) => void;
};

export function CategoryFilterBar({ selected, onSelect }: CategoryFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map(({ value, label }) => {
        const isActive = value === "" ? !selected : selected === value;
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
