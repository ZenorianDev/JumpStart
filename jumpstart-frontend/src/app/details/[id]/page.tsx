// src/app/details/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Home, PenTool, User } from "lucide-react";
import { Heart, Share2, Bookmark, MessageCircle, ArrowLeft } from "lucide-react";
import { interestsData } from "@/lib/data";
import { aiDescription } from "@/lib/aiDescription";
import { aiPersonalization } from "@/lib/aiLogic";

interface DetailItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description?: string;
}

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<DetailItem | null>(null);

  useEffect(() => {
    if (!id) return;
    const t = setTimeout(() => {
      // Build the same item list used by dashboard
      const all: DetailItem[] = interestsData.flatMap((s) =>
        s.samples.map((src, i) => ({
          id: `${s.name}-${i}`,
          title: s.name,
          image: src,
          category: s.name,
        }))
      );

      const found = all.find((it) => it.id === id || it.title.toLowerCase() === id.toLowerCase());
      if (!found) {
        router.push("/dashboard");
        return;
      }

      // record interaction and generate description first
      aiPersonalization.recordInteraction(found.category);
      const desc = aiDescription.generateDescription(found.title, found.category);

      // single, deferred state update
      setItem({ ...found, description: desc });
    }, 0);

    return () => clearTimeout(t);
  }, [id, router]);

  if (!item) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <aside className="w-20 bg-black text-white flex flex-col items-center py-6 space-y-8 fixed h-full">
        <h1 onClick={() => router.push("/")} className="text-2xl font-bold cursor-pointer">J</h1>
        <nav className="flex flex-col items-center space-y-6 mt-10">
          <button title="Home"><Home size={22} /></button>
          <button title="Create"><PenTool size={22} /></button>
          <button title="Profile"><User size={22} /></button>
        </nav>
      </aside>
      <main className="max-w-5xl mx-auto p-8">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="bg-white rounded-3xl p-8 shadow">
          <div className="flex flex-col md:flex-row gap-6">
            <Image src={item.image} alt={item.title} width={600} height={450} className="rounded-2xl object-cover" />
            <div className="flex-1">
              <h1 className="text-3xl font-semibold mb-3">{item.title}</h1>
              <p className="text-gray-700 mb-6">{item.description}</p>

              <div className="flex gap-4 mb-6">
                <Heart className="cursor-pointer" />
                <MessageCircle className="cursor-pointer" />
                <Share2 className="cursor-pointer" />
                <Bookmark className="cursor-pointer" />
              </div>

              <button className="px-5 py-2 bg-black text-white rounded-full" onClick={() => router.push("/dashboard")}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">More like this</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {interestsData.find((i) => i.name === item.category)?.samples.slice(0, 4).map((src, idx) => (
              <Image key={idx} src={src} alt="related" width={300} height={200} className="rounded-lg object-cover" />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">JumpStart</h3>
            <p className="text-sm">
              Empowering creators and businesses with AI-personalized discovery.
            </p>
          </div>
          <div>
            <h4 className="text-white mb-2 font-semibold">Site Map</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Businesses</a></li>
              <li><a href="#" className="hover:text-white">Create</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-2 font-semibold">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs mt-8 border-t border-white/10 pt-4">
          © 2025 JumpStart | All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
