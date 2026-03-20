"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPoint } from "@/hooks/usePointsFeed";

function formatCurrency(value: number): string {
  return "$" + value.toLocaleString("en-US");
}

function getColor(value: number): string {
  if (value < 100_000) return "#06b6d4";
  if (value < 300_000) return "#a78bfa";
  if (value < 500_000) return "#eab308";
  if (value < 750_000) return "#f97316";
  return "#ef4444";
}

/** Ripple max size in px — scales with currency value */
function getRippleSize(value: number): number {
  return 40 + (value / 1_000_000) * 120;
}

function createIcon(value: number): L.DivIcon {
  const color = getColor(value);
  const size = getRippleSize(value);
  const dotSize = 8 + (value / 1_000_000) * 8;
  const half = size / 2;

  return L.divIcon({
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `
      <div class="ripple-container" style="
        --ripple-color: ${color};
        --ripple-size: ${size}px;
        --dot-size: ${dotSize}px;
        position: absolute;
        left: -${half}px;
        top: -${half}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
      ">
        <div class="ripple-ring ripple-ring-1"></div>
        <div class="ripple-ring ripple-ring-2"></div>
        <div class="ripple-ring ripple-ring-3"></div>
        <div class="ripple-dot"></div>
      </div>
    `,
  });
}

const LIGHT_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DARK_TILES =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

function DarkTileSwapper() {
  const map = useMap();
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.setUrl(isDark ? DARK_TILES : LIGHT_TILES);
        }
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    // Set initial
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.setUrl(DARK_TILES);
        }
      });
    }
    return () => observer.disconnect();
  }, [map]);
  return null;
}

export default function WorldMap({ points }: { points: MapPoint[] }) {
  const iconsRef = useRef<Map<number, L.DivIcon>>(new Map());

  // Create icons for new points only
  for (const p of points) {
    if (!iconsRef.current.has(p.id)) {
      iconsRef.current.set(p.id, createIcon(p.value));
    }
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      minZoom={2}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={LIGHT_TILES}
      />
      <DarkTileSwapper />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.lat, point.lng]}
          icon={iconsRef.current.get(point.id)!}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              <strong style={{ fontSize: "1.1rem" }}>
                {formatCurrency(point.value)}
              </strong>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
