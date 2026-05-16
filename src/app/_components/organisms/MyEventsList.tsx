"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/app/_components/atoms";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/_components/shadcn/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/_components/shadcn/dialog";
import { togglePublishAction, deleteEventAction } from "@/server/actions/event/manageEvent.action";

type EventItem = {
  id: string;
  title: string;
  starts_at: Date;
  category: string | null;
  is_published: boolean;
  image_url: string | null;
  _count: { interests: number };
};

type MyEventsListProps = {
  active: EventItem[];
  past: EventItem[];
  drafts: EventItem[];
};

export function MyEventsList({ active, past, drafts }: MyEventsListProps) {
  return (
    <Tabs defaultValue="active" className="space-y-4">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="active">Активни ({active.length})</TabsTrigger>
        <TabsTrigger value="past">Минали ({past.length})</TabsTrigger>
        <TabsTrigger value="drafts">Чернови ({drafts.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <EventList events={active} emptyText="Нямаш активни събития." />
      </TabsContent>
      <TabsContent value="past">
        <EventList events={past} emptyText="Нямаш минали събития." />
      </TabsContent>
      <TabsContent value="drafts">
        <EventList events={drafts} emptyText="Нямаш чернови." isDraft />
      </TabsContent>
    </Tabs>
  );
}

function EventList({ events, emptyText, isDraft }: { events: EventItem[]; emptyText: string; isDraft?: boolean }) {
  if (events.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">{emptyText}</p>;
  }
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <MyEventRow key={event.id} event={event} isDraft={isDraft} />
      ))}
    </div>
  );
}

function MyEventRow({ event, isDraft }: { event: EventItem; isDraft?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function handleTogglePublish() {
    startTransition(async () => {
      await togglePublishAction(event.id);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteEventAction(event.id);
      setShowDeleteDialog(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex gap-3 rounded-xl border border-border bg-card p-3">
        {/* Thumbnail */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          {event.image_url ? (
            <Image src={event.image_url} alt={event.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Без снимка
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <Link href={`/event/${event.id}`} className="line-clamp-1 text-sm font-medium hover:underline">
            {event.title}
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date(event.starts_at).toLocaleDateString("bg-BG", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart size={11} /> {event._count.interests}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                isDraft ? "bg-muted text-muted-foreground" : "bg-green-500/15 text-green-500"
              }`}
            >
              {isDraft ? "Чернова" : "Активно"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col gap-1.5">
          <button
            onClick={handleTogglePublish}
            disabled={isPending}
            className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <Pencil size={11} />
            {event.is_published ? "Скрий" : "Публикувай"}
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            disabled={isPending}
            className="flex items-center gap-1 rounded-lg border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
          >
            <Trash2 size={11} />
            Изтрий
          </button>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изтриване на събитие</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Сигурен ли си, че искаш да изтриеш &ldquo;{event.title}&rdquo;? Това действие е необратимо.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Отказ
            </Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={isPending}>
              Изтрий
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
