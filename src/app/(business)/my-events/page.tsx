import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
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

  const now = new Date();
  const active = events.filter((e) => e.is_published && new Date(e.starts_at) >= now);
  const past = events.filter((e) => e.is_published && new Date(e.starts_at) < now);
  const drafts = events.filter((e) => !e.is_published);

  return (
    <main className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="flex items-center justify-between px-4 py-3 md:hidden">
        <h1 className="text-xl font-bold">Моите събития</h1>
        <Link
          href="/add-event"
          className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-white"
        >
          <Plus size={14} /> Ново
        </Link>
      </header>

      <div className="mx-auto max-w-4xl p-4 md:p-8">
        {/* Desktop title */}
        <div className="mb-6 hidden items-center justify-between md:flex">
          <h1 className="text-2xl font-bold">Моите събития</h1>
          <Link
            href="/add-event"
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            <Plus size={16} /> Ново събитие
          </Link>
        </div>

        <MyEventsList active={active} past={past} drafts={drafts} />
      </div>
    </main>
  );
}
