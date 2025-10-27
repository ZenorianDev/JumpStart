// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell, Home, PenTool, User, Settings } from "lucide-react";
import { interestsData } from "@/lib/data"; // your previously created data file
import { aiPersonalization, Item } from "@/lib/aiLogic";

interface Tile {
  id: string;
  title: string;
  image: string;
  height: string;
  category: string;
}

export default function DashboardPage() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [recommendationText, setRecommendationText] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Defer calculation to avoid "setState in effect" warning
    const t = setTimeout(() => {
      const saved = localStorage.getItem("userInterests");
      if (!saved) {
        router.push("/interests");
        return;
      }

      let parsed: string[] = [];
      try {
        parsed = JSON.parse(saved);
      } catch {
        parsed = [];
      }

      // Build items from interestsData where the user selected the interest
      const items: Item[] = interestsData
        .filter((s) => parsed.includes(s.name))
        .flatMap((s) =>
          s.samples.map((src, i) => ({
            id: `${s.name}-${i}`,
            title: s.name,
            img: src,
            category: s.name,
          }))
        );

      // Compute weights and sort
      const weights = aiPersonalization.computeWeightsFromItems(items);
      const sorted = aiPersonalization.sortItemsByPreference(items, weights);

      // Convert sorted items to Tiles (string ids guaranteed)
      const mapped: Tile[] = sorted.map((it, idx) => ({
        id: String(it.id),
        title: it.title,
        image: it.img,
        height: idx % 3 === 0 ? "h-[320px]" : idx % 2 === 0 ? "h-[260px]" : "h-[380px]",
        category: it.category,
      }));

      setTiles(mapped);
      setRecommendationText(aiPersonalization.getRecommendationText());
    }, 0);

    return () => clearTimeout(t);
  }, [router]);

  const handleTileClick = (tile: Tile) => {
    // record interaction and navigate (tile.id is string)
    aiPersonalization.recordInteraction(tile.category);
    router.push(`/details/${encodeURIComponent(tile.id)}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <aside className="w-20 bg-black text-white flex flex-col items-center py-6 space-y-8 fixed h-full">
        <h1 onClick={() => router.push("/")} className="text-2xl font-bold cursor-pointer">J</h1>
        <nav className="flex flex-col items-center space-y-6 mt-10">
          <button title="Home"><Home size={22} /></button>
          <button title="Create"><PenTool size={22} /></button>
          <button title="Profile"><User size={22} /></button>
        </nav>
      </aside>

      <main className="flex-1 ml-20 flex flex-col min-h-screen">
        <header className="flex justify-between items-center px-8 py-6 border-b bg-white sticky top-0 z-40">
          <div>
            <h2 className="text-2xl font-semibold">Your Personalized Feed</h2>
            <p className="text-gray-500 text-sm mt-1">{recommendationText}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button><Bell size={22} /></button>
            <button><Settings size={22} /></button>
          </div>
        </header>

        <section className="p-8">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
            {tiles.map((tile) => (
              <div
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className="relative mb-6 rounded-2xl overflow-hidden shadow-md break-inside-avoid group hover:shadow-xl cursor-pointer transition duration-300"
              >
                <Image src={tile.image} alt={tile.title} width={800} height={600}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-center">
                  <p className="text-white opacity-0 group-hover:opacity-100 mb-4 text-lg font-medium transition-opacity duration-300">{tile.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
