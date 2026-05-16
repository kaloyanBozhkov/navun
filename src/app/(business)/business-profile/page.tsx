import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-client";
import { db } from "@/lib/db";
import { EventCard } from "@/app/_components/molecules/EventCard";

export default async function BusinessProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      events: {
        include: {
          business: { select: { name: true, username: true } },
          _count: { select: { interests: true } },
        },
        orderBy: { starts_at: "desc" },
      },
    },
  });

  if (!user || user.role !== "BUSINESS") redirect("/");

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Business Header */}
        <div className="flex items-center gap-4 rounded-lg border p-6">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div>
            <h1 className="text-xl font-bold">{user.name ?? "Business"}</h1>
            {user.username && (
              <p className="text-muted-foreground">@{user.username}</p>
            )}
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {!user.is_approved && (
              <span className="mt-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                Pending Approval
              </span>
            )}
          </div>
        </div>

        {/* Events */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">
            My Events ({user.events.length})
          </h2>
          {user.events.length === 0 ? (
            <p className="text-muted-foreground">
              No events created yet. Create your first event!
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {user.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
