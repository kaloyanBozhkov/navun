"use client";

import { useState, useTransition } from "react";
import { Button } from "@/app/_components/atoms";
import { toggleInterestAction } from "@/server/actions/event/toggleInterest.action";

type InterestButtonProps = {
  eventId: string;
  initialInterested: boolean;
  initialCount: number;
};

export function InterestButton({
  eventId,
  initialInterested,
  initialCount,
}: InterestButtonProps) {
  const [interested, setInterested] = useState(initialInterested);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    // Optimistic update
    setInterested(!interested);
    setCount((c) => (interested ? c - 1 : c + 1));

    startTransition(async () => {
      const result = await toggleInterestAction(eventId);
      if (!result.success) {
        // Revert on failure
        setInterested(interested);
        setCount(count);
      }
    });
  }

  return (
    <Button
      onClick={handleToggle}
      variant={interested ? "default" : "outline"}
      isLoading={isPending}
    >
      {interested ? "Interested" : "Mark as Interested"} ({count})
    </Button>
  );
}
