import { getEvents } from "@/server/queries/event/getEvents.query";
import { HeroEvent } from "@/app/_components/molecules/HeroEvent";
import { EventFeed } from "@/app/_components/organisms/EventFeed";

export default async function HomePage() {
  const events = await getEvents();
  const [featured, ...rest] = events;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-2xl font-bold md:text-3xl">Discover Events</h1>

        {featured && <HeroEvent event={featured} />}

        <EventFeed events={rest} />
      </div>
    </main>
  );
}
