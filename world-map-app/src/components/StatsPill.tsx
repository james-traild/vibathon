"use client";

import type { MapPoint } from "@/hooks/usePointsFeed";
import { useMemo } from "react";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return "$" + (value / 1_000_000).toFixed(2) + "M";
  if (value >= 1_000) return "$" + (value / 1_000).toFixed(1) + "K";
  return "$" + value.toLocaleString("en-US");
}

export default function StatsPill({ points }: { points: MapPoint[] }) {
  const total = useMemo(
    () => points.reduce((sum, p) => sum + p.value, 0),
    [points]
  );

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-4 rounded-full bg-zinc-900/85 dark:bg-zinc-800/90 backdrop-blur-sm text-white px-5 py-2 shadow-lg text-sm font-medium">
      <span className="opacity-75">{dateStr} · {tz}</span>
      <span className="h-4 w-px bg-white/30" />
      <span>{formatCurrency(total)}</span>
      <span className="h-4 w-px bg-white/30" />
      <span>{points.length} invoices</span>
    </div>
  );
}
