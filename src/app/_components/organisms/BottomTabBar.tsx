"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FC } from "react";

type BottomTabBarProps = {
  className?: string;
};

const tabs = [
  { href: "/", label: "Начало", icon: Home },
  { href: "/map", label: "Карта", icon: Map },
  { href: "/friends", label: "Приятели", icon: Users },
  { href: "/profile", label: "Профил", icon: User },
] as const;

export const BottomTabBar: FC<BottomTabBarProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card md:hidden",
        className
      )}
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
