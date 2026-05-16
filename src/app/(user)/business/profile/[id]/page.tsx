import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EventCard } from "@/app/_components/molecules/EventCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PublicBusinessProfilePage({ params }: Props) {
  const { id } = await params;

  const business = await db.user.findUnique({
    where: { id, role: "BUSINESS", is_approved: true },
    include: {
      events: {
        where: { is_published: true },
        include: {
          business: { select: { name: true, username: true } },
          _count: { select: { interests: true } },
        },
        orderBy: { starts_at: "desc" },
      },
      _count: { select: { events: true } },
    },
  });

  if (!business) notFound();

  const eventCount = business._count.events;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative w-full h-48 md:h-64">
        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
        <Link
          href="/"
          className="absolute top-4 left-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white"
        >
          <ChevronLeft size={20} />
        </Link>
        {/* Business logo badge */}
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-card border-2 border-border flex items-center justify-center text-2xl font-bold text-primary z-10">
          {business.name?.[0]?.toUpperCase() ?? "B"}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 space-y-6">
            {/* Header info */}
            <div>
              <h1 className="text-xl font-bold">{business.name ?? "Бизнес"}</h1>
              {business.username && (
                <p className="text-sm text-muted-foreground">@{business.username}</p>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-lg font-bold">{eventCount}</p>
                <p className="text-xs text-muted-foreground">Събития</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">0</p>
                <p className="text-xs text-muted-foreground">Последователи</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">4.8</p>
                <p className="text-xs text-muted-foreground">Рейтинг</p>
              </div>
            </div>

            {/* Events */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Предстоящи събития</h2>
              </div>
              {business.events.length === 0 ? (
                <p className="text-muted-foreground">
                  Няма предстоящи събития.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {business.events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-card rounded-xl border border-border p-4 space-y-2">
              <h3 className="font-semibold text-sm">Контакт</h3>
              {business.email && (
                <p className="text-sm text-muted-foreground">{business.email}</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
