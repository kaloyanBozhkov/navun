import Link from "next/link";
import { EventCard } from "@/app/_components/molecules/EventCard";
import { HeroEvent } from "@/app/_components/molecules/HeroEvent";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

type LandingPageProps = {
  events: EventWithDetails[];
};

export function LandingPage({ events }: LandingPageProps) {
  const [featured, ...rest] = events;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav for logged-out */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card px-4 h-16 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">Навън</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Влез
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
          >
            Добави събитие
          </Link>
        </div>
      </nav>

      {/* Hero */}
      {featured && (
        <div className="px-4 pt-6 max-w-6xl mx-auto">
          <HeroEvent event={featured} />
        </div>
      )}

      {/* Events grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Предстоящи събития</h2>
          <Link href="/login" className="text-sm text-primary hover:underline">
            Виж всички →
          </Link>
        </div>

        {rest.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {rest.slice(0, 6).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Няма предстоящи събития за момента.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Навън © 2026 ·{" "}
          <Link href="/about" className="hover:underline">
            За нас
          </Link>{" "}
          ·{" "}
          <Link href="/terms" className="hover:underline">
            Условия
          </Link>{" "}
          ·{" "}
          <Link href="/contact" className="hover:underline">
            Контакт
          </Link>
        </p>
      </footer>
    </div>
  );
}
