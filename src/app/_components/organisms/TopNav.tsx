"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, Bell, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FC } from "react";

type TopNavProps = {
  className?: string;
};

export const TopNav: FC<TopNavProps> = ({ className }) => {
  const { data: session } = useSession();

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 hidden h-16 items-center justify-between border-b border-border bg-card px-6 md:flex",
        className
      )}
    >
      {/* Left: Logo */}
      <Link href="/" className="text-xl font-bold text-primary">
        Навън
      </Link>

      {/* Center: Location pill */}
      <div className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Варна</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/search"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Search className="h-5 w-5" />
        </Link>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
        </button>
        <Link href="/profile">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
};
