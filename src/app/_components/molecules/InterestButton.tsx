"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
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
    setInterested(!interested);
    setCount((c) => (interested ? c - 1 : c + 1));

    startTransition(async () => {
      const result = await toggleInterestAction(eventId);
      if (!result.success) {
        setInterested(interested);
        setCount(count);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleToggle}
        variant={interested ? "default" : "outline"}
        isLoading={isPending}
      >
        <Heart size={16} className="mr-2" />
        {interested ? "Имам интерес" : "Имам интерес"}
      </Button>
      <span className="text-sm font-semibold text-muted-foreground">{count}</span>
    </div>
  );
}
