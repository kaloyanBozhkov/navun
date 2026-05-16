import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth-client";
import { db } from "@/lib/db";
import { MyEventsList } from "@/app/_components/organisms/MyEventsList";

export default async function MyEventsPage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const events = await db.event.findMany({
    where: { business_id: session.user.id },
    include: { _count: { select: { interests: true } } },
    orderBy: { created_at: "desc" },
  });

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Events</h1>
          <Link
            href="/add-event"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create Event
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">
            No events yet. Create your first event!
          </p>
        ) : (
          <MyEventsList events={events} />
        )}
      </div>
    </main>
  );
}
