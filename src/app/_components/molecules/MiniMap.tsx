"use client";

import { useEffect, useState } from "react";

type MiniMapProps = {
  lat: number;
  lng: number;
};

export function MiniMap({ lat, lng }: MiniMapProps) {
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    L: typeof import("leaflet");
  } | null>(null);

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
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, L } = MapComponents;

  const icon = L.divIcon({
    className: "",
    html: `<div style="width:24px;height:24px;border-radius:50%;background:#6366F1;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24] as [number, number],
    iconAnchor: [12, 12] as [number, number],
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      className="h-full w-full"
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[lat, lng]} icon={icon} />
    </MapContainer>
  );
}
