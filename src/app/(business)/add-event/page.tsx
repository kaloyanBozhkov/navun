"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/atoms";
import { Input } from "@/app/_components/atoms";
import { createEventAction } from "@/server/actions/event/createEvent.action";
import { ImageIcon, Calendar, Clock, MapPin, Plus, X } from "lucide-react";

const CATEGORIES = ["music", "art", "food", "sport", "tech", "party", "other"];
const CATEGORY_LABELS: Record<string, string> = {
  music: "Музика",
  art: "Изкуство",
  food: "Храна",
  sport: "Спорт",
  tech: "Технологии",
  party: "Парти",
  other: "Друго",
};

export default function AddEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      // For demo: store as object URL; real impl would upload
      setImageUrl(preview);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const startsAt = date && time ? `${date}T${time}` : (date || "");

    const result = await createEventAction({
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      location: (formData.get("location") as string) || undefined,
      startsAt,
      category: (formData.get("category") as string) || undefined,
      imageUrl: imageUrl || undefined,
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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <h1 className="text-lg font-semibold">Ново събитие</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted text-muted-foreground"
        >
          <X size={20} />
        </button>
      </header>

      <div className="mx-auto max-w-4xl p-4 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
          {/* Left column: Image + Description */}
          <div className="space-y-4">
            {/* Image upload zone */}
            {imagePreview ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageUrl(""); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors">
                <ImageIcon size={32} className="text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Добави снимка за събитието</p>
                <p className="text-xs text-muted-foreground">Препоръчителен размер: 1200 × 630</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="text-sm font-medium">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Разкажи повече за събитието..."
                className="rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
          </div>

          {/* Right column: Name, Category, Date/Time, Location, Publish */}
          <div className="space-y-4">
            <Input id="title" name="title" label="Заглавие" placeholder="Име на събитието" required />

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-sm font-medium">
                Категория
              </label>
              <select
                id="category"
                name="category"
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">Избери категория</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] ?? cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="date" className="text-sm font-medium">Дата на начало</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="time" className="text-sm font-medium">Час на начало</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="text-sm font-medium">Локация</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input
                  type="text"
                  id="location"
                  name="location"
                  placeholder="напр. Варна, България"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Publish button */}
            <Button
              type="submit"
              name="publish"
              value="true"
              isLoading={isLoading}
              className="w-full rounded-xl bg-primary text-white font-medium py-3 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Публикувай събитие
            </Button>

            <Button
              type="submit"
              name="publish"
              value="false"
              variant="outline"
              isLoading={isLoading}
              className="w-full rounded-xl"
            >
              Запази като чернова
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
