// src/app/details/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Heart, Share2, Bookmark, MessageCircle, ArrowLeft } from "lucide-react";
import { interestsData } from "@/lib/data";
import { aiDescription } from "@/lib/aiDescription"; // your generator
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

      // find by id (id is a string like "Fashion-0")
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
                Back to Feed
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
    </div>
  );
}
