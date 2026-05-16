"use client";

import { useEffect, useState } from "react";
import type { EventWithDetails } from "@/server/queries/event/getEvents.query";

// Varna, Bulgaria coordinates
const VARNA_CENTER = { lat: 43.2141, lng: 27.9147 };
const DEFAULT_ZOOM = 13;

type EventMapProps = {
  events: EventWithDetails[];
};

export function EventMap({ events }: EventMapProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
  } | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([rl, L]) => {
      // Fix Leaflet default marker icon
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      setMapComponents({
        MapContainer: rl.MapContainer,
        TileLayer: rl.TileLayer,
        Marker: rl.Marker,
        Popup: rl.Popup,
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

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <MapContainer
      center={[VARNA_CENTER.lat, VARNA_CENTER.lng]}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events
        .filter((e) => e.lat && e.lng)
        .map((event) => (
          <Marker key={event.id} position={[event.lat!, event.lng!]}>
            <Popup>
              <div className="space-y-1">
                <a
                  href={`/event/${event.id}`}
                  className="font-medium hover:underline"
                >
                  {event.title}
                </a>
                <p className="text-xs">
                  {new Date(event.starts_at).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                {event.category && (
                  <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs">
                    {event.category}
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
