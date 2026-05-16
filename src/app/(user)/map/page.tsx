import { getEvents } from "@/server/queries/event/getEvents.query";
import { MapPageClient } from "./MapPageClient";

export default async function MapPage() {
  const events = await getEvents();

  return <MapPageClient events={events} />;
}
