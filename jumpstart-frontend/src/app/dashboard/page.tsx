"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Settings, Bell, Home, PenTool, User } from "lucide-react";

interface Tile {
  id: number;
  title: string;
  image: string;
  height: string;
}

export default function DashboardPage() {
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const router = useRouter();

  // Load user interests from localStorage
  useEffect(() => {
    // Defer to next frame to avoid synchronous setState in the effect body (ESLint-safe).
    requestAnimationFrame(() => {
      const saved = localStorage.getItem("userInterests");
      if (!saved) {
        // no interests -> redirect
        router.push("/interests");
        return;
      }

      const parsed: string[] = (() => {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      })();

      // Build tiles deterministically (compute first, then set state once)
      const simulatedTiles = Array.from({ length: 15 }, (_, i) => {
        const title =
          parsed.length > 0
            ? parsed[Math.floor(Math.random() * parsed.length)]
            : "Explore";
        return {
          id: i + 1,
          title,
          image: `https://source.unsplash.com/random/800x${600 + i * 5}?${encodeURIComponent(title)}`,
          height: i % 3 === 0 ? "h-80" : i % 2 === 0 ? "h-60" : "h-72",
        };
      });

      // Now update state once
      setUserInterests(parsed);
      setTiles(simulatedTiles);
    });
  }, [router]);


  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-20 bg-black text-white flex flex-col items-center py-6 space-y-8 fixed h-full">
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-bold cursor-pointer"
        >
          J
        </h1>

        <nav className="flex flex-col items-center space-y-6 mt-10">
          <button className="hover:text-gray-300" title="Home">
            <Home size={22} />
          </button>
          <button className="hover:text-gray-300" title="Create">
            <PenTool size={22} />
          </button>
          <button className="hover:text-gray-300" title="Profile">
            <User size={22} />
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="flex justify-between items-center px-8 py-6 border-b">
          <h2 className="text-2xl font-semibold">Your Personalized Feed</h2>
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-600">
              <Bell size={22} />
            </button>
            <button className="hover:text-gray-600">
              <Settings size={22} />
            </button>
          </div>
        </header>

        {/* Masonry Layout */}
        <section className="p-8 grid gap-6 auto-rows-[10px] grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className={`relative overflow-hidden rounded-2xl shadow-md ${tile.height} group`}
            >
              <Image
                src={tile.image}
                alt={tile.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 bg-black/60 text-white text-sm p-2 w-full text-center">
                {tile.title}
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-10 text-sm text-center mt-auto">
          <div className="flex flex-col md:flex-row justify-between px-10 md:px-20">
            <div className="text-left mb-4 md:mb-0">
              <h3 className="font-bold text-lg mb-2">JumpStart</h3>
              <p className="text-gray-400 max-w-sm">
                Empowering e-commerce with AI-driven personalization for custom
                experiences, better engagement, and accelerated growth.
              </p>
            </div>

            <div className="flex gap-16 justify-center md:justify-end">
              <div>
                <h4 className="font-semibold mb-2">Site Map</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>Explore</li>
                  <li>Home</li>
                  <li>About</li>
                  <li>Businesses</li>
                  <li>Create</li>
                  <li>Contact Us</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 text-gray-500">
            Copyright © 2025 JumpStart. All Rights Reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
