import { getEvents } from "@/server/queries/event/getEvents.query";
import { EventMap } from "@/app/_components/organisms/EventMap";

export default async function MapPage() {
  const events = await getEvents();

  return (
    <main className="h-screen w-full">
      <EventMap events={events} />
    </main>
  );
}
