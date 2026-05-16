"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, X } from "lucide-react";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

// Varna, Bulgaria coordinates
const VARNA_CENTER = { lat: 43.2141, lng: 27.9147 };
const DEFAULT_ZOOM = 13;

const CATEGORY_COLORS: Record<string, string> = {
  "Нощен живот": "#6366F1",
  "Концерти": "#3B82F6",
  "Уикенди": "#22C55E",
  "Изложби": "#A855F7",
  "Спорт": "#EF4444",
  "Храна & Напитки": "#F97316",
  default: "#6B7280",
};

function getCategoryColor(category: string | null | undefined): string {
  if (!category) return CATEGORY_COLORS.default;
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default;
}

type EventMapProps = {
  events: EventWithDetails[];
};

export function EventMap({ events }: EventMapProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    L: typeof import("leaflet");
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventWithDetails | null>(null);

  useEffect(() => {
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, L]) => {
      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        L: L,
      });
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="flex h-full items-center justify-center bg-muted">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, L } = MapComponents;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[VARNA_CENTER.lat, VARNA_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {events
          .filter((e) => e.lat && e.lng)
          .map((event) => {
            const color = getCategoryColor(event.category);
            const icon = L.divIcon({
              className: "",
              html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
              iconSize: [32, 32] as [number, number],
              iconAnchor: [16, 16] as [number, number],
            });
            return (
              <Marker
                key={event.id}
                position={[event.lat!, event.lng!]}
                icon={icon}
                eventHandlers={{
                  click: () => setSelectedEvent(event),
                }}
              />
            );
          })}
      </MapContainer>

      {selectedEvent && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] rounded-t-2xl border-t border-border bg-card p-4 flex gap-3">
          {selectedEvent.image_url && (
            <img
              src={selectedEvent.image_url}
              className="w-20 h-20 rounded-lg object-cover"
              alt=""
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{selectedEvent.title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(selectedEvent.starts_at).toLocaleDateString("bg-BG", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            {selectedEvent.location && (
              <p className="text-xs text-muted-foreground">{selectedEvent.location}</p>
            )}
          </div>
          <Link href={`/event/${selectedEvent.id}`} className="text-primary self-center">
            <ChevronRight size={20} />
          </Link>
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-3 right-3 text-muted-foreground"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
