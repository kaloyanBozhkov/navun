import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-client";
import { db } from "@/lib/db";
import { MyEventsList } from "@/app/_components/organisms/MyEventsList";
import { Plus } from "lucide-react";

export default async function MyEventsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const events = await db.event.findMany({
    where: { business_id: session.user.id },
    include: { _count: { select: { interests: true } } },
    orderBy: { created_at: "desc" },
  });

  const now = new Date();
  const upcomingEvents = events.filter((e) => new Date(e.starts_at) >= now);
  const pastEvents = events.filter((e) => new Date(e.starts_at) < now);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Моите събития</h1>
          <Link
            href="/add-event"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            <Plus size={16} />
            Ново
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            Все още нямате събития. Създайте първото си събитие!
          </p>
        ) : (
          <MyEventsList
            events={events}
            upcomingCount={upcomingEvents.length}
            pastCount={pastEvents.length}
          />
        )}
      </div>
    </main>
  );
}
