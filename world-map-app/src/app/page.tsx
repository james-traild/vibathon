"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ThemeToggle from "@/components/ThemeToggle";
import StatsPill from "@/components/StatsPill";
import { usePointsFeed } from "@/hooks/usePointsFeed";

const WorldMap = dynamic(() => import("@/components/WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      Loading map…
    </div>
  ),
});

export default function Home() {
  const [fast, setFast] = useState(false);
  const points = usePointsFeed(fast ? 10 : 1);

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900 dark:bg-zinc-950 text-white shadow-md">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <img src="/images/traild.png" alt="Traild" className="h-7 w-7" />
          Traild Live Invoices Heatmap
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => setFast((f) => !f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              fast
                ? "bg-amber-500 text-black"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            }`}
          >
            {fast ? "10× Speed" : "1× Speed"}
          </button>
          <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Live Feed
        </div>
      </header>
      <main className="flex-1 relative">
        <WorldMap points={points} />
        <StatsPill points={points} />
        <ThemeToggle />
      </main>
    </div>
  );
}
