"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/_components/shadcn/tabs";
import {
  approveBusinessAction,
  rejectBusinessAction,
} from "@/server/actions/admin/manageBusiness.action";
import type { PendingBusiness } from "@/server/queries/admin/getPendingBusinesses.query";

export function BusinessApprovalPanel({ businesses }: { businesses: PendingBusiness[] }) {
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected">("pending");

  return (
    <Tabs defaultValue="pending" onValueChange={(v) => setFilter(v as typeof filter)}>
      <TabsList>
        <TabsTrigger value="pending">Чакащи ({businesses.length})</TabsTrigger>
        <TabsTrigger value="approved">Одобрени</TabsTrigger>
        <TabsTrigger value="rejected">Отказани</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        {businesses.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Няма чакащи заявки за одобрение.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((biz) => (
              <PendingBusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="approved">
        <p className="py-12 text-center text-sm text-muted-foreground">
          Одобрените бизнеси се показват тук.
        </p>
      </TabsContent>

      <TabsContent value="rejected">
        <p className="py-12 text-center text-sm text-muted-foreground">
          Отказаните бизнеси се показват тук.
        </p>
      </TabsContent>
    </Tabs>
  );
}

function PendingBusinessCard({ business }: { business: PendingBusiness }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [handled, setHandled] = useState(false);

  function handleApprove() {
    startTransition(async () => {
      await approveBusinessAction(business.id);
      setHandled(true);
      router.refresh();
    });
  }

  function handleReject() {
    startTransition(async () => {
      await rejectBusinessAction(business.id);
      setHandled(true);
      router.refresh();
    });
  }

  if (handled) return null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {business.name?.[0]?.toUpperCase() ?? "B"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold truncate">{business.name || "Без име"}</p>
          {business.username && (
            <p className="text-xs text-muted-foreground">@{business.username}</p>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-1 text-sm text-muted-foreground">
        <p>{business.email}</p>
        <p className="text-xs">
          Регистриран:{" "}
          {new Date(business.created_at).toLocaleDateString("bg-BG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={isPending}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          Одобри
        </button>
        <button
          onClick={handleReject}
          disabled={isPending}
          className="flex-1 rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 disabled:opacity-50"
        >
          Отхвърли
        </button>
      </div>
    </div>
  );
}
