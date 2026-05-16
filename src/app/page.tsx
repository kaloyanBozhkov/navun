import { getSession } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { getEvents } from "@/server/queries/event/getEvents.query";
import { LandingPage } from "@/app/_components/organisms/LandingPage";

export default async function RootPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/home");
  }

  const events = await getEvents();

  return <LandingPage events={events} />;
}
