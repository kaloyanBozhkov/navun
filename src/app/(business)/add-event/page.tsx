"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, ImageIcon, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";
import { createEventAction } from "@/server/actions/event/createEvent.action";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "nightlife", label: "Нощен живот" },
  { value: "concerts", label: "Концерти" },
  { value: "weekends", label: "Уикенди" },
  { value: "exhibitions", label: "Изложби" },
  { value: "sport", label: "Спорт" },
  { value: "food", label: "Храна & Напитки" },
  { value: "other", label: "Друго" },
];

export default function AddEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, publish: boolean) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const startsAt = date && time ? `${date}T${time}` : (date ?? "");

    const result = await createEventAction({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      startsAt,
      category: (formData.get("category") as string) || undefined,
      imageUrl: imageUrl || undefined,
      isPublished: publish,
    });

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push(`/event/${result.eventId}`);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
        <Link href="/my-events" className="text-muted-foreground hover:text-foreground">
          <X size={20} />
        </Link>
        <h1 className="text-lg font-semibold">Ново събитие</h1>
      </header>

      <div className="mx-auto max-w-4xl p-4 md:p-8">
        {/* Desktop title */}
        <div className="mb-6 hidden items-center gap-4 md:flex">
          <Link href="/my-events" className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Ново събитие</h1>
        </div>

        <form
          onSubmit={(e) => handleSubmit(e, true)}
          className="md:grid md:grid-cols-[1fr,380px] md:gap-8"
        >
          {/* Left column: image + description */}
          <div className="space-y-4">
            {/* Image upload zone */}
            <div>
              <label
                htmlFor="image-upload"
                className={cn(
                  "flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card transition-colors hover:border-primary/50",
                  imagePreview && "border-solid border-primary/30 p-0"
                )}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon size={32} className="opacity-60" />
                    <p className="text-sm font-medium">Добави снимка за събитието</p>
                    <p className="text-xs opacity-60">Препоръчителен размер: 1200 x 630</p>
                  </div>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
              <input
                type="url"
                placeholder="или въведи URL на снимка..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  if (e.target.value) setImagePreview(e.target.value);
                }}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Опиши събитието..."
                className="rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Right column: fields + publish */}
          <div className="mt-4 space-y-4 md:mt-0">
            <Input id="title" name="title" label="Ime на събитието" required />

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium">
                Категория
              </label>
              <select
                id="category"
                name="category"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Избери категория</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="date" className="text-sm font-medium">
                  Дата
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="time" className="text-sm font-medium">
                  Час
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="time"
                    name="time"
                    type="time"
                    required
                    className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="text-sm font-medium">
                Локация
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Адрес или им на место"
                  className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              isLoading={isLoading}
            >
              + Публикувай събитие
            </Button>

            {/* Draft button - desktop only */}
            <Button
              type="button"
              variant="outline"
              className="hidden w-full md:flex"
              isLoading={isLoading}
            >
              Запази като чернова
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
