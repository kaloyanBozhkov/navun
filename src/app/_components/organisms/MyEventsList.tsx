"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/_components/atoms";
import { Badge } from "@/app/_components/atoms";
import { togglePublishAction, deleteEventAction } from "@/server/actions/event/manageEvent.action";

type EventItem = {
  id: string;
  title: string;
  starts_at: Date;
  category: string | null;
  is_published: boolean;
  _count: { interests: number };
};

export function MyEventsList({ events }: { events: EventItem[] }) {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <MyEventRow key={event.id} event={event} />
      ))}
    </div>
  );
}

function MyEventRow({ event }: { event: EventItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleTogglePublish() {
    startTransition(async () => {
      await togglePublishAction(event.id);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteEventAction(event.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="min-w-0 flex-1 space-y-1">
        <Link href={`/event/${event.id}`} className="font-medium hover:underline">
          {event.title}
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {new Date(event.starts_at).toLocaleDateString("en-GB", {
              month: "short",
              day: "numeric",
            })}
          </span>
          {event.category && <Badge category>{event.category}</Badge>}
          <span>{event._count.interests} interested</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={event.is_published ? "default" : "secondary"}>
          {event.is_published ? "Published" : "Draft"}
        </Badge>
        <Button size="sm" variant="outline" onClick={handleTogglePublish} isLoading={isPending}>
          {event.is_published ? "Unpublish" : "Publish"}
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete} isLoading={isPending}>
          Delete
        </Button>
      </div>
    </div>
  );
}
