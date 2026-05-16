"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/_components/shadcn/tabs";
import { togglePublishAction, deleteEventAction } from "@/server/actions/event/manageEvent.action";

type EventItem = {
  id: string;
  title: string;
  image_url: string | null;
  starts_at: Date;
  category: string | null;
  is_published: boolean;
  _count: { interests: number };
};

type MyEventsListProps = {
  events: EventItem[];
  upcomingCount: number;
  pastCount: number;
};

export function MyEventsList({ events, upcomingCount, pastCount }: MyEventsListProps) {
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.starts_at) >= now);
  const past = events.filter((e) => new Date(e.starts_at) < now);
  const drafts = events.filter((e) => !e.is_published);

  return (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Активни ({upcomingCount})</TabsTrigger>
        <TabsTrigger value="past">Минали ({pastCount})</TabsTrigger>
        <TabsTrigger value="draft" className="hidden md:inline-flex">
          Чернови ({drafts.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <EventList events={upcoming} emptyText="Няма активни събития." />
      </TabsContent>
      <TabsContent value="past">
        <EventList events={past} emptyText="Няма минали събития." />
      </TabsContent>
      <TabsContent value="draft">
        <EventList events={drafts} emptyText="Няма чернови." />
      </TabsContent>
    </Tabs>
  );
}

function EventList({ events, emptyText }: { events: EventItem[]; emptyText: string }) {
  if (events.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyText}</p>;
  }
  return (
    <div className="mt-4 space-y-3">
      {events.map((event) => (
        <MyEventRow key={event.id} event={event} />
      ))}
    </div>
  );
}

function MyEventRow({ event }: { event: EventItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteEventAction(event.id);
      setShowDeleteConfirm(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
        {/* Thumbnail */}
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {event.image_url && (
            <img src={event.image_url} alt="" className="h-full w-full object-cover" />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 space-y-1">
          <Link href={`/event/${event.id}`} className="block text-sm font-semibold hover:text-primary line-clamp-1">
            {event.title}
          </Link>
          <p className="text-xs text-muted-foreground">
            {new Date(event.starts_at).toLocaleDateString("bg-BG", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart size={12} />
              {event._count.interests}
            </span>
            {event.is_published ? (
              <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">
                Активно
              </span>
            ) : (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Чернова
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <Link
            href={`/event/${event.id}`}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <Pencil size={16} />
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isPending}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-red-500/10 text-red-500 disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-xl bg-card border border-border p-6 space-y-4">
            <h3 className="text-lg font-semibold">Изтриване на събитие</h3>
            <p className="text-sm text-muted-foreground">
              Сигурни ли сте, че искате да изтриете &ldquo;{event.title}&rdquo;? Това действие не може да бъде отменено.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Отказ
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Изтрий
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
