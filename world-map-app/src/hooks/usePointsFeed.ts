"use client";

import { useEffect, useState, useRef } from "react";

export interface MapPoint {
  lat: number;
  lng: number;
  value: number;
  id: number;
}

let nextId = 0;

export function usePointsFeed(speed: number = 1) {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(`/api/feed?speed=${speed}`);
    esRef.current = es;

    es.onmessage = (event) => {
      const raw = JSON.parse(event.data);
      const point: MapPoint = { ...raw, id: nextId++ };
      setPoints((prev) => [...prev, point]);
    };

    es.onerror = () => es.close();
    return () => es.close();
  }, [speed]);

  return points;
}
