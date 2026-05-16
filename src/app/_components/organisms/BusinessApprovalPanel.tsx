"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/atoms";
import {
  approveBusinessAction,
  rejectBusinessAction,
} from "@/server/actions/admin/manageBusiness.action";
import type { PendingBusiness } from "@/server/queries/admin/getPendingBusinesses.query";

export function BusinessApprovalPanel({ businesses }: { businesses: PendingBusiness[] }) {
  if (businesses.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No pending approvals
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {businesses.map((biz) => (
        <PendingBusinessCard key={biz.id} business={biz} />
      ))}
    </div>
  );
}

function PendingBusinessCard({ business }: { business: PendingBusiness }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      await approveBusinessAction(business.id);
      router.refresh();
    });
  }

  function handleReject() {
    if (!confirm("Reject this business? Their role will be reset to USER.")) return;
    startTransition(async () => {
      await rejectBusinessAction(business.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-medium">{business.name || "Unnamed"}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{business.email}</span>
          <span>&middot;</span>
          <span>
            Registered{" "}
            {new Date(business.created_at).toLocaleDateString("bg-BG", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleApprove} isLoading={isPending}>
          Approve
        </Button>
        <Button size="sm" variant="destructive" onClick={handleReject} isLoading={isPending}>
          Reject
        </Button>
      </div>
    </div>
  );
}
