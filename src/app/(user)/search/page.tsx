import { searchEvents } from "@/server/queries/event/searchEvents.query";
import { SearchView } from "@/app/_components/organisms/SearchView";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; from?: string; to?: string; date?: string }>;
}) {
  const params = await searchParams;
  const events = await searchEvents({
    query: params.q,
    category: params.category,
    startDate: params.from,
    endDate: params.to,
  });

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="hidden text-2xl font-bold md:block">Търсене и разглеждане</h1>
        <SearchView events={events} initialParams={params} />
      </div>
    </main>
  );
}
