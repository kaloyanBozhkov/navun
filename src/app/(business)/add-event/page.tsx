"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";
import { createEventAction } from "@/server/actions/event/createEvent.action";

const CATEGORIES = ["music", "art", "food", "sport", "tech", "party", "other"];

export default function AddEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createEventAction({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      lat: formData.get("lat") ? Number(formData.get("lat")) : undefined,
      lng: formData.get("lng") ? Number(formData.get("lng")) : undefined,
      startsAt: formData.get("startsAt") as string,
      endsAt: (formData.get("endsAt") as string) || undefined,
      category: (formData.get("category") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      isPublished: formData.get("publish") === "true",
    });

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push(`/event/${result.eventId}`);
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Create Event</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="title" name="title" label="Title" required />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <Input id="location" name="location" label="Location" placeholder="e.g. Varna, Bulgaria" />

          <div className="grid grid-cols-2 gap-4">
            <Input id="lat" name="lat" label="Latitude" type="number" placeholder="43.2141" />
            <Input id="lng" name="lng" label="Longitude" type="number" placeholder="27.9147" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="startsAt" name="startsAt" label="Start Date/Time" type="datetime-local" required />
            <Input id="endsAt" name="endsAt" label="End Date/Time" type="datetime-local" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <Input id="imageUrl" name="imageUrl" label="Image URL" placeholder="https://..." />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" name="publish" value="true" isLoading={isLoading}>
              Publish
            </Button>
            <Button type="submit" name="publish" value="false" variant="outline" isLoading={isLoading}>
              Save as Draft
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
